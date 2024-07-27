const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use('/api', authRoutes);
app.use('/api', categoryRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
