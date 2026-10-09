# Guia de execução local — Verzel Store QA

Automação **Playwright + Gherkin (BDD)** da entrega VZS-142 (cupom, frete, limites e valores).

---

## 1. Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js    | 18 LTS ou superior |
| npm        | 9+ |
| Sistema    | Windows, macOS ou Linux |

Verifique:

```bash
node -v
npm -v
```

---

## 2. Instalação (passo a passo)

```bash
# 1) Entre na pasta do projeto
cd verzel-store-qa

# 2) Instale as dependências
npm install

# 3) Instale o browser Chromium (UI)
npx playwright install chromium
```

> Se o `postinstall` do `package.json` já instalou o Chromium, o passo 3 é opcional.

---

## 3. Como executar

| Comando | O que roda |
|---------|------------|
| `npm test` | API **e** UI |
| `npm run test:api` | Só cenários de API |
| `npm run test:ui` | Só cenários de UI (Chromium) |
| `npm run test:bug` | Só tags `@bug` (BUG-001 e BUG-002) |
| `npm run test:headed` | UI com navegador visível |
| `npm run report` | Abre o relatório HTML da última execução |

### Filtrar por tag ou nome

```bash
npx bddgen && npx playwright test --grep @ct-cup-001
npx bddgen && npx playwright test --grep "Frete grátis"
npx bddgen && npx playwright test --project=ui-chromium --headed
```

### Trocar a URL do ambiente

```bash
# Linux / macOS
BASE_URL=https://outro-ambiente.example.com npm test

# Windows (PowerShell)
$env:BASE_URL="https://outro-ambiente.example.com"; npm test
```

---

## 4. Estrutura do projeto

```
verzel-store-qa/
├── features/                 ← Cenários Gherkin (o que testar)
│   ├── cupom.feature         API – cupom
│   ├── frete.feature         API – frete
│   ├── quantidade.feature    API – limite de qtd
│   ├── ui-cupom.feature      UI  – cupom
│   ├── ui-frete.feature      UI  – frete
│   └── ui-quantidade.feature UI  – limite de qtd
├── steps/                    ← Implementação dos passos
│   ├── carrinho.steps.ts     steps da API
│   └── ui.steps.ts           steps da UI
├── support/
│   └── world.ts              contexto compartilhado (carrinho API)
├── fixtures/
│   └── catalogo.ts           ★ produtos, cupons, limites, % desconto
├── utils/
│   ├── oraculo.ts            ★ cálculo esperado (centavos)
│   ├── api-client.ts         ★ endpoints e payload da API
│   └── ui-helpers.ts         ★ seletores e ações de tela
├── playwright.config.ts      ★ URL base, timeout, projetos, browser
├── package.json
├── tsconfig.json
└── README.md
```

Arquivos marcados com **★** são os principais pontos de configuração.

---

## 5. Onde alterar os campos (configuração)

### 5.1 URL do ambiente

**Arquivo:** `playwright.config.ts`

```ts
const baseURL = process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev';
```

| O que mudar | Como |
|-------------|------|
| URL padrão | Altere a string após `??` |
| URL só nesta execução | Use a variável `BASE_URL` (ver seção 3) |

---

### 5.2 Produtos, preços, cupons e regras de negócio

**Arquivo:** `fixtures/catalogo.ts`

```ts
export const CATALOGO = {
  P001: { id: 'P001', nome: 'Camiseta Essencial', precoCentavos: 5990 },
  // ...
  P005: { id: 'P005', nome: 'Mochila Urbana 20L', precoCentavos: 10000 },
};

export const CUPONS = {
  VALIDO: 'BEMVINDO10',
  VALIDO_MIN: 'bemvindo10',
  EXPIRADO: 'VERAO2026',
  INEXISTENTE: 'CUPOMINEXISTENTE',
};

export const FRETE_CENTAVOS = 1990;                 // R$ 19,90
export const LIMITE_FRETE_GRATIS_CENTAVOS = 20000;  // R$ 200,00
export const LIMITE_QTD_POR_PRODUTO = 5;
export const DESCONTO_BEMVINDO_PERCENT = 10;        // 10%
```

