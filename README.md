# 🚛 Sistema de Ordens de Coleta — Pianetto Transportes e Logística

Sistema web completo para criação, gestão e histórico de ordens de coleta da Pianetto Transportes e Logística. Desenvolvido para rodar como site estático no GitHub Pages ou em qualquer servidor web.

---

## 📁 Estrutura de Arquivos

```
pianetto-ordens/
├── index.html          → Formulário de Nova Ordem de Coleta
├── historico.html      → Painel de Histórico com filtros
├── print.html          → Página de impressão / salvar em PDF
├── css/
│   └── style.css       → Estilos completos do sistema
├── js/
│   └── storage.js      → Camada de armazenamento (online + fallback local)
├── images/
│   └── logo.png        → Logo da Pianetto Transportes
└── README.md           → Este arquivo
```

---

## 🚀 Como publicar no GitHub Pages

### Passo 1 — Criar o repositório
1. Acesse [github.com/new](https://github.com/new)
2. Nome sugerido: `pianetto-ordens`
3. Deixe como **Público**
4. Clique em **Create repository**

### Passo 2 — Fazer upload dos arquivos
1. No repositório criado, clique em **Add file → Upload files**
2. Arraste todos os arquivos e pastas do projeto:
   - `index.html`
   - `historico.html`
   - `print.html`
   - `README.md`
   - Pasta `css/` com `style.css`
   - Pasta `js/` com `storage.js`
   - Pasta `images/` com `logo.png`
3. Clique em **Commit changes**

### Passo 3 — Ativar o GitHub Pages
1. Vá em **Settings** (aba do repositório)
2. No menu lateral, clique em **Pages**
3. Em **Source**, selecione **Deploy from a branch**
4. Em **Branch**, selecione **main** e **/ (root)**
5. Clique em **Save**
6. Aguarde ~2 minutos

### Passo 4 — Acessar o sistema
Após a publicação, seu link ficará assim:
```
https://SEU_USUARIO.github.io/pianetto-ordens/
```

---

## ✅ Funcionalidades do Sistema

| Recurso | Descrição |
|---|---|
| 📝 **Formulário completo** | Todos os campos da ordem de coleta |
| 🔢 **PEDIDO editável** | Sugerido automaticamente, mas editável manualmente |
| 🔴 **O.C. automática** | Numeração sequencial automática e protegida |
| 📅 **Data automática** | Data de emissão preenchida com a data de hoje |
| 💰 **Cálculo automático** | Total frete e saldo a pagar calculados automaticamente |
| 🖨️ **Exportar PDF** | Botão dedicado no formulário e no histórico |
| 💾 **Salvar no histórico** | Persiste as ordens no banco ou localStorage |
| 📊 **Painel de histórico** | Cards de resumo + tabela paginada com filtros |
| 🔍 **Filtros avançados** | Busca textual, status, data inicial e data final |
| 🔁 **Duplicar ordem** | Gera nova O.C. automática com dados copiados |
| 🔒 **Bloqueio de campos** | Campos sensíveis bloqueados na duplicação |
| 📥 **Exportar CSV** | Exportação dos dados filtrados em CSV |
| 🟢/🟡 **Modo online/local** | Fallback automático para localStorage |
| 🔄 **Sincronização** | Botão para enviar dados locais ao servidor |

---

## ⚠️ Modo Online vs Modo Local

O sistema funciona em dois modos:

### 🟢 Modo Online (Genspark / servidor com banco)
- Dados salvos no servidor
- Histórico compartilhado com toda a equipe
- Disponível quando publicado na plataforma Genspark

### 🟡 Modo Local (GitHub Pages)
- Dados salvos no `localStorage` do navegador
- Histórico disponível apenas no mesmo navegador/dispositivo
- Não compartilha dados entre dispositivos diferentes
- Ideal para uso individual ou como backup

> Para histórico **compartilhado com a equipe**, publique pela plataforma **Genspark (aba Publish)**.  
> Para versionamento, backup e uso individual, use o **GitHub Pages**.

---

## 📊 Campos da Ordem de Coleta

| Seção | Campos |
|---|---|
| **Identificação** | Pedido, O.C., Data de Emissão |
| **Dados da Carga** | Remetente, Cidade Origem, Recebedor, Destino, Mercadoria, Peso Bruto, Terminal, Data Agendamento, Modalidade |
| **Dados do Veículo** | Placa Cavalo, Placa Carreta 1, Dolly, Placa Carreta 3, UF |
| **Dados do Motorista** | Motorista, Celular, CPF, RG, CNH |
| **Local / Obs.** | Local de Coleta, Observações |
| **Valores** | Valor/Ton, Total Frete (auto), Pedágio, Adiantamento, Saldo a Pagar (auto) |
| **Assinaturas** | Nome Motorista, Analista de Logística |

---

## 🖨️ Como gerar PDF de uma ordem

1. Preencha a ordem no formulário
2. Clique em **"🖨️ Exportar PDF"**
3. No Chrome, escolha **Destino → Salvar como PDF**
4. Clique em **Salvar**

### Reimprimir do histórico:
1. Acesse o **Histórico**
2. Clique no botão **PDF** (vermelho) na linha da ordem
3. A página de impressão abre em nova aba
4. Clique em **Imprimir / Salvar PDF**

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** — estrutura semântica
- **CSS3** — design responsivo com variáveis CSS
- **JavaScript ES6+** — lógica do sistema
- **Font Awesome 6** — ícones (via CDN)
- **Google Fonts (Inter)** — tipografia (via CDN)
- **localStorage** — armazenamento local como fallback
- **RESTful API** — banco de dados online (quando disponível)

---

## 📌 Empresa

**Pianetto Transportes e Logística**  
CNPJ: 43.976.512/0001-09  
INSC. EST: 20.101.161-1  
ROD. BR 060 KM 388 SALA 139 – RIO VERDE / GO  
comercial.goianesia@pianettotransportes.com.br
