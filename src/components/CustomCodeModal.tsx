import React, { useState } from 'react';
import { X, Code2, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface CustomCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string, targetArch: string) => void;
}

export const CustomCodeModal: React.FC<CustomCodeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState(`// Paste your monolithic .NET / C# legacy class here
public class LegacyBillingService
{
    private string _conn = "Server=sql01;Database=Legacy;Trusted_Connection=True;";

    public bool ChargeAndNotify(int custId, decimal amt)
    {
        using (var c = new System.Data.SqlClient.SqlConnection(_conn))
        {
            c.Open();
            var cmd = new System.Data.SqlClient.SqlCommand("UPDATE Customers SET Bal = Bal + " + amt + " WHERE Id = " + custId, c);
            cmd.ExecuteNonQuery();
        }
        var smtp = new System.Net.Mail.SmtpClient("smtp.internal", 25);
        smtp.Send("orders@corp.com", "user@corp.com", "Billed", "Amount: " + amt);
        return true;
    }
}`);
  const [targetArch, setTargetArch] = useState('Clean Architecture + CQRS');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              Modernize Custom C# Monolith (.NET Legacy)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Modern Architecture
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                'Clean Architecture + CQRS',
                'Modular Monolith',
                'Vertical Slice Architecture'
              ].map((arch) => (
                <button
                  key={arch}
                  type="button"
                  onClick={() => setTargetArch(arch)}
                  className={`p-2.5 rounded-lg border text-xs text-left transition-colors ${
                    targetArch === arch
                      ? 'bg-cyan-950 border-cyan-800 text-cyan-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-sans">{arch}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">.NET 9 LTS</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Legacy C# Source Code
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                Supports .NET Framework 3.5 - 4.8 / ASP.NET / WCF
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={14}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
              placeholder="// Paste legacy C# code..."
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Automates Assessment, SOLID Inversion, Schema Migration & xUnit Generation
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSubmit(code, targetArch);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modernize with Meta Llama 3</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
