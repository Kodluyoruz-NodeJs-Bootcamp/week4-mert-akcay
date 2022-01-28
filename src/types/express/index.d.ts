import * as express from "express";

//This declaration is used for adding new propertys to Express' default Request interface
//By this declaration we able use req.isAuth, req.usedID and req.browserInfo
declare global {
  namespace Express {
    interface Request {
      isAuth?: boolean;
      userID?: string;
      browserInfo?: string;
    }
  }
}
