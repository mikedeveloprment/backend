import { validationResult } from "express-validator";
import postShema from "../sheme/Post.js";

// створеня статі
export const create = async (req, res) => {
	try {
		// створеня і збереженя обєкта в базу даних за допомоги mongoose
		const doc = new postShema({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			imageUrl: req.body.imageUrl,
			viewsCount: req.body.viewsCount,
			autor: req.userId,
		});
		const post = await doc.save();
		//

		//
		res.json(post);
	} catch (error) {
		res.status(500).json({
			message: "не можливо створити статью",
		});
	}
};

// получаєм всі пости
export const getTags = async (req, res) => {
	try {
		// тут є сенс посянити тільки цю строчку тому що в ній є такі методі як find populate exec
		// по порядку postShema це такак перемена шо мтворив mongoose і в неї є методи щоб получити дані
		// з бази даних типа як fetch значить find просто вертаж все шо є в базі posts потім з цього
		// ми застосовуєим метод populate("тут ми вказуєм свойство яке треба перевести з іншої бази")
		// і exec вона і міняє id на весь обєкт який містить exec
		const posts = await postShema.find().limit(5).exec();
		//
		const tags = posts
			.map((obj) => obj.tags)
			.flat()
			.slice(0, 5);

		res.json(tags);
	} catch (error) {
		res.status(500).json({
			message: "не вийшло :(",
		});
	}
};

// получаєм всі пости
export const getAll = async (req, res) => {
	try {
		// тут є сенс посянити тільки цю строчку тому що в ній є такі методі як find populate exec
		// по порядку postShema це такак перемена шо мтворив mongoose і в неї є методи щоб получити дані
		// з бази даних типа як fetch значить find просто вертаж все шо є в базі posts потім з цього
		// ми застосовуєим метод populate("тут ми вказуєм свойство яке треба перевести з іншої бази")
		// і exec вона і міняє id на весь обєкт який містить exec
		const posts = await postShema.find().populate("autor").exec();
		//

		res.json(posts);
	} catch (error) {
		res.status(500).json({
			message: "не вийшло :(",
		});
	}
};
// получаєм одну пости
export const getOne = async (req, res) => {
	try {
		// тут с низу по факту нічого складного просто якщо буде динамічгий
		// параметр ":id" то його можна буде витащити с req вот так
		// const postId = req.params.id;
		const postId = req.params.id;
		//

		// як я вже писав в нашої схеми є деякі методи
		// findOneAndUpdate говорить сам за себе в нього передаєм 3
		// параметра в обєктах: фільтр, обновлене значнення і як вертати
		const doc = await postShema.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: "after",
			}
		).populate('autor');

		res.json(doc);
	} catch (error) {
		res.status(404).json({
			message: "не вийшло :(",
		});
	}
};
// получаєм одну пости
export const remove = async (req, res) => {
	try {
		// тут с низу по факту нічого складного просто якщо буде динамічгий
		// параметр ":id" то його можна буде витащити с req вот так
		// const postId = req.params.id;
		const postId = req.params.id;
		//
		// //
		// робим тож саме шо і робили коли вертали одну статю
		// але тепер метод findByIdAndDelete а далі нічого складного
		const doc = await postShema.findByIdAndDelete({ _id: postId });
		if (!doc) {
			return res.status(404).json({
				message: "статю не знайдено",
			});
		}
		res.json({
			sucsess: true,
		});
	} catch (error) {
		res.status(500).json({
			message: "не вийшло виконати дію!!!",
		});
	}
};
// оновлена статі
export const update = async (req, res) => {
	try {
		const postId = req.params.id;
		const doc = await postShema.updateOne(
			{ _id: postId },
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags,
				imageUrl: req.body.imageUrl,
				autor: req.userId,
			}
		);

		res.json({
			sucsess: true,
		});
	} catch (error) {
		res.status(500).json({
			message: "не вийшло виконати дію!!!",
		});
	}
};
