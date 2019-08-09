let AccommodationModel = require('./AccommodationModel'),
    express = require('express');

class AccommodationController {
    static async create(req,res,next){
        try{
            let {name, quota, pricePerNight} = req.value.body,
                accommodation = await AccommodationModel.create({name, quota, pricePerNight});
            return res.status(201).json({accommodation});
            
        }catch(e){
            return res.status(400).json({accommodation:null, message:e.message});
        }
    }
    static async list(req,res){
        try{
            let accommodations = await AccommodationModel.find({});
            return res.status(200).json({accommodations});
        }catch(e){
            return res.status(400).json({accommodations:null, message: e.message});
        }
    }
    static async edit(req,res,next){
        try{
            let {_id, name, quota, pricePerNight} = req.value.body;
            let update = {};
            (name!=null?update.name=name:update);
            (quota!=null?update.quota=quota:update);
            (pricePerNight!=null?update.pricePerNight=pricePerNight:update);
            // (remainingQuota==null?update.remainingQuota=remainingQuota:update);
            console.log(update);
            let accommodation = await AccommodationModel.findByIdAndUpdate({_id},update);
            return res.status(200).json({message:"success"});
        }catch(e){
            return res.status(400).json({message: e.message});
        }
    }
    static async delete(req,res,next){
        try{
            let {_id} = req.params,
                accommodation = await AccommodationModel.deleteOne({_id});
            return res.status(200).json({message: "Success"});
        }catch(e){
            return res.status(400).json({message: "Failed"});
        }
    }
}

module.exports = AccommodationController;