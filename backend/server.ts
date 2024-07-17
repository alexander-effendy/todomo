import express from 'express';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-react/server';

const app = express();

app.use(express.json());

app.get('/api/auth/session', async (req, res) => {
  const session = await getKindeServerSession(req, res);

  if (!session) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  res.status(200).json({ message: 'Authenticated', session });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});