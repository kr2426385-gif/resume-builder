import { transcode } from "buffer";
import imagekit from "../configs/imagekit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

//controller for creating a new resume
//Post: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { titile } = req.body;

    //create new resume
    const newResume = await Resume.create({
      userId,
      titile,
    });

    //return success message
    return res.status(201).json({
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//controller for deleting a resume
//Delete: /api/resumes/:id
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId });

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//get user resume by id
//Get: /api/resumes/:id
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resume._v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//get resume by id public
//Get: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ _id: resumeId, public: true });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//controller for updating a resume
//Put: /api/resumes/:id
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy = JSON.parse(resumeData);

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

      const response = await imagekit.files.upload({
        files: imageBufferData,
        fileName: "resume.png",
        folder:"user-resumes",
        transformation:{
            pre: 'w-300,h-300,fo-face,z-0.75'+(removeBackground ? ",e-background_removal" : "")
        }
      });

      resumeDataCopy.personal_info.image = response.url;
    }

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true },
    );
    return res
      .status(200)
      .json({ message: "Resume updated successfully", resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//
