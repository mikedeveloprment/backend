import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
	postCreateValid,
	postUpdateValid,
	registerValid,
	signValid,
} from "./validations.js";
import verifyId from "./utils/verify-id.js";
import * as userControls from "./controlers/user-controller.js";
import * as postControls from "./controlers/post-controller.js";
import checkValidEror from "./utils/check-valid-err.js";
import cors from "cors";
/* ВИКОРИСТОВУЮ ТАКІ БІБЛЬОТЕКИ:
 "node", "nodemun", "express", "jsonwebtoken", "express-validator", "bcrypt"
 + в packege.json пишем "type: "module""
*/

// тут ми просто робим підключеня
// до бази даних як в fetch но пмшем mongoose.connect

await mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log("база даних підключена"))
	.catch((err) => console.log("помилка", err));

// створюємо наше backend програму
const app = express();
//

// хранилище фоток vdsvsdv
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!fs.existsSync("uploads")) {
			fs.mkdirSync("uploads");
		}
		cb(null, "uploads");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});
//
const upload = multer({
	storage,
});
//

app.use(cors());
// якщо коротко за допомоги use ми використовуєм express.json eweqeq2eq2
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//
//новий трігер на вход в профиль
app.post("/sign", signValid, checkValidEror, userControls.sign);

// трекінг запросів post з валідаціє
app.post("/register", registerValid, checkValidEror, userControls.register);

// отриманя даних зп допомоги токена який створився при вході
// використовуєм метод гет
app.get("/sign/me", verifyId, userControls.meInfo);
//
//

app.post("/upload", verifyId, upload.single("image"), (req, res) => {
	res.json({
		mes: "ok",
		url: "/uploads/" + req.file.originalname,
	});
});
///
// //
app.get("/posts", postControls.getAll);
app.get("/posts/tags", postControls.getTags);
app.get("/posts/:id", postControls.getOne);
app.post(
	"/posts",
	verifyId,
	postCreateValid,
	checkValidEror,
	postControls.create
);
app.delete("/posts/:id", verifyId, postControls.remove);
app.patch(
	"/posts/:id",
	verifyId,
	postUpdateValid,
	checkValidEror,
	postControls.update
);

// app.listen встановлює порт і робить вказану функцію при запусці
/* ошибка якшо є така */
app.listen(process.env.PORT || 1000, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log("порграма запущена");
});
