import mongoose from 'mongoose';
const jobSchema=new mongoose.Schema({
	title:{
		type:String,
		required:true
	},
	description:{
		type:String,
		required:true
	},
	requirements:{
		type:[String],
		
	},
	Salary:{
		type:Number,
		required:true
	},
	location:{
		type:String,
		required:true
	},
	jobtype:{
		type:String,
		required:true
	},
	industry: {
  type: String,
  default: ""
},
	experience:{
		type:Number,
		required:true
	},
	position:{
		type:String,
		required:true
	},
	company:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'company',
		required:true
	},
	created_by:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User',
		required:true
	},
	applications:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Application',
	}],

	
} ,
	{ timestamps: true }
)
export default mongoose.model('Job', jobSchema)