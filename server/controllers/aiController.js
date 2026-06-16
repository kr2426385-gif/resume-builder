import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

const aiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Post: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Content is required" });
    }

    const response = await ai.chat.completions.create({
      model: aiModel,
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

// Post: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Content is required" });
    }
    const response = await ai.chat.completions.create({
      model: aiModel,
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

// Post: /api/ai/upload-resume
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
      model: aiModel,
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

// Post: /api/ai/generate-cover-letter
export const generateCoverLetter = async (req, res) => {
  try {
    const { resumeId, companyName, jobTitle } = req.body;
    const userId = req.userId;

    if (!resumeId || !companyName || !jobTitle) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Check ownership
    if (resume.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const name = resume.personal_info?.full_name || "Applicant";
    const profession = resume.personal_info?.profession || "";
    const email = resume.personal_info?.email || "";
    const phone = resume.personal_info?.phone || "";
    const location = resume.personal_info?.location || "";
    const summary = resume.professional_summary || "";
    const skills = resume.skills?.join(", ") || "";

    const expDetails = resume.experience?.map(exp => 
      `- ${exp.position} at ${exp.company} (${exp.start_date} to ${exp.end_date || 'Present'}): ${exp.description}`
    ).join("\n") || "";

    const projDetails = resume.project?.map(proj => 
      `- ${proj.name} (${proj.position}): ${proj.description}`
    ).join("\n") || "";

    const prompt = `
Generate a highly tailored and professional cover letter.
Candidate Details:
- Name: ${name}
- Profession/Job Role: ${profession}
- Email: ${email}
- Phone: ${phone}
- Location: ${location}
- Professional Summary: ${summary}
- Core Skills: ${skills}
- Work Experience:
${expDetails}
- Projects:
${projDetails}

Application Target:
- Target Job Title: ${jobTitle}
- Target Company: ${companyName}

Formatting Guidelines:
- Write in standard, professional business letter format.
- Avoid brackets like [Date] or [Insert Company Name] - write them out naturally or use realistic default values (e.g. today's date).
- Make the introduction attention-grabbing and highly relevant to the role at ${companyName}.
- In the body paragraphs, highlight key candidate accomplishments and align them with the responsibilities of a ${jobTitle}.
- Keep it concise, engaging, and under 350 words.
`;

    const response = await ai.chat.completions.create({
      model: aiModel,
      messages: [
        {
          role: "system",
          content: "You are an expert career advisor and professional resume writer."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const coverLetterText = response.choices[0].message.content;

    // Save cover letter to the database
    resume.cover_letter = coverLetterText;
    resume.cover_letter_company = companyName;
    resume.cover_letter_job = jobTitle;
    await resume.save();

    return res.status(200).json({ 
      coverLetter: coverLetterText,
      message: "Cover letter generated successfully" 
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
