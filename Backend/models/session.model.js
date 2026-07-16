import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: String,
        required:true
    },
    refreshTokenHash:{
         type: String,
        required:true
    },
    ip: {
         type: String,
        required:true
    },
    userAgent:{
         type: String,
        required:true
    },
    revoked:{
         type: Boolean,
    }
},{
    timestamps: true
})

const sessionModel = mongoose.model("sessions",sessionSchema);
 export default sessionModel;