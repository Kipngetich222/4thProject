// import mongoose from 'mongoose';

// //this table stores the assingnment information given to students
// const assingmentSchema = new mongoose.Schema({
//     assinment_id : {type : String, index: true ,  uniquie : true},
//     //class_id : {type : mongoose.Schema.Typed.ObjectId},
//     title : {type : String, reaquired : true},
//     description : {type : String, required : true},
//     due_date : {type : Date},
//     classes : {type : String},
//     subject : {type : String},
//     created_at : {type : Date, default : Date.now()},
//     updated_at : {type : Date, default : Date.now()}
// })

import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    // Uncomment and use class_id if you want to link assignments to a specific class
    // class_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Class', // Assuming there's a 'Class' model
    // },
    // Title of the assignment
    title: {
        type: String,
        required: true, // Marks this field as mandatory
    },
    // Detailed description of the assignment
    description: {
        type: String,
        required: true, // Marks this field as mandatory
    },
    // Due date for the assignment
    due_date: {
        type: Date, // Stores the date in ISO format
    },
    // Class(es) associated with the assignment
    classes: {
        type: [String], // You can replace this with an array if needed: [String]
    },
    // Subject of the assignment
    subject: {
        type: String,
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Compile the schema into a model
const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
