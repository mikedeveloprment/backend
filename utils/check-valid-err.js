import { validationResult } from "express-validator";


export default (req, res, next) => {
  		// "validationResult" пордивиться шо є в req після валідації і верне
		// всі помилки ми їх запишем в err
		// а далі просто провірим на наличие помилок і виведем відповідну res
		const err = validationResult(req);
		if (!err.isEmpty()) {
			return res.json(err.array());
		}
    next()
}