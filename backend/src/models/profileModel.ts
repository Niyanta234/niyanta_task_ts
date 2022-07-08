import mongoose from 'mongoose';
import validator from 'validator';
const profileSchema = new mongoose.Schema({
    avatar: {
        public_id: {
            type: String,
            required: true,
            default: '1hjkjhd'
        },
        url: {
            type: String,
            required: true,
            default: 'xyz.png'
        }
    },
    dateOfBirth: {
        type: Date,
        require: true,
        default: Date.UTC(1990, 1, 0)
    },
    address: {
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: {
            type: String,
            required: true
        },
        postalCode: {
            type: Number,
            reqired: true,
            maxlength: 6,
            minlength: 6
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        LGA: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        DailyWages: {
            type: Number,
            required: true
        }
    },
    degreeDetails: {
        type: String,
        required: true
    },
    degreeUpload: {
        public_id: {
            type: String,
            required: true,
            default: 'xyz'
        },
        url: {
            type: String,
            required: true,
            default: 'xyz.png'
        }
    },
    skillSetsAndTrade: {
        skillset: {
            welder: {
                type: String,
                enum: ['juniar', 'intermidiate', 'senior', 'lead']
            },
            fitter: {
                type: String,
                enum: ['juniar', 'intermidiate', 'senior', 'lead']
            },
            wigger: {
                type: String,
                enum: ['juniar', 'intermidiate', 'senior', 'lead']
            },
            sactfolder: {
                type: String,
                enum: ['juniar', 'intermidiate', 'senior', 'lead']
            }
        }
    },
    desc: {
        type: String,
        required: true
    },
    certificateUpload: {
        public_id: {
            type: String,
            required: true,
            default: '1hjkjhd'
        },
        url: {
            type: String,
            required: true,
            default: 'xyz.png'
        }
    }
});
export default mongoose.model('Profile', profileSchema);
