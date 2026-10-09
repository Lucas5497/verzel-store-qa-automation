# language: pt
Funcionalidade: Frete na interface
  Como cliente da loja
  Quero ver o frete calculado corretamente no carrinho
  Para validar CA06 e CA07 na UI

  Contexto:
    Dado que estou na página de produtos

  @ui @frete @p1 @ct-frt-001
  Cenário: Cobrar frete quando subtotal está abaixo de R$ 200,00 na UI
    Quando eu adiciono o produto "Mochila Urbana 20L" ao carrinho 1 vez
    E eu abro o carrinho
    Então o resumo deve exibir subtotal "R$ 100,00"
    E o resumo deve exibir frete "R$ 19,90"
    E deve aparecer aviso de frete contendo "Faltam"

  @ui @frete @p1 @bug @ct-frt-002
  Cenário: Frete grátis quando subtotal é exatamente R$ 200,00 na UI
    Quando eu adiciono o produto "Mochila Urbana 20L" ao carrinho 2 vezes
    E eu abro o carrinho
    Então o resumo deve exibir subtotal "R$ 200,00"
    E o resumo deve exibir frete "R$ 0,00"
    E o resumo deve exibir total "R$ 200,00"

  @ui @frete @p1 @ct-frt-003
  Cenário: Frete grátis quando subtotal está acima de R$ 200,00 na UI
    Quando eu adiciono o produto "Jaqueta Corta-Vento" ao carrinho 1 vez
    E eu abro o carrinho
    Então o resumo deve exibir subtotal "R$ 229,90"
    E o resumo deve exibir frete "R$ 0,00"
    E o resumo deve exibir total "R$ 229,90"
