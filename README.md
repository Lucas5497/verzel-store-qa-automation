# 🧪 Verzel Store QA — Estratégia, Testes e Automação

![QA](https://img.shields.io/badge/QA-Functional%20Testing-6A5ACD)
![Playwright](https://img.shields.io/badge/Automation-Playwright-2EAD33?logo=playwright&logoColor=white)
![BDD](https://img.shields.io/badge/BDD-Gherkin-23A455)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)

> **Teste técnico:** QA — Verzel  
> **Entrega avaliada:** VZS-142 — cupons de desconto, frete grátis e limites de quantidade  
> **Aplicação:** [Verzel Store — ambiente de QA](https://verzel-store.qa-test-verzel-store.workers.dev/)  
> **Documentação da aplicação:** [Abrir documentação](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao)  
> **API:** [Consultar API](https://verzel-store.qa-test-verzel-store.workers.dev/api)

## 🔗 Acessos rápidos

- **[Relatório de automação online](https://lucas5497.github.io/verzel-store-qa-automation/)**
- **[Repositório da automação Playwright](https://github.com/Lucas5497/verzel-store-qa-automation)**
- [Estratégia de testes](docs/01-estrategia-de-testes.md)
- [Ambiguidades e limitações](docs/02-ambiguidades-e-limitacoes.md)
- [Dados de teste](docs/03-dados-de-teste.md)
- [Relatório de execução manual](reports/execucao-dos-testes.md)
- [Evidências detalhadas](reports/evidencias.md)
- [Sessão exploratória SE-01](reports/teste-exploratorio-SE1.md)
- [Matriz de cenários e casos de teste (Excel)](reports/Verzel_Matriz_Cenarios_Casos_de_Testes.xlsx)
- [Índice de evidências](evidence/README.md)
- [BUG-001 — Frete no subtotal exato de R$ 200,00](bugs/BUG-001.md)
- [BUG-002 — Limite de unidades na API](bugs/BUG-002.md)
- [BUG-003 — Validação de existência do CEP (pendente de requisito)](bugs/BUG-003.md)

Este projeto reúne a estratégia de QA, os casos de teste, os resultados registrados, as evidências, os defeitos identificados e a referência para a suíte automatizada. A automação está mantida em um repositório separado para distinguir a documentação da avaliação funcional do código executável.

> **Nota sobre os resultados:** os números e status apresentados neste README refletem registros documentados durante a avaliação, não uma nova execução em tempo real. Consulte os relatórios vinculados para detalhes por caso.

---

## 📑 Sumário

- [Objetivo](#-objetivo)
- [Escopo](#-escopo)
- [Resultado da execução manual](#-resultado-da-execução-manual)
- [Defeitos e pendências](#-defeitos-e-pendências)
- [Estratégia de testes](#-estratégia-de-testes)
- [Reproduzir uma validação manual](#-reproduzir-uma-validação-manual)
- [Automação Playwright](#-automação-playwright)
- [Como executar a automação](#-como-executar-a-automação)
- [Relatórios e evidências](#-relatórios-e-evidências)
- [CI/CD e GitHub Pages](#-cicd-e-github-pages)
- [Estrutura do repositório](#-estrutura-do-repositório)
- [Limitações e pontos de atenção](#-limitações-e-pontos-de-atenção)
- [Roadmap](#-roadmap)
- [Sobre o projeto](#-sobre-o-projeto)

---

## 🎯 Objetivo

Avaliar o comportamento da Verzel Store com foco em regras de negócio relacionadas a cupons de desconto, frete, limites de quantidade e valores do carrinho.

O trabalho combina testes manuais e exploratórios com automação de API e interface, priorizando:

- Rastreabilidade entre critérios de aceitação e casos de teste.
- Validação de cenários positivos, negativos e de fronteira.
- Comparação entre o comportamento da API e da interface.
- Registro de evidências reproduzíveis.
- Documentação objetiva de defeitos e ambiguidades.
- Execução automatizada e publicação de relatórios.

## 📦 Escopo

A avaliação considera os critérios de aceitação **CA01–CA11**, conforme a documentação do projeto, com foco em:

- Aplicação e validação de cupons.
- Mensagens de cupom inválido ou expirado.
- Aplicação de apenas um cupom ativo, conforme a regra especificada.
- Frete grátis para subtotal igual ou superior a R$ 200,00.
- Cobrança de frete abaixo do limite.
- Ordem do cálculo de frete e desconto.
- Limite de cinco unidades por produto.
- Consistência dos valores monetários.
- Comportamentos observáveis no checkout e na validação de CEP.

Testes de carga, estresse e segurança, autenticação, cadastro, pagamento online e consulta de pedidos estão fora do escopo desta avaliação, conforme a documentação do projeto.

---

## 📊 Resultado da execução manual

O relatório de execução registra **37 casos estruturados**:

| Status registrado | Quantidade |
|---|---:|
| Passou | 24 |
| Falhou | 5 |
| Passou com ressalva / ambiguidade | 3 |
| Bloqueado | 5 |
| **Total** | **37** |

Esses números representam os status documentados na execução manual. Casos com ressalvas, bloqueados ou reprovados não devem ser contabilizados como aprovados sem uma decisão e evidência adicionais.

Para consultar o detalhamento, acesse:

- [Relatório de execução](reports/execucao-dos-testes.md)
- [Evidências detalhadas](reports/evidencias.md)
- [Matriz de cenários e casos de teste](reports/Verzel_Matriz_Cenarios_Casos_de_Testes.xlsx)

## 🐞 Defeitos e pendências

| Registro | Situação documentada | Referência |
|---|---|---|
| **BUG-001** | Frete de R$ 19,90 é cobrado quando o subtotal é exatamente R$ 200,00; comportamento observado na UI e na API. | [Detalhes do BUG-001](bugs/BUG-001.md) |
| **BUG-002** | A API aceita quantidades acima de cinco unidades, contornando o limite observado na interface. | [Detalhes do BUG-002](bugs/BUG-002.md) |
| **BUG-003** | A validação da existência do CEP depende de confirmação do requisito; permanece como pendência, não como defeito confirmado. | [Detalhes do BUG-003](bugs/BUG-003.md) |

### BUG-001 — Frete no subtotal exato de R$ 200,00

**Critério relacionado:** CA06.

O comportamento registrado indica cobrança de frete de R$ 19,90 quando o subtotal chega exatamente a R$ 200,00, embora a regra documentada indique frete grátis a partir desse valor.

A validação contempla valores abaixo, exatamente no limite e acima do limite, além da comparação entre API e UI.

### BUG-002 — Limite de quantidade na API

**Critério relacionado:** CA10.

Foi registrado que a API aceita quantidades acima de cinco unidades. Isso pode permitir que a regra seja contornada quando a validação é feita somente na interface.

A validação deve abranger tanto o endpoint de cálculo do carrinho quanto o endpoint de pedidos, conforme os casos registrados.

### BUG-003 — Validação da existência do CEP

Durante a exploração, foi observado que o valor `0000-1111` foi aceito pela aplicação. A aceitação do formato não comprova a existência do CEP.

Esse comportamento permanece como **pendência de requisito** até que seja esclarecido se o sistema deve apenas validar o formato ou também consultar a existência do CEP.

Consulte o [registro exploratório BUG-003](bugs/BUG-003.md) e a [sessão SE-01](reports/teste-exploratorio-SE1.md).

---

## 🧭 Estratégia de testes

A estratégia combina diferentes abordagens complementares.

### Testes funcionais manuais

Validam o comportamento da aplicação a partir dos critérios de aceitação, com dados de entrada definidos, passos reproduzíveis e resultados esperados.

### Testes exploratórios

Investigam combinações e comportamentos que podem não estar cobertos pelos casos estruturados. As observações devem registrar o contexto, os dados utilizados, o comportamento observado e as dúvidas de requisito.

### Testes de API

Validam regras de negócio diretamente nos endpoints, facilitando a investigação de cálculos, limites e respostas sem depender da interface gráfica.

### Testes de interface (UI)

Validam as interações disponíveis ao usuário, as mensagens e os valores apresentados na tela.

### Testes de fronteira

Regras numéricas são verificadas abaixo, no limite e acima do valor definido. Exemplos:

- Subtotal abaixo de R$ 200,00, exatamente R$ 200,00 e acima de R$ 200,00.
- Quantidade de cinco unidades e tentativa de adicionar a sexta unidade.

### Consistência entre camadas

A comparação de API e UI ajuda a identificar regras aplicadas de maneira diferente. Uma validação feita somente no navegador não substitui a validação correspondente no servidor quando a regra precisa ser garantida pela API.

---

## 🔁 Reproduzir uma validação manual

1. Acesse a [Verzel Store — ambiente de QA](https://verzel-store.qa-test-verzel-store.workers.dev/).
2. Consulte a [documentação da aplicação](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao), incluindo as informações sobre o ambiente.
3. Escolha um caso no [relatório de execução](reports/execucao-dos-testes.md) ou no [relatório de evidências](reports/evidencias.md).
4. Prepare os dados descritos no caso.
5. Execute os passos na ordem registrada.
6. Compare o resultado observado com o esperado.
7. Registre evidências e diferenças, se houver.
8. Se o comportamento depender de uma regra ambígua, documente a dúvida sem classificá-la automaticamente como defeito confirmado.

---

## 🤖 Automação Playwright

A suíte automatizada está em um repositório separado:

**[Abrir repositório de automação](https://github.com/Lucas5497/verzel-store-qa-automation)**

**[Abrir relatório online](https://lucas5497.github.io/verzel-store-qa-automation/)**

A automação utiliza Playwright, TypeScript e Gherkin/BDD para validar cenários selecionados de API e interface.

### Tecnologias da suíte

| Tecnologia | Finalidade |
|---|---|
| Playwright | Automação de API e navegador |
| TypeScript | Implementação dos testes |
| Gherkin | Especificação legível dos cenários |
| `playwright-bdd` | Integração entre Gherkin e Playwright |
| GitHub Actions | Execução automatizada no CI |
| Playwright HTML Reporter | Relatório de execução |

Versões informadas no projeto de automação: Playwright `1.49.1`, `playwright-bdd` `7.5.0` e TypeScript `5.7.2`.

### Cobertura automatizada documentada

Os cenários selecionados abrangem cupom válido e inválido, frete abaixo e no limite de R$ 200,00, cálculo de frete em relação ao desconto e limite de quantidade no cálculo do carrinho e no pedido.

Os resultados de execuções anteriores indicaram falhas relacionadas ao BUG-001 e ao BUG-002. Para o status mais recente, consulte o [relatório de automação online](https://lucas5497.github.io/verzel-store-qa-automation/).

---

## 💻 Como executar a automação

> Os comandos desta seção devem ser executados no repositório **`verzel-store-qa-automation`**, não na raiz deste repositório de documentação manual.

### Pré-requisitos

- [Node.js](https://nodejs.org/) compatível com as dependências do projeto.
- npm.
- Git.
- Acesso à aplicação de QA.

### 1. Clonar o repositório de automação

```bash
git clone https://github.com/Lucas5497/verzel-store-qa-automation.git
cd verzel-store-qa-automation
```

### 2. Instalar dependências

```bash
npm ci
```

### 3. Instalar o Chromium

No Windows:

```bash
npx playwright install chromium
```

Em Linux/CI:

```bash
npx playwright install --with-deps chromium
```

### 4. Executar os testes

Executar a suíte:

```bash
npm test
```

Executar apenas os testes de API:

```bash
npm run test:api
```

Executar apenas os testes de interface:

```bash
npm run test:ui
```

Executar UI com o navegador visível:

```bash
npm run test:headed
```

Executar cenários marcados com a tag `@bug`:

```bash
npm run test:bug
```

O comando `test:bug` depende de os cenários estarem marcados com `@bug` e de essa tag corresponder ao filtro definido no projeto.

Gerar os testes BDD:

```bash
npm run bddgen
```

Listar os testes descobertos:

```bash
npx playwright test --list
```

Abrir o relatório HTML local:

```bash
npm run report
```

### Configurar outra URL de teste

A configuração informada utiliza como URL padrão:

`https://verzel-store.qa-test-verzel-store.workers.dev`

Para alterar a URL no PowerShell:

```powershell
$env:BASE_URL = "https://sua-url-de-teste"
npm test
```

No Bash:

```bash
BASE_URL="https://sua-url-de-teste" npm test
```

Use somente ambientes autorizados e não armazene credenciais ou tokens diretamente no código.

---

## 📄 Relatórios e evidências

### Relatório de automação online

**[Ver relatório publicado no GitHub Pages](https://lucas5497.github.io/verzel-store-qa-automation/)**

### Relatório HTML local

A suíte Playwright pode gerar o diretório `playwright-report/`. Para abri-lo localmente, execute:

```bash
npm run report
```

O relatório precisa ter sido gerado por uma execução anterior.

### Evidências da avaliação manual

Os relatórios e arquivos deste repositório registram a execução manual, os passos de reprodução e as capturas correspondentes:

- [Execução dos testes](reports/execucao-dos-testes.md)
- [Evidências detalhadas](reports/evidencias.md)
- [Índice de evidências](evidence/README.md)
- [Matriz de testes em Excel](reports/Verzel_Matriz_Cenarios_Casos_de_Testes.xlsx)

### Cuidados com a interpretação dos resultados

- Um relatório de automação mostra o resultado dos cenários executados naquela execução.
- Os números da execução manual são registros separados e não devem ser somados automaticamente aos resultados automatizados.
- Um cenário bloqueado ou ambíguo não equivale a um teste aprovado.
- Um relatório online deve ser consultado para verificar a execução publicada; a existência do link, por si só, não garante que o conteúdo represente a execução mais recente.

---

## 🔄 CI/CD e GitHub Pages

O repositório de automação possui um workflow de GitHub Actions para executar os testes em eventos como `push`, `pull_request` e execução manual, conforme a configuração do workflow.

O pipeline pode ser utilizado para:

1. Instalar dependências.
2. Instalar o navegador.
3. Executar os testes.
4. Armazenar o relatório HTML como artefato.
5. Disponibilizar evidências para diagnóstico.
6. Publicar o relatório no GitHub Pages, quando o deploy estiver habilitado.

**Acesso:** [repositório de automação](https://github.com/Lucas5497/verzel-store-qa-automation) · [relatório online](https://lucas5497.github.io/verzel-store-qa-automation/)

### Evoluções propostas para CI/CD

- Exportar os resultados também em JSON.
- Incluir no resumo do GitHub Actions a contagem de aprovados, reprovados, ignorados e instáveis.
- Preservar histórico de execuções para permitir comparações.
- Diferenciar falhas de teste de falhas de infraestrutura.
- Manter o job vermelho quando os testes falharem, mesmo que o relatório seja armazenado corretamente.

Essas evoluções devem ser marcadas como concluídas somente depois de implementadas e validadas no workflow real.

---

## 📁 Estrutura deste repositório

A estrutura documentada para a entrega de QA é:

```text
.
├── README.md
├── bugs/
│   ├── BUG-001.md
│   ├── BUG-002.md
│   ├── BUG-003.md
│   └── ...
├── docs/
│   ├── 01-estrategia-de-testes.md
│   ├── 02-ambiguidades-e-limitacoes.md
│   └── 03-dados-de-teste.md
├── evidence/
│   └── README.md
└── reports/
    ├── execucao-dos-testes.md
    ├── evidencias.md
    ├── teste-exploratorio-SE1.md
    └── Verzel_Matriz_Cenarios_Casos_de_Testes.xlsx
```

A árvore é ilustrativa; os nomes devem corresponder aos arquivos efetivamente versionados no repositório.

A automação possui seu próprio `package.json`, configuração Playwright, arquivos `.feature`, steps e workflow no repositório separado.

---

## ⚠️ Limitações e pontos de atenção

- Os resultados documentados representam a execução registrada, não uma nova execução em tempo real.
- O BUG-003 permanece pendente de confirmação de requisito.
- A automação cobre os cenários selecionados, não necessariamente todos os critérios CA01–CA11.
- O status do relatório online deve ser confirmado diretamente no link publicado.
- O histórico permanente e um dashboard com métricas comparativas são evoluções distintas da publicação de um relatório HTML.
- A estrutura de pastas descrita neste README deve ser conferida contra o conteúdo real do repositório.

---

## 🗺️ Roadmap

### QA e documentação

- [x] Registrar a estratégia e o escopo.
- [x] Documentar os resultados da execução manual.
- [x] Registrar os defeitos e as ambiguidades identificadas.
- [x] Organizar evidências e dados de teste.
- [ ] Revisar a rastreabilidade completa entre CA01–CA11 e os casos executados.

### Automação e relatórios

- [x] Manter a suíte Playwright em repositório separado.
- [x] Disponibilizar o link do relatório online.
- [ ] Validar e documentar o formato JSON dos resultados.
- [ ] Aprimorar o resumo do GitHub Actions com métricas.
- [ ] Preservar histórico de execução.
- [ ] Construir dashboard com indicadores e comparações históricas.

### Evolução da qualidade

- [ ] Ampliar cenários de fronteira e negativos.
- [ ] Revisar a estabilidade dos testes e possíveis flakiness.
- [ ] Melhorar a gestão de dados de teste.
- [ ] Avaliar novas validações automatizadas com base nos riscos encontrados.
- [ ] Explorar apoio de IA para análise de falhas e manutenção dos testes, mantendo revisão humana.

---

## 👨‍💻 Sobre o projeto

Esta entrega demonstra uma abordagem de QA que combina testes manuais, exploração, automação, análise de regras de negócio e documentação de defeitos.

**Competências demonstradas:**

- Planejamento e modelagem de testes.
- Testes funcionais e exploratórios.
- Testes de API e interface.
- Automação com Playwright e TypeScript.
- BDD com Gherkin.
- Análise de valores de fronteira.
- Registro de defeitos com evidências.
- Rastreabilidade entre critérios de aceitação e casos de teste.
- Integração contínua e relatórios de execução.

**Projeto:** Verzel Store QA  
**Entrega:** VZS-142  
**Automação:** [GitHub — verzel-store-qa-automation](https://github.com/Lucas5497/verzel-store-qa-automation)  
**Relatório online:** [GitHub Pages](https://lucas5497.github.io/verzel-store-qa-automation/)
