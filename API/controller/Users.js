const model = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const getUsers = async (req, res) => {
  try {
    const users = await model.UserModel.findAll({
      // untuk menampilkan hanya 3 field saja
      attributes: ["id", "name", "email"],
    });
    res.send(users);
  } catch (error) {
    res.send(error.message);
  }
};

const Register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res.send({ msg: "Password & confirm password tidak Cocok" });

  // Hash Password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const user = await model.UserModel.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    res.send({ msg: `Registrasi Berhasil`, user });
  } catch (error) {
    res.send(error.message);
  }
};

const Login = async (req, res) => {
  const password = req.body.password;

  try {
    const user = await model.UserModel.findOne({
      where: {
        email: req.body.email,
      },
    });
    //compare bcrypt password pakah sama
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send({ msg: `Password yang anda masukan salah` });
    const userId = user.id;
    const name = user.name;
    const email = user.email;

    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "60s",
      }
    );

    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // refresh token yg akan d update harus sama dengan mySql
    const addToken = await model.UserModel.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    // ini untuk cookie ke controller refresh token
    // untuk menyimpan cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.send({ accessToken, refreshToken });
  } catch (error) {
    res.send(error.message);
  }
};

const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.send("Token Tidak ditemukan");
  const user = await model.UserModel.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });

  const userId = user[0].id;

  // membuat refresh token menjadi null sehingga akan logout
  const deleteToken = await model.UserModel.update(
    {
      refresh_token: null,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  // untuk menghapus cookie
  res.clearCookie("refreshToken");
  return res.send("Berhasil Logout");
};
module.exports = { getUsers, Register, Login, Logout };
