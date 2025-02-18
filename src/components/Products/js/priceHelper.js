/**
 * Formatea un número a formato de moneda MXN
 * @param {number} price - El precio a formatear
 * @returns {string} El precio formateado en formato MXN
 */
export const formattedPrice = (price) => {
  return price.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });
}; 