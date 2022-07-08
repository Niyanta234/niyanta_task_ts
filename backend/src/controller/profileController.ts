import Profile  from "../models/profileModel";
import { Request, Response, NextFunction } from 'express';
import cloudinary from "cloudinary";
import path from "path";
import fileUpload from "express-fileupload";

const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file:any = req.files?.avatar;
    const fileTwo:any = req.files?.degreeUpload;
    const fileThree:any = req.files?.certificateUpload;

    let maxFileSize = 2*1024*1024; // 1 mb = 1*1024*1024
    if (file.size > maxFileSize) {
      return res.status(422).json({
        message: "Profile Picture size must be less then 2MB",
      });
    }
    if (fileTwo.size > maxFileSize) {
      return res.status(422).json({
        message: "Degree upload size must be less then 2MB",
      });
    }
    if (fileThree.size > maxFileSize) {
      return res.status(422).json({
        message: "Certificate size must be less then 2MB",
      });
    }

    const allowedExtension = [".png", ".jpg", ".jpeg"];
    const allowedExtensionTwoOrThree = [".pdf"];

    if (!allowedExtension.includes(path.extname(file.name))) {
      return res.status(422).json({
        message:
          "Invalid Image type profile picture should contain png, jpg, or jpeg",
      });
    }

    if (!allowedExtensionTwoOrThree.includes(path.extname(fileTwo.name))) {
      return res.status(422).json({
        message: "Invalid degree upload It should contain pdf",
      });
    }

    if (!allowedExtensionTwoOrThree.includes(path.extname(fileThree.name))) {
      return res.status(422).json({
        message: "Invalid certificate upload It should contain pdf",
      });
    }
    const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    const myCloudTwo = await cloudinary.v2.uploader.upload(
      fileTwo.tempFilePath,
      {
        folder: "degree",
      }
    );
    const myCloudThree = await cloudinary.v2.uploader.upload(
      fileThree.tempFilePath,
      {
        folder: "certificate",
      }
    );
    let data = JSON.parse(req.body.data);
    const { dateOfBirth, address, degreeDetails, skillSetsAndTrade, desc } =
      data;
    const userProfile = await Profile.create({
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      dateOfBirth,
      address,
      degreeDetails,
      degreeUpload: {
        public_id: myCloudTwo.public_id,
        url: myCloudTwo.secure_url,
      },
      skillSetsAndTrade,
      desc,
      certificateUpload: {
        public_id: myCloudThree.public_id,
        url: myCloudThree.secure_url,
      },
    });
    res.status(200).json({ data: userProfile });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}
export default {profile}