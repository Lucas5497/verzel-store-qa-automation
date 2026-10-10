# Verzel Store — Testes de QA

> **Teste técnico:** QA Júnior — Verzel  
> **Entrega avaliada:** VZS-142 — cupons de desconto e frete grátis  
> **Ambiente:** [Verzel Store](https://verzel-store.qa-test-verzel-store.workers.dev/) · [Documentação da aplicação](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao) · [API](https://verzel-store.qa-test-verzel-store.workers.dev/api)

Este repositório reúne a estratégia, os dados de teste, os casos executados, as evidências, o relatório de execução e os registros de defeitos. A documentação distingue os resultados observados, as limitações do ambiente e as dúvidas de requisito ainda não resolvidas.

## Navegação

- [Estratégia de testes](docs/01-estrategia-de-testes.md)
- [Ambiguidades e limitações](docs/02-ambiguidades-e-limitacoes.md)
- [Dados de teste](docs/03-dados-de-teste.md)
- [Relatório de execução](reports/execucao-dos-testes.md)
- [Evidências detalhadas](reports/evidencias.md)
- [Sessão exploratória SE-01](reports/teste-exploratorio-SE1.md)
- [Matriz de cenários e casos de teste (Excel)](reports/Verzel_Matriz_Cenarios_Casos_de_Testes.xlsx)
- [Índice de evidências](evidence/README.md)
- [BUG-001 — Frete no subtotal exato de R$ 200,00](bugs/BUG-001.md)
- [BUG-002 — Limite de unidades na API](bugs/BUG-002.md)
- [BUG-003 — Validação de existência do CEP (pendente de requisito)](bugs/BUG-003.md)

## Escopo

A validação cobre os critérios de aceite CA01–CA11, com foco em cupons, frete grátis, interação entre desconto e frete, limite de cinco unidades por produto, valores monetários e validações existentes no checkout. Testes de carga, estresse e segurança, login, cadastro, pagamento online e consulta de pedidos estão fora do escopo conforme a documentação do projeto.

## Resultado registrado

O relatório de execução registra **37 casos estruturados**:

| Status registrado | Quantidade |
|---|---:|
| Passou | 24 |
| Falhou | 5 |
| Passou com ressalva / ambiguidade | 3 |
| Bloqueado | 5 |
| **Total** | **37** |

Esses números representam os status documentados, não significam que todos os critérios foram aprovados. Consulte [execução dos testes](reports/execucao-dos-testes.md) e [evidências](reports/evidencias.md) para os resultados por caso.

## Defeitos e pendências

| Registro | Situação documentada | Referência |
|---|---|---|
| BUG-001 | Frete de R$ 19,90 é cobrado quando o subtotal é exatamente R$ 200,00; observado na UI e na API | [Relatório](bugs/BUG-001.md) |
| BUG-002 | API aceita quantidades acima de cinco unidades, contornando o limite observado na UI | [Relatório](bugs/BUG-002.md) |
| BUG-003 | A validação da existência do CEP depende de confirmação do requisito; não está classificado como defeito confirmado | [Registro exploratório](bugs/BUG-003.md) |

## Automação

A automação Playwright está em um repositório separado: [Lucas5497/verzel-store-qa-automation](https://github.com/Lucas5497/verzel-store-qa-automation). Este repositório contém a documentação e as evidências de QA; não contém uma pasta local `playwright/` nem um `package.json` próprio para executar a suíte. Consulte o repositório de automação para instruções e execução. O [relatório publicado](https://lucas5497.github.io/verzel-store-qa-automation/) também está referenciado na documentação da sessão exploratória.

## Como reproduzir uma validação manual

1. Acesse a [loja de teste](https://verzel-store.qa-test-verzel-store.workers.dev/).
2. Consulte a [documentação da aplicação](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao) e a seção “Sobre este ambiente”.
3. Selecione um caso em [execução](reports/execucao-dos-testes.md) ou [evidências](reports/evidencias.md).
4. Prepare os dados descritos no caso e siga os passos registrados.
5. Compare o resultado observado com o esperado e consulte as capturas vinculadas.

## Estrutura

```text
.
├── README.md
├── bugs/       # registros de defeitos e template
├── docs/       # estratégia, ambiguidades e dados de teste
├── evidence/   # capturas organizadas por caso, bug e sessão
└── reports/    # execução, evidências, sessão exploratória e planilha
```

**Princípio da documentação:** não presumir cobertura ou resultado sem registro; quando a evidência é insuficiente ou o requisito é ambíguo, isso permanece explícito.
