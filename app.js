// Node
import path from "node:path";
// Express
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
// Express: Performance
import compression from "compression";
// Express: Seceurity and reliabilty
import RateLimit from "express-rate-limit";
import helmet from "helmet";
import createError from "http-errors";
// Express template engine: Handlebars
import { create } from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import createHbsHelpers from "handlebars-helpers";

const limiter = RateLimit({
	windowMs: 1 * 60 * 1000,
	max: 20,
});

const __dirname = "/home/hadezb/learning/web-development/node/odin-inventary/";
const viewsDir = path.join(__dirname, "views");
const hbsHelpers = createHbsHelpers(["comparison", "string"]);

const hbs = create({
	extname: ".hbs",
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	helpers: { ...hbsHelpers },
});

import indexRouter from "./routes/index.js";

const app = express();

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", viewsDir);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet);
app.use(limiter);
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// Catch 404s and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error", { error: err });
});

export default app;
