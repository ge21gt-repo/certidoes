# Roteiro da call com o CJT — apresentação das alterações do Sistema de Certidões

Posição em 2026-10-08 · branch `feat/portal-correcoes-cjt` · base: relatório `relatorio-andamento-cjt-2026-10-07.pdf` (atualizado abaixo com a identidade visual, entregue depois dele).

**Duração prevista:** ~70 min completos. Cortes possíveis ao fim de cada bloco (marcados **[opcional]**) levam a ~45 min.
**Ensaio:** todos os passos abaixo foram executados em 2026-10-08 neste ambiente; os textos entre aspas são os da tela.

---

## 0. Antes da call (30 min antes)

### 0.1 Ambiente

1. **Suba em modo de produção** (sem a bolinha "N" do Next no canto, sem avisos de desenvolvimento, mais rápido):
   ```bash
   npm run build
   npm run start        # http://localhost:3000
   ```
   Se o servidor de desenvolvimento estiver ligado na porta 3000, pare-o antes. (Funciona igual com `npm run dev`, mas aparece a bolinha "N" e o mapa recarrega mais devagar.)
2. **Cuidado com o agendador:** ele roda sozinho às **12:00 e 00:00 (Brasília)** e analisa a duplicidade das requisições pendentes. Se a call for perto dessas horas, faça o passo da seção 5 (Bloco 5) **antes** ou espere o agendador rodar; senão a análise "some" antes de você mostrá-la.
3. **Duas janelas, dois logins** (os cookies do backoffice e do portal são separados, mas se ambos estiverem ativos no mesmo navegador a barra lateral do backoffice aparece também nas telas do portal):
   - **Janela A (normal):** backoffice — `http://localhost:3000/login`.
   - **Janela B (anônima, Ctrl+Shift+N):** portal — `http://localhost:3000/portal/login`.
   Compartilhe a tela mostrando uma janela por vez; zoom do navegador em **110%** facilita a leitura.
4. **Arquivo para a procuração:** deixe na área de trabalho um PDF qualquer (ex.: `procuracao-demo.pdf`, até 10 MB; aceita PDF, JPG ou PNG).
5. **Abra antes, em abas fixas** (para não perder tempo digitando): as URLs das seções 1 e 2.
6. **Teste de fumaça (2 min):** entre nas duas janelas, abra `/requisicoes` (backoffice) e `/portal` (portal) e confira que carregam.

### 0.2 Conhecer o que o banco local tem

O banco local tem **muito dado de teste** (≈85 requisições com nomes como "Teste ARQ-G"). Isso é útil (há um caso pronto para cada situação), mas a **lista completa fica poluída**. Regra para a call: **mostre sempre pelos cartões de situação e filtros, nunca role a lista inteira**, e crie **uma requisição nova ao vivo** para a história principal (Blocos 3 a 7).

### 0.3 O que ainda não existe / não prometer

