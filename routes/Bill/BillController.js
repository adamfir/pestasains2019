let BillModel = require('./BillModel');
let TeamController = require('../Team/TeamController');
let TeacherController = require('../Teacher/TeacherController');
let SchoolModel = require('../School/SchoolModel');
let PaymentEncription = require('../Midleware/PaymentEncription');
let axios = require('axios');
let BookingModel = require('../Booking/BookingModel');
let mongoose = require('mongoose');

class BillController {
    constructor(params) {
        
    }
    static async create(req,res,next){
        try{ //only for school
            let {type, school} = req.value.body, totalPrice = 0;
            if(type == 'registration'){
                let teams = await TeamController.findBySchool(school,{path: 'contest'});
                let teachers = await TeacherController.findBySchool(school);
                let totalStudent=0;
                for(let i=0; i<teams.length; i++){
                    let price = teams[i].contest.memberPerTeam * teams[i].contest.pricePerStundent;
                    totalPrice+=price;
                    totalStudent += teams[i].contest.memberPerTeam;
                }
                let totalTeachers = teachers.length;
                if(totalStudent<5){
                    totalPrice += (totalTeachers <= 1 ? totalTeachers*50000 : 1*50000+(totalTeachers-1)*100000);
                }
                else if(totalStudent<15){
                    totalPrice += (totalTeachers <= 2 ? totalTeachers*50000 : 2*50000+(totalTeachers-2)*100000);
                }
                else if(totalStudent<30){
                    totalPrice += (totalTeachers <= 3 ? totalTeachers*50000 : 3*50000+(totalTeachers-3)*100000);
                }
                else{
                    totalPrice += (totalTeachers <= 4 ? totalTeachers*50000 : 4*50000+(totalTeachers-4)*100000);
                }
                let schoolData = await SchoolModel.findById({_id:school}),
                    cid = '00298',
                    sck = '787b175aeb54a1e133fb71b5d2ebe11d';
                let data = {
                    type:"createbilling",
                    client_id: cid,
                    trx_id: mongoose.Types.ObjectId(),
                    trx_amount: totalPrice,
                    billing_type : "c",
                    customer_name : schoolData.name
                }
                let encryptedData = PaymentEncription.encrypt(data,cid,sck);
                // console.log("hallo");
                let request = await axios({
                    method: 'post',
                    headers: {'Content-Type':'application/json'},
                    url: 'http://103.56.206.107:3001/create',
                    data: {
                        client_id: cid,
                        data: encryptedData
                    }
                });
                console.log(request); 
                res.status(201).json({type, school, teams, teachers, totalPrice});
            }else if(type == 'accommodation'){
                /**
                 * Disini proses penghitungan tagihan penginapan.
                 * 1. Ambil data booking berdasarkan sekolah
                 * 2. Hitung jumlah biaya per orang berdasarkan accommodation
                 * 3. POST ke bank
                 * 4. simpan ke DB
                 */
                let bookings = await BookingModel.find({school}).populate('accommodation');
                for(let i=0; i<bookings.length; i++){
                    totalPrice+=bookings[i].accommodation.pricePerNight; // Kurang atribut durasi booking
                }
                return res.json({bookings, totalPrice});
            }else{
                throw new Error('invalid bill type');
            }
        }catch(e){
            res.status(400).json({message: e.message});
        }
    }
    static async callback(req,res,next){
        let {client_id, data} = req.body;
        console.log(client_id,data);
        return res.json({client_id,data});
    }
}

module.exports = BillController;