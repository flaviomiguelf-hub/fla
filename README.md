# Pianetto Transportes — Sistema de Ordens de Coleta

## Visão Geral
Sistema web para emissão, gestão e histórico de ordens de coleta da **Pianetto Transportes e Logística**.

---

## Páginas do Sistema

| Arquivo | Descrição |
|---|---|
| `index.html` | Formulário principal da ordem de coleta |
| `historico.html` | Painel de histórico com filtros e busca |
| `print.html?id={id}` | Visualização otimizada para impressão/PDF de uma ordem |
| `guia-pdf.html` | Guia completo de como exportar PDF em diferentes navegadores |

---

## Funcionalidades Implementadas

- ✅ **Campo PEDIDO** editável com sugestão automática (`PEDIDO-2026-0001`)
- ✅ **Campo O.C.** com numeração sequencial automática (`OC-2026-0001`)
- ✅ **Data de emissão** preenchida automaticamente com a data de hoje
- ✅ **Formulário completo** — dados da carga, veículo, motorista, local
- ✅ **Exportar PDF** direto no formulário (1 página A4 otimizada)
- ✅ **Salvar no histórico** com banco de dados persistente
- ✅ **Duplicar ordem** com nova O.C. automática e bloqueio de campos sensíveis
- ✅ **Painel de histórico** com filtros por data, status e busca textual
- ✅ **Reimprimir/PDF** pelo histórico (abre `print.html`)
- ✅ **Exportar CSV** dos registros filtrados
- ✅ **Modo online/offline** — fallback automático para localStorage
- ✅ **Logo** da Pianetto em cabeçalho, rodapé e impressão
- ✅ **Guia de exportação PDF** para Chrome, Edge, Firefox e Safari
- ✅ Máscaras de CPF e celular
- ✅ Layout A4 otimizado para 1 página

---

## Armazenamento

- **Modo Online**: API REST da tabela `ordens` (31 campos estruturados)
- **Modo Offline**: localStorage do navegador com sincronização manual
- **Indicador visual**: banner no topo mostra modo atual

---

## Como Exportar PDF em 1 Página A4

### Recomendado: Chrome ou Edge

1. Preencha a ordem
2. Clique em **🖨️ Exportar PDF**
3. Configure:
   - Destino: **Salvar como PDF**
   - Tamanho: **A4** | Orientação: **Retrato**
   - Cabeçalhos e Rodapés: **☐ DESMARCAR**
   - Margens: **Nenhuma** ou **Mínimo**
4. Verifique a pré-visualização (deve aparecer 1 página)
5. Clique em **Salvar**

### Firefox
- Funciona, mas use a aba "Opções" para desmarcar cabeçalhos/rodapés
- Se sair em 2 páginas, reduza a escala para 90%

### Safari (Mac)
- Clique em PDF → Salvar como PDF no canto inferior esquerdo
- Se sair em 2 páginas, reduza a escala para 90-95%

---

## Compatibilidade de Navegadores

| Navegador | PDF 1 Página | Qualidade | Recomendação |
|---|---|---|---|
| Chrome | ✅ | ⭐ Ótima | **1ª opção** |
| Edge | ✅ | ⭐ Ótima | **2ª opção** |
| Firefox | ⚠️ Ajustes | 🔵 Boa | Com configuração |
| Safari | ⚠️ Ajustes | ⚠️ Parcial | Reduzir escala |
| Mobile | ❌ | ❌ Limitada | Usar computador |

---

## Próximas Melhorias Sugeridas

- [ ] Login/autenticação por usuário
- [ ] PDF com nome automático (OC-2026-0001.pdf)
- [ ] Filtro por motorista no histórico
- [ ] Status personalizáveis
- [ ] Dashboard com gráficos de entregas
- [ ] Envio de PDF por WhatsApp/e-mail
- [ ] Controle de versão das ordens
