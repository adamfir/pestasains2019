let BookingModel = require('./BookingModel');

class BookingController {
    static async create(req,res){
        try{
            let {userType, student, teacher, accommodation} = req.value.body,
                booking = null,
                school = req.decoded.sub;
            if(userType == 'student'){
                booking = await BookingModel.create({school, userType, student, accommodation});
            } else if(userType == 'teacher'){
                booking = await BookingModel.create({school, userType, teacher, accommodation});
            } else{
                throw new Error('userType invalid'); 
            }
            return res.status(201).json({message:"Success", booking});
        }catch(e){
            return res.status(400).json({message: e.message});
        }
    }
    static async list(req,res){
        try{
            let {privilege,sub} = req.decoded,
                bookings = null;
            if(privilege == 'admin'){
                bookings = await BookingModel.find({});
            }
            else if(privilege == 'school'){
                bookings = await BookingModel.find({school:sub});
            }
            else {
                throw new Error('Privilege invalid')
            }
            return res.status(200).json({bookings});
        }catch(e){
            return res.status(400).json({bookings:null, message:e.message});
        }
    }
    static async delete(req,res){
        try {
            let {_id} = req.value.body,
                booking = await BookingModel.deleteOne({_id});
            return res.status(200).json({message:"Success",booking});
        
        } catch (e) {
            return res.status(400).json({message:e.message, booking:null});
        }
    }
}
module.exports = BookingController;