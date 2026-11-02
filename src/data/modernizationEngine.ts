import { LEGACY_SAMPLES, LegacySample } from './legacySamples';

export interface ModernizationResult {
  systemId: string;
  systemName: string;
  timestamp: string;
  engineUsed: string;
  llamaModel: string;
  metrics: {
    legacyCouplingIndex: number;
    modernCouplingIndex: number;
    cyclomaticReductionPct: number;
    maintainabilityIndexBefore: number;
    maintainabilityIndexAfter: number;
    technicalDebtHoursSaved: number;
    estimatedCostSavedUsd: number;
    testCoveragePct: number;
  };
  assessment: {
    summary: string;
    blastRadiusScore: number; // 0 - 100
    blastRadiusLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    godClasses: string[];
    solidViolations: {
      principle: 'SRP' | 'OCP' | 'LSP' | 'ISP' | 'DIP';
      title: string;
      location: string;
      severity: 'Critical' | 'High' | 'Medium';
      legacyProblem: string;
      modernRemedy: string;
    }[];
    stranglerFigRoadmap: {
      phase: number;
      name: string;
      duration: string;
      objective: string;
      tactics: string[];
      deliverable: string;
    }[];
  };
  uncoupling: {
    summary: string;
    nodes: {
      id: string;
      label: string;
      layer: 'Presentation' | 'Application' | 'Domain' | 'Infrastructure' | 'Legacy';
      type: 'controller' | 'service' | 'interface' | 'database' | 'external';
      status: 'legacy_coupled' | 'decoupled_interface' | 'modern_implementation';
    }[];
    edges: {
      source: string;
      target: string;
      type: 'tight_coupling' | 'interface_inversion' | 'mediator_dispatch';
      label?: string;
    }[];
    iocRegistrations: {
      interfaceName: string;
      implementationName: string;
      lifetime: 'Transient' | 'Scoped' | 'Singleton';
      rationale: string;
    }[];
    serviceRegistrationCode: string;
  };
  refactoredFiles: {
    filename: string;
    path: string;
    layer: 'Domain' | 'Application' | 'Infrastructure' | 'API';
    language: string;
    description: string;
    code: string;
  }[];
  schemaMigration: {
    legacySqlSnippet: string;
    modernDbContextCode: string;
    efCoreEntityConfiguration: string;
    sqlMigrationScript: string;
  };
  testSuite: {
    framework: string;
    mockLibrary: string;
    testCode: string;
    testCases: {
      id: string;
      name: string;
      type: 'Unit' | 'Boundary' | 'Failure-Mode' | 'Regression-Safety';
      targetMethod: string;
      assertions: string[];
      simulatedOutcome: 'PASS' | 'FAIL';
      durationMs: number;
    }[];
  };
}

export function generateModernizationForSample(sampleId: string, customCode?: string): ModernizationResult {
  const sample = LEGACY_SAMPLES.find(s => s.id === sampleId) || LEGACY_SAMPLES[0];

  if (sample.id === 'healthcare-ehr') {
    return generateHealthcareModernization(sample);
  } else if (sample.id === 'logifleet-telematics') {
    return generateLogisticsModernization(sample);
  } else {
    return generateBillingModernization(sample, customCode);
  }
}

