import mongoose,{Schema} from "mongoose"

const profileSchema = new Schema(
{
     userId:{
        type:String,
        
    },
    url:{
        type:String,
        
    }
}
,{timestamps:true});

export const Profile = mongoose.model("Profile",profileSchema);