# language: pt
Funcionalidade: Limite de quantidade na interface
  Como cliente da loja
  Quero ser impedido de adicionar mais de 5 unidades do mesmo produto
  Para validar CA10 na UI

  Contexto:
    Dado que estou na página de produtos

  @ui @quantidade @p1 @ct-qtd-003
  Cenário: UI impede adicionar a 6ª unidade do mesmo produto
    Quando eu adiciono o produto "Tênis Casual Urbano" ao carrinho 5 vezes
    Então o card do produto "Tênis Casual Urbano" deve exibir aviso de limite
    E o botão de adicionar do produto "Tênis Casual Urbano" deve estar desabilitado

  @ui @quantidade @p1 @ct-qtd-002
  Cenário: UI permite adicionar exatamente 5 unidades
    Quando eu adiciono o produto "Boné Aba Curva" ao carrinho 5 vezes
    E eu abro o carrinho
    Então o item "Boné Aba Curva" deve ter quantidade 5 no carrinho
