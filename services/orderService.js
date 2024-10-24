const db = require('../utils/db');

exports.getOrderNumber = (callback) => {
  const queryLastOrder = `
    SELECT order_number, order_date
    FROM print_orders
    ORDER BY id DESC
    LIMIT 1
  `;
  db.query(queryLastOrder, (err, results) => {
    if (err) {
      return callback(err);
    }
    let newOrderNumber = 1;
    const today = new Date().toISOString().split('T')[0];
    if (results.length > 0) {
      const lastOrder = results[0];
      const lastOrderDate = new Date(lastOrder.order_date).toISOString().split('T')[0];
      if (lastOrderDate === today) {
        newOrderNumber = lastOrder.order_number + 1;
      }
    }
    callback(null, newOrderNumber);
  });
};
