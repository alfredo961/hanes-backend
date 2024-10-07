
# Hanes Backend 

**¿Qué es el backend?**

El backend es la parte de una aplicación o sitio web que maneja la lógica, las bases de datos, la autenticación de usuarios y otras operaciones que no son visibles para el usuario final. Es esencialmente el "cerebro" detrás de la interfaz de usuario (frontend).

Los componentes clave del backend son:

1. **Servidor**: Maneja las solicitudes de los usuarios y envía las respuestas adecuadas.
2. **Base de datos**: Almacena y gestiona los datos que la aplicación necesita.
3. **API (Interfaz de Programación de Aplicaciones)**: Permite la comunicación entre diferentes partes de la aplicación o con servicios externos.
4. **Lógica de negocio**: Define cómo se procesan y gestionan los datos.

## Componentes 
- **Servidor**: 
En este caso, estamos usando Node.js para manejar las solicitudes y respuestas. Ademas se está utilizando el framework Express.js para facilitar la creación de rutas y manejar las peticiones HTTP.

- **Base de datos**: 
Se está usando MySQL para almacenar y gestionar los datos. Ademas se está usando un controlador de MySQL para Node.js, el cual es mysql2, para conectarse y realizar operaciones en la base de datos.

- **API (Interfaz de Programación de Aplicaciones)**: 
Estas APIs permiten que el frontend o cualquier otro cliente como una aplicación móvil, se comunique con el servidor para obtener datos. Actualmente se han trabajado 2 apis, las cuales son:
1. /getYarnInventory
2. /filterYarnInventory?yarn_type=Blend  
    
  
- **Lógica de negocio**: 
Este es el código que define cómo se procesan y gestionan los datos. La lógica de negocio es bastante simple: se ejecuta una consulta SQL y se devuelven los resultados. En este código la lógica se encuentra principalmente en la función __getYarnInventoryWithImages__. Esta función se encarga de procesar y gestionar los datos que se obtienen de la base de datos.  
  


## ¿Como ejecutar el backend?

1. Clonar el proyecto desde:
https://github.com/alfredo961/hanes-backend/tree/main 

2. Abrir la carpeta del proyecto llamada: **backend-hanes** en un editor de código como Visual Studio Code (VS Code).

3. Instalar las dependencias:
```
npm install
```
4. Configura la base de datos:
Asegúrate de tener MySQL instalado y ejecutándose.

4. En la terminal de VS Code, ingresar el comando: 
**nodemon index.js** y automáticamente el proyecto se conectará localmente en el puerto 3001.
Para comprobar que está conectado correctamente, puede ingresar esta url a un navegador web (Google Chrome, Microsoft Edge, Safari, etc):  
http://localhost:3001/
  
El servidor estará escuchando en http://localhost:3001. Con esto ya se pueden realizar consultas a la API. 

## Guía para Probar APIs en Postman

### Paso 1: Instalar Postman
Si aún no tienes Postman instalado, puedes descargarlo e instalarlo desde aquí: https://www.postman.com/downloads/.

### Paso 2: Abrir Postman y Crear una Nueva Colección
1. Abre Postman.
2. Haz clic en el botón **"New"** y selecciona **"Collection"**.
3. Nombra tu colección, por ejemplo, "Inventario Hilos API".

### Paso 3: Crear una Nueva Solicitud
1. Dentro de tu colección, haz clic en **"Add Request"**.
2. Nombra tu solicitud, por ejemplo, "obtenerListaHilos".

### Paso 4: Configurar la Solicitud GET para `/getYarnInventory`
1. Selecciona el método **GET**.
2. En el campo de URL, ingresa `http://localhost:3001/getYarnInventory`.
3. Haz clic en **"Send"** para enviar la solicitud.

### Paso 5: Verificar la Respuesta
1. En la sección de **"Response"** de Postman, deberías ver los datos devueltos por tu API en formato JSON.
2. La respuesta debería contener todos los registros de `yarn_inventory` junto con las rutas de las imágenes.


