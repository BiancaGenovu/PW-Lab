import express from 'express';
import cors from 'cors';
import pilotsRoutes from './modules/pilot/pilot.routes.js'; // ✅ import corect
import circuitesRoutes from './modules/circuites/circuites.routes.js'; // ✅ import corect

const app = express();

// middleware-uri
app.use(cors());
app.use(express.json());

// ✅ înregistrăm ruta piloților
app.use('/api/pilot', pilotsRoutes);
app.use('/api/circuites', circuitesRoutes);
app.get('/health', (_req, res) => res.send('OK'));

app.listen(3000, () => {
  console.log('✅ API running on http://localhost:3000');
});