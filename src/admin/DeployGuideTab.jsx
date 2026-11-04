import React, { useState } from 'react';
import { Server, Download, Upload, RefreshCw, CheckCircle, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';
import { api } from '../services/api';

export default function DeployGuideTab() {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  const handleExport = async () => {
    try {
      const data = await api.exportFullConfig();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `barbearia-config-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erro ao exportar: " + err.message);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        await api.importFullConfig(json);
        setImportStatus("Configuração importada com sucesso! Recarregando...");
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        alert("Erro ao importar arquivo: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (confirm("Deseja restaurar as configurações originais da Barbearia Ferreira?")) {
      await api.resetToDefaults();
      window.location.reload();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Server className="w-5 h-5 text-amber-500" />
            <span>Guia de Deploy HostGator & Multi-Clientes</span>
          </h3>
          <p className="text-xs text-slate-500">
            Como clonar, exportar e publicar este projeto para dezenas de barbearias na HostGator.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Config (.json)</span>
          </button>

          <label className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Importar Config</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {importStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Guide Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
        {/* Architecture concept */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
          <h4 className="font-bold text-slate-900 text-sm mb-1">
            🚀 Como funciona o modelo Multi-Barbearias na HostGator?
          </h4>
          <p>
            Cada barbearia é <b>100% independente</b> e possui seu próprio catálogo de serviços, barbeiros, horários e agendamentos. Você pode hospedar cada uma das seguintes formas no cPanel da HostGator:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><b>Por Domínio Próprio:</b> <code>barbeariaferreira.com.br</code> apontando para a pasta <code>public_html/</code></li>
            <li><b>Por Subdomínio:</b> <code>ferreira.seusite.com.br</code> ou <code>vips.seusite.com.br</code></li>
            <li><b>Por Subpasta:</b> <code>seusite.com.br/ferreira/</code> ou <code>seusite.com.br/barbearia2/</code> (graças ao caminho relativo configurado no Vite)</li>
          </ul>
        </div>

        {/* Step by step */}
        <div>
          <h4 className="font-extrabold text-slate-900 text-base mb-4">
            Passo a Passo de Publicação na HostGator (cPanel)
          </h4>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-amber-600 text-xs uppercase tracking-wider block mb-1">
                Passo 1: Gerar a compilação do projeto
              </span>
              <p className="text-slate-600">
                No terminal do seu computador, execute o comando de build:
              </p>
              <div className="mt-2 flex items-center justify-between bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px]">
                <code>npm run build</code>
                <button
                  onClick={() => copyToClipboard('npm run build')}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-slate-500 text-[11px] mt-1.5">
                Isso criará uma pasta <code>dist/</code> com todos os arquivos HTML, CSS e JavaScript ultra-otimizados.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-amber-600 text-xs uppercase tracking-wider block mb-1">
                Passo 2: Enviar para o cPanel da HostGator
              </span>
              <p className="text-slate-600">
                Acesse o cPanel da HostGator &gt; <b>Gerenciador de Arquivos</b> &gt; pasta <code>public_html</code> (ou subpasta do cliente):
              </p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Copie todo o conteúdo da pasta <b><code>dist/</code></b> para a raiz do site (<code>index.html</code>, pasta <code>assets/</code>).</li>
                <li>Copie também a pasta <b><code>api/</code></b> (contendo <code>index.php</code> e <code>.htaccess</code>) para o mesmo local.</li>
              </ol>
              <p className="text-emerald-700 font-semibold text-[11px] mt-2">
                ✅ Pronto! Não precisa instalar Node.js nem criar banco de dados MySQL na HostGator: o backend PHP com JSON funciona de forma automática e segura!
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-amber-600 text-xs uppercase tracking-wider block mb-1">
                Passo 3: Como criar uma nova barbearia para outro cliente
              </span>
              <p className="text-slate-600">
                Quando você fechar contrato com uma nova barbearia:
              </p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Basta duplicar a pasta no cPanel (ex: criar <code>public_html/novobarber</code>).</li>
                <li>Acesse o painel admin dessa nova barbearia (senha padrão <code>admin123</code>).</li>
                <li>Altere o Nome Fantasia, WhatsApp, Barbeiros e Serviços na aba <b>Configurações</b>.</li>
                <li>Se preferir, use o botão <b>Exportar Config (.json)</b> para criar templates pré-prontos (ex: barbearia premium, barbearia simples) e importe com 1 clique!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Reset */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <h5 className="font-bold text-slate-800 text-xs">Restaurar Barbearia Ferreira</h5>
            <p className="text-[11px] text-slate-500">Volta para os dados padrão da referência inbarberapp</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>
        </div>
      </div>
    </div>
  );
}

