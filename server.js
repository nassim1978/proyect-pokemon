const jsonServer = require('json-server');
const cors = require('cors'); // Importar el paquete cors
const fs = require('fs');
const restoreData = require('./restore-data'); // Importar la función restoreData
const server = jsonServer.create();
const router = jsonServer.router('pokemon-data.json'); // Archivo JSON que contiene los datos
const middlewares = jsonServer.defaults();
// Configurar CORS para permitir solicitudes desde http://localhost:4200

server.use(cors({ origin: 'http://localhost:4200' }));

// Middleware para restaurar los datos automáticamente al iniciar el servidor
// server.use((req, res, next) => {
//   if (req.method === 'POST' && req.url === '/restore-data') {
//     restoreData();
//     res.status(200).send('Datos restaurados correctamente');
//   } else {
//     next(); // Continuar con la siguiente operación
//   }
// });
server.post('/restore-data', (req, res) => {
  try {
    restoreData(); // Llamar a la función para restaurar los datos
    res.status(200).send('Datos restaurados correctamente');
  } catch (error) {
    console.error('Error al restaurar los datos:', error);
    res.status(500).send('Error al restaurar los datos');
  }
});


// Usar middlewares predeterminados de JSON Server
server.use(middlewares);

// Usar el enrutador de JSON Server
server.use(router);

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
  console.log('JSON Server está ejecutándose en http://localhost:3000');
});
