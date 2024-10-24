const orderService = require('../services/orderService');

exports.getOrderNumber = (req, res) => {
  orderService.getOrderNumber((err, newOrderNumber) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json({ orderNumber: newOrderNumber });
  });
};
