import jwt from "jsonwebtoken";
import bcrypt  from "bcrypt";
import userShema from "../sheme/User.js";


export const register = async (req, res) => {
	try {
		// просто треба поняти це шифровання пароля
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const pass = await bcrypt.hash(password, salt);

		//  ми імпортнули конструктор класа який ми записуєм в doc і зберегаєм
		//  в базу doc.save()
		const doc = new userShema({
			email: req.body.email,
			name: req.body.name,
			passwordLook: pass,
			imageUrl: req.body.imageUrl
		});

		const user = await doc.save();

		// шоб подальше було легко понимати в кого є права на ті чи
		// інші функції ми робим токен на id яке буде в  req

		const token = jwt.sign(
			{
				_id: user._id,
			},
			"kybik",
			{
				expiresIn: "30d",
			}
		);

		// вивод даних і відлавлювання помилок
		const { passwordLook, ...userData } = user._doc;

		res.json({
			...userData,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(403).json({
			message: "не удалось зарегатса",
		});
	}
};
export const sign = async (req, res) => {
	try {
		//

		// код нижче якщо коротко просто витягує з бази юзера якщо по почті
		// не тре вдаватися в подробиці як точно протсо в нашої переменої userShema є
		// методи які багато шо можуть
		const user = await userShema.findOne({ email: req.body.email });

		// просто провірка чи найшовся юзер
		if (!user) {
			return res.status(400).json({
				message: "Користувач не найден",
			});
		}

		// тепер за допомогою метода compare в bcrypt ми срявнюєм зашифрований і
		// переданий з фронта незашиф паролі
		const truePassword = await bcrypt.compare(
			req.body.password,
			user._doc.passwordLook
		);

		// знов провірка на правильність пароля
		if (!truePassword) {
			return res.status(400).json({
				message: "Пароль або Почта не валідна",
			});
		}

		// якшо всі провірки пройшли ми створюєм токен про то шо
		// був зроблений вхід в профіль шоб подальше його викоритсати
		//  на провірку чи може юзер шось зробити який буде зберігатися в jwt
		const token = jwt.sign(
			{
				_id: user._id,
			},
			"kybik",
			{
				expiresIn: "30d",
			}
		);

		// пон
		const { passwordLook, ...userData } = user._doc;
		res.json({
			...userData,
			token,
		});

		// відлав. помилок
	} catch (error) {
		res.status(400).json({
			message: "не удалось войти",
		});
	}
};
export const meInfo = async (req, res) => {
	// провірка
	try {
		// достаєм юзера вже відомим способом але тепер за допомогою
		// метода findById
		const user = await userShema.findById(req.userId);

		// провірка
		if (!user) {
			res.status(404).json({
				message: "юзера нет",
			});
		}
		// вивод даних
		const { passwordLook, ...userData } = user._doc;
		res.json(userData);
	} catch (error) {
		res.status(404).json({
			message: "юзера нет",
		});
	}
};
