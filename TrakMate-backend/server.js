// Fișierul tău principal de start (cel pe care rulezi npm run dev)
import express from 'express';
import cors from 'cors';
// ⚠️ Importă doar routerele, nu ai nevoie de toți controllerii aici
import pilotsRoutes from './modules/pilot/pilot.routes.js'; 
import circuitesRoutes from './modules/circuites/circuites.routes.js'; // <<< ESENȚIAL
import timeRoutes from './modules/time/time.routes.js';

const app = express();

// Middleware-uri
app.use(cors());
app.use(express.json());

// RUTAREA: ORDINEA CONTEAZĂ
app.use('/api/pilot', pilotsRoutes);
app.use('/api/circuites', circuitesRoutes); // <<< AICI SE FACE CONEXIUNEA CU RUTA DE ID
app.use('/api/time', timeRoutes);

app.get('/health', (_req, res) => res.send('OK'));

app.listen(3000, () => {
  console.log('✅ API running on http://localhost:3000');
});