function generateBillingModernization(sample: LegacySample, customCode?: string): ModernizationResult {
  return {
    systemId: sample.id,
    systemName: sample.name,
    timestamp: new Date().toISOString(),
    engineUsed: 'Meta Llama 3 Agentic Copilot (AST-Grounded Enterprise Reasoning)',
    llamaModel: 'meta-llama/Meta-Llama-3.3-70B-Instruct',
    metrics: {
      legacyCouplingIndex: 94,
      modernCouplingIndex: 12,
      cyclomaticReductionPct: 76,
      maintainabilityIndexBefore: 32,
      maintainabilityIndexAfter: 89,
      technicalDebtHoursSaved: 340,
      estimatedCostSavedUsd: 51000,
      testCoveragePct: 97.4
    },
    assessment: {
      summary: 'OrderProcessingController is a monolithic God Class acting as Controller, Service, Data Access Object, and Notification Queue simultaneously. It violates all 5 SOLID principles, contains hardcoded credentials, and performs unmanaged synchronous ADO.NET database operations in HTTP threads.',
      blastRadiusScore: 89,
      blastRadiusLevel: 'CRITICAL',
      godClasses: ['OrderProcessingController', 'CyberSourcePaymentGateway (Concrete)'],
      solidViolations: [
        {
          principle: 'SRP',
          title: 'Single Responsibility Principle Violation',
          location: 'OrderProcessingController.cs : Line 22',
          severity: 'Critical',
          legacyProblem: 'Controller coordinates HTTP handling, input validation, SQL transactions, payment gateway execution, and SMTP mailing within a single method.',
          modernRemedy: 'Decompose into MediatR Command Handlers, Domain Entities with invariant checks, and decoupled Infrastructure services.'
        },
        {
          principle: 'DIP',
          title: 'Dependency Inversion Principle Violation',
          location: 'OrderProcessingController.cs : Line 58',
          severity: 'Critical',
          legacyProblem: 'Direct concrete instantiation via new CyberSourcePaymentGateway() and new SmtpClient() prevents unit testing and locks vendor implementation.',
          modernRemedy: 'Inject IPaymentGateway and INotificationService through standard ASP.NET Core IServiceCollection.'
        },
        {
          principle: 'OCP',
          title: 'Open / Closed Principle Violation',
          location: 'OrderProcessingController.cs : Line 60',
          severity: 'High',
          legacyProblem: 'Adding a second payment processor (e.g. Stripe or PayPal) requires editing and recompiling core order checkout logic.',
          modernRemedy: 'Implement Payment Strategy Factory pattern with polymorphic provider resolution.'
        },
        {
          principle: 'ISP',
          title: 'Interface Segregation Violation',
          location: 'OrderProcessingController.cs : Database operations',
          severity: 'Medium',
          legacyProblem: 'Raw ADO.NET queries directly mutate both Customer balances and Order tables within a single unmanaged transaction.',
          modernRemedy: 'Segregate into focused ICustomerRepository and IOrderRepository contracts.'
        }
      ],
      stranglerFigRoadmap: [
        {
          phase: 1,
          name: 'Anti-Corruption Layer (ACL) & API Gateway Façade',
          duration: 'Week 1 - 2',
          objective: 'Route legacy clients through YARP reverse proxy with telemetry and correlation IDs.',
          tactics: ['Deploy YARP Reverse Proxy', 'Implement Distributed Tracing', 'Mirror Live Traffic (Shadow Testing)'],
          deliverable: 'Zero-downtime routing gateway between legacy monolith and modern service.'
        },
        {
          phase: 2,
          name: 'Domain Extraction & Dependency Inversion',
          duration: 'Week 3 - 5',
          objective: 'Carve out Order Processing bounded context using Clean Architecture and CQRS.',
          tactics: ['Extract IOrderRepository & IPaymentGateway', 'Introduce MediatR Pipeline Behaviors', 'Inject Dependency Container'],
          deliverable: 'Isolated, unit-tested .NET 9 service running alongside monolith.'
        },
        {
          phase: 3,
          name: 'Schema Migration & Dual-Write Synchronization',
          duration: 'Week 6 - 8',
          objective: 'Migrate legacy SQL tables to normalized schema with EF Core 9 and Outbox pattern.',
          tactics: ['Deploy EF Core Migrations', 'Implement Transactional Outbox Pattern', 'Dual-write data synchronization'],
          deliverable: 'Decoupled persistent data store with zero data loss guarantee.'
        },
        {
          phase: 4,
          name: 'Cutover & Monolith Decommission',
          duration: 'Week 9',
          objective: 'Switch 100% of write traffic to modern service and decommission legacy MVC controller.',
          tactics: ['100% Traffic Cutover via Gateway', 'Decommission legacy MVC controller & dead code cleanup'],
          deliverable: '340 technical debt hours eliminated with 97.4% test coverage.'
        }
      ]
    },
    uncoupling: {
      summary: 'Replaced 7 tightly coupled concrete dependencies with clean abstraction interfaces registered in Microsoft.Extensions.DependencyInjection.',
      nodes: [
        { id: 'api_ctrl', label: 'OrdersController', layer: 'Presentation', type: 'controller', status: 'modern_implementation' },
        { id: 'med_cmd', label: 'ProcessOrderCommand', layer: 'Application', type: 'service', status: 'modern_implementation' },
        { id: 'i_order_repo', label: 'IOrderRepository', layer: 'Application', type: 'interface', status: 'decoupled_interface' },
        { id: 'i_payment', label: 'IPaymentGateway', layer: 'Application', type: 'interface', status: 'decoupled_interface' },
        { id: 'i_notification', label: 'INotificationService', layer: 'Application', type: 'interface', status: 'decoupled_interface' },
        { id: 'ef_repo', label: 'OrderRepository (EF Core 9)', layer: 'Infrastructure', type: 'service', status: 'modern_implementation' },
        { id: 'cs_gateway', label: 'CyberSourceAdapter', layer: 'Infrastructure', type: 'service', status: 'modern_implementation' },
        { id: 'smtp_service', label: 'FluentEmailNotificationService', layer: 'Infrastructure', type: 'service', status: 'modern_implementation' },
        { id: 'legacy_god', label: 'OrderProcessingController (Monolith)', layer: 'Legacy', type: 'controller', status: 'legacy_coupled' },
        { id: 'legacy_sql', label: 'Raw SqlConnection & ADO.NET', layer: 'Legacy', type: 'database', status: 'legacy_coupled' }
      ],
      edges: [
        { source: 'api_ctrl', target: 'med_cmd', type: 'mediator_dispatch', label: 'Sends Command' },
        { source: 'med_cmd', target: 'i_order_repo', type: 'interface_inversion', label: 'Depends on Abstraction' },
        { source: 'med_cmd', target: 'i_payment', type: 'interface_inversion', label: 'Depends on Abstraction' },
        { source: 'med_cmd', target: 'i_notification', type: 'interface_inversion', label: 'Depends on Abstraction' },
        { source: 'ef_repo', target: 'i_order_repo', type: 'interface_inversion', label: 'Implements' },
        { source: 'cs_gateway', target: 'i_payment', type: 'interface_inversion', label: 'Implements' },
        { source: 'smtp_service', target: 'i_notification', type: 'interface_inversion', label: 'Implements' },
        { source: 'legacy_god', target: 'legacy_sql', type: 'tight_coupling', label: 'Direct SQL String' }
      ],
      iocRegistrations: [
        { interfaceName: 'IOrderRepository', implementationName: 'OrderRepository', lifetime: 'Scoped', rationale: 'Scoped to HTTP request context with EF Core DbContext lifecycle.' },
        { interfaceName: 'IPaymentGateway', implementationName: 'CyberSourcePaymentAdapter', lifetime: 'Transient', rationale: 'Stateless integration client with circuit breaker & retry policies.' },
        { interfaceName: 'INotificationService', implementationName: 'EmailNotificationService', lifetime: 'Scoped', rationale: 'Dispatches templated confirmation emails asynchronously.' },
        { interfaceName: 'IUnitOfWork', implementationName: 'BillingDbContext', lifetime: 'Scoped', rationale: 'Coordinates transactional consistency across domain aggregate roots.' }
      ],
      serviceRegistrationCode: `// Modern Dependency Injection Extension (.NET 9)
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Contoso.Billing.Application.Interfaces;
using Contoso.Billing.Infrastructure.Data;
using Contoso.Billing.Infrastructure.Services;

namespace Contoso.Billing.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddBillingInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // 1. Resilient EF Core 9 DbContext with Connection Resiliency
            services.AddDbContext<BillingDbContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("BillingDbConnection"),
                    sqlOptions => sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null)));

            // 2. Interface Segregated Repositories
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<BillingDbContext>());

            // 3. Decoupled Payment Gateway with Polly Circuit Breaker
            services.AddHttpClient<IPaymentGateway, CyberSourcePaymentAdapter>(client =>
            {
                client.BaseAddress = new Uri(configuration["PaymentGateway:BaseUrl"]!);
                client.Timeout = TimeSpan.FromSeconds(10);
            });

            // 4. Asynchronous Notification Service
            services.AddScoped<INotificationService, SmtpNotificationService>();

            return services;
        }
    }
}`
    },
    refactoredFiles: [
      {
        filename: 'OrdersController.cs',
        path: 'src/Contoso.Billing.API/Controllers/OrdersController.cs',
        layer: 'API',
        language: 'csharp',
        description: 'Ultra-thin API Controller. 0 lines of business logic or SQL. Dispatches CQRS command through MediatR.',
        code: `// MODERN .NET 9 CLEAN ARCHITECTURE API CONTROLLER
using System.Net.Mime;
using Contoso.Billing.Application.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Contoso.Billing.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class OrdersController(ISender mediator, ILogger<OrdersController> logger) : ControllerBase
{
    /// <summary>
    /// Processes an enterprise customer order with full ACID & payment guarantees
    /// </summary>
    [HttpPost("process")]
    [ProducesResponseType(typeof(OrderResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> ProcessOrder(
        [FromBody] ProcessOrderCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Receiving checkout request for Customer {CustomerId}", command.CustomerId);
        
        var result = await mediator.Send(command, cancellationToken);
        
        return result.Match<IActionResult>(
            success => CreatedAtAction(nameof(ProcessOrder), new { id = success.OrderId }, success),
            error => UnprocessableEntity(new { error.Code, error.Description })
        );
    }
}`
      },
      {
        filename: 'ProcessOrderCommandHandler.cs',
        path: 'src/Contoso.Billing.Application/Commands/ProcessOrderCommandHandler.cs',
        layer: 'Application',
        language: 'csharp',
        description: 'Single Responsibility CQRS Handler. Coordinates domain aggregate, payment gateway, and outbox events.',
        code: `// APPLICATION LAYER: CQRS COMMAND HANDLER
using Contoso.Billing.Application.Common;
using Contoso.Billing.Application.Interfaces;
using Contoso.Billing.Domain.Entities;
using Contoso.Billing.Domain.Errors;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Contoso.Billing.Application.Commands;

public record ProcessOrderCommand(
    int CustomerId,
    decimal TotalAmount,
    string PaymentNonce
) : IRequest<Result<OrderResponseDto, DomainError>>;

public class ProcessOrderCommandHandler(
    ICustomerRepository customerRepository,
    IOrderRepository orderRepository,
    IPaymentGateway paymentGateway,
    INotificationService notificationService,
    IUnitOfWork unitOfWork,
    ILogger<ProcessOrderCommandHandler> logger)
    : IRequestHandler<ProcessOrderCommand, Result<OrderResponseDto, DomainError>>
{
    public async Task<Result<OrderResponseDto, DomainError>> Handle(
        ProcessOrderCommand request, 
        CancellationToken cancellationToken)
    {
        // 1. Fetch Customer Aggregate Root
        var customer = await customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (customer is null)
        {
            return DomainError.NotFound("Customer", request.CustomerId);
        }

        // 2. Validate Domain Invariants
        if (!customer.CanAffordCharge(request.TotalAmount))
        {
            return DomainError.CreditLimitExceeded(customer.CreditLimit, customer.Balance, request.TotalAmount);
        }

        // 3. Process Payment via Decoupled Gateway Interface
        var paymentResult = await paymentGateway.ChargeAsync(
            customer.Id.ToString(), 
            request.TotalAmount, 
            request.PaymentNonce, 
            cancellationToken);

        if (!paymentResult.IsSuccess)
        {
            logger.LogWarning("Payment rejected for customer {CustomerId}: {Reason}", request.CustomerId, paymentResult.DeclineReason);
            return DomainError.PaymentDeclined(paymentResult.DeclineReason);
        }

        // 4. Create Order Domain Entity (Enforces Invariants)
        var order = Order.Create(
            customerId: customer.Id,
            totalAmount: request.TotalAmount,
            transactionReference: paymentResult.TransactionId);

        customer.ApplyCharge(request.TotalAmount);

        // 5. Persist via Unit of Work
        await orderRepository.AddAsync(order, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 6. Asynchronous Non-blocking Event Notification
        _ = notificationService.SendOrderConfirmationAsync(
            customer.Email, 
            order.Id, 
            order.TotalAmount, 
            cancellationToken);

        return new OrderResponseDto(order.Id, paymentResult.TransactionId, "Completed");
    }
}`
      },
      {
        filename: 'Order.cs',
        path: 'src/Contoso.Billing.Domain/Entities/Order.cs',
        layer: 'Domain',
        language: 'csharp',
        description: 'Rich Domain Entity with encapsulated state, private setters, and Domain Events dispatch.',
        code: `// DOMAIN LAYER: AGGREGATE ROOT ENTITY
using Contoso.Billing.Domain.Common;
using Contoso.Billing.Domain.Events;

namespace Contoso.Billing.Domain.Entities;

public class Order : AggregateRoot<int>
{
    public int CustomerId { get; private set; }
    public decimal TotalAmount { get; private set; }
    public OrderStatus Status { get; private set; }
    public string TransactionReference { get; private set; } = string.Empty;
    public DateTime CreatedAtUtc { get; private set; }

    private Order() { } // Required for EF Core 9

    public static Order Create(int customerId, decimal totalAmount, string transactionReference)
    {
        if (customerId <= 0) throw new ArgumentException("Customer ID must be valid", nameof(customerId));
        if (totalAmount <= 0) throw new ArgumentException("Total amount must be greater than zero", nameof(totalAmount));
        if (string.IsNullOrWhiteSpace(transactionReference)) throw new ArgumentException("Transaction reference required", nameof(transactionReference));

        var order = new Order
        {
            CustomerId = customerId,
            TotalAmount = totalAmount,
            Status = OrderStatus.Completed,
            TransactionReference = transactionReference,
            CreatedAtUtc = DateTime.UtcNow
        };

        order.AddDomainEvent(new OrderCreatedDomainEvent(order));
        return order;
    }
}

public enum OrderStatus
{
    Pending = 0,
    Completed = 1,
    Cancelled = 2,
    Refunded = 3
}`
      },
      {
        filename: 'BillingDbContext.cs',
        path: 'src/Contoso.Billing.Infrastructure/Data/BillingDbContext.cs',
        layer: 'Infrastructure',
        language: 'csharp',
        description: 'Modern EF Core 9 DbContext replacing legacy ADO.NET SqlConnection and SqlTransaction.',
        code: `// INFRASTRUCTURE: MODERN EF CORE 9 DBCONTEXT
using Contoso.Billing.Application.Interfaces;
using Contoso.Billing.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Contoso.Billing.Infrastructure.Data;

public class BillingDbContext(DbContextOptions<BillingDbContext> options) 
    : DbContext(options), IUnitOfWork
{
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Customer> Customers => Set<Customer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BillingDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Enforce audit timestamps & outbox event dispatching
        return await base.SaveChangesAsync(cancellationToken);
    }
}`
      }
    ],
    schemaMigration: {
      legacySqlSnippet: `-- LEGACY ADO.NET FRAGILE T-SQL IN CONTROLLER
SELECT CreditLimit, Balance FROM Customers WHERE CustomerId = @customerId;
INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status, TransactionRef) 
VALUES (@cId, GETUTCDATE(), @amount, 'Completed', @txRef);
UPDATE Customers SET Balance = Balance + @amount WHERE CustomerId = @cId;`,
      modernDbContextCode: `// MODERN EF CORE 9 FLUENT CONFIGURATION
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders", "billing");
        builder.HasKey(o => o.Id);
        
        builder.Property(o => o.TotalAmount)
               .HasPrecision(18, 4)
               .IsRequired();

        builder.Property(o => o.TransactionReference)
               .HasMaxLength(64)
               .IsRequired();

        builder.HasIndex(o => o.CustomerId);
        builder.HasIndex(o => o.TransactionReference).IsUnique();

        builder.Property(o => o.Status)
               .HasConversion<string>()
               .HasMaxLength(32);
    }
}`,
      efCoreEntityConfiguration: `// Customer Aggregate Mapping
public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers", "billing");
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.CreditLimit).HasPrecision(18, 4);
        builder.Property(c => c.Balance).HasPrecision(18, 4);
        builder.Property(c => c.RowVersion).IsRowVersion(); // Concurrency Token
    }
}`,
      sqlMigrationScript: `-- GENERATED EF CORE 9 SQL SERVER MIGRATION SCRIPT
-- Migration: 20261031_DecomposeOrdersTable
BEGIN TRANSACTION;

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'billing')
BEGIN
    EXEC('CREATE SCHEMA [billing]');
END

-- Create resilient Orders table with proper indexes and constraints
IF OBJECT_ID(N'[billing].[Orders]', N'U') IS NULL
BEGIN
    CREATE TABLE [billing].[Orders] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [CustomerId] INT NOT NULL,
        [TotalAmount] DECIMAL(18,4) NOT NULL,
        [Status] NVARCHAR(32) NOT NULL,
        [TransactionReference] NVARCHAR(64) NOT NULL,
        [CreatedAtUtc] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        [RowVersion] ROWVERSION NOT NULL,
        CONSTRAINT [PK_Orders] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_Orders_Customers] FOREIGN KEY ([CustomerId]) REFERENCES [billing].[Customers]([Id])
    );

    CREATE NONCLUSTERED INDEX [IX_Orders_CustomerId] ON [billing].[Orders]([CustomerId] ASC);
    CREATE UNIQUE NONCLUSTERED INDEX [UX_Orders_TxRef] ON [billing].[Orders]([TransactionReference] ASC);
END;

COMMIT TRANSACTION;`
    },
    testSuite: {
      framework: 'xUnit 2.9 + FluentAssertions 7',
      mockLibrary: 'Moq 4.20',
      testCode: `// AUTOMATED REGRESSION SAFETY TEST SUITE (xUnit + Moq + FluentAssertions)
using Contoso.Billing.Application.Commands;
using Contoso.Billing.Application.Interfaces;
using Contoso.Billing.Domain.Entities;
using Contoso.Billing.Domain.Errors;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Contoso.Billing.UnitTests.Commands;

public class ProcessOrderCommandHandlerTests
{
    private readonly Mock<ICustomerRepository> _customerRepoMock = new();
    private readonly Mock<IOrderRepository> _orderRepoMock = new();
    private readonly Mock<IPaymentGateway> _paymentGatewayMock = new();
    private readonly Mock<INotificationService> _notificationMock = new();
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<ILogger<ProcessOrderCommandHandler>> _loggerMock = new();
    private readonly ProcessOrderCommandHandler _handler;

    public ProcessOrderCommandHandlerTests()
    {
        _handler = new ProcessOrderCommandHandler(
            _customerRepoMock.Object,
            _orderRepoMock.Object,
            _paymentGatewayMock.Object,
            _notificationMock.Object,
            _unitOfWorkMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsSuccessAndPersistsOrder()
    {
        // Arrange
        var customer = Customer.Create(1, creditLimit: 5000m, initialBalance: 500m, email: "acme@enterprise.com");
        _customerRepoMock.Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(customer);

        _paymentGatewayMock.Setup(p => p.ChargeAsync("1", 200m, "tok_valid", It.IsAny<CancellationToken>()))
            .ReturnsAsync(PaymentResult.Success("TX_77391"));

        var command = new ProcessOrderCommand(1, 200m, "tok_valid");

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.TransactionReference.Should().Be("TX_77391");
        customer.Balance.Should().Be(700m); // Invariant updated

        _orderRepoMock.Verify(r => r.AddAsync(It.Is<Order>(o => o.TotalAmount == 200m), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _notificationMock.Verify(n => n.SendOrderConfirmationAsync("acme@enterprise.com", It.IsAny<int>(), 200m, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ExceededCreditLimit_RejectsWithoutCallingPaymentGateway()
    {
        // Arrange
        var customer = Customer.Create(1, creditLimit: 1000m, initialBalance: 900m, email: "acme@enterprise.com");
        _customerRepoMock.Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(customer);

        var command = new ProcessOrderCommand(1, 300m, "tok_valid"); // 900 + 300 > 1000

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("CreditLimitExceeded");

        _paymentGatewayMock.Verify(p => p.ChargeAsync(It.IsAny<string>(), It.IsAny<decimal>(), It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_PaymentGatewayDeclined_DoesNotPersistOrder()
    {
        // Arrange
        var customer = Customer.Create(1, creditLimit: 5000m, initialBalance: 100m, email: "acme@enterprise.com");
        _customerRepoMock.Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(customer);

        _paymentGatewayMock.Setup(p => p.ChargeAsync("1", 450m, "tok_declined", It.IsAny<CancellationToken>()))
            .ReturnsAsync(PaymentResult.Failed("Card expired (ERR_054)"));

        var command = new ProcessOrderCommand(1, 450m, "tok_declined");

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PaymentDeclined");
        customer.Balance.Should().Be(100m); // Balance rolled back

        _orderRepoMock.Verify(r => r.AddAsync(It.IsAny<Order>(), It.IsAny<CancellationToken>()), Times.Never);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_NonExistentCustomer_ReturnsNotFoundError()
    {
        // Arrange
        _customerRepoMock.Setup(r => r.GetByIdAsync(999, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Customer?)null);

        var command = new ProcessOrderCommand(999, 50m, "tok_valid");

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("NotFound");
    }
}`,
      testCases: [
        {
          id: 'TEST-01',
          name: 'Handle_ValidCommand_ReturnsSuccessAndPersistsOrder',
          type: 'Unit',
          targetMethod: 'ProcessOrderCommandHandler.Handle',
          assertions: ['result.IsSuccess == true', 'Order saved via IOrderRepository', 'UnitOfWork.SaveChangesAsync called once', 'Notification queued asynchronously'],
          simulatedOutcome: 'PASS',
          durationMs: 42
        },
        {
          id: 'TEST-02',
          name: 'Handle_ExceededCreditLimit_RejectsWithoutCallingPaymentGateway',
          type: 'Boundary',
          targetMethod: 'ProcessOrderCommandHandler.Handle',
          assertions: ['result.IsFailure == true', 'Error.Code == CreditLimitExceeded', 'PaymentGateway.ChargeAsync never invoked', 'Customer balance untouched'],
          simulatedOutcome: 'PASS',
          durationMs: 18
        },
        {
          id: 'TEST-03',
          name: 'Handle_PaymentGatewayDeclined_DoesNotPersistOrder',
          type: 'Failure-Mode',
          targetMethod: 'ProcessOrderCommandHandler.Handle',
          assertions: ['result.IsFailure == true', 'Payment declined error code passed to client', 'No order record inserted', 'Transaction aborted safely'],
          simulatedOutcome: 'PASS',
          durationMs: 27
        },
        {
          id: 'TEST-04',
          name: 'Handle_NonExistentCustomer_ReturnsNotFoundError',
          type: 'Boundary',
          targetMethod: 'ProcessOrderCommandHandler.Handle',
          assertions: ['result.IsFailure == true', 'Error.Code == NotFound', 'No database mutations executed'],
          simulatedOutcome: 'PASS',
          durationMs: 14
        },
        {
          id: 'TEST-05',
          name: 'Regression_ZeroThreadLockup_ConcurrentLoadSimulation',
          type: 'Regression-Safety',
          targetMethod: 'OrdersController.ProcessOrder',
          assertions: ['Asynchronous non-blocking I/O verified', 'No .Result or .Wait() calls present in AST', 'Thread pool starvation risk eliminated'],
          simulatedOutcome: 'PASS',
          durationMs: 65
        }
      ]
    }
  };
}

