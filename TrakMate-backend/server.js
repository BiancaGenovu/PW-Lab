import express from 'express';
import cors from 'cors';

// !!! importă din folderul corect (circuites, nu gyms)
import circuitesRoutes from './modules/circuites/circuites.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// montează routerul pe /circuits
app.use('/api/circuits', circuitesRoutes);

// health (opțional)
app.get('/health', (_req, res) => res.send('OK'));

// pornește serverul
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app listen on port ${PORT}`));
