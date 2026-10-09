# language: pt
Funcionalidade: Cupom de desconto na interface
  Como cliente da loja
  Quero aplicar cupons no carrinho pela UI
  Para validar CA01 e CA03 na camada de apresentação

  Contexto:
    Dado que estou na página de produtos

  @ui @cupom @p1 @ct-cup-001
  Cenário: Aplicar cupom válido BEMVINDO10 na UI
    Quando eu adiciono o produto "Mochila Urbana 20L" ao carrinho 1 vez
    E eu abro o carrinho
    E eu aplico o cupom "BEMVINDO10" na interface
    Então o resumo deve exibir desconto "R$ 10,00"
    E o resumo deve exibir subtotal "R$ 100,00"
    E deve aparecer a mensagem de cupom aplicado

  @ui @cupom @p1 @ct-cup-005
  Cenário: Rejeitar cupom inexistente na UI
    Quando eu adiciono o produto "Mochila Urbana 20L" ao carrinho 1 vez
    E eu abro o carrinho
    E eu aplico o cupom "CUPOMINEXISTENTE" na interface
    Então deve aparecer a mensagem de cupom inválido
    E o resumo deve exibir desconto "R$ 0,00"
