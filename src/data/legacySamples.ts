export interface LegacySample {
  id: string;
  name: string;
  systemType: string;
  legacyFramework: string;
  targetFramework: string;
  description: string;
  technicalDebtHours: number;
  linesOfCode: number;
  complexityScore: number;
  couplingIndex: number;
  files: {
    name: string;
    path: string;
    code: string;
  }[];
  antiPatternsSummary: string[];
}

export const LEGACY_SAMPLES: LegacySample[] = [
  {
    id: 'contoso-billing',
    name: 'Contoso Billing & Order Processing Monolith',
    systemType: 'E-Commerce / Enterprise ERP',
    legacyFramework: '.NET Framework 4.8 / ASP.NET MVC 5',
    targetFramework: '.NET 9 / Clean Architecture',
    description: 'Mission-critical monolithic order & payment engine. Features 1,200+ line God Controller with hardcoded ADO.NET connections, manual SqlTransactions, tight SMTP coupling, and concrete payment gateway instances.',
    technicalDebtHours: 340,
    linesOfCode: 1280,
    complexityScore: 84,
    couplingIndex: 92,
    antiPatternsSummary: [
      'God Class: Single controller handles HTTP, validation, billing, SQL, fraud, and email',
      'Tight DB Coupling: Raw SqlConnection & SqlDataReader with hardcoded queries in controller methods',
      'Dependency Inversion Violation: Direct instantiation of SmtpClient and CyberSourcePaymentGateway',
      'Thread Starvation: Synchronous blocking DB calls and .Result task resolution',
      'Zero Testability: Static ConfigurationManager and new() keywords prevent unit testing'
    ],
    files: [
      {
        name: 'OrderProcessingController.cs',
        path: 'Controllers/OrderProcessingController.cs',
        code: `// LEGACY ENTERPRISE MONOLITH (.NET Framework 4.8)
// Last modified: 2017 by Enterprise IT Team
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net.Mail;
using System.Web.Mvc;

namespace Contoso.Legacy.Billing.Controllers
{
    public class OrderProcessingController : Controller
    {
        private static string _connectionString = ConfigurationManager.AppSettings["BillingDbConnection"];
        private static int _activeOrderCount = 0; // State in controller singleton!

        [HttpPost]
        public ActionResult ProcessOrder(int customerId, decimal totalAmount, string paymentNonce, string orderItemsXml)
        {
            _activeOrderCount++;
            
            // 1. Validation mixed with presentation
            if (customerId <= 0)
                return Json(new { success = false, error = "Invalid Customer ID" });
            if (totalAmount <= 0)
                return Json(new { success = false, error = "Order amount must be greater than zero" });

            SqlConnection conn = null;
            SqlTransaction transaction = null;

            try
            {
                // 2. Direct ADO.NET & tight coupling
                conn = new SqlConnection(_connectionString);
                conn.Open();
                transaction = conn.BeginTransaction(IsolationLevel.Serializable);

                // Check customer credit
                var checkCmd = new SqlCommand("SELECT CreditLimit, Balance FROM Customers WHERE CustomerId = " + customerId, conn, transaction);
                SqlDataReader reader = checkCmd.ExecuteReader();
                if (!reader.Read())
                {
                    reader.Close();
                    return Json(new { success = false, error = "Customer record not found" });
                }

                decimal creditLimit = Convert.ToDecimal(reader["CreditLimit"]);
                decimal balance = Convert.ToDecimal(reader["Balance"]);
                reader.Close();

                if (balance + totalAmount > creditLimit)
                {
                    transaction.Rollback();
                    return Json(new { success = false, error = "Credit limit exceeded. Balance: " + balance });
                }

                // 3. Direct Concrete Payment Gateway Call (violates DIP)
                var paymentProcessor = new CyberSourcePaymentGateway("PROD_API_KEY_849204", "SEC_93021");
                var paymentResult = paymentProcessor.ChargeCreditCard(customerId.ToString(), totalAmount, paymentNonce);

                if (!paymentResult.IsAuthorized)
                {
                    transaction.Rollback();
                    return Json(new { success = false, error = "Payment gateway declined: " + paymentResult.DeclineReason });
                }

                // 4. Inline SQL Insert & Update
                var insertCmd = new SqlCommand(
                    "INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status, TransactionRef) " +
                    "VALUES (@cId, GETUTCDATE(), @amount, 'Completed', @txRef); SELECT SCOPE_IDENTITY();", 
                    conn, transaction);
                
                insertCmd.Parameters.AddWithValue("@cId", customerId);
                insertCmd.Parameters.AddWithValue("@amount", totalAmount);
                insertCmd.Parameters.AddWithValue("@txRef", paymentResult.TransactionId);

                int newOrderId = Convert.ToInt32(insertCmd.ExecuteScalar());

                // Update customer balance
                var updateCmd = new SqlCommand("UPDATE Customers SET Balance = Balance + @amount WHERE CustomerId = @cId", conn, transaction);
                updateCmd.Parameters.AddWithValue("@amount", totalAmount);
                updateCmd.Parameters.AddWithValue("@cId", customerId);
                updateCmd.ExecuteNonQuery();

                transaction.Commit();

                // 5. Direct tight SMTP email dispatch
                try
                {
                    var smtp = new SmtpClient("smtp.internal.contoso.com", 25);
                    smtp.Credentials = new System.Net.NetworkCredential("billing@contoso.com", "Summer2016!");
                    var mail = new MailMessage("orders@contoso.com", "customer" + customerId + "@client.com");
                    mail.Subject = "Order Confirmation #" + newOrderId;
                    mail.Body = "Thank you for your order of $" + totalAmount + ". Transaction ID: " + paymentResult.TransactionId;
                    smtp.Send(mail);
                }
                catch (Exception mailEx)
                {
                    // Swallowing email errors silently
                    System.Diagnostics.Trace.WriteLine("Failed to send email: " + mailEx.Message);
                }

                return Json(new { success = true, orderId = newOrderId, transactionId = paymentResult.TransactionId });
            }
            catch (Exception ex)
            {
                if (transaction != null) transaction.Rollback();
                return Json(new { success = false, error = "System error: " + ex.Message });
            }
            finally
            {
                if (conn != null && conn.State == ConnectionState.Open) conn.Close();
                _activeOrderCount--;
            }
        }
    }

    public class CyberSourcePaymentGateway
    {
        public CyberSourcePaymentGateway(string key, string secret) { }
        public PaymentResponse ChargeCreditCard(string customerRef, decimal amount, string nonce)
        {
            return new PaymentResponse { IsAuthorized = true, TransactionId = "CS_" + Guid.NewGuid().ToString().Substring(0, 8) };
        }
    }

    public class PaymentResponse
    {
        public bool IsAuthorized { get; set; }
        public string DeclineReason { get; set; }
        public string TransactionId { get; set; }
    }
}`
      }
    ]
  },
  {
    id: 'healthcare-ehr',
    name: 'HealthCore EHR & Claims Adjudication Monolith',
    systemType: 'Healthcare / HIPAA Claims Processing',
    legacyFramework: '.NET Framework 4.6.2 / WCF SOAP Service',
    targetFramework: '.NET 9 / Clean Architecture + MediatR',
    description: 'Enterprise healthcare claims adjudication engine. Monolithic God service with circular dependencies, raw inline T-SQL for claims history, HIPAA audit logs written to unencrypted text files, and blocking synchronous WCF calls.',
    technicalDebtHours: 480,
    linesOfCode: 2150,
    complexityScore: 91,
    couplingIndex: 96,
    antiPatternsSummary: [
      'Circular Dependency: ClaimsService tightly coupled with ProviderRegistry and PatientLookup',
      'HIPAA Audit Risk: Direct file writing without structured encryption or tamper-proofing',
      'SQL Injection Vulnerability: Dynamic string concatenation in SQL claims queries',
      'Blocking WCF Thread Pool: Synchronous .Wait() on remote insurance verification web services'
    ],
    files: [
      {
        name: 'PatientClaimsManager.cs',
        path: 'Services/PatientClaimsManager.cs',
        code: `// HEALTHCORE LEGACY PATIENT CLAIMS ENGINE (WCF SOAP Monolith)
using System;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.ServiceModel;

namespace HealthCore.Legacy.Claims
{
    [ServiceContract]
    public class PatientClaimsManager
    {
        private string connStr = "Server=sql-cluster-01.corp;Database=HealthCoreClaims;Trusted_Connection=True;";

        [OperationContract]
        public ClaimSubmissionResult SubmitClaim(int patientId, string diagnosisCode, decimal claimAmount, string providerNpi)
        {
            // Direct file logging of PHI (HIPAA Compliance Risk)
            File.AppendAllText("C:\\\\HealthCore\\\\Logs\\\\claims_audit.log", 
                DateTime.Now + " - Patient:" + patientId + " Claim:" + claimAmount + " Diag:" + diagnosisCode + "\\r\\n");

            if (claimAmount > 50000m)
            {
                // Synchronous RPC blocking
                var eligibilityClient = new LegacyInsuranceSoapClient();
                bool isEligible = eligibilityClient.VerifyPayerNetwork(providerNpi, patientId);
                if (!isEligible)
                    return new ClaimSubmissionResult { Accepted = false, DenialCode = "PR-204" };
            }

            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();
                // SQL Injection Risk: raw string interpolation
                string sql = "SELECT Status, MedicaidId FROM Patients WHERE Id = " + patientId;
                using (var cmd = new SqlCommand(sql, conn))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (!reader.Read()) return new ClaimSubmissionResult { Accepted = false, DenialCode = "PAT-NOT-FOUND" };
                    }
                }

                // Tight stored procedure coupling without models
                using (var insertCmd = new SqlCommand("sp_InsertAdjudicatedClaim", conn))
                {
                    insertCmd.CommandType = CommandType.StoredProcedure;
                    insertCmd.Parameters.AddWithValue("@PatientId", patientId);
                    insertCmd.Parameters.AddWithValue("@Code", diagnosisCode);
                    insertCmd.Parameters.AddWithValue("@Amount", claimAmount);
                    insertCmd.Parameters.AddWithValue("@Npi", providerNpi);
                    
                    var outIdParam = new SqlParameter("@ClaimId", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    insertCmd.Parameters.Add(outIdParam);
                    insertCmd.ExecuteNonQuery();

                    return new ClaimSubmissionResult { Accepted = true, ClaimId = (int)outIdParam.Value };
                }
            }
        }
    }

    public class ClaimSubmissionResult
    {
        public bool Accepted { get; set; }
        public int ClaimId { get; set; }
        public string DenialCode { get; set; }
    }

    public class LegacyInsuranceSoapClient
    {
        public bool VerifyPayerNetwork(string npi, int pId) => true;
    }
}`
      }
    ]
  },
  {
    id: 'logifleet-telematics',
    name: 'LogiFleet Telematics & Fleet Dispatcher',
    systemType: 'Logistics / Fleet Telemetry',
    legacyFramework: '.NET Framework 4.7.2 / Windows Service',
    targetFramework: '.NET 9 / Event-Driven Modular Monolith',
    description: 'Real-time telemetry and dispatching server. Giant switch statements for 12 truck sensor protocols, hardcoded COM port / TCP sockets, no background async queues, and synchronous SQL logging every 100ms.',
    technicalDebtHours: 290,
    linesOfCode: 1640,
    complexityScore: 78,
    couplingIndex: 88,
    antiPatternsSummary: [
      'Open-Closed Principle Violation: 200-line switch-case statement for telematics hardware models',
      'Lack of Async I/O: Synchronous Thread.Sleep() and blocking TCP stream reads',
      'Single Point of Failure: Static in-memory dictionary holding truck state with no persistence resilience',
      'Hardcoded Connection Strings & Credentials embedded directly in class constructor'
    ],
    files: [
      {
        name: 'DispatchEngine.cs',
        path: 'Core/DispatchEngine.cs',
        code: `// LOGIFLEET TELEMATICS DISPATCH ENGINE (Legacy Windows Service)
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace LogiFleet.Legacy.Dispatch
{
    public class DispatchEngine
    {
        private static Dictionary<string, string> _activeTruckGps = new Dictionary<string, string>();
        private const string ConnectionString = "Data Source=10.0.4.12;Initial Catalog=FleetDb;User ID=fleet_admin;Password=TruckPass99$;";

        public void ProcessTelemetryPacket(string deviceProtocol, byte[] rawBytes)
        {
            // OCP Violation: Massive switch statement instead of strategy pattern
            string parsedData = "";
            switch (deviceProtocol.ToUpper())
            {
                case "CALAMP_LMU3030":
                    parsedData = Encoding.ASCII.GetString(rawBytes).Trim();
                    break;
                case "GEOTAB_GO9":
                    parsedData = "LAT:37.7749,LON:-122.4194,SPEED:65";
                    break;
                case "TELTONIKA_FMC130":
                    parsedData = "LAT:41.8781,LON:-87.6298,SPEED:55";
                    break;
                default:
                    throw new NotSupportedException("Unsupported hardware protocol: " + deviceProtocol);
            }

            // Synchronous DB write on high-throughput sensor stream!
            using (var conn = new SqlConnection(ConnectionString))
            {
                conn.Open();
                var cmd = new SqlCommand("INSERT INTO TelemetryLog (RawPayload, IngestedAt) VALUES (@p, GETDATE())", conn);
                cmd.Parameters.AddWithValue("@p", parsedData);
                cmd.ExecuteNonQuery();
            }
        }
    }
}`
      }
    ]
  }
];
