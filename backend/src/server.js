require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const salonRoutes = require('./routes/salonRoutes');

const app = express();

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', app: 'Snip API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/salons', salonRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Snip Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
};

startServer();