function generateHealthcareModernization(sample: LegacySample): ModernizationResult {
  return {
    systemId: sample.id,
    systemName: sample.name,
    timestamp: new Date().toISOString(),
    engineUsed: 'Meta Llama 3 Agentic Copilot (AST-Grounded Enterprise Reasoning)',
    llamaModel: 'meta-llama/Meta-Llama-3.3-70B-Instruct',
    metrics: {
      legacyCouplingIndex: 96,
      modernCouplingIndex: 14,
      cyclomaticReductionPct: 81,
      maintainabilityIndexBefore: 28,
      maintainabilityIndexAfter: 92,
      technicalDebtHoursSaved: 480,
      estimatedCostSavedUsd: 72000,
      testCoveragePct: 98.2
    },
    assessment: {
      summary: 'PatientClaimsManager is a high-risk monolithic WCF service with serious HIPAA audit exposure. Claims details are logged in plaintext to local file systems, database calls use string-concatenated SQL vulnerable to injection, and synchronous RPC network calls block IIS worker processes.',
      blastRadiusScore: 94,
      blastRadiusLevel: 'CRITICAL',
      godClasses: ['PatientClaimsManager', 'LegacyInsuranceSoapClient'],
      solidViolations: [
        {
          principle: 'SRP',
          title: 'Single Responsibility & HIPAA Security Breach',
          location: 'PatientClaimsManager.cs : Line 18',
          severity: 'Critical',
          legacyProblem: 'Service directly writes unencrypted Protected Health Information (PHI) to C:\\HealthCore\\Logs\\claims_audit.log without encryption-at-rest or access control.',
          modernRemedy: 'Route all audit events through an encrypted IHipaaAuditLogger backed by Azure Key Vault / AWS KMS.'
        },
        {
          principle: 'DIP',
          title: 'Direct SQL & SOAP Client Instantiation',
          location: 'PatientClaimsManager.cs : Line 23',
          severity: 'Critical',
          legacyProblem: 'Instantiates raw LegacyInsuranceSoapClient and builds raw SqlConnection with hardcoded connection string.',
          modernRemedy: 'Inject IPayerEligibilityService and IClaimsRepository interfaces via DI.'
        },
        {
          principle: 'OCP',
          title: 'Hardcoded Adjudication Rules',
          location: 'PatientClaimsManager.cs : Line 21',
          severity: 'High',
          legacyProblem: 'Arbitrary $50,000 threshold hardcoded in service code instead of a configurable rules engine.',
          modernRemedy: 'Implement Specification Pattern / Rules Engine for dynamic adjudication policy checks.'
        }
      ],
      stranglerFigRoadmap: [
        {
          phase: 1,
          name: 'HIPAA Quarantine & Secure Ingestion Gateway',
          duration: 'Week 1 - 3',
          objective: 'Intercept all incoming SOAP calls and establish cryptographically signed audit logging.',
          tactics: ['Deploy API Gateway with mTLS', 'Replace plaintext file logging with KMS audit pipeline'],
          deliverable: 'HIPAA compliant ingress gateway without touching core claims logic.'
        },
        {
          phase: 2,
          name: 'Decouple Payer Eligibility Verification',
          duration: 'Week 4 - 6',
          objective: 'Replace blocking SOAP service with asynchronous resilient gRPC/REST clients.',
          tactics: ['Extract IPayerEligibilityService', 'Implement Polly Circuit Breaker & Retry Policies'],
          deliverable: 'Fault-tolerant asynchronous eligibility subsystem.'
        },
        {
          phase: 3,
          name: 'Clean Claims Repository & Schema Migration',
          duration: 'Week 7 - 9',
          objective: 'Replace parameter-less stored proc with EF Core 9 domain mapping and zero-injection queries.',
          tactics: ['Convert raw T-SQL to EF Core Compiled Queries', 'Implement Row-Level Security on Patient records'],
          deliverable: 'Certified secure claims adjudication data layer.'
        }
      ]
    },
    uncoupling: {
      summary: 'Replaced monolithic WCF SOAP contract with modern ASP.NET Core Minimal APIs and decoupled domain services.',
      nodes: [
        { id: 'api_claims', label: 'ClaimsEndpoints (Minimal API)', layer: 'Presentation', type: 'controller', status: 'modern_implementation' },
        { id: 'handler_claims', label: 'SubmitClaimCommandHandler', layer: 'Application', type: 'service', status: 'modern_implementation' },
        { id: 'i_claims_repo', label: 'IClaimsRepository', layer: 'Application', type: 'interface', status: 'decoupled_interface' },
        { id: 'i_payer_svc', label: 'IPayerEligibilityService', layer: 'Application', type: 'interface', status: 'decoupled_interface' },
        { id: 'i_hipaa_audit', label: 'IHipaaAuditLogger', layer: 'Application', type: 'interface', status: 'decoupled_interface' },
        { id: 'ef_claims_repo', label: 'ClaimsRepository (EF Core 9)', layer: 'Infrastructure', type: 'service', status: 'modern_implementation' },
        { id: 'soap_adapter', label: 'ResilientPayerAdapter', layer: 'Infrastructure', type: 'service', status: 'modern_implementation' },
        { id: 'kms_logger', label: 'KmsEncryptedAuditLogger', layer: 'Infrastructure', type: 'service', status: 'modern_implementation' },
        { id: 'legacy_wcf', label: 'PatientClaimsManager (WCF)', layer: 'Legacy', type: 'service', status: 'legacy_coupled' }
      ],
      edges: [
        { source: 'api_claims', target: 'handler_claims', type: 'mediator_dispatch', label: 'Dispatches' },
        { source: 'handler_claims', target: 'i_claims_repo', type: 'interface_inversion', label: 'Uses' },
        { source: 'handler_claims', target: 'i_payer_svc', type: 'interface_inversion', label: 'Uses' },
        { source: 'handler_claims', target: 'i_hipaa_audit', type: 'interface_inversion', label: 'Uses' },
        { source: 'ef_claims_repo', target: 'i_claims_repo', type: 'interface_inversion', label: 'Implements' },
        { source: 'soap_adapter', target: 'i_payer_svc', type: 'interface_inversion', label: 'Implements' },
        { source: 'kms_logger', target: 'i_hipaa_audit', type: 'interface_inversion', label: 'Implements' }
      ],
      iocRegistrations: [
        { interfaceName: 'IClaimsRepository', implementationName: 'ClaimsRepository', lifetime: 'Scoped', rationale: 'Scoped per HTTP claims submission.' },
        { interfaceName: 'IPayerEligibilityService', implementationName: 'ResilientPayerAdapter', lifetime: 'Singleton', rationale: 'Thread-safe HTTP client with connection pooling.' },
        { interfaceName: 'IHipaaAuditLogger', implementationName: 'KmsEncryptedAuditLogger', lifetime: 'Singleton', rationale: 'High-throughput buffered encrypted telemetry.' }
      ],
      serviceRegistrationCode: `// HealthCore Modern Dependency Injection (.NET 9)
public static IServiceCollection AddHealthCoreServices(this IServiceCollection services, IConfiguration config)
{
    services.AddScoped<IClaimsRepository, ClaimsRepository>();
    services.AddSingleton<IHipaaAuditLogger, KmsEncryptedAuditLogger>();
    services.AddHttpClient<IPayerEligibilityService, ResilientPayerAdapter>(client =>
    {
        client.BaseAddress = new Uri(config["PayerService:Url"]!);
        client.Timeout = TimeSpan.FromSeconds(5);
    });
    return services;
}`
    },
    refactoredFiles: [
      {
        filename: 'SubmitClaimCommandHandler.cs',
        path: 'src/HealthCore.Claims.Application/Commands/SubmitClaimCommandHandler.cs',
        layer: 'Application',
        language: 'csharp',
        description: 'Modern HIPAA-compliant command handler with secure audit trail and non-blocking payer verification.',
        code: `// MODERN HEALTHCARE CLAIMS COMMAND HANDLER (.NET 9)
using HealthCore.Claims.Application.Interfaces;
using HealthCore.Claims.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace HealthCore.Claims.Application.Commands;

public record SubmitClaimCommand(
    int PatientId,
    string DiagnosisCode,
    decimal ClaimAmount,
    string ProviderNpi
) : IRequest<ClaimResultDto>;

public class SubmitClaimCommandHandler(
    IClaimsRepository claimsRepository,
    IPayerEligibilityService eligibilityService,
    IHipaaAuditLogger auditLogger,
    ILogger<SubmitClaimCommandHandler> logger)
    : IRequestHandler<SubmitClaimCommand, ClaimResultDto>
{
    public async Task<ClaimResultDto> Handle(SubmitClaimCommand request, CancellationToken ct)
    {
        // 1. HIPAA Encrypted Audit Log (Zero plaintext disk writing)
        await auditLogger.LogAccessAsync("CLAIM_SUBMISSION", request.PatientId, request.ClaimAmount, ct);

        // 2. Non-blocking asynchronous network eligibility check
        if (request.ClaimAmount > 50000m)
        {
            var isEligible = await eligibilityService.VerifyPayerNetworkAsync(request.ProviderNpi, request.PatientId, ct);
            if (!isEligible)
            {
                return new ClaimResultDto(false, 0, "PR-204: Payer Network Out-Of-Scope");
            }
        }

        // 3. Create Validated Domain Aggregate
        var claim = AdjudicatedClaim.Create(
            patientId: request.PatientId,
            diagnosisCode: request.DiagnosisCode,
            amount: request.ClaimAmount,
            providerNpi: request.ProviderNpi);

        await claimsRepository.AddAsync(claim, ct);

        return new ClaimResultDto(true, claim.Id, null);
    }
}`
      }
    ],
    schemaMigration: {
      legacySqlSnippet: `SELECT Status, MedicaidId FROM Patients WHERE Id = ' + patientId;
EXEC sp_InsertAdjudicatedClaim @PatientId, @Code, @Amount, @Npi;`,
      modernDbContextCode: `// EF Core 9 Configuration with SQL Injection Immunity & Encryption
public class ClaimConfiguration : IEntityTypeConfiguration<AdjudicatedClaim>
{
    public void Configure(EntityTypeBuilder<AdjudicatedClaim> builder)
    {
        builder.ToTable("Claims", "healthcare");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.DiagnosisCode).HasMaxLength(16).IsRequired();
        builder.Property(c => c.Amount).HasPrecision(18, 2).IsRequired();
        builder.Property(c => c.ProviderNpi).HasMaxLength(10).IsFixedLength().IsRequired();
    }
}`,
      efCoreEntityConfiguration: `// Patient Entity with Data Protection
public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.ToTable("Patients", "healthcare");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.MedicaidId).HasMaxLength(32);
    }
}`,
      sqlMigrationScript: `-- SQL SERVER MIGRATION: Schema Isolation for Healthcare Claims
CREATE SCHEMA [healthcare];
GO
CREATE TABLE [healthcare].[Claims] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [PatientId] INT NOT NULL,
    [DiagnosisCode] NVARCHAR(16) NOT NULL,
    [Amount] DECIMAL(18,2) NOT NULL,
    [ProviderNpi] NCHAR(10) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
CREATE NONCLUSTERED INDEX [IX_Claims_Patient_Npi] ON [healthcare].[Claims]([PatientId], [ProviderNpi]);
GO`
    },
    testSuite: {
      framework: 'xUnit 2.9 + Moq',
      mockLibrary: 'Moq 4.20',
      testCode: `// Healthcare Adjudication Safety Tests
[Fact]
public async Task Handle_HighValueClaim_VerifiesPayerEligibilityAsync()
{
    _eligibilityMock.Setup(e => e.VerifyPayerNetworkAsync("NPI_123", 101, It.IsAny<CancellationToken>()))
        .ReturnsAsync(true);
    var command = new SubmitClaimCommand(101, "E11.9", 75000m, "NPI_123");
    var result = await _handler.Handle(command, CancellationToken.None);
    result.Accepted.Should().BeTrue();
    _auditMock.Verify(a => a.LogAccessAsync("CLAIM_SUBMISSION", 101, 75000m, It.IsAny<CancellationToken>()), Times.Once);
}`,
      testCases: [
        {
          id: 'TEST-HC-01',
          name: 'Handle_HighValueClaim_VerifiesPayerEligibilityAsync',
          type: 'Unit',
          targetMethod: 'SubmitClaimCommandHandler.Handle',
          assertions: ['Payer verified asynchronously', 'KMS audit logged', 'Claim persisted'],
          simulatedOutcome: 'PASS',
          durationMs: 38
        },
        {
          id: 'TEST-HC-02',
          name: 'Handle_IneligiblePayer_RejectsWithPR204',
          type: 'Boundary',
          targetMethod: 'SubmitClaimCommandHandler.Handle',
          assertions: ['Returns denial code PR-204', 'No database write'],
          simulatedOutcome: 'PASS',
          durationMs: 19
        }
      ]
    }
  };
}

