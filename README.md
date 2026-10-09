# Verzel Store QA — Automação Playwright + Gherkin

Automação dos cenários prioritários da entrega **VZS-142** (cupom, frete, limites e valores) em **API** e **UI**.

## Pré-requisitos

- Node.js 18+
- npm

## Instalação

```bash
cd verzel-store-qa
npm install
# chromium é instalado no postinstall; se falhar:
npx playwright install chromium
```

## Executar

```bash
npm test          # API + UI
npm run test:api  # só API
npm run test:ui   # só UI (Chromium)
npm run test:bug  # só cenários @bug (BUG-001 / BUG-002)
npm run test:headed
npm run report
```

## Cenários automatizados

### API (7)

| Tag | Cenário | CA | Esperado |
|-----|---------|----|----------|
| `@ct-api-cup-001` | Cupom válido | CA01 | Passa |
| `@ct-api-cup-004` | Cupom inexistente | CA03 | Passa |
| `@ct-api-frt-001` | Frete abaixo de R$ 200 | CA07 | Passa |
| `@ct-api-frt-002` | Frete grátis em R$ 200 | CA06 | **Falha — BUG-001** |
| `@ct-api-frt-005` | Frete antes do desconto | CA08/09 | Passa |
| `@ct-api-qtd-007` | Limite 5 no cálculo | CA10 | **Falha — BUG-002** |
| `@ct-api-qtd-007-pedido` | Limite 5 no pedido | CA10 | **Falha — BUG-002** |

### UI (7)

| Tag | Cenário | CA | Esperado |
|-----|---------|----|----------|
| `@ct-cup-001` | Cupom válido na UI | CA01 | Passa |
| `@ct-cup-005` | Cupom inválido na UI | CA03 | Passa |
| `@ct-frt-001` | Frete cobrado &lt; R$ 200 | CA07 | Passa |
| `@ct-frt-002` | Frete grátis = R$ 200 | CA06 | **Falha — BUG-001** |
| `@ct-frt-003` | Frete grátis &gt; R$ 200 | CA06 | Passa |
| `@ct-qtd-002` | Permite 5 unidades | CA10 | Passa |
| `@ct-qtd-003` | Bloqueia 6ª unidade | CA10 | Passa |

## Estrutura

```
verzel-store-qa/
├── features/
│   ├── cupom.feature / frete.feature / quantidade.feature   # API
│   ├── ui-cupom.feature / ui-frete.feature / ui-quantidade.feature
├── steps/
│   ├── carrinho.steps.ts   # API
│   └── ui.steps.ts         # UI
├── support/world.ts
├── fixtures/catalogo.ts
├── utils/
│   ├── oraculo.ts          # valores esperados (centavos)
│   ├── api-client.ts
│   └── ui-helpers.ts       # seletores e ações de tela
└── playwright.config.ts
```

## Seletores UI estáveis

| Elemento | Seletor |
|----------|---------|
| Card de produto | `.produto` + texto do nome |
| Campo de cupom | `#campo-cupom` |
| Valores do resumo | `[data-valor="subtotal\|desconto\|frete\|total"]` |
| Aviso de frete | `.aviso-frete` |
| Aviso de limite | `.produto-aviso` / `.produto-aviso-limite` |
| Quantidade no carrinho | `.seletor-quantidade output` |

## Ambiente

```
BASE_URL=https://verzel-store.qa-test-verzel-store.workers.dev
```
