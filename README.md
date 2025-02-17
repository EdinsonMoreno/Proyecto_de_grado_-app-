SolarSense
SolarSense es un sistema diseñado para monitorear y analizar la radiación solar utilizando un piranómetro, un Arduino Uno, y una tarjeta Wi-Fi como intermediario. Este sistema permite recopilar datos en tiempo real, almacenarlos en una base de datos y visualizarlos a través de una interfaz web. Además, incluye un controlador PID para orientar el piranómetro hacia la posición óptima, maximizando la captación de radiación solar.

Características Principales
Monitoreo en Tiempo Real: Recopilación de datos de radiación solar en tiempo real mediante un piranómetro.
Control Automático: Uso de un controlador PID para ajustar la posición del piranómetro con motores paso a paso.
Análisis de Datos: Almacenamiento de datos históricos para generar gráficos y análisis de radiación solar por días, semanas y meses.
Exportación de Datos: Posibilidad de exportar los datos históricos en formato CSV.
Interfaz Web: Frontend interactivo para visualizar datos, diagnosticar el sistema y gestionar la ubicación del dispositivo.
Educación Solar: Contenido educativo sobre instalación y mantenimiento de paneles solares.
Arquitectura del Sistema
El sistema está compuesto por los siguientes componentes:

Arduino Uno:
Recibe datos del piranómetro.
Controla los motores paso a paso para orientar el piranómetro.
Envía datos al backend y recibe comandos desde este.
Backend:
Desarrollado con FastAPI.
Almacena datos en una base de datos SQLite.
Proporciona endpoints para la comunicación con el frontend y el Arduino.
Transmite datos en tiempo real mediante WebSocket.
Frontend:
Desarrollado con React y TailwindCSS.
Visualiza datos en tiempo real e históricos.
Permite gestionar la ubicación del dispositivo mediante un mapa interactivo.
Incluye herramientas de diagnóstico y exportación de datos.
Mejoras y Correcciones Implementadas
Arduino
Calibración del Piranómetro:
Conversión de la señal analógica (0-2V) a valores de radiación solar (W/m²).
Optimización de la Orientación:
Implementación de lógica para ajustar automáticamente la posición del piranómetro hacia la máxima radiación.
Protocolo de Comunicación:
Envío de datos al backend en formato JSON.
Recepción de comandos para ajustar la posición y parámetros PID.
Backend
Nuevos Endpoints:
Guardar ubicación: Permite almacenar la ubicación del dispositivo.
Obtener ubicación: Recupera la ubicación almacenada.
Enviar comandos al Arduino: Endpoint para enviar instrucciones al Arduino.
Cálculos Reales:
Promedios diarios, mensuales y anuales basados en los datos almacenados.
WebSocket:
Transmisión de datos en tiempo real desde el Arduino al frontend.
Estructura Modular:
Fragmentación del backend en módulos para mejorar la organización y el mantenimiento.
Frontend
Integración con el Backend:
Conexión a los endpoints para obtener datos históricos, guardar ubicación y enviar comandos.
Uso de WebSocket para mostrar datos en tiempo real.
Gráficos Mejorados:
Visualización de datos históricos con gráficos dinámicos.
Mapa Interactivo:
Gestión de la ubicación del dispositivo con Leaflet.
Manejo de Errores:
Notificaciones para errores en la API y mensajes de carga.
Contenido Educativo:
Guías sobre instalación y mantenimiento de paneles solares.
Requisitos del Sistema
Hardware
Arduino Uno.
Tarjeta Wi-Fi para Arduino.
Piranómetro con salida analógica (0-2V).
Motores paso a paso para control de orientación.
Software
Python 3.9 o superior.
Node.js 16 o superior.
FastAPI.
React.
SQLite.
Instalación
1. Clonar el Repositorio
bash
Copy Code
git clone <URL_DELPOSITORIO>
cd SolarSense
2. Configurar el Backend
Crear un entorno virtual:
bash
Copy Code
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
Instalar dependencias:
bash
Copy Code
pip install -r requirements.txt
Iniciar el servidor:
bash
Copy Code
uvicorn backend.main:app --reload
3. Configurar el Frontend
Instalar dependencias:
bash
Copy Code
cd AppWeb\piranometro
npm install
Iniciar el servidor de desarrollo:
bash
Copy Code
npm run dev
4. Configurar el Arduino
Subir el código del archivo PIDMotorDCCodigo.ino al Arduino.
Conectar el piranómetro y los motores paso a paso según el esquema.
Uso
Acceder al frontend en http://localhost:3000.
Visualizar datos en tiempo real y gráficos históricos.
Diagnosticar el estado del sistema y gestionar la ubicación.
Exportar datos históricos en formato CSV.
Pruebas
1. Comunicación con el Arduino
Verificar que el Arduino envíe datos al backend y reciba comandos correctamente.
2. Backend
Probar todos los endpoints con herramientas como Postman.
Verificar cálculos de promedios y exportación de datos.
3. Frontend
Probar la visualización de datos en tiempo real e históricos.
Verificar la funcionalidad del mapa interactivo.
Contribuciones
Las contribuciones son bienvenidas. Por favor, sigue los pasos a continuación:

Crea un fork del repositorio.
Realiza tus cambios en una rama nueva.
Envía un pull request con una descripción detallada de los cambios.
Licencia
Este proyecto está protegido por derechos de autor. Consulta el archivo LICENSE para más detalles.

Autores
Edinson Moreno - Desarrollador Principal.
Saray Santos - Desarrollador de Diseño.
Azael Salas - Desarrollador Backend.
Unidades Tecnológicas de Santander (UTS) - Institución Académica.
Contacto
Para consultas o soporte, por favor contacta a:

Correo Electrónico: [Email](eandresmoreno@uts.edu.co)
