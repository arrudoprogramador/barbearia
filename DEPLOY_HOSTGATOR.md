# 💈 Guia Completo de Deploy na HostGator & Multi-Aplicações

Este projeto foi especialmente desenhado para permitir que você use **o mesmo template em dezenas de clientes/barbearias diferentes**, com total facilidade de publicação na **HostGator** (cPanel tradicional ou VPS).

---

## 🎯 1. Estrutura e Diferencial da Arquitetura

1. **Frontend Ultra-Rápido e Estático:**
   - Construído com React, Vite e Tailwind CSS.
   - Gera uma pasta `dist/` com arquivos estáticos leves e caminhos relativos (`./`), permitindo rodar em **qualquer subpasta ou domínio** sem quebrar rotas ou imagens.

2. **Backend PHP Zero-Configuração (Perfeito para HostGator cPanel):**
   - Na HostGator, planos compartilhados não precisam de Node.js rodando como serviço ou banco de dados MySQL complexo.
   - O arquivo `api/index.php` armazena e gerencia os dados com segurança em `data.json` com bloqueio de concorrência (`LOCK_EX`) e proteção contra acesso direto via `.htaccess`.

3. **Fallback Instantâneo em LocalStorage:**
   - Mesmo se você rodar o projeto localmente ou em hospedagens puramente estáticas, o sistema funciona 100% de imediato.

4. **Multi-Clientes com Templates Portáteis:**
   - Você pode exportar a configuração de um cliente em `.json` e importar em outro cliente em apenas 1 clique pelo Painel Admin!

---

## 🚀 2. Como Gerar o Pacote de Deploy

No terminal do seu computador (dentro da pasta do projeto):

```bash
npm run build
```

Este comando gera a pasta `dist/` contendo:
- `index.html`
- `assets/` (CSS e JS minificados e ultra-rápidos)
- `api/` (com `index.php` e `.htaccess`)

A pasta `dist/` é **tudo o que você precisa enviar para o servidor**.

---

## 🌐 3. Estratégias de Implantação para Vários Clientes na HostGator

Você pode escolher como organizar os clientes na sua conta HostGator:

### Opção A: Um domínio próprio para cada barbearia
*(Ex: `barbeariaferreira.com.br`, `imperiofade.com.br`)*
1. No cPanel da HostGator, vá em **Domínios de Complemento** (Addon Domains) ou configure o domínio principal.
2. Acesse o **Gerenciador de Arquivos** e entre na pasta do domínio (ex: `public_html/` ou `public_html/barbeariaferreira.com.br/`).
3. Envie todos os arquivos de dentro da sua pasta `dist/` para a raiz do domínio.

### Opção B: Subdomínio para cada barbearia (Muito recomendado!)
*(Ex: `ferreira.seusite.com.br`, `barbervip.seusite.com.br`)*
1. No cPanel, vá em **Subdomínios**.
2. Crie o subdomínio desejado (ex: `ferreira`). A HostGator criará a pasta `public_html/ferreira/`.
3. Abra o **Gerenciador de Arquivos**, vá até `public_html/ferreira/` e envie os arquivos da pasta `dist/`.

### Opção C: Subpastas no mesmo domínio
*(Ex: `seusite.com.br/ferreira/`, `seusite.com.br/imperio/`)*
1. No cPanel, no **Gerenciador de Arquivos**, crie pastas dentro de `public_html/`:
   - `public_html/ferreira/`
   - `public_html/imperio/`
2. Copie os arquivos da pasta `dist/` para dentro de cada pasta. Como o projeto usa caminhos relativos (`base: './'`), ele funcionará perfeitamente dentro de qualquer subpasta!

---

## 🛠️ 4. Passo a Passo no cPanel da HostGator

1. **Acessar o cPanel:** Entre na sua conta HostGator e clique em *cPanel*.
2. **Compactar os arquivos para envio rápido:**
   - No seu computador, entre na pasta `dist/`, selecione todos os arquivos e crie um arquivo ZIP (ex: `dist.zip`).
3. **Enviar via Gerenciador de Arquivos:**
   - No cPanel, abra o **Gerenciador de Arquivos** (`File Manager`).
   - Navegue até a pasta de destino (`public_html` ou subpasta).
   - Clique em **Carregar** (`Upload`) e envie o `dist.zip`.
   - Clique com o botão direito no `dist.zip` dentro do cPanel e escolha **Extrair** (`Extract`).
4. **Permissões de Arquivo:**
   - A pasta `api/` precisa de permissão de escrita para salvar `data.json` (permissão padrão `755` para pastas e `644` para arquivos, já padrão na HostGator).
5. **Ativar SSL Grátis (HTTPS):**
   - No cPanel, procure por **SSL/TLS Status** e certifique-se de que o certificado AutoSSL está ativo no domínio ou subdomínio.

---

## 🔒 5. Como Customizar para Cada Cliente pelo Painel Admin

Ao abrir o site da barbearia:
1. No topo à direita ou no rodapé, clique em **Área Admin**.
2. Digite a senha padrão: **`admin123`**
3. Você terá acesso às seguintes abas:
   - **Dashboard:** Métricas do dia, faturamento e agenda de hoje com botão de WhatsApp direto para o cliente.
   - **Agendamentos:** Filtro por data e status, criação de horários manuais e cancelamentos.
   - **Serviços:** Adicione ou edite os serviços (Corte, Barba, Platinado, etc.), com preços, tempos e fotos.
   - **Barbeiros & Escalas:** Cadastre os barbeiros, fotos e defina os horários de expediente de segunda a domingo e pausa de almoço.
   - **Configurações:** Altere Nome Fantasia, WhatsApp, endereço, tolerância de atraso, mensagens padrão e a senha admin.
   - **Deploy HostGator:** Ferramenta para exportar e importar configurações em `.json`.

---

## 📋 6. Clonando Novas Barbearias em 30 Segundos

Para entregar uma nova barbearia para um novo cliente rapidamente:
1. Crie a nova pasta na HostGator (ex: `public_html/barbearia2/`).
2. Cole os arquivos do `dist/`.
3. Abra `seusite.com.br/barbearia2/` no navegador.
4. Acesse o Admin com `admin123`.
5. Se você já tiver um arquivo `.json` exportado de outro modelo, clique na aba **Deploy HostGator** &gt; **Importar Config** e selecione o arquivo. Tudo (serviços, barbeiros, regras) será configurado na hora!

