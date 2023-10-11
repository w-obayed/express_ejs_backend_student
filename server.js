import express from "express";
import dotenv from "dotenv";
import color from "colors";
import studentRouter from "./routes/student.js";
import expressEjsLayouts from "express-ejs-layouts";
// confiq env
dotenv.config();

// port confiq
const PORT = process.env.PORT || 6060;

// init express
const app = express();

// middleware parse to json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ejs
app.set("view engine", "ejs");
app.use(expressEjsLayouts);

// static folder
app.use(express.static("public"));

// routes
app.use(studentRouter);

// listen sever
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgGreen.red);
});
