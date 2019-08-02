let TeacherModel = require('./TeacherModel');

class TeacherController {
    constructor(params) {
        
    }
    static async create(req,res){
        try{
            let {name, email, phone, NIP, school} = req.value.body,
                teacher = await TeacherModel.create({name, email, phone, NIP, school});
            return res.status(201).json({message:"Success",teacher});
        }catch(e){
            return res.status(400).json({message:e.message,teacher:null});
        }
    }
    static async edit(req,res){
        try{
            let {_id, name, email, phone, NIP, school} = req.value.body,
                teacher = await TeacherModel.findByIdAndUpdate({_id},{name, email, phone, NIP, school});
            return res.status(201).json({message:"Success"});
        }catch(e){
            return res.status(400).json({message:e.message});
        }
    }
    static async delete(req,res){
        try{
            let {_id} = req.value.body,
                teacher = await TeacherModel.findByIdAndRemove({_id});
            return res.status(201).json({message:"Success"});
        }catch(e){
            return res.status(400).json({message:e.message});
        }
    }
}

module.exports = TeacherController;