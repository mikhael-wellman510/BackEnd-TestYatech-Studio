const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // jika refresh token nya sudah tidak ada / di hapus d logout
  // maka tidak bisa get data
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.send("Login Terlebih Dahulu");
  // untuk memasukan di headers . key nya  = authorization dan isi value Bearer + isi token
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  //jika token exp atau kosong
  if (token == null) return res.status(401).send("Login Terlebih Dahulu");

  //verify token untuk Login
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.send({ err: err.message });
    req.email = decoded.email;

    next();
  });
};

module.exports = verifyToken;
