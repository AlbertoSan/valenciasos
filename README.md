# Mapa Interactivo de Recursos y Puntos de Ayuda para Valencia

Este proyecto es una aplicación web diseñada para mostrar un mapa interactivo que permite localizar puntos de ayuda, recursos y asociaciones en Valencia tras la reciente catástrofe causada por la DANA. La aplicación muestra centros de acopio, refugios, clínicas y otros lugares donde los afectados y voluntarios pueden encontrar o proporcionar ayuda.

## Características

- **Mapa Interactivo:** Visualiza los puntos de ayuda en un mapa centralizado y fácil de navegar.
- **Filtros de Búsqueda:** Filtra los puntos de ayuda por tipo de recurso (alimentos, refugios, asistencia médica).
- **Actualización en Tiempo Real:** Añade, edita o elimina puntos de ayuda con actualizaciones automáticas en el mapa.
- **Detalles de Recursos:** Muestra información detallada de cada punto (dirección, horarios, recursos, contactos).
- **Formulario de Reporte:** Permite a los usuarios agregar nuevos puntos de ayuda de forma rápida y sencilla.
- **Notificaciones:** Recibe alertas sobre cambios importantes en puntos de ayuda.

## Tecnologías Utilizadas

- **Frontend:** [Vue.js](https://vuejs.org/) o [React](https://reactjs.org/) (framework de JavaScript para el desarrollo de interfaces de usuario).
- **Map API:** [Mapbox](https://www.mapbox.com/) o [Leaflet](https://leafletjs.com/) para los mapas interactivos.
- **Backend:** [Node.js](https://nodejs.org/) con [Express](https://expressjs.com/) para la API REST.
- **Base de Datos:** [MongoDB](https://www.mongodb.com/) (con MongoDB Atlas para el despliegue) o [PostgreSQL](https://www.postgresql.org/) con PostGIS para almacenamiento geoespacial.
- **Autenticación (opcional):** Integración con herramientas de autenticación para garantizar acceso seguro.

## Estructura de la Base de Datos

La base de datos almacena los puntos de ayuda con los siguientes campos:

```json
{
  "id": "1",
  "tipo": "refugio",
  "nombre": "Refugio Municipal",
  "ubicacion": { "lat": 39.4699, "lng": -0.3763 },
  "direccion": "Calle Ejemplo 123, Valencia",
  "horario": "24 horas",
  "recursos": ["alimentos", "agua", "ropa"],
  "contacto": "+34 600 123 456",
  "actualizado": "2024-11-01T15:30:00Z"
}