| Campo | Onde | Exemplo |
|-------|------|---------|
| Preço de um produto | `precoCentavos` | `10000` = R$ 100,00 |
| Novo produto | novo item em `CATALOGO` | `P009: { id: 'P009', nome: '...', precoCentavos: 7990 }` |
| Código do cupom válido | `CUPONS.VALIDO` | `'BEMVINDO10'` |
| Valor do frete | `FRETE_CENTAVOS` | `1990` |
| Limite frete grátis | `LIMITE_FRETE_GRATIS_CENTAVOS` | `20000` |
| Máx. unidades | `LIMITE_QTD_POR_PRODUTO` | `5` |
| % do cupom | `DESCONTO_BEMVINDO_PERCENT` | `10` |

> Preços estão em **centavos** para evitar erro de ponto flutuante.

---

### 5.3 Dados do cliente no pedido (API)

**Arquivo:** `utils/api-client.ts` — função `criarPedido`

```ts
cliente: {
  nome: opts?.nome ?? 'Maria Silva',
  email: opts?.email ?? 'maria.silva@teste.com',
  cep: opts?.cep ?? '01310-100',
},
```

| Campo | Valor padrão | Como sobrescrever |
|-------|--------------|-------------------|
| Nome | `Maria Silva` | Passar `nome` em `opts` no step |
| E-mail | `maria.silva@teste.com` | Passar `email` em `opts` |
| CEP | `01310-100` | Passar `cep` em `opts` |

Endpoints usados no mesmo arquivo:

| Função | Método | Path |
|--------|--------|------|
| `calcularCarrinho` | POST | `/api/carrinho/calcular` |
| `criarPedido` | POST | `/api/pedidos` |

Se a API mudar o path ou o nome do campo (`itens` vs `items`), altere **aqui**.

---

### 5.4 Cálculo esperado (oráculo)

**Arquivo:** `utils/oraculo.ts`

Funções principais:

| Função | Responsabilidade |
|--------|------------------|
| `subtotalCentavos` | soma preço × quantidade |
| `descontoCentavos` | aplica % do cupom só sobre o subtotal |
| `freteCentavos` | frete grátis se subtotal **≥** limite (antes do desconto) |
| `calcularEsperado` | monta o objeto completo esperado |

Altere a lógica **somente** se a regra de negócio documentada mudar (ex.: frete grátis passar a ser `>` em vez de `>=`).

---

### 5.5 Seletores e textos da UI

**Arquivo:** `utils/ui-helpers.ts`

| Elemento na tela | Seletor / estratégia |
|------------------|----------------------|
| Card do produto | `.produto` + texto do nome |
| Botão adicionar | `getByRole('button', { name: /Adicionar ao carrinho/i })` |
| Link do carrinho | `getByRole('link', { name: /Carrinho/i })` |
| Campo de cupom | `#campo-cupom` |
| Botão aplicar cupom | `getByRole('button', { name: /Aplicar cupom/i })` |
| Subtotal / desconto / frete / total | `[data-valor="subtotal"]` etc. |
| Aviso de frete | `.aviso-frete` |
| Aviso de limite | `.produto-aviso` / `.produto-aviso-limite` |
| Quantidade no carrinho | `.seletor-quantidade output` |

Se a UI mudar classes ou `data-valor`, atualize **este arquivo**.

---

### 5.6 Timeouts, browser e paralelismo

**Arquivo:** `playwright.config.ts`

```ts
timeout: 45_000,           // tempo máximo por teste
expect: { timeout: 10_000 },
retries: process.env.CI ? 1 : 0,
fullyParallel: true,
workers: process.env.CI ? 2 : undefined,
```

Projetos:

| Projeto | Filtro | Browser |
|---------|--------|---------|
| `api` | tudo **sem** tag `@ui` | nenhum (só HTTP) |
| `ui-chromium` | tag `@ui` | Chromium desktop |

Para rodar em Firefox, por exemplo, adicione outro project com `devices['Desktop Firefox']`.

---

### 5.7 Cenários (produto, quantidade, cupom usados no teste)

**Arquivos:** `features/*.feature`

Exemplo — trocar produto e quantidade no teste de frete UI:

```gherkin
# features/ui-frete.feature
Quando eu adiciono o produto "Mochila Urbana 20L" ao carrinho 2 vezes
```

