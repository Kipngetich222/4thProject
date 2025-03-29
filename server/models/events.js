import mongoose from 'mongoose';

//table stored events such as parent-teacher meetings, school events etc
const eventsSchema = new mongoose.Schema({
    event_name : {type :String, index : true, required : true},
    event_description : {type : String},
    event_date : {type : Date},
    event_time : {type : Date},
    organizer_id : {type : mongoose.Schema.Types.ObjectId, ref : users},
    created_at : {type : Date, default : Date.now()},
    updated_at : {type : Date, default : Date.now()}
})