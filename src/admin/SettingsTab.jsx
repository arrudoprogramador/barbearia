import React, { useState } from 'react';
import { Save, Check, RefreshCw, Key, Store, MapPin, MessageSquare, ShieldAlert } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function SettingsTab() {
  const { settings, updateSettings } = useBarber();
  const [form, setForm] = useState({ ...settings });
  const [newPassword, setNewPassword] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleChange = (section, field, value) => {
    if (section) {
      setForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = { ...form };
    if (newPassword.trim()) {
      updated.admin_credentials = {
        password_hash: newPassword.trim()
      };
    }
    await updateSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Configurações & Personalização</h3>
          <p className="text-xs text-slate-500">
            Altere dados de contato, endereço, mensagens de WhatsApp e regras do estabelecimento.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}

      {/* Identity & Contact */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-3">
          <Store className="w-4 h-4 text-amber-500" />
          <span>Identidade e Contatos</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nome Fantasia da Barbearia *</label>
            <input
              type="text"
              required
              value={form.fantasy_name}
              onChange={(e) => handleChange(null, 'fantasy_name', e.target.value)}
              className="w-full px-3 py-2 border rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Subtítulo / Slogan</label>
            <input
              type="text"
              value={form.subtitle || ''}
              onChange={(e) => handleChange(null, 'subtitle', e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">WhatsApp de Atendimento *</label>
            <input
              type="text"
              required
              value={form.phone}
              onChange={(e) => handleChange(null, 'phone', e.target.value)}
              placeholder="(11) 98765-4321"
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Instagram (@usuario)</label>
            <input
              type="text"
              value={form.instagram || ''}
              onChange={(e) => handleChange(null, 'instagram', e.target.value)}
              placeholder="barbearia_oficial"
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">URL Logo / Avatar</label>
            <input
              type="url"
              value={form.avatar}
              onChange={(e) => handleChange(null, 'avatar', e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">URL Foto de Capa / Banner</label>
            <input
              type="url"
              value={form.banner || ''}
              onChange={(e) => handleChange(null, 'banner', e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-3">
          <MapPin className="w-4 h-4 text-amber-500" />
          <span>Localização e Endereço</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Rua / Avenida</label>
            <input
              type="text"
              value={form.address?.street || ''}
              onChange={(e) => handleChange('address', 'street', e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Número</label>
            <input
              type="text"
              value={form.address?.number || ''}
              onChange={(e) => handleChange('address', 'number', e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Bairro</label>
            <input
              type="text"
              value={form.address?.neighbourhood || ''}
              onChange={(e) => handleChange('address', 'neighbourhood', e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Cidade</label>
            <input
              type="text"
              value={form.address?.city || ''}
              onChange={(e) => handleChange('address', 'city', e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Estado</label>
            <input
              type="text"
              value={form.address?.state || 'SP'}
              onChange={(e) => handleChange('address', 'state', e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-3">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Regras de Tolerância & Cancelamento</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tolerância de atraso (minutos)</label>
            <input
              type="number"
              value={form.booking_rules?.tolerance_late_minutes || 10}
              onChange={(e) => handleChange('booking_rules', 'tolerance_late_minutes', parseInt(e.target.value) || 10)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Antecedência mínima de cancelamento (horas)</label>
            <input
              type="number"
              value={form.booking_rules?.cancellation_notice_hours || 12}
              onChange={(e) => handleChange('booking_rules', 'cancellation_notice_hours', parseInt(e.target.value) || 12)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Texto de Política de Cancelamento / Reembolso</label>
            <input
              type="text"
              value={form.booking_rules?.cancellation_policy || ''}
              onChange={(e) => handleChange('booking_rules', 'cancellation_policy', e.target.value)}
              placeholder="ex: Reembolso até 12 hrs antes..."
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.booking_rules?.allow_client_cancel ?? true}
                onChange={(e) => handleChange('booking_rules', 'allow_client_cancel', e.target.checked)}
                className="rounded text-amber-500 w-4 h-4"
              />
              <span>Permitir que clientes cancelem o horário diretamente pelo link do site</span>
            </label>
          </div>
        </div>
      </div>

      {/* WhatsApp Message Template */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-3">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>Mensagem Automática de Confirmação no WhatsApp</span>
        </h4>

        <div className="text-xs space-y-2">
          <p className="text-slate-500">
            Você pode usar as tags: <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-600 font-bold">{'{cliente}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-600 font-bold">{'{fantasia}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-600 font-bold">{'{data}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-600 font-bold">{'{horario}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-600 font-bold">{'{servicos}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-600 font-bold">{'{profissional}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-600 font-bold">{'{valor_total}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-600 font-bold">{'{endereco}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-600 font-bold">{'{tolerancia}'}</code>.
          </p>
          <textarea
            rows="7"
            value={form.manual_messages?.appointment_confirmation || ''}
            onChange={(e) => handleChange('manual_messages', 'appointment_confirmation', e.target.value)}
            className="w-full px-3 py-2 border rounded-xl font-mono text-xs text-slate-800"
          />
        </div>
      </div>

      {/* Admin Password */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-3">
          <Key className="w-4 h-4 text-slate-700" />
          <span>Segurança & Senha de Acesso Admin</span>
        </h4>

        <div className="text-xs max-w-sm">
          <label className="block font-bold text-slate-700 mb-1">Nova Senha Admin</label>
          <input
            type="password"
            placeholder="Deixe em branco para manter a atual"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl"
          />
          <p className="text-[11px] text-slate-400 mt-1">Senha atual configurada: <b>admin123</b></p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Todas as Configurações</span>
        </button>
      </div>
    </form>
  );
}

