const db = require('../utils/db');
const printer = require('pdf-to-printer');

exports.printerName = 'Canon E400 series Printer';

exports.insertPrintOrder = (teamId, callback) => {
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

exports.printFile = (filePath, orderNumber, res) => {
    const printerOptions = {
      printer: this.printerName,
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
  };
  