import * as express from "express-session";

//This declaration is used for adding new propertys to express-session's default session interface
//By this declaration we able use req.session.userID, req.session.browserInfo
declare module "express-session" {
  interface Session {
    userID: string;
    browserInfo: string;
  }
}
