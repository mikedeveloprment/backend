import mongoose from "mongoose";

const userShema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		passwordLook: {
			type: String,
			required: true,
		},
		imageUrl: String
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("User", userShema);
