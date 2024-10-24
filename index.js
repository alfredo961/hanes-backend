const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json()); // Middleware para analizar JSON
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const yarnRoutes = require('./routes/yarnRoutes');
const printRoutes = require('./routes/printRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/yarn', yarnRoutes);
app.use('/api/print', printRoutes);
app.use('/api/order', orderRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
