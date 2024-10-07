const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const db = require('./db');

// Configurar CORS
app.use(cors());

// Configurar encabezados de seguridad
app.use(helmet());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Función para obtener los datos de yarn_inventory con las rutas de las imágenes
const getYarnInventoryWithImages = (filters = {}, callback) => {
  let query = `
    SELECT 
      yi.id, yi.cod, yi.item, yi.description, yi.vendor, yi.yarn_type,
      fh.nombre AS fotosHilosNombre, fh.ruta AS fotosHilosRuta,
      fd.nombre AS fotosDescripcionesHilosNombre, fd.ruta AS fotosDescripcionesHilosRuta
    FROM yarn_inventory yi
    LEFT JOIN fotosHilos fh ON yi.id = fh.item_id
    LEFT JOIN fotosDescripcionesHilos fd ON yi.id = fd.item_id
    WHERE 1=1
  `;
  const queryParams = [];

  Object.keys(filters).forEach((key) => {
    query += ` AND yi.${key} = ?`;
    queryParams.push(filters[key]);
  });

  db.query(query, queryParams, (err, results) => {
    if (err) {
      return callback(err);
    }

    const formattedResults = results.map(row => ({
      id: row.id,
      cod: row.cod,
      item: row.item,
      description: row.description,
      vendor: row.vendor,
      yarn_type: row.yarn_type,
      fotosHilos: {
        nombre: row.fotosHilosNombre || '',
        ruta: row.fotosHilosRuta || ''
      },
      fotosDescripcionesHilos: {
        nombre: row.fotosDescripcionesHilosNombre || '',
        ruta: row.fotosDescripcionesHilosRuta || ''
      }
    }));

    callback(null, formattedResults);
  });
};

// Ruta para obtener todos los datos de yarn_inventory con las rutas de las imágenes
app.get('/getYarnInventory', (req, res) => {
  getYarnInventoryWithImages({}, (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
});

// Ruta para filtrar por yarn_type
app.get('/getYarnByType', (req, res) => {
  const yarnType = req.query.yarn_type;
  if (!yarnType) {
    return res.status(400).send('Falta el parámetro yarn_type');
  }

  getYarnInventoryWithImages({ yarn_type: yarnType }, (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
});

// Ruta para filtrar dinámicamente por cualquier columna
app.get('/filterYarnInventory', (req, res) => {
  const filters = req.query;

  getYarnInventoryWithImages(filters, (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
});

app.listen(3001, () => {
  console.log('Servidor escuchando en el puerto 3001');
});
