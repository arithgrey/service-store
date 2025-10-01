/**
 * Helper para obtener estadísticas de entregas
 * Responsabilidad única: Manejo de datos de estadísticas de entregas
 */

/**
 * Obtiene las estadísticas de entregas desde la API
 * @param {Object} axiosInstance - Instancia de axios configurada
 * @param {Object} params - Parámetros opcionales { start_date, end_date }
 * @returns {Promise<Object>} - Objeto con las estadísticas { 'YYYY-MM-DD': count }
 */
export async function fetchDeliveryStats(axiosInstance, params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.start_date) {
      queryParams.append('start_date', params.start_date);
    }
    
    if (params.end_date) {
      queryParams.append('end_date', params.end_date);
    }
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `enid/orden/delivery-stats/?${queryString}` 
      : 'enid/orden/delivery-stats/';
    
    const response = await axiosInstance.get(url);
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    
    return {};
  } catch (error) {
    console.error('Error fetching delivery stats:', error);
    throw error;
  }
}

/**
 * Obtiene el número de entregas para una fecha específica
 * @param {Object} stats - Objeto de estadísticas
 * @param {String} date - Fecha en formato 'YYYY-MM-DD'
 * @returns {Number} - Número de entregas
 */
export function getDeliveriesForDate(stats, date) {
  return stats[date] || 0;
}

/**
 * Formatea el rango de fechas para la API
 * @param {Object} momentDate - Objeto moment con la fecha
 * @param {Number} monthsToAdd - Número de meses a agregar (0 = mes actual, 1 = siguiente mes)
 * @returns {Object} - { start_date, end_date }
 */
export function getDateRangeForMonth(momentDate, monthsToAdd = 0) {
  const targetMonth = momentDate.clone().add(monthsToAdd, 'months');
  const startDate = targetMonth.clone().startOf('month').format('YYYY-MM-DD');
  const endDate = targetMonth.clone().endOf('month').format('YYYY-MM-DD');
  
  return { start_date: startDate, end_date: endDate };
}

/**
 * Combina estadísticas de múltiples rangos de fechas
 * @param {Array<Object>} statsArray - Array de objetos de estadísticas
 * @returns {Object} - Estadísticas combinadas
 */
export function mergeStats(...statsArray) {
  return statsArray.reduce((merged, stats) => {
    return { ...merged, ...stats };
  }, {});
} 