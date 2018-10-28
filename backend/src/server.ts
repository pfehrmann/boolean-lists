require("dotenv").config();

import * as cors from "cors";
import * as  express from "express";
import * as session from "express-session";
import * as Keycloak from "keycloak-connect";
import * as morgan from "morgan";
import * as path from "path";
import * as winston from "winston";
import * as logger from "winston";
import * as Api from "./spotify/Api";

const kcConfig = require("../keycloak.json");

winston.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
    ),
}));

const sessionStore = session({secret: "my secret of the day"});
const keycloak = new Keycloak({store: sessionStore}, kcConfig);

const app = express();

app.use(morgan("default"));
app.use((err, req, res, next) => {
    logger.error(err.stack);
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

app.use(express.static(
  process.env.FRONTEND_BUILD_DIR ||
  path.join(__dirname, "..", "..", "frontend", "build")),
);
app.get("/", express.static(
  process.env.FRONTEND_BUILD_INDEX ||
  path.join(__dirname, "..", "..", "frontend", "build", "index.html")),
);
app.use(Api.router(keycloak));

app.listen(process.env.PORT, () => {
    logger.info(`Listening on port ${process.env.PORT}`);
});
