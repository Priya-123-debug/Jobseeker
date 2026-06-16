const sessions={};
export const createSession=(userId)=>{
	if(!sessions[userId]){
		sessions[userId]={
			context: {}, currentStep: null, currentIntent: null
		};

	};
	
}
export const getSession=(userId)=>{
		return sessions[userId];
	};
	export const updateSession=(userId,data)=>{
		if(!sessions[userId]) return;
		sessions[userId]={...sessions[userId],...data};

	}
	export const deleteSession=(userId)=>{
		delete sessions[userId];
	}
