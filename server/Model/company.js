import mongoose, { Mongoose } from "mongoose";
const companySchema=new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	description:{
		type:String
	},
	website:{
		type:String,
		required:true
	},
	location:{
		type:String
	},
	logo:{
		type:String
	},
	userID:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User',
		required:true
	}
},{timestamps:true});
export const company=mongoose.model("company",companySchema);
