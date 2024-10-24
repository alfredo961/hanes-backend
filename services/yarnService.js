const db = require('../utils/db');

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

exports.getYarnInventoryWithImages = (filters, callback) => {
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

exports.getTeams = (callback) => {
  db.query('SELECT * FROM teams', (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};
