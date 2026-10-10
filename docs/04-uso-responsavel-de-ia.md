# Uso de Inteligência Artificial no Projeto de QA — Verzel Store

## 1. Objetivo do uso de IA

Durante a execução deste projeto, utilizei ferramentas de Inteligência Artificial como apoio ao processo de Quality Assurance (QA), buscando aumentar a produtividade, organizar as informações, ampliar a cobertura das análises e acelerar a construção dos artefatos de teste.

A IA foi utilizada como uma ferramenta auxiliar, e não como substituta do trabalho do QA. **As sugestões, análises, casos de teste, documentos e códigos gerados com seu apoio passaram pela avaliação e validação humana**, considerando os requisitos disponíveis, o comportamento real da aplicação e as evidências obtidas durante a execução dos testes.

## 2. Onde e como utilizei a IA

### 2.1. Análise e interpretação de requisitos

Utilizei a IA para apoiar a análise dos critérios de aceitação, organizar regras de negócio e identificar possíveis cenários positivos, negativos, limites e inconsistências entre o comportamento esperado e o comportamento observado.

O objetivo foi transformar os requisitos em pontos verificáveis e levantar questões que mereciam investigação durante os testes.

**Validação humana:** revisei as sugestões considerando os critérios documentados, o contexto funcional e o comportamento observado na aplicação e na API. Quando havia ambiguidades ou ausência de definição suficiente, tratei o ponto como uma limitação ou necessidade de esclarecimento, em vez de assumir que a interpretação sugerida pela IA era necessariamente correta.

### 2.2. Modelagem e escrita dos casos de teste

Utilizei a IA como apoio para estruturar cenários e casos de teste, organizar pré-condições, dados de entrada, passos, resultados esperados, prioridades e técnicas de teste.

Esse apoio contribuiu para sistematizar a cobertura dos critérios de aceitação e considerar diferentes combinações de dados, limites e comportamentos entre a interface e a API.

**Validação humana:** avaliei a pertinência de cada caso, sua relação com os requisitos e a viabilidade de execução. Os casos foram ajustados conforme necessário, e os resultados esperados foram confrontados com as regras documentadas, sem tratar o conteúdo gerado pela IA como uma especificação oficial.

### 2.3. Organização da documentação e das evidências

Utilizei a IA para auxiliar na estruturação e padronização dos documentos do projeto, incluindo estratégia de testes, matriz de cenários e casos de teste, registros de execução, documentação de defeitos, evidências e relatório de testes exploratórios.

O objetivo foi manter os artefatos mais claros, consistentes e fáceis de consultar por recrutadores, avaliadores e outros profissionais de QA.

**Validação humana:** revisei o conteúdo para preservar a rastreabilidade entre requisito, cenário, execução, resultado e defeito. Os registros de execução e as conclusões técnicas precisaram estar fundamentados no que foi efetivamente observado ou coletado. A IA não foi considerada fonte de evidências nem utilizada para inventar resultados, capturas de tela ou comportamentos da aplicação.

### 2.4. Desenvolvimento da automação de testes

Utilizei a IA como apoio à escrita, revisão e organização do código de automação com Playwright, TypeScript e Gherkin, incluindo a estruturação de testes, implementação de passos, organização do projeto e sugestões para execução local e integração contínua.

Também recorri a esse apoio para analisar problemas de implementação e considerar formas de tornar a suíte mais legível, reutilizável e fácil de manter.

**Validação humana:** revisei o código, executei os testes no ambiente disponível e avaliei os resultados produzidos. A geração de código não foi considerada garantia de funcionamento ou de cobertura adequada. A automação precisou ser verificada por meio da execução e da análise dos resultados, com atenção a falhas, falsos positivos, falsos negativos e limitações do ambiente.

### 2.5. Análise de defeitos e sugestões de melhoria

Utilizei a IA para ajudar a organizar observações, estruturar descrições de defeitos, melhorar a clareza dos relatos e levantar hipóteses e sugestões de melhoria para a aplicação e para o próprio processo de testes.

Esse apoio também ajudou a refletir sobre a consistência entre interface e API, a cobertura dos cenários críticos e a qualidade da documentação entregue.

**Validação humana:** as hipóteses foram tratadas como pontos a investigar, não como defeitos confirmados automaticamente. A classificação de um comportamento como defeito dependeu da comparação com os requisitos, da reprodução do problema e da análise das evidências disponíveis. Quando não havia critério suficiente para uma conclusão definitiva, a incerteza foi registrada.

## 3. Princípios adotados no uso da IA

Durante o projeto, procurei seguir os seguintes princípios:

- **Responsabilidade humana:** as decisões de QA, a avaliação dos resultados e a conclusão sobre os defeitos permaneceram sob responsabilidade humana.
- **Validação antes da entrega:** conteúdos e códigos sugeridos pela IA foram revisados e, quando aplicável, testados antes de serem incorporados ao projeto.
- **Evidências reais:** resultados, falhas e conclusões deveriam refletir a execução efetiva dos testes, e não suposições produzidas pela IA.
- **Rastreabilidade:** os artefatos foram organizados para relacionar requisitos, casos de teste, resultados e defeitos.
- **Transparência:** o uso da IA foi declarado, sem apresentar conteúdo gerado automaticamente como se fosse integralmente produzido sem assistência.
- **Pensamento crítico:** sugestões da IA foram avaliadas de acordo com o contexto, as regras de negócio e os riscos envolvidos.

## 4. Limitações e responsabilidade do QA

A IA pode acelerar atividades repetitivas, ajudar a explorar possibilidades e contribuir para a produção de código e documentação. Entretanto, também pode gerar interpretações incorretas, cenários irrelevantes, código defeituoso ou conclusões sem evidências suficientes.

Por esse motivo, **a IA não substitui a validação humana do QA em nenhuma etapa crítica do processo**. Ela não deve ser considerada autoridade sobre os requisitos, não comprova por conta própria que um teste passou ou falhou e não elimina a necessidade de julgamento técnico, execução, análise de evidências e avaliação de riscos.

O papel do QA continua sendo compreender o contexto, questionar premissas, verificar o comportamento real do sistema e assumir a responsabilidade pelas conclusões e recomendações apresentadas.

## 5. Resultado esperado da abordagem

O uso da IA teve como finalidade apoiar a produtividade, a organização e a qualidade dos artefatos, liberando mais tempo para atividades que exigem análise crítica, investigação e tomada de decisão.

A abordagem adotada foi, portanto, **IA como copiloto; QA humano como responsável pela validação e pelas decisões**. A qualidade da entrega não foi atribuída à geração automática de conteúdo, mas à combinação entre assistência da IA, conhecimento técnico, execução dos testes e validação humana.