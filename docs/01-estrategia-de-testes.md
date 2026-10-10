# Estratégia de testes — VZS-142 (cupom de desconto e frete grátis)

## 1. Escopo

Validar a entrega **VZS-142, versão 2.3.0** da Verzel Store: os critérios de aceite CA01–CA11, a API (`/produtos`, `/carrinho/calcular`, `/pedidos`), a exibição no carrinho e as regras que já existiam para o pedido (nome com sobrenome, e-mail e CEP).

**Fora do escopo:** testes de carga, estresse e segurança (ambiente compartilhado, regra do teste) e login, cadastro, pagamento online e consulta de pedidos (documentação).

## 2. Abordagem

- **A API é a fonte da verdade.** A documentação diz que o cálculo é feito pela API e a tela só exibe. Por isso as regras de negócio são verificadas direto na API (rápido e determinístico) e a interface é verificada na exibição e no fluxo, comparando o que aparece na tela com a resposta da API.
- **Oráculo independente.** Os valores esperados são calculados à parte, em centavos inteiros (cálculo independente descrito em [`03-dados-de-teste.md`](03-dados-de-teste.md); a suíte Playwright está em [repositório separado](https://github.com/Lucas5497/verzel-store-qa-automation)), sem reaproveitar lógica da aplicação.
- **Dados fixos e nomeados.** Carrinhos-alvo para cada fronteira em [`03-dados-de-teste.md`](03-dados-de-teste.md).
- **Ambiente compartilhado.** Poucos workers e só Chromium; cada teste usa um contexto novo (o carrinho vive na aba), então não há interferência entre testes nem entre candidatos.

## 3. Técnicas

| Técnica | Onde foi aplicada |
|---|---|
| Valor-limite | Frete: R$ 199,90 / 200,00 / 209,40 · Quantidade: 4 / 5 / 6 unidades |
| Partição de equivalência | Cupom: válido, inexistente, expirado · CEP: formatos aceitos × rejeitados |
| Tabela de decisão | Subtotal × cupom → desconto, frete e total (CT-FRT-006, CT-FRT-007) |
| Transição de estados | Aplicar, trocar e remover cupom (CA05) |
| Adivinhação de erros | Caixa e espaços no cupom, ruído de ponto flutuante, contorno do limite pela API |
| Testes exploratórios | 1 sessão documentada, SE-01 ([`reports/teste-exploratorio-SE1.md`](../reports/teste-exploratorio-SE1.md)) |

## 4. Riscos e prioridade

Onde um defeito mais custa e onde as regras mais interagem:

1. **Frete × desconto (CA08/CA09)** — o frete grátis deve usar o subtotal *antes* do desconto: CT-FRT-006 e CT-FRT-007.
2. **Limite de 5 unidades na interface *e* na API (CA10)** — uma camada pode ser contornada pela outra: CT-QTD-003 a 005.
3. **Valores monetários (CA11)** — somas e percentuais em ponto flutuante podem vazar casas decimais: CT-VAL-001.
4. **Normalização do cupom (CA02)** — caixa e espaços: CT-CUP-003.
5. **Diferença entre `/calcular` e `/pedidos`** — o mesmo cupom ruim é 200 num e 422 no outro: CT-CUP-004, 005 e 008.

Os casos **P1** (14) rodam primeiro e são os primeiros candidatos à automação.

## 5. Rastreabilidade: critério de aceite × casos

A matriz abaixo foi reconciliada com o campo **Critério** de cada caso documentado em [`reports/evidencias.md`](../reports/evidencias.md). Os IDs foram mantidos exatamente como aparecem nesse documento; a tabela não presume cobertura que não esteja registrada nas evidências.

| CA | Regra de aceite | Casos documentados em `reports/evidencias.md` |
|---|---|---|
| CA01 | `BEMVINDO10` aplica 10% sobre o subtotal | [CT-CUP-001](../reports/evidencias.md#ct-cup-001--aplicar-cupom-válido), [CT-API-CUP-001](../reports/evidencias.md#ct-api-cup-001--aplicação-de-cupom-válido) |
| CA02 | Código sem distinção de caixa; espaços nas pontas ignorados | [CT-CUP-002](../reports/evidencias.md#ct-cup-002--aplicar-cupom-utilizando-letras-minúsculas), [CT-CUP-003](../reports/evidencias.md#ct-cup-003--aplicar-cupom-com-espaços-no-início), [CT-CUP-004](../reports/evidencias.md#ct-cup-004--aplicar-cupom-com-espaços-no-final), [CT-API-CUP-002](../reports/evidencias.md#ct-api-cup-002--cupom-informado-em-letras-minúsculas), [CT-API-CUP-003](../reports/evidencias.md#ct-api-cup-003--cupom-com-espaços-em-branco) |
| CA03 | Cupom inexistente retorna `Cupom inválido.` | [CT-CUP-005](../reports/evidencias.md#ct-cup-005--aplicar-cupom-inexistente), [CT-API-CUP-004](../reports/evidencias.md#ct-api-cup-004--cupom-inexistente) |
| CA04 | Cupom expirado retorna `Cupom expirado.` | [CT-CUP-006](../reports/evidencias.md#ct-cup-006--aplicar-cupom-expirado), [CT-API-CUP-005](../reports/evidencias.md#ct-api-cup-005--cupom-expirado) |
| CA05 | Um cupom por vez; para trocar, remover o primeiro e aplicar outro | [CT-CUP-007](../reports/evidencias.md#ct-cup-007--tentar-aplicar-segundo-cupom-sem-remover-o-primeiro), [CT-CUP-008](../reports/evidencias.md#ct-cup-008--remover-cupom-e-aplicar-outro) |
| CA06 | Frete grátis a partir de R$ 200,00, inclusive | [CT-FRT-002](../reports/evidencias.md#ct-frt-002--subtotal-exatamente-r-20000), [CT-FRT-003](../reports/evidencias.md#ct-frt-003--subtotal-acima-de-r-20000), [CT-API-FRT-002](../reports/evidencias.md#ct-api-frt-002--limite-exato-para-frete-grátis), [CT-API-FRT-003](../reports/evidencias.md#ct-api-frt-003--subtotal-acima-do-limite-de-frete-grátis) |
| CA07 | Abaixo de R$ 200,00, cobrar R$ 19,90 e informar quanto falta | [CT-FRT-001](../reports/evidencias.md#ct-frt-001--subtotal-abaixo-de-r-20000), [CT-FRT-004](../reports/evidencias.md#ct-frt-004--subtotal-imediatamente-abaixo-do-limite), [CT-FRT-005](../reports/evidencias.md#ct-frt-005--subtotal-significativamente-abaixo-do-limite), [CT-API-FRT-001](../reports/evidencias.md#ct-api-frt-001--subtotal-abaixo-do-limite-de-frete-grátis), [CT-API-FRT-004](../reports/evidencias.md#ct-api-frt-004--limite-imediatamente-abaixo-do-frete-grátis) |
| CA08 | O frete grátis considera o subtotal antes do desconto | [CT-FRT-006](../reports/evidencias.md#ct-frt-006--frete-deve-considerar-subtotal-antes-do-desconto), [CT-API-FRT-005](../reports/evidencias.md#ct-api-frt-005--frete-grátis-baseado-no-subtotal-antes-do-desconto) |
| CA09 | O desconto não incide sobre o frete | [CT-FRT-007](../reports/evidencias.md#ct-frt-007--desconto-não-incide-sobre-o-frete), [CT-API-FRT-006](../reports/evidencias.md#ct-api-frt-006--frete-pago-após-aplicação-do-cupom) |
| CA10 | Máximo de 5 unidades por produto, na UI e na API | [CT-QTD-001](../reports/evidencias.md#ct-qtd-001--adicionar-4-unidades), [CT-QTD-002](../reports/evidencias.md#ct-qtd-002--adicionar-exatamente-5-unidades), [CT-QTD-003](../reports/evidencias.md#ct-qtd-003--tentar-adicionar-6-unidades-pela-interface), [CT-QTD-004](../reports/evidencias.md#ct-qtd-004--solicitar-6-unidades-através-da-api), [CT-QTD-005](../reports/evidencias.md#ct-qtd-005--solicitar-exatamente-5-unidades-através-da-api), [CT-QTD-006](../reports/evidencias.md#ct-qtd-006--comparar-regra-de-quantidade-entre-ui-e-api), [CT-API-QTD-007](../reports/evidencias.md#ct-api-qtd-007--bloqueio-de-quantidade-superior-ao-limite) |
| CA11 | Valores monetários apresentados com duas casas decimais e cálculo consistente | [CT-VAL-001](../reports/evidencias.md#ct-val-001--desconto-com-resultado-de-duas-casas-decimais), [CT-VAL-002](../reports/evidencias.md#ct-val-002--desconto-que-exige-arredondamento), [CT-VAL-003](../reports/evidencias.md#ct-val-003--consistência-dos-valores-do-pedido), [CT-API-VAL-001](../reports/evidencias.md#ct-api-val-001--consistência-dos-valores-monetários) |

**Nota de escopo:** esta matriz reproduz as associações CA–CT registradas em `reports/evidencias.md`. Não foi incluída uma linha genérica para `CT-API-001` ou `CT-PED-01` a `CT-PED-04`, pois esses IDs não aparecem como casos documentados nesse arquivo. Se esses casos existirem em outra fonte, devem ser adicionados após conferência, sem presumir sua cobertura.

## 6. Execução e relato

- **UI:** execução manual com captura de tela por passo relevante (`evidence/<ID>/`).
- **API:** os resultados e as evidências registrados neste projeto estão em [`reports/evidencias.md`](../reports/evidencias.md). O código Playwright fica no [repositório de automação separado](https://github.com/Lucas5497/verzel-store-qa-automation); os comandos devem ser consultados no README daquele repositório.
- **Bugs:** um arquivo por bug em [`bugs/`](../bugs), com a regra violada citada. Antes de reportar, confiro se o comportamento é uma limitação documentada do ambiente ([`02-ambiguidades-e-limitacoes.md`](02-ambiguidades-e-limitacoes.md)).
- **Bug confirmado na automação:** o teste correspondente é marcado como falha esperada (`bugConhecido`), mantendo o pipeline verde e o bug rastreável.
- **Regressão final:** consultar o estado e as instruções de execução no [repositório de automação](https://github.com/Lucas5497/verzel-store-qa-automation). Este repositório documental não possui `package.json` nem suíte local para executar `npm test`.
