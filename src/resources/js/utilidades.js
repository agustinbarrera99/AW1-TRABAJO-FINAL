const ENTIDADES_HTML = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const formatearPrecio = valor => `$${valor.toLocaleString('es-AR')}`;

export const escaparHTML = texto => String(texto).replace(/[&<>"']/g, caracter => ENTIDADES_HTML[caracter]);