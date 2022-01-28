import * as express from "express";
import { createConnection } from "typeorm";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import Controller from "./models/Interfaces/controller.interface";

export default class App {
  private app: express.Application;
  private port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    //Call all required methods whenever a new instance created from this class
    this.initialiseDatabaseConnection();
    this.initialiseTemplateEngine();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.createServer();
  }

  //This method connects to DB
  private async initialiseDatabaseConnection(): Promise<void> {
    await createConnection();
    console.log("Connected to DB");
  }

  //This method initializes the ejs as template engine, set views folder path, and static files' folder.
  private initialiseTemplateEngine(): void {
    this.app.set("view engine", "ejs");
    this.app.set("views", path.join(path.resolve(), "./src/views"));
    this.app.use(express.static("public"));
  }

  //This method is using required middlewares such as express-session,cookie-parser for express app 
  private initialiseMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 600000,
          httpOnly: true,
        },
      })
    );
  }

  //This method uses the controllers which is given when using this class. In that specific example, routes has been used.
  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach((element) => {
      this.app.use(element.path, element.router);
    });
  }

  //This method listens to server on given port
  private createServer(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
