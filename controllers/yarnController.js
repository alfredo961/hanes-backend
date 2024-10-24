const yarnService = require('../services/yarnService');

exports.getYarnInventory = (req, res) => {
  yarnService.getYarnInventoryWithImages({}, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
};

exports.getYarnByType = (req, res) => {
  const { yarn_type } = req.query;
  if (!yarn_type) {
    return res.status(400).send('Falta el parámetro yarn_type');
  }
  yarnService.getYarnInventoryWithImages({ yarn_type }, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
};

exports.filterYarnInventory = (req, res) => {
  const filters = req.query;
  yarnService.getYarnInventoryWithImages(filters, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
};

exports.getTeams = (req, res) => {
  yarnService.getTeams((err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
};

exports.getYarnByTeam = (req, res) => {
  const { team_id } = req.query;
  if (!team_id) {
    return res.status(400).send('Falta el parámetro team_id');
  }
  yarnService.getYarnInventoryWithImages({ team_id }, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
};
