import express from "express";
import bodyParser from "body-parser";
import Router from "./router";
// import fs from "fs";
import cors from "cors";

class Server {
  app: any;

  constructor() {
    this.app = express();
  }

  configure() {
    this.app.use(
      "/static",
      express.static(`${process.cwd()}/public/static`)
    );

    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

    this.app.use(cors());
    this.app.use(
      cors({
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: [
          "Origin",
          "X-Requested-With",
          "Content-Range",
          "Content-Disposition",
          "Content-Type",
          "Authorization",
        ],
      })
    );
    this.app.use(Router);
  }

  createServer() {
    // const privateKey = fs.readFileSync(`${__dirname}/keys/privkey.pem`, 'utf8');
    // const certificate = fs.readFileSync(`${__dirname}/keys/cert.pem`, 'utf8');
    // const ca = fs.readFileSync(`${__dirname}/keys/chain.pem`, 'utf8');    
    
    this.configure();

    this.app.listen(process.env.PORT || 8080);
  }
}

export default Server;
