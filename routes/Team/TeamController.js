let TeamModel = require('./TeamModel');
let ContestModel = require('../Contest/ContestModel');
let StudentModel = require('../Student/StudentModel');

class TeamController {
    constructor(params) {
        
    }
    static async create(req,res){
        try{
            let {name, contest, student} = req.value.body,
                {privilege,sub} = req.decoded;
            if(privilege != 'school'){
                return res.status(401).json({success:false,team:null});
            }
            contest = await ContestModel.findById({_id:contest});
            let maxTeam = contest.maxTeam;
            let teamRegistered = await TeamModel.count({contest});
            if(teamRegistered >= maxTeam){
                return res.status(200).json({success:false, message:"Kuota sudah penuh", team:null})
            }
            let team = await TeamModel.create({name, contest, school:sub, student});
            for (let i = 0; i < student.length; i++) {
                await StudentModel.findByIdAndUpdate({_id:student[i]},{team:team._id});
            }
            return res.status(201).json({success:true,team});
        }catch(e){
            return res.status(400).json({success:false,team:null,message:e.message});
        }
    }
    static async list(req,res){
        try{
            let {school, contest} = req.query, teams=null;
            if(school){
                teams = await TeamModel.find({school});
            }else if(contest){
                teams = await TeamModel.find({contest});
            }else{
                teams = await TeamModel.find({});
            }
            return res.status(200).json({message:"Success",teams});
        }catch(e){
            return res.status(500).json({message:e.message,teams:null});
        }
    }
    static async get(req,res){
        try{
            let {_id} = req.params,
                team = await TeamModel.findById({_id});
            return res.status(200).json({message:"Success", team});
        }catch(e){
            return res.status(500).json({message:e.message, team:null});
        }
    }
    static async edit(req,res){
        try{
            let {_id, name, student} = req.value.body,
                {sub, privilege} = req.decoded,
                team = await TeamModel.findById({_id});
            if(team.school != sub){
                return res.status(401).json({message:"Not allowed, school id not match."});
            }
            // hapus id tim di student
            for (let i = 0; i < team.student.length; i++) {
                await StudentModel.findByIdAndUpdate({_id:team.student[i]},{team:null});
            } 
            await team.update({name,student});
            // assign id tim ke student baru
            for (let i = 0; i < student.length; i++) {
                await StudentModel.findByIdAndUpdate({_id:student[i]},{team:team._id});
            }
            return res.status(200).json({message:"Success"});
        }catch(e){
            return res.status(400).json({message:e.message})
        }
    }
    static async delete(req,res){
        try{
            let {_id} = req.params,
                {sub} = req.decoded,
                team = await TeamModel.findById({_id});
            console.log(_id);
            // if(sub != team.school){
            //     return res.status(401).json({message:"Not allowed, school id not match."});
            // }
            for (let i = 0; i < team.student.length; i++) {
                await StudentModel.findByIdAndUpdate({_id:team.student[i]},{team:null});
            }
            if(team.isPaid == true)
                return res.status(400).json({success:false, message:"Team sudah dibayar, tidak dapat dihapus."});
            await team.remove();
            return res.status(200).json({success:true, message:"Success"});
        }catch(e){
            return res.status(400).json({success:false, message:e.message});
        }
    }
    static async populatedTeams(teams){
        let populatedTeams = [];
        for(let i=0;i<teams.length;i++){
            let temp = await TeamModel.findById({_id:teams[i]}).populate('contest','pricePerStudent');
            populatedTeams.push(temp);
        }
        return populatedTeams;
    }
    static async findBySchool(school,populate){
        try{
            let teams = null;
            if(populate){
                teams = await TeamModel.find({school,isPaid:{$ne:true}}).populate(populate);
            }
            return teams;
        }
        catch(e){
            throw e;
        }
    }
    static async count(req,res){
        try {
            let {school} = req.params,
                totalTeams = await TeamModel.count({school});
            return res.status(200).json({totalTeams});
        } catch (e) {
            return res.status(400).json({message:e.message, totalTeams:null});
        }
    }
}

module.exports = TeamController;