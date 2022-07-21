"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profileModel_1 = __importDefault(require("../models/profileModel"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const setProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        let data = JSON.parse(req.body.data);
        const { dateOfBirth, address, degreeDetails, skillSetsAndTrade, desc } = data;
        const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.avatar;
        const fileTwo = (_b = req.files) === null || _b === void 0 ? void 0 : _b.degreeUpload;
        const fileThree = (_c = req.files) === null || _c === void 0 ? void 0 : _c.certificateUpload;
        let isAvatarInvalid = isInvalid(file, 'avatar');
        let isdegreeUploadInvalid = isInvalid(fileTwo, 'degreeUpload');
        let iscertificateUploadInvalid = isInvalid(fileThree, 'certificateUpload');
        var myCloud, myCloudTwo, myCloudThree;
        if (file) {
            if (isAvatarInvalid) {
                return res.status(400).json({
                    message: isAvatarInvalid
                });
            }
            myCloud = yield cloudinary_1.default.v2.uploader.upload(file.tempFilePath, {
                folder: 'avatars',
                width: 150,
                crop: 'scale'
            });
        }
        if (fileTwo) {
            if (isdegreeUploadInvalid) {
                return res.status(400).json({
                    message: isdegreeUploadInvalid
                });
            }
            myCloudTwo = yield cloudinary_1.default.v2.uploader.upload(fileTwo.tempFilePath, {
                folder: 'degree'
            });
        }
        if (fileThree) {
            if (iscertificateUploadInvalid) {
                return res.status(400).json({
                    message: iscertificateUploadInvalid
                });
            }
            myCloudThree = yield cloudinary_1.default.v2.uploader.upload(fileThree.tempFilePath, {
                folder: 'certificate'
            });
        }
        let oldProfile = yield profileModel_1.default.findById(req.user._id);
        if (oldProfile) {
            oldProfile.dateOfBirth = dateOfBirth;
            oldProfile.address = address;
            oldProfile.degreeDetails = degreeDetails;
            oldProfile.skillSetsAndTrade = skillSetsAndTrade;
            oldProfile.desc = desc;
            if (file) {
                oldProfile.avatar = {
                    public_id: myCloud === null || myCloud === void 0 ? void 0 : myCloud.public_id,
                    url: myCloud === null || myCloud === void 0 ? void 0 : myCloud.secure_url
                };
            }
            if (fileTwo) {
                oldProfile.degreeUpload = {
                    public_id: myCloudTwo === null || myCloudTwo === void 0 ? void 0 : myCloudTwo.public_id,
                    url: myCloudTwo === null || myCloudTwo === void 0 ? void 0 : myCloudTwo.secure_url
                };
            }
            if (fileThree) {
                oldProfile.certificateUpload = {
                    public_id: myCloudThree === null || myCloudThree === void 0 ? void 0 : myCloudThree.public_id,
                    url: myCloudThree === null || myCloudThree === void 0 ? void 0 : myCloudThree.secure_url
                };
            }
            yield oldProfile.save();
            res.status(200).json({ success: true, message: 'Successfully updated profile', data: oldProfile });
        }
        else {
            if (!file || !fileTwo || !fileThree) {
                return res.status(400).json({
                    message: 'All files not added'
                });
            }
            // setting same id for userModel and profileModel
            console.log('here ss', skillSetsAndTrade);
            const userProfile = yield profileModel_1.default.create({
                _id: new mongoose_1.default.Types.ObjectId(req.user._id),
                avatar: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                dateOfBirth,
                address,
                degreeDetails,
                degreeUpload: {
                    public_id: myCloudTwo.public_id,
                    url: myCloudTwo.secure_url
                },
                skillSetsAndTrade,
                desc,
                certificateUpload: {
                    public_id: myCloudThree.public_id,
                    url: myCloudThree.secure_url
                }
            });
            res.status(200).json({ success: true, message: 'Successfully created profile', data: userProfile });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.user);
        let profile = yield profileModel_1.default.findById(req.user._id);
        if (profile) {
            return res.send({ profile, success: true });
        }
        res.status(200).send({ success: false, message: 'not found' });
    }
    catch (e) {
        console.log(e);
        res.send({ error: e });
    }
});
// return message if is invalid
const isInvalid = (file, tag) => {
    const maxFileSize = 2 * 1024 * 1024; // 1 mb = 1*1024*1024
    const allowedExtension = {
        avatar: ['.png', '.jpg', '.jpeg'],
        degreeUpload: ['.pdf'],
        certificateUpload: ['.pdf']
    };
    if (!file) {
        return tag + ' not exists';
    }
    else if (file.size > maxFileSize) {
        return tag + ' size must be less then 2MB';
    }
    else if (!allowedExtension[tag].includes(path_1.default.extname(file.name))) {
        return 'Invalid file extension of' + tag;
    }
    else {
        return false;
    }
};
exports.default = { setProfile, getProfile };
