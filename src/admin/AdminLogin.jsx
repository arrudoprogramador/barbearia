import React, { useState } from 'react';
import { Lock, ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function AdminLogin({ onClose }) {
  const { loginAdmin } = useBarber();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (!success) {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top banner */}
        <div className="bg-slate-900 p-6 text-center text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="font-extrabold text-lg tracking-tight">Painel do Administrador</h3>
          <p className="text-xs text-slate-400 mt-0.5">Gerenciamento da Barbearia</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Senha de Acesso</span>
            </label>
            <input
              type="password"
              required
              autoFocus
              placeholder="Digite a senha admin"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm focus:outline-hidden"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>Senha incorreta. (Padrão: <b>admin123</b>)</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Acessar Painel
            </button>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-slate-400">
              Dica: a senha padrão é <span className="font-mono font-semibold text-slate-600">admin123</span> e pode ser alterada nas configurações.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

