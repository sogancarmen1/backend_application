import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";
import Controller from "interfaces/controller.interface";
import errorMiddleware from "./middlewares/erreur.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import { swaggerUi, swaggerDocs } from "./swagger";
import dotenv from "dotenv";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[]) {
    this.app = express();
    dotenv.config;
    this.port = Number(process.env.PORT) || 3000;

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    this.app.use(
      cors({
        origin: "https://front-end-to-do-list-niul.vercel.app",
        credentials: true,
      })
    );
    this.app.all("/*", function (req, res, next) {
      res.header(
        "Access-Control-Allow-Origin",
        "https://front-end-to-do-list-niul.vercel.app"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Content-type,Accept,X-Access-Token,X-Key"
      );
      if (req.method == "OPTIONS") {
        res.status(200).end();
      } else {
        next();
      }
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private async connectToTheDatabase() {
    const {
      DB_USER,
      DB_PASSWORD,
      DB_HOST,
      DB_PORT,
      DB_DATABASE,
      PORT,
      JWT_SECRET,
    } = process.env;

    const pool = new Pool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    });

    try {
      await pool.connect();
      console.log("Connexion à la base de données réussie !");
    } catch (error) {
      console.error(
        "Erreur lors de la connexion à la base de données :",
        error
      );
    } finally {
      await pool.end();
    }
  }
}

export default App;
