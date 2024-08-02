const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const subcategoryRoutes = require('./routes/subcategories');
const generalTaskRoutes = require('./routes/generalTasks');
const taskRoutes = require('./routes/tasks');

dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(cors({
  origin: ['http://localhost:5173', 'https://todomo.vercel.app', 'https://todomo.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods if needed
  allowedHeaders: ['Content-Type', 'Authorization'], // Add other headers if needed
}));

app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', subcategoryRoutes);
app.use('/api', generalTaskRoutes);
app.use('/api', taskRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
