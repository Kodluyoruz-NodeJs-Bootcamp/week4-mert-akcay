import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMainPage,
  getRegisterPage,
  getLoginPage,
  getUsersPage,
  logOutUser,
} from "../controller/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getMainPage);
router.get("/register", authenticate, getRegisterPage);
router.get("/login", authenticate, getLoginPage);
router.get("/users", authenticate, getUsersPage);
router.get("/logout", authenticate, logOutUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
