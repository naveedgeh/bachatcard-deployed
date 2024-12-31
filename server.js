const express = require("express");
const dotenv = require("dotenv");
const mongoSanitizer = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
const connectDb = require("./config/db");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const cors = require("cors");

const mongoose = require("mongoose");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
// io.set('origins', 'http://localhost:8888');
const Emitter = require("events");

const errorResponse = require("./utils/errorResponse");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDb();

//event emmiter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

//Data sanitization against NoSQL query injection
app.use(mongoSanitizer());

//Data sanitization against xss(cross site scripting)
app.use(xss()); // this middleware is used to prevent any malicious stuff through html code

// Set security headers
app.use(helmet());

//Request Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 500, //100 requests per 10 mins
});

//Route files
const user = require("./routes/user");
const admin = require("./routes/admin");
const banner = require("./routes/banner");
const category = require("./routes/category");
const discount = require("./routes/discount");
const quizes = require("./routes/quizes");
const luckydraw = require("./routes/luckydraw");
const product = require("./routes/product");
const commission = require("./routes/commission");
//Body Parser
app.use(express.json({ limit: "50mb" }));

// Dev logging middleware
app.use(morgan("dev"));

//File uploading
app.use(fileupload());

// Assign socket object to every request
app.use(function (req, res, next) {
  req.io = io;
  next();
});

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

// app.use(cors());
// Mount routers

app.use("/api/v1/user", user);
app.use("/api/v1/admin", admin);
app.use("/api/v1/banner", banner);
app.use("/api/v1/categories", category);
app.use("/api/v1/discounts", discount);
app.use("/api/v1/quizes", quizes);
app.use("/api/v1/luckydraws", luckydraw);
app.use("/api/v1/product", product);
app.use("/api/v1/commission", commission);
// set static folder
app.use(express.static(path.join(__dirname, "public")));
// app.use('*', (req, res, next) => {
//     next(new errorResponse('resource not found', 404))
// })

app.use(errorHandler);

// Set the app view engine
app.set("view engine", "ejs");

const PORT = process.env.PORT || 9000;

const server = http.listen(PORT, console.log(`server running on port ${PORT}`));

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //close server and exit process
  server.close(() => process.exit(1));
});
