# SolarSense - Proyecto de Grado  
  
SolarSense es una aplicación web diseñada para monitorear datos de radiación solar en tiempo real, visualizar datos históricos y exportarlos en formato CSV. Este proyecto incluye un frontend desarrollado con **Next.js** y un backend construido con **FastAPI**.  
  
---  
  
## **Requisitos Previos**  
  
Antes de comenzar, asegúrate de tener instalados los siguientes programas:  
  
- **Node.js** (versión 16 o superior) - [Descargar aquí](https://nodejs.org/)  
- **Python** (versión 3.8 o superior) - [Descargar aquí](https://www.python.org/)  
- **Git** (opcional, para clonar el repositorio) - [Descargar aquí](https://github.com/EdinsonMoreno/Proyecto_de_grado_-app-.git)  
  
---  
  
## **Estructura del Proyecto**  
  
El proyecto está dividido en dos partes principales:  
  
1. **Frontend**: Ubicado en la carpeta `AppWeb piranometro`.  
2. **Backend**: Ubicado en la carpeta `Backend`.  
  
---  
  
## **Configuración del Backend**  
  
### **1. Instalar Dependencias**  
  
Navega a la carpeta del backend:  
  
```bash  
cd Backend  

Instala las dependencias necesarias utilizando `pip`:

pip install fastapi uvicorn sqlalchemy pydantic  

### **2. Ejecutar el Backend**

Para iniciar el servidor del backend, ejecuta el siguiente comando:

uvicorn Backend_v1:app --reload --host 0.0.0.0 --port 8000  

El backend estará disponible en: [http://localhost:8000](http://localhost:8000)

### **3. Endpoints del Backend**

- **POST `/data/`**: Recibe datos del piranómetro.
- **GET `/data/`**: Recupera datos históricos.
- **GET `/data/average/`**: Calcula promedios de radiación solar.
- **GET `/data/export/`**: Exporta datos en formato CSV.
- **WebSocket `/ws`**: Transmite datos en tiempo real.

---

## **Configuración del Frontend**

### **1. Instalar Dependencias**

Navega a la carpeta del frontend:

cd "AppWeb piranometro"  

Instala las dependencias necesarias utilizando `npm` o `yarn`:

npm install  

### **2. Configurar Variables de Entorno**

En el archivo `next.config.js`, asegúrate de que la URL del backend esté configurada correctamente:

javascript

module.exports = {  
  env: {  
    NEXT_PUBLIC_BACKEND_URL: "http://localhost:8000", // Cambia esto si el backend está en otro dominio o puerto  
  },  
};  

### **3. Ejecutar el Frontend**

Para iniciar el servidor de desarrollo del frontend, ejecuta:

npm run dev  

El frontend estará disponible en: [http://localhost:3000](http://localhost:3000)

---

## **Dependencias del Proyecto**

### **Backend**

- `fastapi`: Framework para construir APIs rápidas y modernas.
- `uvicorn`: Servidor ASGI para ejecutar aplicaciones FastAPI.
- `sqlalchemy`: ORM para manejar la base de datos SQLite.
- `pydantic`: Validación de datos.

### **Frontend**

- `react`: Biblioteca para construir interfaces de usuario.
- `next.js`: Framework para aplicaciones React con renderizado del lado del servidor.
- `tailwindcss`: Framework CSS para estilos rápidos y personalizados.

---

## **Cómo Usar la Aplicación**

1. **Inicia el backend** siguiendo las instrucciones de la sección "Configuración del Backend".
2. **Inicia el frontend** siguiendo las instrucciones de la sección "Configuración del Frontend".
3. Abre el navegador y navega a [http://localhost:3000](http://localhost:3000) para usar la aplicación.

---

## **Funcionalidades Principales**

- **Monitor**: Visualiza datos de radiación solar en tiempo real.
- **Diagnóstico**: Verifica el estado del dispositivo y la conexión.
- **Ubicación**: Muestra un mapa interactivo para configurar la ubicación del panel solar.
- **Educación**: Proporciona información educativa sobre paneles solares.
- **Exportación de Datos**: Descarga datos históricos en formato CSV.

---

## **Notas Adicionales**

- Asegúrate de reemplazar `YOUR_API_KEY` en el archivo `page.jsx` con una clave válida de Google Maps para habilitar la funcionalidad del mapa.
- Si el backend y el frontend están en diferentes dominios o puertos, asegúrate de configurar correctamente CORS en el backend.

---

## **Contacto**

Si tienes preguntas o necesitas ayuda, no dudes en contactarme.

¡Gracias por usar SolarSense!

```
  
