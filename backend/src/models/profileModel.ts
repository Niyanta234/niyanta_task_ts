import mongoose from 'mongoose';
import validator from 'validator';
const profileSchema = new mongoose.Schema({
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
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
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    skillSetsAndTrade: {
        skillSets: {
            Welder: {
                type: String
                // enum: ['Juniar', 'Intermidiate', 'Senior', 'Lead']
            },
            Fitter: {
                type: String
                // enum: ['Juniar', 'Intermidiate', 'Senior', 'Lead']
            },
            Wigger: {
                type: String
                // enum: ['Juniar', 'Intermidiate', 'Senior', 'Lead']
            },
            Sactfolder: {
                type: String
                // enum: ['Juniar', 'Intermidiate', 'Senior', 'Lead']
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
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
});
export default mongoose.model('Profile', profileSchema);
