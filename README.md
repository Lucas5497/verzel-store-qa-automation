# 🧪 Verzel Store QA — Testes Automatizados com Playwright + Gherkin

![Playwright](https://img.shields.io/badge/Playwright-Testing-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript&logoColor=white)
![BDD](https://img.shields.io/badge/BDD-Gherkin-23A455)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)
![Status](https://img.shields.io/badge/Projeto-Em%20Evolução-orange)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Relat%C3%B3rio%20Online-222222?logo=githubpages&logoColor=white)](https://lucas5497.github.io/verzel-store-qa-automation/)

Projeto de automação de testes da **Verzel Store**, utilizando Playwright, TypeScript e Gherkin (BDD), com validações de API e interface web, análise de regras de negócio, rastreabilidade dos cenários e integração contínua.

O objetivo é demonstrar como uma estratégia de QA pode combinar testes automatizados, análise de defeitos e relatórios de execução para aumentar a confiabilidade de uma aplicação.

> **Nota sobre o status:** os relatórios, workflows, publicação no GitHub Pages e dashboard descritos neste documento dependem das respectivas configurações. Consulte a estrutura real do repositório para identificar quais recursos já estão implementados.

---

## 📑 Sumário

- [Objetivos](#-objetivos)
- [Tecnologias](#-tecnologias)
- [Escopo dos testes](#-escopo-dos-testes)
- [Defeitos identificados](#-defeitos-identificados)
- [Arquitetura do projeto](#-arquitetura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação no Windows](#-instalação-no-windows)
- [Configuração do ambiente](#-configuração-do-ambiente)
- [Executando os testes](#-executando-os-testes)
- [Entendendo os cenários BDD](#-entendendo-os-cenários-bdd)
- [Estratégia de testes](#-estratégia-de-testes)
- [Relatórios e evidências](#-relatórios-e-evidências)
- [Integração contínua](#-integração-contínua-com-github-actions)
- [Publicação no GitHub Pages](#-publicação-no-github-pages)
- [Dashboard de qualidade](#-dashboard-de-qualidade)
- [Diagnóstico de problemas](#-diagnóstico-de-problemas)
- [Boas práticas](#-boas-práticas)
- [Roadmap](#-roadmap)
- [Contribuição](#-contribuição)

---

## 🎯 Objetivos

O projeto tem como objetivos:

- Automatizar testes funcionais de API e interface.
- Validar regras de negócio relacionadas a cupons, frete e quantidade de produtos.
- Investigar comportamentos inconsistentes entre API e UI.
- Organizar os cenários usando BDD e Gherkin.
- Melhorar a rastreabilidade entre cenários e critérios de aceitação.
- Gerar relatórios que facilitem a análise das execuções.
- Executar testes automaticamente por meio do GitHub Actions.
- Evoluir a apresentação dos resultados com histórico e indicadores de qualidade.

## 🛠️ Tecnologias

| Tecnologia | Utilização |
|---|---|
| Node.js | Ambiente de execução JavaScript |
| npm | Gerenciamento de dependências e scripts |
| TypeScript | Implementação dos testes |
| Playwright | Automação de API e navegador |
| playwright-bdd | Integração de Gherkin com Playwright |
| Gherkin | Especificação dos cenários em linguagem de negócio |
| Git e GitHub | Versionamento e colaboração |
| GitHub Actions | Integração contínua |
| Playwright HTML Reporter | Relatório das execuções |
| JSON Reporter | Exportação estruturada dos resultados, quando configurada |
| GitHub Pages | Publicação do relatório HTML, quando habilitada |

### Versões definidas no projeto

- Playwright: `1.49.1`
- playwright-bdd: `7.5.0`
- TypeScript: `5.7.2`

As versões acima refletem as dependências informadas no `package.json`. Para reproduzir o ambiente, utilize também o `package-lock.json`.

---

## 🧪 Escopo dos testes

A suíte contempla cenários de API e interface para as regras de negócio do carrinho.

### Testes de API

| ID | Cenário | Critério | Resultado observado anteriormente |
|---|---|---|---|
| `CT-API-CUP-001` | Aplicação de cupom válido | CA01 | Passa |
| `CT-API-CUP-004` | Validação de cupom inexistente | CA03 | Passa |
| `CT-API-FRT-001` | Frete para subtotal abaixo de R$ 200 | CA07 | Passa |
| `CT-API-FRT-002` | Frete grátis para subtotal de R$ 200 | CA06 | Falha — BUG-001 |
| `CT-API-FRT-005` | Cálculo do frete antes do desconto | CA08/CA09 | Passa |
| `CT-API-QTD-007` | Limite de 5 unidades no cálculo | CA10 | Falha — BUG-002 |
| `CT-API-QTD-007-PEDIDO` | Limite de 5 unidades no pedido | CA10 | Falha — BUG-002 |

### Testes de interface (UI)

| ID | Cenário | Critério | Resultado observado anteriormente |
|---|---|---|---|
| `CT-CUP-001` | Aplicação de cupom válido na UI | CA01 | Passa |
| `CT-CUP-005` | Validação de cupom inválido na UI | CA03 | Passa |
| `CT-FRT-001` | Cobrança de frete abaixo de R$ 200 | CA07 | Passa |
| `CT-FRT-002` | Frete grátis para subtotal de R$ 200 | CA06 | Falha — BUG-001 |
| `CT-FRT-003` | Frete grátis acima de R$ 200 | CA06 | Passa |
| `CT-QTD-002` | Permitir até 5 unidades | CA10 | Passa |
| `CT-QTD-003` | Bloquear a sexta unidade | CA10 | Passa |

**Importante:** a tabela registra os resultados anteriormente documentados para os cenários. Ela não representa o resultado da execução mais recente. Consulte o relatório Playwright para confirmar o status atual.

---

## 🐞 Defeitos identificados

### BUG-001 — Regra de frete grátis

**Critério relacionado:** CA06.

Foi identificada uma divergência na validação do frete grátis para o valor de referência de R$ 200.

As verificações relacionadas contemplam:

- Subtotal abaixo de R$ 200.
- Subtotal exatamente igual a R$ 200.
- Subtotal acima de R$ 200.
- Consistência entre os resultados apresentados pela API e pela interface.

A investigação deve confirmar o valor utilizado pela regra de negócio, o momento do cálculo e o comportamento esperado no limite definido.

### BUG-002 — Limite de quantidade por produto

**Critério relacionado:** CA10.

Foram identificadas falhas relacionadas à validação do limite de cinco unidades por produto.

As verificações contemplam:

- Permitir a inclusão de até cinco unidades.
- Impedir a inclusão da sexta unidade.
- Validar o cálculo do carrinho.
- Validar a criação ou atualização do pedido.
- Comparar o comportamento entre API e UI.

A validação deve considerar não apenas o que a interface permite selecionar, mas também o que a API aceita e processa.

---

## 📁 Arquitetura do projeto

A estrutura abaixo representa a organização de referência para a suíte.

```text
verzel-store-qa/
├── features/
│   ├── cupom.feature
│   ├── frete.feature
│   ├── quantidade.feature
│   ├── ui-cupom.feature
│   ├── ui-frete.feature
│   └── ui-quantidade.feature
├── steps/
│   ├── carrinho.steps.ts
│   └── ui.steps.ts
├── support/
│   └── world.ts
├── fixtures/
│   └── catalogo.ts
├── utils/
│   ├── oraculo.ts
│   ├── api-client.ts
│   └── ui-helpers.ts
├── .github/
│   └── workflows/
│       └── playwright.yml
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

Os nomes e caminhos devem corresponder aos arquivos existentes no repositório.

### Responsabilidade de cada diretório

#### `features/`

Armazena os cenários de teste escritos em Gherkin.

Os arquivos são separados por funcionalidade e por tipo de teste para facilitar a leitura e a manutenção.

#### `steps/`

Contém as implementações TypeScript que conectam as etapas Gherkin às ações executadas pelo Playwright.

#### `support/`

Centraliza os recursos compartilhados pela suíte, como contexto de execução e configurações de suporte ao BDD.

#### `fixtures/`

Organiza dados de teste reutilizáveis, como produtos e informações necessárias para preparar os cenários.

#### `utils/`

Contém utilitários reutilizáveis:

- `oraculo.ts`: centralização dos valores e cálculos esperados.
- `api-client.ts`: funções de comunicação com a API.
- `ui-helpers.ts`: ações e seletores reutilizáveis da interface.

#### `.github/workflows/`

Armazena os arquivos YAML responsáveis por executar os testes no GitHub Actions.

---

## ⚙️ Pré-requisitos

Antes de iniciar, instale:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (recomendado)

Verifique as instalações no terminal:

```powershell
node --version
npm --version
git --version
```

Se algum comando não for reconhecido, verifique a instalação e a variável de ambiente `PATH`.

---

## 🚀 Instalação no Windows

### 1. Clonar o repositório

Substitua a URL pelo endereço real do repositório.

```powershell
git clone <URL_DO_REPOSITORIO>
cd verzel-store-qa
```

### 2. Instalar as dependências

```powershell
npm ci
```

O comando instala as versões registradas no `package-lock.json`.

Se o arquivo de lock não estiver disponível, será necessário corrigir o repositório ou utilizar `npm install` para gerar o arquivo correspondente.

### 3. Instalar o navegador

```powershell
npx playwright install chromium
```

### 4. Executar a suíte

```powershell
npm test
```

O comando executa primeiro a geração dos testes BDD e, em seguida, a suíte Playwright.

---

## 🌐 Configuração do ambiente

A URL padrão informada na configuração do projeto é:

```text
https://verzel-store.qa-test-verzel-store.workers.dev
```

A URL pode ser substituída por meio da variável de ambiente `BASE_URL`, conforme o `playwright.config.ts`.

### PowerShell

```powershell
$env:BASE_URL = "https://sua-url-de-teste"
npm test
```

### CMD

```cmd
set BASE_URL=https://sua-url-de-teste
npm test
```

### Bash

```bash
BASE_URL="https://sua-url-de-teste" npm test
```

Para voltar a utilizar a URL padrão, abra um novo terminal ou remova a variável da sessão atual.

**Segurança:** utilize apenas ambientes autorizados para os testes. Não versione senhas, tokens ou outros dados sensíveis no repositório.

---

## ▶️ Executando os testes

Os comandos abaixo correspondem aos scripts informados no `package.json`.

### Executar todos os testes

```bash
npm test
```

Executa:

1. `npm run bddgen`
2. `npx playwright test`

### Executar somente API

```bash
npm run test:api
```

Utiliza o projeto `api` configurado no Playwright.

### Executar somente UI

```bash
npm run test:ui
```

Utiliza o projeto `ui-chromium`.

### Executar UI com o navegador visível

```bash
npm run test:headed
```

Útil para observar as interações e investigar comportamentos da interface.

### Executar testes por tag de bug

```bash
npm run test:bug
```

Esse script executa os testes que correspondem à expressão `@bug`.

**Atenção:** os cenários precisam estar efetivamente marcados com a tag `@bug` para serem selecionados por esse comando.

### Executar testes com o Playwright diretamente

Após gerar os testes BDD:

```bash
npm run bddgen
npx playwright test
```

Executar um projeto específico:

```bash
npx playwright test --project=api
```

```bash
npx playwright test --project=ui-chromium
```

Executar um teste filtrando pelo nome:

```bash
npx playwright test -g "cupom válido"
```

Executar em modo de depuração:

```bash
npx playwright test --debug
```

Listar os testes reconhecidos pelo Playwright:

```bash
npm run bddgen
npx playwright test --list
```

A opção `--list` permite conferir se os cenários foram descobertos antes de executar a suíte.

---

## 📝 Entendendo os cenários BDD

O Gherkin descreve o comportamento esperado de forma legível para pessoas de QA, desenvolvimento e negócio.

Exemplo ilustrativo:

```gherkin
Funcionalidade: Limite de quantidade por produto

  Cenário: Impedir a inclusão da sexta unidade
    Dado que estou visualizando um produto disponível
    Quando tento selecionar seis unidades do produto
    Então o sistema deve respeitar o limite de cinco unidades
```

O exemplo é conceitual. Os passos devem corresponder às definições realmente implementadas em `steps/`.

### Estrutura básica

- `Funcionalidade`: descreve o comportamento ou regra de negócio.
- `Cenário`: identifica uma situação que será validada.
- `Dado`: estabelece o contexto inicial.
- `Quando`: descreve a ação executada.
- `Então`: define o resultado esperado.
- `E`: complementa qualquer uma das etapas anteriores.

### Tags

Tags permitem organizar e selecionar cenários.

Exemplos:

```gherkin
@ui
Cenário: Validar cupom na interface
```

```gherkin
@bug
Cenário: Validar regra de frete grátis
```

```gherkin
@api
Cenário: Validar cálculo do carrinho
```

As tags são exemplos de organização. Para que os comandos funcionem como esperado, os nomes das tags precisam corresponder às expressões utilizadas na configuração e nos scripts.

---

## 🧠 Estratégia de testes

### 1. Testes de API

Validam regras de negócio diretamente na camada de serviço.

Benefícios:

- Menor dependência do navegador.
- Investigação mais direta de cálculos e respostas.
- Facilidade para testar valores de fronteira.
- Possibilidade de comparar os resultados com os valores esperados.

### 2. Testes de interface

Validam o comportamento apresentado ao usuário.

As verificações incluem interações, campos, mensagens e valores exibidos na tela.

### 3. Testes de fronteira

Regras com limites numéricos precisam ser testadas em torno do valor de referência.

Para o limite de quantidade, por exemplo:

- Valor imediatamente abaixo do limite.
- Valor igual ao limite.
- Valor imediatamente acima do limite.

Para o frete, os cenários devem cobrir os valores relevantes abaixo, no limite e acima de R$ 200, respeitando os critérios de aceitação definidos.

### 4. Consistência entre API e UI

A comparação entre as camadas ajuda a localizar divergências.

Se a interface bloqueia uma quantidade, mas a API a aceita, por exemplo, existe uma diferença de comportamento que precisa ser investigada.

### 5. Oráculo de testes

O módulo `utils/oraculo.ts` pode centralizar os valores esperados para evitar duplicação de regras nos testes.

Para cálculos monetários, prefira representar os valores em centavos quando isso for compatível com a implementação.

Exemplo conceitual:

```typescript
const precoEmCentavos = 19900;
const freteEmCentavos = 1500;

const totalEmCentavos = precoEmCentavos + freteEmCentavos;
```

Esse exemplo demonstra a representação monetária e não substitui os valores reais de negócio da aplicação.

---

## 🔎 Seletores de interface

Os seletores abaixo foram registrados durante a definição da estratégia de testes. Confirme se continuam válidos no DOM atual da aplicação.

| Elemento | Seletor |
|---|---|
| Card de produto | `.produto` |
| Campo de cupom | `#campo-cupom` |
| Subtotal | `[data-valor="subtotal"]` |
| Desconto | `[data-valor="desconto"]` |
| Frete | `[data-valor="frete"]` |
| Total | `[data-valor="total"]` |
| Aviso de frete | `.aviso-frete` |
| Aviso de limite | `.produto-aviso` ou `.produto-aviso-limite` |
| Quantidade | `.seletor-quantidade output` |

### Recomendações

- Prefira seletores estáveis.
- Quando disponíveis, utilize atributos dedicados a testes.
- Evite depender de posições fixas ou estruturas HTML frágeis.
- Centralize seletores compartilhados em utilitários.
- Não interprete automaticamente um seletor quebrado como defeito de negócio.

---

## 📊 Relatórios e evidências

O Playwright oferece um relatório HTML para analisar os resultados da execução.

### Gerar o relatório

A configuração deve conter o reporter HTML:

```typescript
reporter: [
  ['list'],
  ['html', {
    open: 'never',
    outputFolder: 'playwright-report',
  }],
],
```

Depois da execução:

```bash
npm test
```

### Abrir o relatório

```bash
npm run report
```

O script `report` informado no projeto executa:

```bash
npx playwright show-report
```

O relatório precisa existir antes de ser aberto.

### Evidências de falha

A configuração pode manter screenshots e traces:

```typescript
use: {
  screenshot: 'only-on-failure',
  trace: 'on-first-retry',
},
```

- `screenshot: 'only-on-failure'`: captura screenshots em falhas.
- `trace: 'on-first-retry'`: registra o trace na primeira nova tentativa do teste.

A disponibilidade das evidências depende da execução e da configuração do projeto.

### Reporter JSON

Um reporter JSON pode ser adicionado para disponibilizar os resultados em formato estruturado:

```typescript
['json', {
  outputFile: 'test-results/results.json',
}],
```

Para habilitá-lo, inclua essa entrada na configuração `reporter`.

O arquivo JSON pode servir como base para resumos de execução e para um dashboard futuro.

### Organização sugerida dos artefatos

```text
playwright-report/
└── index.html

test-results/
├── results.json
└── artifacts/
```

Essa estrutura depende das opções configuradas. O caminho de `outputDir` controla a saída dos artefatos de teste, enquanto `outputFile` controla onde o reporter JSON grava seu resultado.

---

## 🔄 Integração contínua com GitHub Actions

O objetivo do pipeline é executar a suíte automaticamente, armazenar os resultados e facilitar a identificação de regressões.

### Eventos de execução

Um workflow pode ser configurado para executar em:

- `push` para `main` ou `master`.
- `pull_request` para essas branches.
- `workflow_dispatch`, para execução manual.

### Fluxo sugerido

1. Fazer checkout do código.
2. Configurar o Node.js.
3. Instalar as dependências com `npm ci`.
4. Instalar o Chromium e as dependências do sistema.
5. Executar os testes.
6. Gerar o resumo da execução.
7. Armazenar o relatório HTML e as evidências.
8. Publicar o relatório no GitHub Pages, quando habilitado.

### Artefatos do pipeline

O workflow pode disponibilizar:

- Relatório HTML.
- Resultado JSON.
- Screenshots.
- Traces.
- Outros artefatos de diagnóstico.

No GitHub, acesse a execução do workflow e procure a seção **Artifacts** para baixar os arquivos publicados.

### Exemplo de workflow básico

O exemplo abaixo demonstra uma configuração básica para executar os testes e armazenar o relatório HTML mesmo quando houver falhas.

Salve como `.github/workflows/playwright.yml`, ajustando o caminho caso seu repositório utilize outro nome de arquivo.

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  test:
    timeout-minutes: 30
    runs-on: ubuntu-latest

    steps:
      - name: Checkout do repositório
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Instalar dependências
        run: npm ci

      - name: Instalar navegador
        run: npx playwright install --with-deps chromium

      - name: Executar testes
        id: tests
        continue-on-error: true
        run: npm test

      - name: Armazenar relatório HTML
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
          if-no-files-found: warn

      - name: Armazenar resultados e evidências
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-test-results
          path: test-results/
          retention-days: 30
          if-no-files-found: warn

      - name: Registrar status dos testes
        if: ${{ always() }}
        run: |
          if [ "${{ steps.tests.outcome }}" = "success" ]; then
            echo "## ✅ Testes Playwright" >> "$GITHUB_STEP_SUMMARY"
            echo "A execução foi concluída sem falhas." >> "$GITHUB_STEP_SUMMARY"
          else
            echo "## ❌ Testes Playwright" >> "$GITHUB_STEP_SUMMARY"
            echo "A execução apresentou falhas. Consulte os relatórios e as evidências." >> "$GITHUB_STEP_SUMMARY"
          fi

      - name: Falhar o job se os testes falharam
        if: ${{ always() && steps.tests.outcome == 'failure' }}
        run: exit 1
```

**Observações importantes:**

- O exemplo usa Node.js 20. Se o projeto exigir outra versão, ajuste o valor de `node-version`.
- O diretório `test-results/` só terá conteúdo correspondente se a configuração efetivamente gerar esses arquivos.
- O exemplo publica artefatos no GitHub Actions, mas não configura a publicação no GitHub Pages.
- A falha dos testes deve continuar refletida no status final do job, mesmo que os relatórios sejam armazenados com sucesso.
- O resumo mostrado é intencionalmente simples. Um resumo com contagem de aprovados, reprovados e ignorados depende da leitura do JSON reporter.

---

## 🌍 Publicação no GitHub Pages

A publicação do relatório HTML permite consultar os resultados por meio de uma URL, sem precisar baixar o artefato a cada execução.

Esse recurso precisa ser configurado no repositório e no workflow.

### Configuração no GitHub

1. Acesse **Settings** do repositório.
2. Entre em **Pages**.
3. Selecione **GitHub Actions** como método de publicação.
4. Confira se as permissões necessárias estão habilitadas.
5. Execute o workflow de publicação.
6. Acesse a URL disponibilizada pelo GitHub e valide o conteúdo.

### Considerações

- O relatório precisa existir antes da publicação.
- A etapa de deploy deve baixar ou receber o diretório do relatório HTML.
- O workflow de publicação precisa das permissões adequadas.
- Uma execução de testes com falha não deve ser considerada uma publicação bem-sucedida dos testes; são estados diferentes.
- O relatório pode conter dados de execução. Avalie o conteúdo antes de publicar, principalmente se o repositório for público.

## 📊 Relatório de testes online

Acesse o relatório publicado no GitHub Pages:

👉 **[Ver relatório de testes — Verzel Store QA](https://lucas5497.github.io/verzel-store-qa-automation/)**

O relatório permite consultar os resultados e as informações disponibilizadas pela publicação.

---

## 📈 Dashboard de qualidade

Uma evolução planejada é transformar os resultados das execuções em um dashboard de qualidade.

O dashboard poderá reunir:

- Total de testes executados.
- Quantidade de aprovados e reprovados.
- Testes ignorados e instáveis, quando disponíveis.
- Taxa de sucesso.
- Histórico de execuções.
- Resultados por projeto: API e UI.
- Falhas por funcionalidade.
- Evolução dos defeitos conhecidos.
- Links para relatórios e evidências.

### Arquitetura sugerida

```text
Playwright
    |
    v
Reporter JSON
    |
    v
GitHub Actions
    |
    v
Armazenamento do histórico
    |
    v
Dashboard de qualidade
    |
    v
Indicadores, gráficos e relatórios
```

### Etapas de implementação

**Etapa 1 — Gerar dados estruturados**

Configurar o JSON reporter e verificar a estrutura real de `test-results/results.json`.

**Etapa 2 — Criar um resumo no CI**

Extrair as métricas da execução e disponibilizá-las no resumo do GitHub Actions.

**Etapa 3 — Preservar o histórico**

Definir como os resultados serão armazenados entre execuções. Um artefato temporário não equivale a um histórico permanente.

**Etapa 4 — Construir a interface**

Criar uma página que apresente indicadores, gráficos e acesso aos relatórios.

**Etapa 5 — Publicar**

Disponibilizar o dashboard por um mecanismo de hospedagem compatível, com controle sobre as informações expostas.

O dashboard não deve apresentar métricas como se estivessem disponíveis antes de existir uma fonte de dados implementada.

---

## 🧰 Diagnóstico de problemas

### Erro ao instalar dependências

Execute:

```bash
npm ci
```

Se houver erro, confira se o `package-lock.json` corresponde ao `package.json` e se a versão do Node.js é compatível.

### Navegador não instalado

Execute:

```bash
npx playwright install chromium
```

Em Linux ou CI, utilize:

```bash
npx playwright install --with-deps chromium
```

### Nenhum teste encontrado

Gere os testes BDD:

```bash
npm run bddgen
```

Depois liste os testes:

```bash
npx playwright test --list
```

Confira também:

- Os caminhos configurados em `defineBddConfig`.
- A existência dos arquivos `.feature`.
- A localização das definições de steps.
- A correspondência entre tags e filtros.

### Erro ao abrir o relatório

Execute primeiro:

```bash
npm test
```

Depois:

```bash
npm run report
```

Se o diretório `playwright-report/` não existir, verifique a configuração do reporter e o resultado da execução.

### Falha de teste na interface

Antes de concluir que existe um defeito funcional:

1. Confira a URL do ambiente.
2. Verifique se a aplicação está acessível.
3. Valide os seletores.
4. Consulte a mensagem de erro.
5. Analise screenshot e trace, se disponíveis.
6. Confirme os dados utilizados no cenário.
7. Reproduza o comportamento quando possível.

### Diferença entre API e UI

Registre:

- O cenário executado.
- Os dados de entrada.
- A resposta da API.
- Os valores apresentados na interface.
- O resultado esperado.
- O resultado observado.

Essas informações facilitam a investigação e a comunicação com desenvolvimento.

### Falha na publicação do GitHub Pages

Confira:

- Se o relatório HTML foi gerado.
- Se o diretório correto foi enviado para publicação.
- Se o workflow tem as permissões necessárias.
- Se o GitHub Pages está configurado para utilizar GitHub Actions.
- Se a etapa de deploy foi executada.

---

## ✅ Boas práticas

- Mantenha os cenários organizados por funcionalidade.
- Utilize nomes claros e rastreáveis.
- Separe testes de API e UI quando a finalidade for diferente.
- Centralize utilitários compartilhados.
- Evite dependência desnecessária entre cenários.
- Utilize dados de teste controlados.
- Valide os limites das regras de negócio.
- Prefira seletores estáveis.
- Preserve evidências que ajudem a investigar falhas.
- Não oculte falhas do pipeline apenas para manter o build verde.
- Diferencie falhas de teste de falhas de infraestrutura.
- Não armazene segredos no repositório.
- Revise o README quando scripts, diretórios ou configurações forem alterados.

---

## 🗺️ Roadmap

### Fase 1 — Estrutura e automação

- [x] Configurar Playwright e TypeScript.
- [x] Organizar cenários com Gherkin e BDD.
- [x] Separar execução de API e UI.
- [x] Documentar regras de negócio e defeitos identificados.
- [ ] Revisar a cobertura e a rastreabilidade de todos os cenários.

### Fase 2 — Relatórios e CI/CD

- [ ] Confirmar a geração do relatório HTML no ambiente local.
- [ ] Configurar e validar o JSON reporter.
- [ ] Publicar os artefatos no GitHub Actions.
- [ ] Criar um resumo de execução com métricas.
- [ ] Validar o comportamento do pipeline quando os testes falham.

### Fase 3 — Publicação

- [ ] Configurar o GitHub Pages.
- [ ] Publicar o relatório HTML.
- [ ] Validar a URL pública ou interna.
- [ ] Revisar os dados disponibilizados no relatório.

### Fase 4 — Dashboard

- [ ] Definir o modelo dos dados históricos.
- [ ] Preservar os resultados entre execuções.
- [ ] Construir indicadores e gráficos.
- [ ] Separar métricas de API e UI.
- [ ] Relacionar falhas aos defeitos conhecidos.
- [ ] Publicar o dashboard.

### Fase 5 — Evolução da qualidade

- [ ] Ampliar os testes de fronteira.
- [ ] Melhorar a gestão de dados de teste.
- [ ] Revisar flakiness e estabilidade.
- [ ] Avaliar a execução paralela.
- [ ] Explorar melhorias assistidas por IA para análise de falhas e manutenção de testes, mantendo a validação humana.

---

## 🤝 Contribuição

Para contribuir com o projeto:

1. Crie uma branch para a alteração.
2. Implemente ou atualize os cenários.
3. Execute os testes localmente.
4. Revise os resultados e as evidências.
5. Atualize a documentação quando necessário.
6. Abra um Pull Request com a descrição das mudanças.

Sugestão de nomenclatura:

```text
feature/novo-cenario-cupom
fix/validacao-limite-quantidade
docs/atualizacao-readme
```

---

## 👨‍💻 Sobre o projeto

Este projeto demonstra práticas de Quality Assurance com foco em automação, análise crítica de regras de negócio, testes de API e interface, rastreabilidade e integração contínua.

**Principais competências demonstradas:**

- Testes funcionais e exploratórios.
- Automação com Playwright e TypeScript.
- BDD com Gherkin.
- Validação de API e UI.
- Análise de valores de fronteira.
- Investigação e documentação de defeitos.
- Relatórios e evidências de execução.
- CI/CD com GitHub Actions.

---

**Projeto:** Verzel Store QA  
**Stack:** Playwright · TypeScript · Gherkin · BDD · GitHub Actions  
**Objetivo:** Aumentar a confiabilidade da aplicação por meio de testes automatizados, rastreabilidade e análise de resultados.