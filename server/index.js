// Import Modules
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

// Import Routes
import router from "./routes.js";

// Import Middleware

// Express App
const app = express();

// Express App Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("common"));   // Log HTTP Requests
app.use(cors()); // TODO: Remove this in production
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Express App Routes
app.use("", router);

// Express App Server
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
