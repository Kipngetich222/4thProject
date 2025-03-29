import mongoose from 'mongoose';

const resourcesSchema  = new mongoose.Shema({
    teacher_id : {type : mongoose.Schema.Types.ObjectId, ref : teachers},
    title : {type :String},
    description : {type : String},
    file_path : {type :String},
    created_at : {type : Date},
    updated_at : {type : Date}
})