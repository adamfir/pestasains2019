let BillModel = require('./BillModel');
// let TeamController = require('../Team/TeamController');
let TeamModel = require('../Team/TeamModel');
// let TeacherController = require('../Teacher/TeacherController');
let SchoolModel = require('../School/SchoolModel');
let StudentModel = require('../Student/StudentModel');
let TeacherModel = require('../Teacher/TeacherModel');
let PaymentEncription = require('../Midleware/PaymentEncription');
let axios = require('axios');
let BookingModel = require('../Booking/BookingModel');
let mongoose = require('mongoose');
let cid = '00298', sck = '787b175aeb54a1e133fb71b5d2ebe11d';
let ParamModel = require('../Params/ParamModel');
class BillController {
    constructor(params) {
        
    }
    static async create(req,res,next){
        try{ //only for school
            let {type, school} = req.value.body, 
                totalPrice = 0,
                cid = '00298',
                sck = '787b175aeb54a1e133fb71b5d2ebe11d',
                teams=null,
                teachers=null,
                numberOfStudent=0,
                numberOfTeacher=null,
                trx_id = mongoose.Types.ObjectId(),
                lastVA = await ParamModel.findOne({code:"VA"}),
                firstVA = Math.floor(1000 + Math.random() * 9000),
                VA = firstVA.toString() + lastVA.toString();
            lastVA.value += 1;
            lastVA.save();
            school = await SchoolModel.findById({_id:school});
            if(type == 'registration'){
                teams = await TeamModel.find({school,isPaid:{$ne:true}}).populate({path: 'contest'}); //TeamController.findBySchool(school._id,{path: 'contest'});
                teachers = await TeacherModel.find({school:school._id, isPaid : {$ne:true}});//TeacherController.findBySchool(school._id);
                numberOfTeacher = teachers.length;
                if(teams.length == 0 && teachers.length == 0)
                    return res.status(400).json({message:"Tidak ada tim atau guru pendamping yang belum dibayar. Silahkan tambahkan tim atau guru pendamping baru.",bill:null}); 
                let totalStudent = await StudentModel.count({school:school._id}),
                    totalTeacher = await TeacherModel.count({school:school._id});
                if(teams.length != 0){
                    for(let i=0; i<teams.length; i++){
                        let price = parseInt(teams[i].contest.memberPerTeam) * parseInt(teams[i].contest.pricePerStudent);
                        console.log(40,price,teams[i].contest.memberPerTeam,teams[i].contest.pricePerStudent);
                        totalPrice+=price;
                        numberOfStudent += teams[i].contest.memberPerTeam;
                        teams[i].isPaid = true;
                        await teams[i].save();
                    }
                }
                console.log(46, totalPrice);
                if(teachers.length != 0){
                    if(totalStudent<5){
                        if(totalTeacher-numberOfTeacher >= 1){
                            totalPrice += numberOfTeacher*100000;
                        }
                        else{
                            totalPrice += (numberOfTeacher <= 1 ? numberOfTeacher*50000 : 1*50000+(numberOfTeacher-1)*100000);
                        }
                    }
                    else if(totalStudent<15){
                        if(totalTeacher-numberOfTeacher >= 2){
                            totalPrice += numberOfTeacher*100000;
                        }
                        else{
                            let distToTreshold = (totalTeacher > 2 ? 0 : 2-totalTeacher);
                            totalPrice += distToTreshold*50000 + (numberOfTeacher-distToTreshold)*100000;
                        }
                    }
                    else if(totalStudent<30){
                        if(totalTeacher-numberOfTeacher >= 3){
                            totalPrice += numberOfTeacher*100000;
                        }
                        else{
                            let distToTreshold = (totalTeacher > 3 ? 0 : 3-totalTeacher);
                            totalPrice += distToTreshold*50000 + (numberOfTeacher-distToTreshold)*100000;
                        }
                    }
                    else{
                        if(totalTeacher-numberOfTeacher >= 4){
                            totalPrice += numberOfTeacher*100000;
                        }
                        else{
                            let distToTreshold = (totalTeacher > 4 ? 0 : 4-totalTeacher);
                            totalPrice += distToTreshold*50000 + (numberOfTeacher-distToTreshold)*100000;
                        }
                    }
                    for(let i=0; i<numberOfTeacher; i++){
                        teachers[i].isPaid = true;
                        await teachers[i].save();
                    }
                }
                console.log(87, totalPrice);
            }else if(type == 'accommodation'){
                /**
                 * Disini proses penghitungan tagihan penginapan.
                 * 1. Ambil data booking berdasarkan sekolah
                 * 2. Hitung jumlah biaya per orang berdasarkan accommodation
                 * 3. POST ke bank
                 * 4. simpan ke DB
                 */
                // let bookings = await BookingModel.find({school}).populate('accommodation');
                // for(let i=0; i<bookings.length; i++){
                //     totalPrice+=bookings[i].accommodation.pricePerNight; // Kurang atribut durasi booking
                // }
                // return res.json({bookings, totalPrice, message: "API belum siap."});
            }else{
                throw new Error('invalid bill type');
            }
            console.log(108, totalPrice);
            totalPrice += Math.floor(Math.random()*(899)+100);
            // throw new Error(totalPrice);
            let data = {
                type:"createbilling",
                client_id: cid,
                trx_id,
                trx_amount: totalPrice,
                billing_type : "c",
                customer_name : school.name,
                virtual_account: VA
            }
            let encryptedData = PaymentEncription.encrypt(data,cid,sck),
                request = await axios({
                    method: 'post',
                    headers: {'Content-Type':'application/json'},
                    url: 'http://103.56.206.107:3001/create',
                    data: {
                        client_id: cid,
                        data: encryptedData
                    }
                });
            // console.log(request,data);
            let result = request.data.data, decryptedData = PaymentEncription.decrypt(result.data,cid,sck),
                bill = null;
            // console.log(result);
            if(type == 'registration'){
                bill = await BillModel.create({
                    _id:trx_id,type,totalPrice,VANumber:decryptedData.virtual_account,
                    payment:{status:'waiting'},school,registration:
                    {
                        teams,teachers,numberOfStudent:numberOfStudent,numberOfTeacher:numberOfTeacher
                    }
                });
            }
            return res.status(201).json({bill});
        }catch(e){
            res.status(400).json({message: e.message});
        }
    }
    static async callback(req,res,next){
        // urus lagi nanti, update bill ke database
        try {
            let {client_id, data} = req.body,
                decryptedData = PaymentEncription.decrypt(data,cid,sck);
            let bill = await BillModel.findByIdAndUpdate({_id:decryptedData.trx_id},{payment:{status:'paid',data:Date.now()}});
            console.log({trx: data.trx_id, message:"Bill berhasil diupdate"});
            return res.json({trx: data.trx_id, message:"Bill berhasil diupdate"});
        } catch (e) {
            return res.json({message:e.message});
        }
    }
    static async get(req,res){
        let {_id} = req.params;
        try{
            let bill = await BillModel.findById({_id});
            return res.json({bill});
        }catch(e){
            return res.json({message:e.message});
        }
    }
    static async listBySchool(req,res){
        let {school} = req.params;
        try{
            let bills = await BillModel.find({school});
            return res.json({bills});
        }catch(e){
            return res.json({message:e.message});
        }
    }
    static async count(req,res){
        try {
            let {school} = req.params,
                totalBill = await BillModel.count({school});
            return res.status(200).json({totalBill});
        } catch (e) {
            return res.status(400).json({message:e.message, totalBill:null});
        }
    }
}

module.exports = BillController;