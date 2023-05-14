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
mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log("база даних підключена"))
	.catch((err) => console.log("помилка", err));

// створюємо наше backend програму
const app = express();
//

// хранилище фоток
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
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
// якщо коротко за допомоги use ми використовуєм express.json
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

//
///
//
///

// app.listen встановлює порт і робить вказану функцію при запусці
/* ошибка якшо є така */
app.listen(process.env.PORT || 1000, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log("\vПрограма запущена");
});

// ПРИКЛАДИ

/*
res - связано з ответом там є методи інше
req те шо рийшоло разом із запросом 
*/
// app.get("/", (req, res) => {
// 	res.send(`${Math.random()}`);
// 	console.log("jbkj");
/*
   при заході на сайт с таким маршрутом дуже
   виконуватися get запрос і ми будем надсилати
  за допомогою "res.send" текст шо все ок     
  */
// });

// res.json відправляє просто сообщ в форматі json
// app.post("/login", (req, res) => {

/*
це просто строка в якій дешо зашифровано за допомоги jwt
тобто токен який ми створли с помощю jwt.sign()
перший параметир дані які шифруєм другий просто ключ який ми самі придумєм він знадобиться
*/
// const token = jwt.sign(
// 	{
// 		email: req.body.email,
// 		Name: "gg",
// 	},
// 	"kybik"
// );

// 	console.log(req.body, `\v\v\v${token} `);

// 	res.json({
// 		sucsess: true,
// 		token,
// 	});
// });
