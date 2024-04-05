const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const bikes = require("../models/bikes");
const config = require("../utils/config");
const nodemailer = require("nodemailer");
const bookings = require("../models/bookings");

const userController = {
  signup: async (request, response) => {
    try {
      const body = request.body;
      if (!body.password || body.password.length < 3) {
        return response.status(400).json({
          error: "password must be at least 3 characters long",
        });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(body.password, saltRounds);

      const user = new User({
        username: body.username,
        name: body.name,
        mobile: body.mobile,
        address: body.address,
        bookings: [],
        passwordHash,
      });
      const book = new bookings({
        username: body.username,
        details: [],
      });

      const savedUser = await user.save();
      const savedBook = await book.save();

      response
        .status(201)
        .json({ message: "User created successfully", user: savedUser });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  getUserList: async (request, response) => {
    try {
      const userList = await User.find({}, {});
      response.status(200).json(userList);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  signin: async (request, response) => {
    try {
      const { username, password } = request.body;

      const user = await User.findOne({ username });

      if (!user) {
        return response.status(401).json({ error: "User Not found" });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        return response.status(401).json({ error: "Invalid Password" });
      }

      const token = jwt.sign(
        {
          username: user.username,
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          address: user.address,
          bookings: user.bookings,
        },
        config.JWT_SECRET
      );

      response.status(200).json({
        token,
        username: user.username,
        name: user.name,
        mobile: user.mobile,
        address: user.address,
        bookings: user.bookings,
      });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  getProfile: async (request, response) => {
    try {
      const userId = request.userId;
      const user = await User.findById(userId, {});
      response.status(200).json(user);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  editProfile: async (request, response) => {
    try {
      const userId = request.userId;
      const { username, name, mobile, address } = request.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { username, name, mobile, address },
        { new: true }
      );
      response.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  bookBike: async (request, response) => {
    try {
      const { id, username, detail } = request.body;

      const bike = await bikes.findById(id);
      const user = await User.findOne({ username });
      const book = await bookings.findOne({ username });
      const available = bike.details.Available - 1;
      let date = new Date();
      const Details = {
        ...bike.details,
        Available: available,
      };
      const booked = await User.updateOne(user, {
        bookings: [...user.bookings, bike],
      });
      const bookingDetails = [
        ...book.details,
        {
          ...bike,
          bookedAt: `${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}`,
          location: detail.location,
          pick: detail.pick,
          drop: detail.drop,
        },
      ];
      const bikeBook = await bikes.findByIdAndUpdate(id, { details: Details });
      const booking = await bookings.updateOne(book, {
        details: bookingDetails,
      });
      response.status(200).json({ message: "Bike booked successfully" });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  deleteProfile: async (request, response) => {
    try {
      const userId = request.userId;
      await User.findByIdAndDelete(userId);
      response.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  forget: async (request, response) => {
    const { username } = request.body;
    const user = await User.findOne({ username });
    const id = user._id;
    if (!user) {
      return response.status(401).json({
        message: "user does not exist",
      });
    }
    const random = () => {
      let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let str = "";
      for (let i = 0; i < 6; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return str;
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: config.USER_NAME,
        pass: config.PASSWORD,
        clientId: config.ID,
        clientSecret: config.SECRET,
        refreshToken: config.TOKEN,
      },
    });
    let ranstr = random();
    const mailConfigurations = {
      from: "rajabharathi0258@gmail.com",
      to: username,
      subject: "Sending Email using Node.js",
      html: `<h2>Hi!</h2> <h5>The password reset code is : ${ranstr} </h5>`,
    };
    await User.findByIdAndUpdate(id, {
      passwordHash: ranstr,
    });
    await transporter.sendMail(mailConfigurations, function (error, info) {
      if (error) console.log(error);
      response.json({ message: "Password reset code sent sucessfully" });
    });
  },

  reset: async (request, response) => {
    const { username, code, password } = request.body;
    const newPass = await bcrypt.hash(password, 10);
    let user = await User.findOne({ username });
    if (code !== user.passwordHash) {
      return response.json({ message: "wrong code" });
    }
    await User.findByIdAndUpdate(user._id, {
      passwordHash: newPass,
    });
    response.json({ message: "password changed sucessfully" });
  },
};

module.exports = userController;
