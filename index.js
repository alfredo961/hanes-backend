const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./db');
const printer = require('pdf-to-printer');
const { exec } = require('child_process');
const multer = require('multer');
const app = express();
const PORT = 3001;

// Configurar multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json()); // Middleware para analizar JSON
app.use(express.static(path.join(__dirname, 'public')));

// Función para formatear los resultados de la consulta
const formatResults = (results) => {
  return results.map(row => ({
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
};

// Función para obtener el inventario de hilos con imágenes
const getYarnInventoryWithImages = (filters = {}, callback) => {
  let query = `
    SELECT 
      yi.id, yi.cod, yi.item, yi.description, yi.vendor, yi.yarn_type, yi.team_id,
      t.nombre AS team_nombre,
      fh.nombre AS fotosHilosNombre, fh.ruta AS fotosHilosRuta,
      fd.nombre AS fotosDescripcionesHilosNombre, fd.ruta AS fotosDescripcionesHilosRuta
    FROM yarn_inventory yi
    LEFT JOIN teams t ON yi.team_id = t.id
    LEFT JOIN fotos_hilos fh ON yi.id = fh.item_id
    LEFT JOIN fotos_descripciones_hilos fd ON yi.id = fd.item_id
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
    callback(null, formatResults(results));
  });
};

// Rutas
app.get('/getYarnInventory', (req, res) => {
  getYarnInventoryWithImages({}, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
});

app.get('/getYarnByType', (req, res) => {
  const { yarn_type } = req.query;
  if (!yarn_type) {
    return res.status(400).send('Falta el parámetro yarn_type');
  }
  getYarnInventoryWithImages({ yarn_type }, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
});

app.get('/filterYarnInventory', (req, res) => {
  const filters = req.query;
  getYarnInventoryWithImages(filters, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
});

app.get('/getTeams', (req, res) => {
  db.query('SELECT * FROM teams', (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
});

app.get('/getYarnByTeam', (req, res) => {
  const { team_id } = req.query;
  if (!team_id) {
    return res.status(400).send('Falta el parámetro team_id');
  }
  getYarnInventoryWithImages({ team_id }, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
});

const insertPrintOrder = (teamId, callback) => {
  const queryLastOrder = `
    SELECT order_number, order_date
    FROM print_orders
    WHERE order_date = CURDATE()
    ORDER BY id DESC
    LIMIT 1
  `;
  db.query(queryLastOrder, (err, results) => {
    if (err) {
      return callback(err);
    }
    let newOrderNumber = 1;
    if (results.length > 0) {
      const lastOrder = results[0];
      newOrderNumber = lastOrder.order_number + 1;
    }
    const queryInsertOrder = `
      INSERT INTO print_orders (order_number, team_id, order_date)
      VALUES (?, ?, NOW())
    `;
    db.query(queryInsertOrder, [newOrderNumber, teamId], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, newOrderNumber);
    });
  });
};

const printerName = 'Canon E400 series Printer';

app.post('/printOrder', upload.single('file'), async (req, res) => {
  const { teamId } = req.body;
  const filePath = req.file.path;

  if (!filePath || !teamId) {
    return res.status(400).send('Faltan parámetros filePath o teamId');
  }

  try {
    const isAvailable = await isPrinterAvailable(printerName);
    if (!isAvailable) {
      return res.status(500).send('La impresora no está disponible en este momento');
    }

    insertPrintOrder(teamId, (err, orderNumber) => {
      if (err) {
        console.error('Error al insertar la orden de impresión:', err);
        return res.status(500).send('Error al insertar la orden de impresión');
      }
      const printerOptions = {
        printer: printerName,
        monochrome: true
      };
      printer.print(filePath, printerOptions)
        .then(() => {
          res.json({ status: 'success', orderNumber });
        })
        .catch((err) => {
          console.error('Error al imprimir el PDF:', err);
          res.status(500).send('Error al imprimir el PDF');
        });
    });
  } catch (err) {
    console.error('Error al verificar la disponibilidad de la impresora:', err);
    res.status(500).send('Error al verificar la disponibilidad de la impresora');
  }
});

function isPrinterAvailable(printerName) {
  return new Promise((resolve, reject) => {
    exec(`wmic printer where name="${printerName}" get PrinterStatus`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error ejecutando el comando: ${error.message}`);
        return reject(false);
      }
      if (stderr) {
        console.error(`Error en el comando: ${stderr}`);
        return reject(false);
      }
      console.log(`Estado de la impresora ${printerName}: ${stdout}`);
      const status = stdout.includes('3'); // 3 generalmente significa "Idle" (lista para imprimir)
      resolve(status);
    });
  });
}

app.get('/getOrderNumber', (req, res) => {
  const queryLastOrder = `
    SELECT order_number, order_date
    FROM print_orders
    ORDER BY id DESC
    LIMIT 1
  `;
  db.query(queryLastOrder, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    let newOrderNumber = 1;
    const today = new Date().toISOString().split('T')[0];
    if (results.length > 0) {
      const lastOrder = results[0];
      const lastOrderDate = new Date(lastOrder.order_date).toISOString().split('T')[0];
      console.log('Última orden:', lastOrder);
      console.log('Comparando fechas:', lastOrderDate, today);
      if (lastOrderDate === today) {
        newOrderNumber = lastOrder.order_number + 1;
      }
    }
    console.log('Nuevo número de orden:', newOrderNumber);
    res.json({ orderNumber: newOrderNumber });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
