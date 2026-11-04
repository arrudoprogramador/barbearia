# 💈 Barber Booking System (Template Multi-Barbearias Clean)

Template de agendamento online moderno, minimalista e ultra-rápido, com cadastro direto no sistema (sem WhatsApp) e dados do cliente salvos no primeiro uso para agendamentos futuros em 1 clique.

## ✨ Recursos

- **Cadastro Único e Inteligente:**
  - O cliente informa nome e telefone apenas na primeira vez.
  - Nas próximas visitas, o sistema reconhece o usuário e permite agendar em **1 clique**, sem formulários repetitivos.
  - Opção fácil de editar dados ou trocar de usuário.

- **100% Nativo no Sistema (Zero Dependência de WhatsApp):**
  - Agendamentos, comprovantes e protocolos (`#BF-XXXX`) gerados e gravados diretamente no sistema.
  - Tela de consulta e cancelamento integrada ("Meus Agendamentos"), que já abre com os horários do cliente logado.

- **Design Ultra-Clean (Sem Navbars Poluídas):**
  - Barra superior escura e stepper removidos para foco total no serviço e agilidade de conversão.
  - Header minimalista com status da barbearia ("Aberto hoje até às 19:00", endereço e botão sutil de consulta).
  - Indicadores sutis e elegantes ("Passo 1 de 4", etc.).
  - Acesso ao painel administrativo discreto com cadeado no rodapé.

- **Painel Administrativo Completo (`admin123`):**
  - Dashboard em tempo real com métricas e agenda do dia.
  - Gestão de agendamentos com filtros e criação de horários manuais.
  - Gestão de catálogo de serviços (preços, tempos, fotos).
  - Gestão de barbeiros e escala semanal individual com horário de almoço.
  - Exportação e importação de configurações em `.json` para clonar clientes na HostGator em segundos.

- **Deploy HostGator:**
  - Backend PHP zero-configuração (`dist/api/index.php`) compatível com cPanel compartilhado ou VPS.
  - Guia completo em [`DEPLOY_HOSTGATOR.md`](file:///c:/Users/joao.souza/Projetos/barber/DEPLOY_HOSTGATOR.md).

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Gerar build final para upload no cPanel da HostGator
npm run build
```
