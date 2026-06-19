// frontend/src/utils/dateHelpers.ts

/**
 * Convierte una fecha a formato ISO (YYYY-MM-DD) usando hora LOCAL.
 * IMPORTANTE: Evita el bug del día anterior por zonas horarias.
 * 
 * @example toISODate("2024-03-15T00:00:00") → "2024-03-15"
 * @example toISODate(new Date(2024, 2, 15)) → "2024-03-15"
 */
export const toISODate = (fecha: string | Date): string => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  
  // Usar métodos locales para evitar desplazamiento UTC
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Formato corto para tarjetas y listas.
 * Ejemplo: "15 mar 2024"
 */
export const formatDateShort = (fecha: string | Date): string => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Formato largo para títulos de modales y cabeceras.
 * Ejemplo: "lunes, 15 de marzo de 2024"
 */
export const formatDateLong = (fecha: string | Date): string => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formato para inputs de tipo date.
 * Ejemplo: "2024-03-15"
 */
export const formatDateForInput = (fecha: string | Date): string => {
  return toISODate(fecha);
};

/**
 * Formato DD/MM/YYYY para ciertos contextos (ej: ExamenModal).
 * Ejemplo: "15/03/2024"
 */
export const formatDateDMY = (fecha: string | Date): string => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Valida si una fecha es válida
 */
export const isValidDate = (fecha: string | Date): boolean => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return !isNaN(date.getTime());
};