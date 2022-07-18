import Profile from '../models/profileModel';
import { Request, Response, NextFunction } from 'express';
import cloudinary from 'cloudinary';
import path from 'path';
import mongoose from 'mongoose';

const setProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let data = JSON.parse(req.body.data);
        const { dateOfBirth, address, degreeDetails, skillSetsAndTrade, desc } = data;

        const file: any = req.files?.avatar;
        const fileTwo: any = req.files?.degreeUpload;
        const fileThree: any = req.files?.certificateUpload;

        let isAvatarInvalid = isInvalid(file, 'avatar');
        let isdegreeUploadInvalid = isInvalid(fileTwo, 'degreeUpload');
        let iscertificateUploadInvalid = isInvalid(fileThree, 'certificateUpload');

        var myCloud: any, myCloudTwo: any, myCloudThree: any;
        if (file) {
            if (isAvatarInvalid) {
                return res.status(400).json({
                    message: isAvatarInvalid
                });
            }
            myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
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
            myCloudTwo = await cloudinary.v2.uploader.upload(fileTwo.tempFilePath, {
                folder: 'degree'
            });
        }
        if (fileThree) {
            if (iscertificateUploadInvalid) {
                return res.status(400).json({
                    message: iscertificateUploadInvalid
                });
            }
            myCloudThree = await cloudinary.v2.uploader.upload(fileThree.tempFilePath, {
                folder: 'certificate'
            });
        }

        let oldProfile = await Profile.findById((req as any).user._id);
        if (oldProfile) {
            oldProfile.dateOfBirth = dateOfBirth;
            oldProfile.address = address;
            oldProfile.degreeDetails = degreeDetails;
            oldProfile.skillSetsAndTrade = skillSetsAndTrade;
            oldProfile.desc = desc;
            if (file) {
                oldProfile.avatar = {
                    public_id: myCloud?.public_id,
                    url: myCloud?.secure_url
                };
            }
            if (fileTwo) {
                oldProfile.degreeUpload = {
                    public_id: myCloudTwo?.public_id,
                    url: myCloudTwo?.secure_url
                };
            }
            if (fileThree) {
                oldProfile.certificateUpload = {
                    public_id: myCloudThree?.public_id,
                    url: myCloudThree?.secure_url
                };
            }
            await oldProfile.save();
            res.status(200).json({ success: true, message: 'Successfully updated profile', data: oldProfile });
        } else {
            if (!file || !fileTwo || !fileThree) {
                return res.status(400).json({
                    message: 'All files not added'
                });
            }
            // setting same id for userModel and profileModel
            console.log('here ss', skillSetsAndTrade);
            const userProfile = await Profile.create({
                _id: new mongoose.Types.ObjectId((req as any).user._id),
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
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
};

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log((req as any).user);
        let profile = await Profile.findById((req as any).user._id);
        if (profile) {
            return res.send({ profile, success: true });
        }
        res.status(200).send({ success: false, message: 'not found' });
    } catch (e: any) {
        console.log(e);
        res.send({ error: e });
    }
};

// return message if is invalid
const isInvalid = (file: any, tag: string) => {
    const maxFileSize = 2 * 1024 * 1024; // 1 mb = 1*1024*1024
    const allowedExtension: any = {
        avatar: ['.png', '.jpg', '.jpeg'],
        degreeUpload: ['.pdf'],
        certificateUpload: ['.pdf']
    };

    if (!file) {
        return tag + ' not exists';
    } else if (file.size > maxFileSize) {
        return tag + ' size must be less then 2MB';
    } else if (!allowedExtension[tag].includes(path.extname(file.name))) {
        return 'Invalid file extension of' + tag;
    } else {
        return false;
    }
};

export default { setProfile, getProfile };
