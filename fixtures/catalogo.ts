/** Catálogo oficial VZS-142 — preços em centavos para evitar float. */
export const CATALOGO = {
  P001: { id: 'P001', nome: 'Camiseta Essencial', precoCentavos: 5990 },
  P002: { id: 'P002', nome: 'Calça Jeans Slim', precoCentavos: 13990 },
  P003: { id: 'P003', nome: 'Tênis Casual Urbano', precoCentavos: 18990 },
  P004: { id: 'P004', nome: 'Boné Aba Curva', precoCentavos: 4990 },
  P005: { id: 'P005', nome: 'Mochila Urbana 20L', precoCentavos: 10000 },
  P006: { id: 'P006', nome: 'Kit 3 Pares de Meias', precoCentavos: 2990 },
  P007: { id: 'P007', nome: 'Jaqueta Corta-Vento', precoCentavos: 22990 },
  P008: { id: 'P008', nome: 'Garrafa Térmica 750ml', precoCentavos: 5000 },
} as const;

export type ProdutoId = keyof typeof CATALOGO;

export const CUPONS = {
  VALIDO: 'BEMVINDO10',
  VALIDO_MIN: 'bemvindo10',
  EXPIRADO: 'VERAO2026',
  INEXISTENTE: 'CUPOMINEXISTENTE',
} as const;

export const FRETE_CENTAVOS = 1990;
export const LIMITE_FRETE_GRATIS_CENTAVOS = 20000;
export const LIMITE_QTD_POR_PRODUTO = 5;
export const DESCONTO_BEMVINDO_PERCENT = 10;
