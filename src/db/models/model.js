const mong = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongSchema = new mong.Schema({
    fullName:           {type:String},
    email:              {type:String},
    password:           {type:String},
    confirmPassword:    {type:String},
    gender:             {type:String},
    languages:[         {type:String}
    ],
    profession:         {type:String},
    phone:              {type:Number},
    address:            {type:String},
    tokens: [
        {
            token:{
                type:String
            }
        }
    ]
});

mongSchema.methods.authToken = async function (){
    try {
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        console.log(`Token saved`);
        return token;
    } catch (error) {
        console.log(`Error occured while generating the token ${error}`);
    }
};  

mongSchema.pre('save', async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = undefined;
    }
    next();
});

const MongModel = new mong.model("Collection1", mongSchema);

module.exports = MongModel;