- Integração real com **SEI**, **SIGEF/INCRA** e **gov.br** (tudo simulado: o login gov.br pede só CPF e nome; a consulta SIGEF devolve as parcelas do acervo de teste).
- **Download da certidão** (etapa 6 do acompanhamento mostra "o download ainda não está disponível").
- **E-mail/SMS** de confirmação do cadastro (pedido #2) e **Bloco 2 "Recebimento DDD"** (página em branco no documento).
- Chat **sem anexos**. A tela de **Usuários** e o **Quadro** têm alguns textos antigos sem acento ("Requisicoes", "Analise Tecnica"): é legado, será corrigido numa tarefa à parte.

---

## 1. Acessos

**Senha de todos os usuários do backoffice (somente desenvolvimento):** `IGC@certidoes-2026`

| Papel | E-mail | Para que usar na call |
| --- | --- | --- |
| **ADMIN** | `admin@igc.sp.gov.br` | **Usuário principal.** Faz tudo: atendimento (DDD), análise de duplicidade, processos, corte, usuários. |
| SDTC (= "DDD") | `sdtc@igc.sp.gov.br` | Mostrar que a DDD (ADMIN + SDTC) atende as requisições: chat, devolver, liberar, desarquivar. **Não** vê "Pré-análise de Divisas" nem "Usuários"; **não** tem "Rodar análise agora" (só ADMIN). |
| TÉCNICO | `thiago@igc.sp.gov.br` (também `ana@`, `pedro@`) | Técnico responsável: confirma o nível de complexidade e usa o **Pré-análise de Divisas**; abre a lista de Requisições mas **sem** as ações de atendimento (chat, devolver, liberar, abrir processo). |
| Conferente | `marcos@igc.sp.gov.br` | Só se perguntarem do fluxo de conferência. |
| Gerente / Diretor | `gerente@igc.sp.gov.br` · `diretor@igc.sp.gov.br` | Só se perguntarem das assinaturas. |

**Portal do solicitante** (`/portal/login`): qualquer CPF com dígitos verificadores válidos + um nome. **Use sempre este**, que já tem cadastro de contato e as requisições de exemplo:

- CPF **529.982.247-25** · nome **Cidadao de Teste** → e-mail e telefone já cadastrados.
- Para mostrar o **primeiro acesso** (cadastro de e-mail e telefone): CPF **111.444.777-35** · nome **Outra Pessoa** (já usado) ou gere outro CPF válido. É nesse momento que o pedido #2 (e-mail/SMS) fica pendente.

**CNPJ válido para o campo do representante:** `11.222.333/0001-81`.

---

## 2. URLs úteis e casos prontos

Base: `http://localhost:3000`

### 2.1 Menu

| O quê | URL |
| --- | --- |
| Login backoffice | `/login` |
| Login portal | `/portal/login` |
| Minhas Requisições (portal) | `/portal` (filtro: `/portal?grupo=em-analise`, também `devolvidas`, `concluidas`) |
| Nova Requisição (portal) | `/portal/nova-solicitacao` |
| Cadastro do solicitante | `/portal/cadastro` |
| Requisições (atendimento/DDD) | `/requisicoes` · nova pelo atendimento: `/requisicoes/nova` |
| Processos · Quadro · Pré-análise de divisas | `/processos` · `/quadro` · `/geometria` |
| Dashboard · Usuários · Clientes | `/` · `/usuarios` · `/clientes` |

### 2.2 Casos prontos (todos do "Cidadao de Teste")

| Situação | Protocolo | Portal | Backoffice |
| --- | --- | --- | --- |
| **Em análise, no Setor Técnico, SEI e nível 7 confirmados** (o mais completo) | CERT-2026-000083 | `/portal/requisicoes/cmuytn1fw0019qscme8at3ln1` | `/requisicoes/cmuytn1fw0019qscme8at3ln1` · processo #24 `/processos/cmuytn1ki001bqscm3wuf8wou` |
| Idem, criada no ensaio de hoje (nível 3, SEI 00456.123456/2026-10, duplicidade respondida) | CERT-2026-000084 | `/portal/requisicoes/cmuzrzy15000k5gcmz6zihsiq` | `/requisicoes/cmuzrzy15000k5gcmz6zihsiq` · processo #25 `/processos/cmuzs163b000q5gcm01fj7szu` |
| **Devolvida** (solicitante pode "Alterar requisição") | CERT-2026-000018 | `/portal/requisicoes/cmuyl937j000478cmm0hk6258` | `/requisicoes/cmuyl937j000478cmm0hk6258` |
| **Rascunho** ("Não enviadas") | CERT-2026-000038 | `/portal/requisicoes/cmuyob1980006mocm3cu4v4jk` | — |
| Rascunho de **15 polígonos**, congelado e liberado pela DDD | CERT-2026-000034 | `/portal/requisicoes/cmuyn7zzb000adwcmfm59xyvx` | `/requisicoes/cmuyn7zzb000adwcmfm59xyvx` |
| **Aguardando sua resposta** (pergunta de duplicidade no chat) | CERT-2026-000081 | `/portal/requisicoes/cmuytmmbu000oqscmv4yfckda` | `/requisicoes/cmuytmmbu000oqscmv4yfckda` |
| **Sobreposição** (aviso vermelho na DDD) | CERT-2026-000079 | `/portal/requisicoes/cmuysh2nk002dv4cm4hv60tua` | `/requisicoes/cmuysh2nk002dv4cm4hv60tua` |
| **Arquivada** (para "Desarquivar") | CERT-2026-000065 | `/portal/requisicoes/cmuys60ct000uv4cmefpldbas` | `/requisicoes/cmuys60ct000uv4cmefpldbas` |
| Pendente já analisada, sem processo (para **Devolver** ou **pedir arquivamento**) | CERT-2026-000076 · 000075 · 000074 | `/portal/requisicoes/cmuysh0tm0020v4cmxkhvp2ct` · `…/cmuys6a5t001sv4cmxhya4yf1` · `…/cmuys6a2d001qv4cmtgw6b30h` | mesmo id em `/requisicoes/…` |

> Cada ação **consome** o caso (uma requisição devolvida deixa de estar pendente). Por isso a história principal usa uma requisição **nova**; os casos prontos servem de **plano B** e para o que seria lento de montar ao vivo.

---

## 3. Panorama (3 min) — o que dizer

Use o PDF como pano de fundo, **com os números atualizados**:

- O documento do cliente (16/09) tem **29 pedidos**. **27 atendidos** (93%): 14 só de frontend, 11 de frontend e backend, 2 só de backend. **1 depende do cliente** (#2, e-mail/SMS do cadastro) e **1 está sem definição** (#29, "Bloco 2 – Recebimento DDD", página em branco).
- **Novidade desde o relatório de 07/10:** o pedido **#1 (cores e logos) foi atendido** com a paleta do portal IDE-SP e a logo do IGC (a do Governo do Estado de SP **não** foi usada). Ver Bloco 1.
- **12 entregas além do documento** (edição do processo, pré-análise de divisas no menu, máscaras, contraste, desarquivar, cartões de situação etc.).
- **57 pendências registradas** (24 resolvidas, 3 descartadas, 30 abertas: 13 backend, 10 negócio, 5 infra, 2 frontend). **Quatro delas são decisões que dependem do CJT**; fecharemos a call com elas (Bloco 11).
- O trabalho foi feito em fases, **cada uma com proposta visual aprovada, teste no navegador e um commit**; tudo está documentado em `docs/`.

---

## 4. Roteiro por blocos

> Legenda: **[Portal]** = janela B (anônima), solicitante. **[Back]** = janela A, backoffice (ADMIN, salvo indicação). **#N** = número do pedido no documento do cliente.

### Bloco 1 — Identidade visual (#1) · 4 min

**Mensagem:** a aplicação inteira agora segue a paleta do IDE-SP e a logo do IGC.

1. **[Back]** `/login` → mostre a logo do IGC, "Sistema de Certidões" e o botão azul-petróleo. **Não entre ainda.**
2. **[Portal]** `/portal/login` → cabeçalho **branco com a logo do IGC** e a **faixa bege** de navegação; "Acesse com sua conta gov.br" (login simulado; selo gov.br saiu).
3. **[Back]** entre como **admin** → **Dashboard**: barra lateral com a logo, item ativo em azul claro, cartões e chips de etapa.
4. Fale rápido de **acessibilidade**: contraste AA conferido em 21 telas, foco por teclado visível (aperte `Tab` duas vezes e mostre o anel azul), fonte Inter, funciona a 375 px de largura no portal.
5. **Pontos para o cliente decidir** (anote): a paleta aplicada é a do **IDE-SP** (a identidade do site do IGC é preto, branco e vermelho) → confirmar (**#PEND-58**); a **logo é provisória** (arquivo pequeno do histórico do repositório) → precisamos do arquivo em **SVG ou PNG de alta resolução** e de uma versão para fundo escuro (**#PEND-57**). Trocar cores/logo depois é rápido (tokens em um arquivo).

### Bloco 2 — Portal: Minhas Requisições e Status Geral (#21) · 4 min

1. **[Portal]** `/portal/login` → CPF `529.982.247-25`, nome `Cidadao de Teste` → **Entrar com gov.br**.
2. Em **Minhas Requisições** (`/portal`) mostre os **5 cartões de Status Geral**: **Não enviadas · Em análise · Devolvidas · Arquivadas · Concluídas**, com contagem.
3. Clique **Em análise** → a lista filtra (`/portal?grupo=em-analise`); clique de novo para limpar. Mostre **Buscar** (protocolo, imóvel ou município) e o filtro **Situação** (11 opções).
4. Mostre os chips de situação e o aviso de **"1 nova mensagem no chat"** em alguns itens.

### Bloco 3 — Nova Requisição: o formulário em 4 caixas (#3 a #17) · 12 min  ← coração da demonstração

1. **[Portal]** **Nova Requisição** (`/portal/nova-solicitacao`).
   - **#3** Mostre o texto "Certidão de Jurisdição Territorial (CJT)", o quadro **Avisos** e a lista dos documentos recomendados. Clique **Iniciar solicitação**.
2. **Caixa 1 — Solicitante** (**#4** barra de evolução: "Etapa 1 de 4 · Solicitante", 0% concluído; as caixas **só aparecem quando a anterior está completa**).
   - Pergunta **1. Quem sou eu?** → **Representante**. **#5** abre "Dados de quem você representa": CPF ou CNPJ **`11.222.333/0001-81`** (a máscara se aplica sozinha) e Nome ou razão social **`Fazenda Demonstração Ltda`**. A procuração será pedida no fim.
3. **Caixa 2 — Configuração da CJT**
   - **2. O resultado será por:** passe o olho nas **dicas** ao lado de cada opção (**#6**): "Matrícula (aceita apenas 1 polígono, sendo 1 matrícula)", "Gleba (1 ou mais polígonos da mesma matrícula)", "Área (aceita 1 polígono e não olha as matrículas)". Escolha **Gleba**.
   - **3. Meu imóvel atualmente é:** mostre **Usucapião** → aparece **3.1 "Quero informar o número da matrícula?"** (**#7**, Sim/Não/Não sei). Depois escolha **Regular/comum** para seguir.
4. **Caixa 3 — Pergunta 4, Dados do imóvel** (**#8, #9, #10**)
   - Cada campo tem a **explicação acima**, rótulo em negrito e **sem "SNCR"**. **Propriedade de** = `Fazenda Demonstração Ltda` (orientação: vários proprietários → "e outros"; sem "S/M" nem "S/E"). **Matrícula** = `12345` ("somente algarismos, sem CRI").
   - **Quantidade de polígonos:** `2`. Em **Nome de cada polígono** (**#10**, rótulo atualizado) escolha o tipo **Gleba** e preencha só o complemento: `A-1` e `A-2` ("Nome final: Gleba A-1"). Mostre a **nomenclatura fechada** (**#13**): Gleba/Parte/Parcela ou só o complemento, até 3 caracteres, sem acento, sem repetir.
   - **Mostre os alertas** mudando a quantidade rapidamente: **6** → "Atenção: 6 polígonos. Pedidos com 6 ou mais polígonos exigem análise específica e podem ter prazo maior." (**#11**); **13** → "Pedidos com 13 ou mais polígonos exigem análise da DDD antes de continuar…" e o botão **Enviar para análise da DDD** (**#12**; vamos ver a liberação no Bloco 6). **Volte para 2.**
   - **INCRA (opcional):** deixe vazio.
5. **Caixa 4 — Imóvel e documentos**
   - **#15 Parcela de cada polígono:** escolha para **Gleba A-1** → "Teste DUP-A2 · 100 ha" e para **Gleba A-2** → "Teste DUP-A · 100 ha" (cada parcela só pode ser usada uma vez). Em **Localização dos polígonos** (**#14**) o mapa mostra o contorno e **cada polígono tem uma cor**, a mesma da lista.
   - **Procuração** → anexe o PDF. Marque a **declaração** (**#16**: "Declaro que as informações prestadas e a documentação apresentada são verdadeiras e estão em conformidade com os padrões estabelecidos pelo Instituto.").
   - **[opcional] #4 rascunho:** antes de enviar, clique **Salvar rascunho** → "Rascunho salvo. Protocolo CERT-2026-0000NN…"; mostre que a requisição vai para o cartão **Não enviadas** e que se continua por **Continuar solicitação**. (Se fizer isso, volte e conclua o envio.)
   - Clique **Enviar requisição**.
6. **#17 Tela de sucesso:** "Solicitação enviada com sucesso — Protocolo CERT-2026-0000NN … será avaliada em até 10 dias… Todas as comunicações … no chat da solicitação." **Anote o protocolo** (será o CERT-2026-000085 se ninguém criou outra desde o ensaio).
7. Clique **Ver minhas requisições**: a nova aparece como **Pendente**.

### Bloco 4 — Atendimento (DDD): fila, cartões de situação e análise de duplicidade (#19, #20) · 7 min

1. **[Back]** (**admin**; a análise e o painel de duplicidade são só do ADMIN) **Requisições** (`/requisicoes`).
   - Mostre os **9 cartões de situação** (Aguardando análise · Na fila · Aguardando cliente · Congeladas · Em análise · Devolvidas · Arquivamento solicitado · Arquivadas · Concluídas): cada um **filtra** a lista (e some o filtro clicando de novo). **Não role a lista toda.**
   - No painel **Análise de duplicidade** leia: "Última execução: … Próxima: amanhã às 00:00. **1 requisição aguardando análise.**" (**#19**: roda **às 12:00 e às 00:00** sozinha, **sem rodar duas vezes**).
2. Clique **Rodar análise agora** → "Análise concluída: 1 analisada, 1 com pergunta ao solicitante." (**#20**). (Em produção isso é automático; o botão existe para a DDD e para a demonstração.)
3. Na lista, a nova requisição ganhou os chips **Sobreposição** e **Aguardando sua resposta**. Abra-a: o **aviso vermelho** "Sobreposição com outra requisição…" e, no **chat**, a **pergunta ao solicitante** ("Encontramos a certidão CERT-2026-000039… Você quer solicitar uma nova certidão mesmo assim?"). Explique: abertura de processo e pagamento ficam **bloqueados** até a resposta.
   - *Observação:* o texto exato e os números dos protocolos variam conforme as requisições que já existem; as 4 situações (**S1 a S4**) estão descritas em `docs/atendimento-cjt-pedidos-restantes.md` e as hipóteses nas **#PEND-53**.
4. **[Portal]** abra a requisição nova (**Minhas Requisições → protocolo**): acompanhamento "1 Conformidade mínima (etapa atual)", **aviso "Aguardando a sua resposta"** e, no **Conversa com o IGC**, os botões **Sim, quero uma nova certidão** / **Não, arquivar esta requisição**. Clique **Sim, quero uma nova certidão** → "Resposta registrada. A requisição segue para a fila do atendimento."

### Bloco 5 — Chat da solicitação (#28) · 3 min

1. **[Back]** na mesma requisição, em **Conversa com o solicitante → Mensagem para o solicitante**, escreva: `Documentos conferidos. Pode acompanhar por aqui.` → **Enviar mensagem**.
2. **[Portal]** na requisição, em **Conversa com o IGC**, a mensagem aparece (o chat atualiza **a cada 20 s**; para acelerar, tecle F5). Responda algo curto e **Enviar mensagem**. Em **Minhas Requisições**, o aviso "1 nova mensagem no chat".
3. Diga: chat só para **ADMIN e SDTC** no backoffice, **sem anexos** e **sem e-mail/SMS** (**#PEND-37**).

### Bloco 6 — Devolver, liberar (13+ polígonos) e edição pelo solicitante (#12, #18) · 6 min

1. **[opcional] 13+ polígonos (#12):** **[Portal]** em **Nova Requisição** responda o mínimo (Q1 **Proprietário**, Q2 **Gleba**, Q3 **Regular/comum**, matrícula `999`, **Quantidade 13**) e clique **Enviar para análise da DDD** → fica **Aguardando liberação**. **[Back]** abra a requisição → **Liberar preenchimento** (abre o chat). **[Portal]** "A DDD liberou o seu pedido." → **Continuar solicitação**. (Caso pronto: **CERT-2026-000034**.)
2. **#18 Devolver:** **[Back]** abra uma requisição **pendente e sem processo** (ex.: **CERT-2026-000076**) → seção **Devolver ao solicitante** → **Motivo da devolução** (mín. 10 caracteres): `Anexe a matrícula atualizada e confira o nome do proprietário.` → **Devolver requisição**.
3. **[Portal]** na requisição: "A equipe devolveu sua requisição." com o motivo e o botão **Alterar requisição**. Mostre que **só depois da devolução** o formulário abre para edição (antes: "Sua requisição está em análise e não pode ser alterada"). Altere um campo e reenvie.

### Bloco 7 — Do atendimento ao processo, SEI e pré-análise de divisas (#25, #23) · 8 min

1. **[Back]** na requisição nova (a do Bloco 3, já respondida):
   - **Marcar documentos como conferidos** (aparece no chat e vira a subetapa "Checagem de documentos").
   - Em **Abertura de Processo**, **Expediente SEI** = `00456.123456/2026-10` → **Abrir processo na entrada do SDTC**. O sistema abre o **Processo #N** (Entrada SDTC) e leva você a ele. **#25:** o número SEI aparece para o solicitante.
2. No processo: **Editar processo** (expediente, técnico responsável, datas, taxas — **[opcional]**, 1 min) e o **Histórico de transições**.
3. **#23 Pré-análise de divisas:** botão **Pré-análise de divisas** → abre `/geometria?processo=…` com a parcela como **"Polígono em análise"** → **Calcular pré-análise** → "**Caso: FÁCIL · Nível sugerido: 1** — longe da divisa, 1 polígono. O técnico responsável confirma o nível no processo. Pré-análise gravada no processo #N. Ver minuta da certidão."
4. Volte ao processo (**Abrir processo** no topo da tela de pré-análise). Em **Ações do Workflow → Mover para:** clique **Distribuicao GDAT** e depois **Analise Tecnica**.
5. Em **Nível de complexidade**: "Sugerido pela pré-análise de …: 1." Escolha **3** em **Nível (1 a 9)** → **Confirmar nível** → "Nível 3 confirmado. O solicitante já o vê no acompanhamento." (O técnico responsável — ou ADMIN — confirma; o solicitante só vê **depois** da confirmação.)
6. **[opcional]** **Minuta da Certidao** (`/processos/{id}/certidao`) — abre a minuta; não mudou de aparência.

### Bloco 8 — O que o solicitante vê no acompanhamento (#22, #25, #26, #27) · 5 min

1. **[Portal]** abra a requisição nova. Mostre o **Acompanhamento** com as **6 etapas**: 1 Conformidade mínima · 2 Setor de Atendimentos · 3 Setor Técnico · 4 Documento em assinatura · 5 Aguardando pagamento · 6 Liberado para download.
   - Etapas **concluídas em verde**, a **atual em azul**, e as **subetapas** do Setor Técnico: **Triagem (concluída) · Elaboração da divisa (etapa atual) · Conferência da divisa · Expedição**. No Setor de Atendimentos: **Checagem de documentos** e **Liberação do número SEI**.
   - Caixas **NÍVEL 3** ("1 fácil · 9 complexo") e **NÚMERO SEI 00456.123456/2026-10** (**#23, #25**).
2. Role até **Imóvel** (**#26**): sem município, com **nomes e quantidade de polígonos**, tabela **Polígono → Parcela do SIGEF** e o **mapa com as cores**.
3. **Caso mais completo, se quiser comparar:** CERT-2026-000083 (nível 7, SEI e "Elaboração da divisa").
4. Diga: o texto "**Expedição**" é **hipótese** do time (corresponde à assinatura do técnico) — **#PEND-55**.

### Bloco 9 — Arquivar e desarquivar (#24) · 5 min

1. **[Portal]** na requisição nova (já tem processo) → **Arquivar requisição** → **Motivo do pedido** (mín. 10 caracteres): `Não preciso mais desta certidão.` → **Enviar pedido de arquivamento** → situação **Arquivamento solicitado**.
   - Regra do documento: **antes** da análise de duplicidade e **sem processo**, o arquivamento é **imediato e sem custo** (**Confirmar arquivamento**); **depois**, vira **pedido que a DDD decide**. **[opcional]** mostre o caminho imediato criando outra requisição e arquivando **antes** de "Rodar análise agora".
2. **[Back]** abra a requisição → **Aceitar arquivamento** (ou **Recusar…** → justificativa → **Confirmar recusa**; a requisição volta ao status anterior). Aceite → **Arquivada** (cartão **Arquivadas** no portal e no atendimento).
3. **Desarquivar** (entrega extra): na requisição arquivada, **Desarquivar requisição** → justificativa (mín. 10) → volta **ao status de antes**, com a justificativa no chat. (Caso pronto: **CERT-2026-000065**.)
4. Diga: **aceitar o arquivamento não cancela o processo aberto** — decisão pendente do cliente (**#PEND-54**).

### Bloco 10 — Outras entregas que o documento não pedia · 6 min **[opcional]**

- **Máscaras** de CPF/CNPJ/telefone: **[Back]** `/clientes` ("Cadastro de Cliente") ou `/requisicoes/nova`; digite com letras, cole com e sem pontuação.
- **Edição do processo** em página própria (**Editar processo**) e **Quadro** (`/quadro`, kanban por etapa).
- **Usuários** (`/usuarios`, ADMIN): papéis e quem acessa o quê. Entre como **thiago@** (técnico) e mostre que ele **não vê** "Usuários" e que, em Requisições, **não tem** as ações de atendimento (chat, devolver, abrir processo); entre como **sdtc@** e mostre que ele **não vê** "Pré-análise de Divisas".
- **Cartões de situação** do atendimento, **desarquivar**, **testes automatizados** (189 testes de regra + 45 do contraste da paleta = **234**), **documentação** em `docs/`.

### Bloco 11 — Fechamento: o que precisamos do CJT · 5 min

Mostre o quadro e peça a **decisão** de cada item:

| # | O que decidir | Pendência |
| --- | --- | --- |
| #2 | O que é a **confirmação do contato** (e-mail ou SMS, e o que acontece se não confirmar) | #PEND-37 |
| #29 | **Conteúdo do "Bloco 2 – Recebimento DDD"** (a página 10 do documento está em branco) | — |
| #1 | **Confirmar a paleta** (IDE-SP × cartela própria do IGC) e **enviar a logo** em SVG/PNG de alta resolução, com versão para fundo escuro | #PEND-58 · #PEND-57 |
| #20 | Confirmar as **regras de duplicidade** que o documento não detalha (mesma geometria com solicitantes diferentes, parcelas que só se encostam, repetições) | #PEND-53 |
| #24 | **Aceitar arquivamento** deve **cancelar o processo aberto**? | #PEND-54 |
| #22/#23 | Quem marca a **divisa como finalizada** e as hipóteses do **nível de complexidade** e da **subetapa "Expedição"** | #PEND-55 |
| — | **Integração com SEI e b-Cadastro:** contrato das APIs e o que o SEI deve fazer (o e-mail do Suporte Integrador só descreve o pedido de acesso) | #PEND-50 · #PEND-51 |
| — | **Produção:** manter a instância ligada para o agendador, variáveis e migrations conferidas em staging | #PEND-52 (infra) |

Próximos passos do nosso lado: ajustar o que a call decidir, **trocar a logo**, e fechar os textos antigos sem acento.

---

## 5. Mapa rápido: pedido do documento → onde mostrar

| Pedido | Bloco | | Pedido | Bloco |
| --- | --- | --- | --- | --- |
| #1 cores e logos | 1 | | #15 polígono ↔ parcela | 3 |
| #2 e-mail/SMS | 11 (pendente) | | #16 declaração | 3 |
| #3 intro da CJT | 3 | | #17 tela de sucesso | 3 |
| #4 caixas e barra | 3 | | #18 devolver e editar | 6 |
| #5 representante CPF/CNPJ | 3 | | #19 análise 12:00/00:00 | 4 |
| #6 dicas Matrícula/Gleba/Área | 3 | | #20 duplicidade | 4 |
| #7 usucapião | 3 | | #21 Status Geral | 2 |
| #8, #9 textos da Pergunta 4 | 3 | | #22 etapas e subetapas | 8 |
| #10 nome de cada polígono | 3 | | #23 nível de complexidade | 7 e 8 |
| #11 alerta de 6 polígonos | 3 | | #24 arquivar | 9 |
| #12 13+ polígonos | 3 e 6 | | #25 número SEI | 7 e 8 |
| #13 nomenclatura | 3 | | #26 box Imóvel | 8 |
| #14 mapa do polígono | 3 e 8 | | #27 status na box | 8 |
| #28 chat | 5 | | #29 Bloco 2 | 11 (sem definição) |

---

## 6. Se algo der errado

| Sintoma | O que fazer |
| --- | --- |
| Servidor não responde | Terminal na pasta do projeto: `npm run start` (ou `npm run dev`). Confira `http://localhost:3000/portal/login`. |
| "Não autorizado" / volta ao login | A sessão expirou: entre de novo (admin ou CPF `529.982.247-25`). |
| O chat não mostra a mensagem | Ele atualiza a cada 20 s; tecle **F5**. |
| A requisição nova não aparece em "Aguardando análise" | O agendador já rodou (12:00/00:00). Use **Rodar análise agora** só se ainda houver pendente; senão mostre o caso **CERT-2026-000081** (aguardando resposta). |
| O mapa não carrega | Os mapas usam o OpenStreetMap: precisa de internet. Sem rede, mostre a lista **Polígono → Parcela** (que não depende do mapa). |
| A requisição escolhida já foi consumida | Use outra da seção 2.2 (000075, 000074…) ou crie uma nova; as ações são independentes por requisição. |
| Algum botão some | Confira o papel: o atendimento (chat, devolver, liberar, abrir processo) é de **ADMIN/SDTC**; "Rodar análise agora" só **ADMIN**; "Pré-análise de Divisas" só **ADMIN/TÉCNICO**; "Usuários" só **ADMIN**. |

## 7. Perguntas prováveis

- **"Isso já está em produção?"** Não: está na branch de desenvolvimento. Em produção a infra precisa manter o agendador ligado, definir variáveis e rodar as migrations (**#PEND-52**).
- **"O login gov.br é real?"** Ainda é simulado (CPF e nome). A integração real é uma etapa à parte.
- **"O SIGEF é real?"** A consulta é simulada com um acervo de teste; o vínculo polígono ↔ parcela já funciona sobre ela (**#PEND-33**).
- **"E o e-mail de confirmação?"** Depende da definição do #2 (**#PEND-37**).
- **"Dá para mudar as cores depois?"** Sim: são tokens em um arquivo (`globals.css`) e há um teste automático de contraste; a troca não mexe nas telas.
- **"O solicitante pode editar a requisição enviada?"** Só depois que a DDD a **devolve** (#18); em rascunho, sim.
- **"Quem vê o chat?"** O solicitante e a DDD (ADMIN e SDTC).
