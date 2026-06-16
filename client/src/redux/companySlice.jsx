import {createSlice} from "@reduxjs/toolkit"
const companySlice=createSlice({
	name:"company",
	initialState:{
		singleCompany:null,
		companies:[],
		searchCompanybytext:"",
	},
	reducers:{
		setsingleCompany:(state,action)=>{
			state.singleCompany=action.payload;
		},
		setCompanies:(state,action)=>{
			state.companies=action.payload;
		},
		setsearchbyCompanybytext:(state,action)=>{
			state.searchCompanybytext=action.payload;
		}
	}
});
export const {setsingleCompany,setCompanies,setsearchbyCompanybytext}=companySlice.actions;
export default companySlice.reducer