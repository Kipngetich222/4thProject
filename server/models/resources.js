import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    file_path: {
        type: String,
        required: true
    },
    file_type: {
        type: String,
        required: true,
        enum: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'image', 'video', 'other']
    },
    file_size: {
        type: Number,
        required: true
    },
    downloads: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
