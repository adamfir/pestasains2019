let SchoolModel = require('./SchoolModel');
class SchoolController{
    constructor(params) {
        
    }
    static async create(name,address,email,phone,username,password){
        try{
            return await SchoolModel.create({name,address,email,phone,username,password});
        }catch(e){
            throw e;
        }
    }
    static async login(username,password){
        let school = await SchoolModel.findOne({username});
        if(school==null)
            return {status: 404, school: null, message:"Username not found."}
        let isMatch = await school.isValidPassword(password);
        if(isMatch){
            return {status: 200, school, message:"Success"}
        }
        else{
            return {status: 400, school:null, message:"Wrong password."}
        }
    }
}

module.exports = SchoolController;