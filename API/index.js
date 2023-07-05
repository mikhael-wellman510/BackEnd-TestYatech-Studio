const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
dotenv.config();

const router = require("./routes/UserRoutes");
const PORT = process.env.DB_PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//midd untuk ambil value dari cookie nya
app.use(cookieParser());
// ==ooo==

app.use(router);

// Error Handling
app.use((req, res, next) => {
  const error = new Error("alamat Routes Salah");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message,
    },
  });
});
app.listen(PORT, () => {
  console.log(`Server Running in Port ${PORT}`);
});
