import multer, { diskStorage } from "multer";

// create stroage

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photo") {
      cb(null, "public/student");
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "_" +
        Math.round(Math.random() * 10000) +
        "_" +
        file.originalname
    );
  },
});

// create multer

export const createStudentMulter = multer({ storage }).single("photo");
