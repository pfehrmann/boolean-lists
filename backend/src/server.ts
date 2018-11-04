require("dotenv").config();

import * as cors from "cors";
import * as  express from "express";
import * as session from "express-session";
import * as Keycloak from "keycloak-connect";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as winston from "winston";
import * as logger from "winston";

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);

import api from "./api";
import * as SpotifyAuthorization from "./model/spotify/Authorization";

const kcConfig = require("../keycloak.json");

winston.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
    ),
}));

const sessionStore = session({
    resave: false,
    saveUninitialized: false,
    secret: "my secret of the day",
});
const keycloak = new Keycloak({store: sessionStore}, kcConfig);

const app = express();

app.use(morgan("dev"));
app.use((err, req, res, next) => {
    logger.error(err.stack);
    logger.error(err);
    res.sendStatus(500);
});

app.use(cors());
app.use((req: express.Request, res: any, next: express.NextFunction) => {
    if (req.query.authorization) {
        req.headers.authorization = req.query.authorization;
    }
    next();
});

app.use(sessionStore);
app.use("/auth/spotify", SpotifyAuthorization.getRouter(keycloak));
app.use("/v1", api(keycloak));

app.listen(process.env.PORT, () => {
    logger.info(`Listening on port ${process.env.PORT}`);
});
