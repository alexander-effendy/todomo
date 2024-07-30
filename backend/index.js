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
app.use(cors({
  origin: ['http://localhost:5173', 'https://todomo.vercel.app'],
}));

app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', subcategoryRoutes);
app.use('/api', generalTaskRoutes);
app.use('/api', taskRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
