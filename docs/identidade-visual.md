# Identidade visual (paleta do IDE-SP e logo do IGC)

Atende o pedido nº 1 do documento de correções do CJT (#PEND-38): "mudar todas as cores, seguindo a cartela e padrão do IGC". Como a cartela do IGC não está no repositório, o time decidiu em 2026-10-08 seguir a **paleta do portal IDE-SP** (https://www.idesp.sp.gov.br/), com **a logo do IGC e nunca a do Governo do Estado de SP**. Foi feito na branch `feat/portal-correcoes-cjt`, em 6 fases (um commit por fase).

## 1. Onde ficam as cores

Tudo nasce de **tokens** no bloco `@theme` de `src/app/globals.css`. Em telas e componentes se usam classes (`bg-brand-800`, `text-gray-600`); **não se escreve hex** no código de interface.

| Família | Valores | Uso |
| --- | --- | --- |
| `brand-*` (marca) | 50 `#E6EFF4` · 100 `#CFE1EA` · 200 `#A6C6D6` · 300 `#78A5BD` · 400 `#4D87A5` · 500 `#3D7896` · 600 `#2D6986` · 700 `#1F4F69` · 800 `#183747` · 900 `#0F2733` · 950 `#091A22` | **Botão primário `brand-800`** (hover `brand-900`); links, foco e ênfase `brand-600`; item ativo e destaques `brand-50`/`brand-100`; bordas `brand-100`/`brand-200`. |
| `gray-*` (neutros, sobrescreve o padrão do Tailwind) | 50 `#F6F7F9` · 100 `#EFF2F5` · 200 `#E4E7EC` · 300 `#CDD3DD` · 400 `#98A2B3` · 500 `#5F6C85` · 600 `#46536C` · 700 `#39465B` · 800 `#212E40` · 900 `#020817` · 950 `#01040F` | Texto, bordas e fundos. **`gray-400` só para decoração** (ícone); texto de apoio é `gray-500` ou mais escuro. |
| `areia-*` | 100 `#E9E6DD` · 600 `#8A8066` (decoração) · 700 `#6B6148` | Faixa de navegação do portal. |
| `marca-*` | 100 `#FBDADA` · 500 `#ED5B5B` (decoração) | Só detalhe gráfico; nunca texto nem erro. |
| `red-*` (sobrescrito) | 700 `#B42318` etc. | Erro e ação destrutiva. |
| `green`, `amber`, `red`, `orange`, `violet` (padrão do Tailwind) | — | **Semânticos**: sucesso e etapa concluída, alerta, erro, status. Não são marca. |

Fonte: **Inter** (`next/font/google` em `src/app/layout.tsx`); Geist Mono continua nos trechos monoespaçados. A plataforma só tem tema claro (regra existente do `AGENTS.md`).

## 2. Regras de uso

- **Marca = `brand`.** Botão, link, foco, item selecionado e progresso usam `brand-*`. **Verde só onde significa sucesso ou concluído** (confirmação de envio, "Rascunho salvo", etapa concluída do acompanhamento, cartão "Concluídas", chip "SIGEF real").
- **Categorias continuam distintas.** As 10 etapas do quadro (`src/lib/workflow.ts`), os chips de status (`src/lib/requisicao-status.ts`), os chips de papel (`usuarios-admin.tsx`) e as cores das camadas do mapa (`/geometria`) são categóricas: só "Entrada SDTC" e "Em análise" passaram a `brand`; não se colapsam duas categorias na mesma cor. Os 12 polígonos nomeados (`src/lib/cores-poligonos.ts`) têm a primeira cor alinhada à marca (`#2D6986`) e as demais distintas; a cor nunca é a única pista (há rótulo).
- **Contraste AA (4,5:1 em texto comum).** `src/lib/paleta.test.ts` lê `globals.css` e falha se um par de token cair abaixo disso; ao mudar um token, rode `npm test`. Branco sobre `brand-800` tem ~12:1; `brand-600` sobre branco, ~6:1.
- **Logo:** só pelo componente `LogoIgc` (`src/components/marca/logo-igc.tsx`), arquivo `public/marca/igc-logo.png`. Vai sobre fundo claro e em até ~64 px de altura. A rota `/marca` é pública no `src/proxy.ts` (a logo aparece nos logins, antes de haver sessão). O favicon (`src/app/favicon.ico`) é gerado da mesma imagem.
- **Foco por teclado:** regra global em `globals.css` (anel de 2 px `brand-600`, 2 px de distância) para links, botões e campos; não se redefine por componente.
- **A minuta impressa da certidão** (`/processos/[id]/certidao`) continua neutra; só o botão Imprimir (que some na impressão) usa `brand`.

## 3. O que cada fase entregou

| Fase | Commit | Conteúdo |
| --- | --- | --- |
| 0 | — | Proposta visual em HTML aprovada; logo definida. |
| 1 | `216d43a` | Tokens, fonte Inter, regras globais (placeholder, texto, seleção, foco), `paleta.ts` e `paleta.test.ts`. |
| 2 | `c9acc02` | Logo do IGC, favicon, cabeçalho branco e faixa bege do portal, barra lateral e logins; `/marca` pública; `min-w-0` no `main` (#PEND-47). |
| 3 | `ae64208` | Portal do solicitante: botões, links, seleção, acompanhamento (atual em `brand`, concluído em verde), chat. |
| 4 | `ea404be` | Backoffice: botões, links, avisos e notificações. |
| 5 | `530fb7b` | Chips de status, etapa do quadro, polígonos, mapas, `/geometria` e botão de feedback. |
| 6 | (este) | Auditoria, ajustes finos (seta decorativa, chip "Ativo"), documentação. |

## 4. Como verificar

- `npm test` (contraste dos tokens), `npx tsc --noEmit`, `npx eslint src`, `npm run build`.
- Auditoria no navegador: percorrer cada tela com um script que calcula o contraste real de todo texto visível (a cor computada do Tailwind 4 vem em `oklch`; normalizar por canvas). Na última rodada (2026-10-08, Chrome e navegador do app): 16 telas do backoffice como ADMIN e 5 do portal, **0 falhas** abaixo de AA depois dos ajustes da Fase 6.
- Foco por teclado visível (anel `#2D6986`) e sem estouro horizontal a 375 px nas telas do portal.

## 5. Limites e pendências

- **A paleta é a do IDE-SP, não a do IGC** (preto, branco e vermelho `#FF161F`). Confirmar com o cliente: #PEND-57.
- **A logo é provisória** (PNG 176×141 px, fundo branco). Falta SVG ou PNG de alta resolução e uma versão para fundo escuro: #PEND-56.
- Ícones decorativos em `gray-400` (≈2,6:1) não são texto e foram mantidos; se um ícone passar a carregar significado sozinho, usar `gray-500` ou mais escuro.
- O backoffice não foi desenhado para celular (barra lateral fixa de 16 rem); só o portal é responsivo.
