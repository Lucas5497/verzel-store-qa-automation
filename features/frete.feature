# language: pt
Funcionalidade: Cálculo de frete via API

  @frete @p1 @ct-api-frt-001
  Cenário: Cobrar frete quando subtotal está abaixo de R$ 200,00
    Quando eu calculo o carrinho com produto "P005" quantidade 1 sem cupom
    Então a resposta deve ter status 200
    E o subtotal deve ser 100.00
    E o frete deve ser 19.90
    E o frete grátis deve ser falso

  @frete @p1 @bug @ct-api-frt-002
  Cenário: Frete grátis quando subtotal é exatamente R$ 200,00
    Quando eu calculo o carrinho com produto "P005" quantidade 2 sem cupom
    Então a resposta deve ter status 200
    E o subtotal deve ser 200.00
    E o frete deve ser 0.00
    E o frete grátis deve ser verdadeiro
    E o total deve ser 200.00

  @frete @p1 @ct-api-frt-005
  Cenário: Frete grátis considera subtotal antes do desconto e desconto não incide sobre frete
    Quando eu calculo o carrinho com produto "P005" quantidade 3 e cupom "BEMVINDO10"
    Então a resposta deve ter status 200
    E o subtotal deve ser 300.00
    E o desconto deve ser 30.00
    E o frete deve ser 0.00
    E o total deve ser 270.00