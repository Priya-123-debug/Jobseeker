import jwt from "jsonwebtoken"

const isAuthenciated=async(req,res,next)=>{
	try{
		const token=req.cookies.token;
if(!token){
	return res.status(401).json({
		message:"user not authenticate",
		success:false,

	})
}
const decode = jwt.verify(token, process.env.JWT_KEY);

if(!decode){
	return res.status(401).json({
		message:"invalid token",
		success:false
	})
}
// req.id=decode.userID;
 req.user = decode;
 req.id = decode.userId;
next();

	}
	catch(err){
		 console.log("Auth error:", err);
  return res.status(401).json({
    message: "Authentication failed",
    success: false,
  });
	}
}
export default isAuthenciated;