| O que mudar no cenário | Onde |
|------------------------|------|
| Nome do produto na UI | string entre aspas (deve bater com o texto da vitrine) |
| Quantidade de cliques | número antes de `vez` / `vezes` |
| Código do cupom | string no passo `eu aplico o cupom "..."` |
| Valores esperados no resumo | `"R$ 100,00"` etc. nos passos `Então` |
| ID do produto na API | `"P005"` nos features de API |

> Na UI o nome é o **texto visível** do card (ex.: `Mochila Urbana 20L`).  
> Na API o identificador é o **id** (ex.: `P005`).

---

## 6. Mapa rápido: “quero mudar X → arquivo Y”

| Quero mudar… | Arquivo |
|--------------|---------|
| URL da loja | `playwright.config.ts` ou env `BASE_URL` |
| Preço / catálogo de produtos | `fixtures/catalogo.ts` |
| Código dos cupons | `fixtures/catalogo.ts` |
| Valor do frete / limite R$ 200 | `fixtures/catalogo.ts` |
| Limite de 5 unidades | `fixtures/catalogo.ts` |
| % de desconto do cupom | `fixtures/catalogo.ts` + `utils/oraculo.ts` |
| Nome, e-mail, CEP do pedido | `utils/api-client.ts` |
| Path dos endpoints da API | `utils/api-client.ts` |
| Seletores da tela | `utils/ui-helpers.ts` |
| Produto/qtd/cupom de um cenário | `features/*.feature` |
| Timeout dos testes | `playwright.config.ts` |
| Browser (Chrome/Firefox) | `playwright.config.ts` → `projects` |

---

## 7. Resultados esperados na primeira execução

| Grupo | Qtd | Comportamento |
|-------|-----|---------------|
| API passando | ~4 | cupom válido, cupom inválido, frete &lt; 200, frete+desconto |
| API falhando (`@bug`) | ~3 | frete = R$ 200 (BUG-001), qtd 6 no cálculo e no pedido (BUG-002) |
| UI passando | ~6 | cupom, frete &lt;/&gt; 200, limite 5 na vitrine |
| UI falhando (`@bug`) | ~1 | frete = R$ 200 na UI (BUG-001) |

Falhas em `@bug` **são esperadas** enquanto os defeitos não forem corrigidos — servem como regressão automática.

---

## 8. Relatório e evidências

Após `npm test`:

```bash
npm run report
```

Abre `playwright-report/index.html` com:

- status de cada cenário
- screenshots em falhas de UI (`screenshot: 'only-on-failure'`)
- trace na primeira retentativa

---

## 9. Troubleshooting

| Problema | Solução |
|----------|---------|
| `bddgen: command not found` | Rode `npx bddgen` ou `npm test` (o script já chama o bddgen) |
| Browser não encontrado | `npx playwright install chromium` |
| Timeout na UI | Aumente `timeout` em `playwright.config.ts` ou verifique a URL |
| Seletor não encontra elemento | Inspecione a página e atualize `utils/ui-helpers.ts` |
| Carrinho “sujo” entre testes | Cada teste UI usa contexto isolado; se persistir, adicione passo “Esvaziar carrinho” |
| CORS / rede | Confirme que `BASE_URL` está acessível no seu navegador |

---

## 10. Checklist rápido antes de entregar

- [ ] `npm install` ok  
- [ ] `npm run test:api` executa  
- [ ] `npm run test:ui` executa  
- [ ] Cenários `@bug` falham (documentando BUG-001 e BUG-002)  
- [ ] Demais cenários passam  
- [ ] `npm run report` abre o HTML  

---

## 11. Referência dos critérios cobertos

| CA | Regra | API | UI |
|----|-------|-----|-----|
| CA01 | Cupom 10% válido | ✓ | ✓ |
| CA03 | Cupom inválido | ✓ | ✓ |
| CA06 | Frete grátis ≥ R$ 200 | ✓ (bug) | ✓ (bug) |
| CA07 | Frete R$ 19,90 abaixo do limite | ✓ | ✓ |
| CA08/09 | Frete antes do desconto; desconto não no frete | ✓ | — |
| CA10 | Máx. 5 unidades | ✓ (bug na API) | ✓ (UI bloqueia) |
