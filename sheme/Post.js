import mongoose from "mongoose";

const postShema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
			unique: true,
		},
		tags: {
			type: Array,
			default: [],
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		imageUrl: String,
		autor: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},

	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Post", postShema);
