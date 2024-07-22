const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const authRoute = require("./routes/authRoute");
const question = require("./routes/questionRoute");
const quize = require("./routes/quizRoute");
const section = require("./routes/sectionRoute");
const history = require("./routes/historyRoute");
const result = require("./routes/resultRoute");
const key = require("./routes/keyRoute");
const file = require("./routes/fileRoute");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const search = require("./routes/serarchRoute");

const app = express();
env.config();
const bodyParser = require("body-parser");

const port = process.env.PORT || 3002;

mongoose
  .connect(
    "mongodb+srv://vinaysakariya5042:8TgZA4ELZRRTiIRw@cluster0.3flotcp.mongodb.net/ExamData?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// app.post("/file/upload", upload.single("file"), (req, res) => {
//   try {
//     const filePath = req.file.path;
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(sheet);

//     res.json({ data: data });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error uploading file");
//   }
// });

app.use("/auth", authRoute);
app.use("/questions", question);
app.use("/section", quize);
app.use("/quiz", section);
app.use("/history", history);
app.use("/result", result);
app.use("/search", search);
app.use("/key", key);
app.use("/file", file);

app.listen(port, () => {
  console.log("Server is running on port", port);
});
