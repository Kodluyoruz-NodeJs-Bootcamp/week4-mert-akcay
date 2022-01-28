import { RequestHandler } from "express";
import { hash, compare } from "bcryptjs";
import { IRegisterUser } from "../models/Interfaces/register.interface";
import { getRepository } from "typeorm";
import { User } from "../models/entity/User";
import { sign } from "jsonwebtoken";

//This function renders main page.
export const getMainPage: RequestHandler = async (req, res) => {
  res.render("index", { isAuth: req.isAuth, index: "home" });
};

//This function renders register page
export const getRegisterPage: RequestHandler = async (req, res) => {
  if (req.isAuth) return res.redirect("/");
  res.render("sign-up");
};

//This function renders login page
export const getLoginPage: RequestHandler = async (req, res) => {
  if (req.isAuth) return res.redirect("/");
  res.render("sign-in");
};

//This function renders users page
export const getUsersPage: RequestHandler = async (req, res) => {
  if (!req.isAuth) return res.redirect("/login");

  //Connect repository for accessing database and find all users
  const userRepository = getRepository(User);
  let users = await userRepository.find();
  res.render("users", { isAuth: req.isAuth, users, index: "users" });
};

//This function adds new users to db
export const registerUser: RequestHandler = async (req, res) => {
  try {
    //Deconstruct req.body
    const { firstName, lastName, email, password }: IRegisterUser = req.body;

    //Connect to User Repository for accessing database
    const userRepository = getRepository(User);

    //Check if a user exists with that email, if exist throw error
    const existingUser = await userRepository.findOne({ email });
    if (existingUser) throw "User already exists";

    //Encrypt the password
    const passwordHash = await hash(password, 10);

    //Create a new User according to the User entity
    const user = await userRepository.create({
      firstName,
      lastName,
      password: passwordHash,
      email,
    });

    //Save this user to db
    await userRepository.save(user);

    //Redirect to login page
    res.status(201).redirect("/login");
  } catch (err) {
    //If any error occures, send them to sign-up page
    res.render("sign-up", { err });
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    //Desconstruct request body
    const { email, password } = req.body as IRegisterUser;

    //Check if the user exists
    const user = await getRepository(User).findOne({ email });
    if (!user) throw "User not found";

    //Check if the password is valid
    let passwordIsValid = await compare(password, user.password);
    if (!passwordIsValid) throw "Password is not correct";

    //Create a JWT token
    let token = sign(
      { id: user.id, browserInfo: req.headers["user-agent"] },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    //Return the information including token
    res.cookie("token", token, { httpOnly: true });

    //Create a session and write userID and BrowserInfo to it.
    req.session.userID = user.id;
    req.session.browserInfo = req.headers["user-agent"];

    //Redirect to homepage
    res.redirect("/");
  } catch (err) {
    //If any error occures, send them to sign-in page
    res.render("sign-in", { err });
  }
};

//This function is for logging out
export const logOutUser: RequestHandler = async (req, res) => {
  //Destroy the session
  req.session.destroy((err) => {
    if (err) return res.send("An error occured");
  });

  //Clear the cookies
  res.clearCookie("token");
  res.clearCookie("connect.sid");

  //Redirect to homepage
  res.redirect("/");
};
