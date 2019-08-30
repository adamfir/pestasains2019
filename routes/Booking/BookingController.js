let BookingModel = require('./BookingModel');
let StudentModel = require('../Student/StudentModel');
let TeacherModel = require('../Teacher/TeacherModel');
class BookingController {
    static async create(req,res){
        try{
            let {userType, student, teacher, accommodation, startDate} = req.value.body,
                booking = null,
                school = req.decoded.sub;
            if(userType == 'student'){
                booking = await BookingModel.create({school, userType, student, accommodation, startDate});
                await StudentModel.findByIdAndUpdate({_id:student},{accommodationBooking:true,accommodationBookingId:booking._id});
            } else if(userType == 'teacher'){
                booking = await BookingModel.create({school, userType, teacher, accommodation, startDate});
                await TeacherModel.findByIdAndUpdate({_id:teacher},{accommodationBooking:true,accommodationBookingId:booking._id});
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
            let {_id} = req.params,
                booking = await BookingModel.findById({_id});
            if(booking.isFinal)
                return res.status(400).json({message:"Gagal", message:"Status booking telah final."})
            if(booking.userType == 'student'){
                await StudentModel.findByIdAndUpdate({_id:booking.student},{accommodationBooking:false,accommodationBookingId:null})
            }
            else if(booking.userType == 'teacher'){
                await TeacherModel.findByIdAndUpdate({_id:booking.teacher},{accommodationBooking:false,accommodationBookingId:null})
            }
            await booking.remove();
            return res.status(200).json({message:"Success",booking});
        
        } catch (e) {
            return res.status(400).json({message:e.message, booking:null});
        }
    }
}
module.exports = BookingController;