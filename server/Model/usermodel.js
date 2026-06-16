import mongoose from 'mongoose';
const userSchema=new mongoose.Schema({
	fullname:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	phoneNumber:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true
	},
	role:{
		type:String,
		enum:['student','recruiter'],
		required:true

	},
	profile:{
		bio:{type:String},
		skills:[{type:String}],
		resume:{type:String},
		resumeoriginalname:{type:String},
		companyname:{type:mongoose.Schema.Types.ObjectId,ref:'Company'},
		profileImage:{
			type:String,
			default:""
		}
	},
}
,{timestamps:true});
export default mongoose.model('User',userSchema);