function generateLogisticsModernization(sample: LegacySample): ModernizationResult {
  return {
    systemId: sample.id,
    systemName: sample.name,
    timestamp: new Date().toISOString(),
    engineUsed: 'Meta Llama 3 Agentic Copilot (AST-Grounded Enterprise Reasoning)',
    llamaModel: 'meta-llama/Meta-Llama-3.3-70B-Instruct',
    metrics: {
      legacyCouplingIndex: 88,
      modernCouplingIndex: 11,
      cyclomaticReductionPct: 79,
      maintainabilityIndexBefore: 36,
      maintainabilityIndexAfter: 94,
      technicalDebtHoursSaved: 290,
      estimatedCostSavedUsd: 43500,
      testCoveragePct: 96.8
    },
    assessment: {
      summary: 'DispatchEngine violates Open/Closed Principle via giant protocol switch statements and starves thread pool via blocking synchronous ADO.NET database writes on high-throughput sensor telemetry streams.',
      blastRadiusScore: 78,
      blastRadiusLevel: 'HIGH',
      godClasses: ['DispatchEngine'],
      solidViolations: [
        {
          principle: 'OCP',
          title: 'Open / Closed Violation (Hardware Switch Case)',
          location: 'DispatchEngine.cs : Line 20',
          severity: 'Critical',
          legacyProblem: 'Adding a new hardware protocol requires modifying the monolithic switch-case in DispatchEngine.',
          modernRemedy: 'Implement Polymorphic ITelemetryDecoder Strategy Pattern with reflection-free DI discovery.'
        },
        {
          principle: 'SRP',
          title: 'Single Responsibility Violation (Ingest vs Persist)',
          location: 'DispatchEngine.cs : Line 35',
          severity: 'High',
          legacyProblem: 'Telemetry ingestion engine directly writes to SQL Server synchronously every 100ms.',
          modernRemedy: 'Introduce Channel<T> or Kafka/RabbitMQ producer with batch asynchronous persistence.'
        }
      ],
      stranglerFigRoadmap: [
        {
          phase: 1,
          name: 'Protocol Decoder Strategy Extraction',
          duration: 'Week 1 - 2',
          objective: 'Replace switch statement with Open/Closed strategy interfaces.',
          tactics: ['Define ITelemetryDecoder', 'Implement CalAmpDecoder and GeotabDecoder'],
          deliverable: 'Plug-and-play hardware decoder pipeline.'
        },
        {
          phase: 2,
          name: 'Async Channel Batch Ingestion',
          duration: 'Week 3 - 4',
          objective: 'Decouple ingestion from database writes using System.Threading.Channels.',
          tactics: ['Implement high-speed in-memory channel', 'Background batch worker with EF Core bulk insert'],
          deliverable: '10x ingestion throughput without blocking.'
        }
      ]
    },
    uncoupling: {
      summary: 'Deconstructed 200-line switch into individual decoder strategies registered in DI.',
      nodes: [
        { id: 'engine', label: 'TelemetryIngestionService', layer: 'Application', type: 'service', status: 'modern_implementation' },
        { id: 'i_decoder', label: 'ITelemetryDecoder', layer: 'Domain', type: 'interface', status: 'decoupled_interface' },
        { id: 'calamp', label: 'CalAmpDecoder', layer: 'Infrastructure', type: 'service', status: 'modern_implementation' },
        { id: 'geotab', label: 'GeotabDecoder', layer: 'Infrastructure', type: 'service', status: 'modern_implementation' },
        { id: 'channel', label: 'Channel<TelemetryPacket>', layer: 'Infrastructure', type: 'service', status: 'modern_implementation' }
      ],
      edges: [
        { source: 'engine', target: 'i_decoder', type: 'interface_inversion', label: 'Resolves Protocol' },
        { source: 'calamp', target: 'i_decoder', type: 'interface_inversion', label: 'Implements' },
        { source: 'geotab', target: 'i_decoder', type: 'interface_inversion', label: 'Implements' },
        { source: 'engine', target: 'channel', type: 'mediator_dispatch', label: 'Publishes' }
      ],
      iocRegistrations: [
        { interfaceName: 'ITelemetryDecoder', implementationName: 'CalAmpDecoder', lifetime: 'Singleton', rationale: 'Stateless protocol byte parser.' },
        { interfaceName: 'ITelemetryDecoder', implementationName: 'GeotabDecoder', lifetime: 'Singleton', rationale: 'Stateless protocol byte parser.' }
      ],
      serviceRegistrationCode: `// Logistics Modern DI
services.AddSingleton<ITelemetryDecoder, CalAmpDecoder>();
services.AddSingleton<ITelemetryDecoder, GeotabDecoder>();
services.AddHostedService<TelemetryBatchWriterService>();`
    },
    refactoredFiles: [
      {
        filename: 'TelemetryIngestionService.cs',
        path: 'src/LogiFleet.Dispatch.Application/Services/TelemetryIngestionService.cs',
        layer: 'Application',
        language: 'csharp',
        description: 'Open-Closed compliant telemetry ingestor using strategy lookup and non-blocking System.Threading.Channels.',
        code: `// MODERN TELEMATICS INGESTION ENGINE (.NET 9)
using System.Threading.Channels;
using LogiFleet.Dispatch.Domain.Decoders;
using LogiFleet.Dispatch.Domain.Models;

namespace LogiFleet.Dispatch.Application.Services;

public class TelemetryIngestionService(
    IEnumerable<ITelemetryDecoder> decoders,
    ChannelWriter<TelemetryRecord> channelWriter)
{
    private readonly Dictionary<string, ITelemetryDecoder> _decoderMap = 
        decoders.ToDictionary(d => d.SupportedProtocol, StringComparer.OrdinalIgnoreCase);

    public async ValueTask IngestAsync(string protocol, ReadOnlyMemory<byte> payload, CancellationToken ct = default)
    {
        if (!_decoderMap.TryGetValue(protocol, out var decoder))
        {
            throw new NotSupportedException($"Unsupported hardware protocol: {protocol}");
        }

        var record = decoder.Decode(payload);
        await channelWriter.WriteAsync(record, ct);
    }
}`
      }
    ],
    schemaMigration: {
      legacySqlSnippet: `INSERT INTO TelemetryLog (RawPayload, IngestedAt) VALUES (@p, GETDATE());`,
      modernDbContextCode: `// High-Performance Telematics Entity Mapping
public class TelemetryConfiguration : IEntityTypeConfiguration<TelemetryRecord>
{
    public void Configure(EntityTypeBuilder<TelemetryRecord> builder)
    {
        builder.ToTable("TelemetryRecords", "telematics");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Latitude).HasPrecision(9, 6);
        builder.Property(t => t.Longitude).HasPrecision(9, 6);
        builder.HasIndex(t => t.IngestedAtUtc);
    }
}`,
      efCoreEntityConfiguration: ``,
      sqlMigrationScript: `CREATE TABLE [telematics].[TelemetryRecords] (
    [Id] BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Latitude] DECIMAL(9,6) NOT NULL,
    [Longitude] DECIMAL(9,6) NOT NULL,
    [SpeedMph] DECIMAL(5,2) NOT NULL,
    [IngestedAtUtc] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);`
    },
    testSuite: {
      framework: 'xUnit 2.9',
      mockLibrary: 'Moq 4.20',
      testCode: `// Telematics Unit Tests
[Fact]
public async Task IngestAsync_ValidProtocol_WritesToChannelWithoutBlocking()
{
    var decoderMock = new Mock<ITelemetryDecoder>();
    decoderMock.SetupGet(d => d.SupportedProtocol).Returns("GEOTAB_GO9");
    decoderMock.Setup(d => d.Decode(It.IsAny<ReadOnlyMemory<byte>>()))
        .Returns(new TelemetryRecord(37.77m, -122.41m, 65m));

    var channel = Channel.CreateUnbounded<TelemetryRecord>();
    var service = new TelemetryIngestionService([decoderMock.Object], channel.Writer);

    await service.IngestAsync("GEOTAB_GO9", new byte[] { 0x01, 0x02 });

    channel.Reader.TryRead(out var record).Should().BeTrue();
    record.SpeedMph.Should().Be(65m);
}`,
      testCases: [
        {
          id: 'TEST-LOGI-01',
          name: 'IngestAsync_ValidProtocol_WritesToChannelWithoutBlocking',
          type: 'Unit',
          targetMethod: 'TelemetryIngestionService.IngestAsync',
          assertions: ['Decodes correctly via polymorphic strategy', 'Pushes into asynchronous channel', 'Zero database lockup'],
          simulatedOutcome: 'PASS',
          durationMs: 22
        }
      ]
    }
  };
}
