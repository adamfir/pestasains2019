let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs');

let teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    memberPerTeam:{
        type: Number,
        required: true
    },
    maxTeam:{
        type: Number,
        required: true
    }
});

// create a model
let Team = mongoose.model('Team', teamSchema);

// export the model
module.exports = Team;