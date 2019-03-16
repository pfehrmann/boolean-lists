require("dotenv").config();

const session = require("cookie-session");
import * as cors from "cors";
import * as  express from "express";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as winston from "winston";
import * as logger from "winston";

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);

import api from "./api";
import * as SpotifyAuthorization from "./model/spotify/Authorization";

import * as passport from "passport";

winston.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
    ),
}));

const corsOptions = {
    credentials: true,
    origin: true,
};

const app = express();

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(session({
    cookie: {
        httpOnly: true,
        maxAge: null,
        path: "/",
        secure: false,
    },
    resave: true,
    saveUninitialized: true,
    secret: "my secret of the day",
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth/spotify", SpotifyAuthorization.getRouter());
app.use("/v1", api());

app.use((err, req, res, next) => {
    logger.error(err.stack);
    logger.error(err);
    res.sendStatus(500);
});

app.listen(process.env.PORT, () => {
    logger.info(`Listening on port ${process.env.PORT}`);
});
