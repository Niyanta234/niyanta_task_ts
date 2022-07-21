"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profileSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('Profile', profileSchema);
