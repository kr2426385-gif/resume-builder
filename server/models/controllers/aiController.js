//controller for enhancing resume using AI

import Resume from "../models/Resume.js";
import  ai  from "../configs/ai.js";

//Post: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userConent) {
      return res.status(400).json({ message: "Content is required" });
    }

    const response = await ai.chat.completions.create({
      model: "process.env.OPENAI_MODEL",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for enhancing resume. You will be provided with the professional summary of a resume and you have to enhance it by making it more professional and impactful. You can also add some relevant points to make it more effective. The enhanced professional summary should be concise and should not exceed 5 lines.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedSummary = response.choices[0].message.content;

    return res.status(200).json({ enhancedSummary });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//controller for enhancing resume using AI
//Post: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userConent) {
      return res.status(400).json({ message: "Content is required" });
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for enhancing resume. You will be provided with the job description of a resume and you have to enhance it by making it more professional and impactful. You can also add some relevant points to make it more effective. The enhanced job description should be concise and should not exceed 5 lines.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhancedJobDescription = response.choices[0].message.content;

    return res.status(200).json({ enhancedJobDescription });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//controller for uploading resume to the database
//Post: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPromt =
      "You are an expert Ai Agent to extract data fromt resume.";

    const userPromt = `Extract all the relevant data from the resume and convert it into a JSON format. The JSON should have the following structure:${resumeText}

Provide data in the following format:
{personal_info: {
    image: { type: String, default: "" },
    full_name: { type: String, default: "" },
    profession: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  experience: [
    {
      company: { type: String },
      position: { type: String },
      start_date: { type: String },
      end_date: { type: String },
      description: { type: String },
      is_current: { type: String },
    },
  ],
  project: [
    {
      name: { type: String },
      position: { type: String },
      description: { type: String },
    },
  ],

  education: [
    {
      institution: { type: String },
      degree:{type:String},
      field:{type:String},
      graduation_date:{type:String},
      gpa:{type:String}
      }]

}`;

    const response = await ai.chat.completions.create({
      model: "process.env.OPENAI_MODEL",
      messages: [
        {
          role: "system",
          content: systemPromt,
        },
        {
          role: "user",
          content: userPromt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });
    const extractedData = response.choices[0].message.content;
    const parseData = JSON.parse(extractedData);
    const newResume = await Resume.create({ userId, title, ...parseData });
    res.json({ resumeId: newResume._id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
