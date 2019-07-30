let TeamModel = require('./Model');

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
            let team = await TeamModel.create({name, contest, school:sub, student});
            return res.status(201).json({success:true,team});
        }catch(e){
            return res.status(500).json({success:false,team:null});
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
            await team.update({name,student});
            return res.status(200).json({message:"Success"});
        }catch(e){
            return res.status(400).json({message:e.message})
        }
    }
    static async delete(req,res){
        try{
            let {_id} = req.value.body,
                {sub} = req.decoded,
                team = await TeamModel.findById({_id});
            console.log(_id);
            if(sub != team.school){
                return res.status(401).json({message:"Not allowed, school id not match."});
            }
            await team.remove();
            return res.status(200).json({success:true, message:"Success"});
        }catch(e){
            return res.status(400).json({success:false, message:e.message});
        }
    }
}

module.exports = TeamController;