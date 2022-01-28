import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";

export const authenticate: RequestHandler = (req, res, next) => {
  //Get JWT token from cookie
  var token = req.cookies.token;

  //Give default false value to isAuth property of request
  req.isAuth = false;

  //If there is no token, go to next middleware so leave isAuth property as false
  if (!token) return next();

  //Decode the JWT token that obtained from cookie and assign it's values to request
  verify(token, process.env.JWT_SECRET, (err: Error, decoded) => {
    if (err) return next();
    req.userID = decoded.id;
    req.browserInfo = decoded.browserInfo;
  });

  //Check if UserIDs and BrowserInfos in the request, JWT token and session. 
  //If they are not same, go next middleware and leave isAuth false
  if (
    !(
      req.userID == req.session.userID &&
      req.headers["user-agent"] == req.session.browserInfo &&
      req.headers["user-agent"] == req.browserInfo
    )
  )
    return next();

  //If everything is OK, change the isAuth property as true and go next
  req.isAuth = true;
  next();
};
