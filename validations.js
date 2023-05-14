import { body } from "express-validator";

// ми імпортуєм body спеціальний метод
// який применяється як до промісів
// пергий в ньому аргумент це свойство в обєкте яке прийде в req
// якщо ми вкажем "registerValid" 2 параметром в application.post
// другий аргумент це ошибка яка вернеться далі до цього метьоді ми прикручуєи провірки типа
// isEmail, isUrl і т.д

export const registerValid = [
	body("email", "ця строка обовязково повина бути поштою").isEmail(),
	body("password", "пароль має бути довше 4 символів").isLength({
		min: 5,
	}),
	body("name", "ім'я має бути валідним і довше 2 символів").isLength({
		min: 3,
	}),	body("imageUrl", "це не силка").optional().isString()
];

export const signValid = [
	body("email", "це не є постою").isEmail(),
	body("password", "можливо ви ввели не валідний пароль").isLength({
		min: 5,
	}),
];

export const postCreateValid = [
	body("title", "можлиово заголовок закороткий")
		.isString()
		.isLength({ min: 5 }),
	body("text", "статья обовязково повина бути строчкою і довше 10 символів")
		.isString()
		.isLength({ min: 20 }),
	body("tags", "теги записані в неправильному ворматі").optional().isString(),
];

export const postUpdateValid = [
	body("title", "можлиово заголовок закороткий")
		.optional()
		.isString()
		.isLength({ min: 5 }),
	body("text", "статья обовязково повина бути строчкою і довше 10 символів")
		.optional()
		.isString()
		.isLength({ min: 20 }),
	body("tags", "теги записані в неправильному ворматі").optional().isArray(),

];
