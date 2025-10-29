import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import config_obj from './config/env.js'
import pilotRoutes from './modules/pilot/pilot.routes.js'
import circuitesRoutes from './modules/circuites/circuites.routes.js'

const app=express();
const Router = express.Router()
// parse everything in to json 
app.use(express.json())
// expose the folder where the photos are saved 

app.use(cookieParser())
app.use(cors({
  origin: config_obj.front_end_url, // ✅ your frontend address here
  credentials: true, // ✅ if you're using cookies, sessions, or auth headers
}));
app.use(Router)

Router.use("/circuites", circuitesRoutes);
Router.use("/pilot" , pilotRoutes);

app.listen(config_obj.backend_port, ()=>{
    console.log(`app listen on port ${config_obj.backend_port}`)
})            