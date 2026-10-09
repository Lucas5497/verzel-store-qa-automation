# language: pt
Funcionalidade: Limite de quantidade por produto via API

  @quantidade @p1 @bug @ct-api-qtd-007
  Cenário: API deve recusar 6 unidades do mesmo produto no cálculo
    Quando eu calculo o carrinho com produto "P003" quantidade 6 sem cupom
    Então a resposta deve indicar recusa por limite de quantidade

  @quantidade @p1 @bug @ct-api-qtd-007-pedido
  Cenário: API deve recusar pedido com 6 unidades do mesmo produto
    Quando eu crio um pedido com produto "P005" quantidade 6 sem cupom
    Então a resposta do pedido deve indicar recusa por limite de quantidade