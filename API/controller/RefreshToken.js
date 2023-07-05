const model = require("../models/index");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Supaya tidak perlu login lagi jika harus mendapatkan new token
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.send({ msg: "Gagal" });
    const user = await model.UserModel.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    console.log(user);
    if (!user) return res.send({ msg: "tidak cocok" });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err) return res.send(err.message);
        const userId = user.id;
        const name = user.name;
        const email = user.email;

        // membuat jwt baru
        const accessToken = jwt.sign(
          // knp harus pakai user, name dan email
          // supaya di front end bisa di pakai
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15s" }
        );
        res.send(accessToken);
      }
    );
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = { refreshToken };
