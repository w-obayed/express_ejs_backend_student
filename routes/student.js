import express from "express";
import {
  createStudent,
  getAllStudent,
  getStudentPage,
  createStudentPage,
  createSinglePage,
  getSingleStudent,
  deleteStudent,
  editSinglePage,
  editStudent,
  adminLoginPage,
  createUser,
  loginUser,
} from "../controller/studentcontroller.js";
import { createStudentMulter } from "../utils/multer.js";

// router init
const router = express.Router();
// ejs router
router.get("/home", getStudentPage);
router.get("/create", createStudentPage);
router.get("/single/:slug", createSinglePage);
router.get("/edit/:id", editSinglePage);
router.get("/", adminLoginPage);

// Api router
router.get("/home", getAllStudent);
router.get("/single/:slug", getSingleStudent);
router.get("/delete/:id", deleteStudent);
router.post("/student", createStudentMulter, createStudent);
router.post("/edit/:id", createStudentMulter, editStudent);
router.post("/register", createStudentMulter, createUser);
router.post("/login", createStudentMulter, loginUser);

// default router
export default router;
