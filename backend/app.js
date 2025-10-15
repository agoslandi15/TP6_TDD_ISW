const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const comprarEntradaRoutes = require('./routes/comprar-entrada');
app.use('/api/comprar-entrada', comprarEntradaRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
