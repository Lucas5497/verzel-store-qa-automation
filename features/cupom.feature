# language: pt
Funcionalidade: Cupom de desconto via API

  @cupom @p1 @ct-api-cup-001
  Cenário: Aplicar cupom válido BEMVINDO10
    Quando eu calculo o carrinho com produto "P005" quantidade 1 e cupom "BEMVINDO10"
    Então a resposta deve ter status 200
    E o cupom deve estar aplicado
    E o subtotal deve ser 100.00
    E o desconto deve ser 10.00
    E o total deve ser consistente com subtotal, desconto e frete

  @cupom @p1 @ct-api-cup-004
  Cenário: Rejeitar cupom inexistente no cálculo
    Quando eu calculo o carrinho com produto "P005" quantidade 1 e cupom "CUPOMINEXISTENTE"
    Então a resposta deve ter status 200
    E o cupom não deve estar aplicado
    E a mensagem do cupom deve conter "inválido"
    E o desconto deve ser 0.00