import { config } from "dotenv";
import App from "./app";
import Controller from "./models/Interfaces/controller.interface";
import userRouter from "./routes/pageRoutes";

//Load environmental variables to process.env
config();

//Create a route item according to the Controller interface and pass it to the App class
const routeItem: Controller = { path: "/", router: userRouter }

//Create a new App instance which is working on port 3000 
new App([routeItem], 3000);
