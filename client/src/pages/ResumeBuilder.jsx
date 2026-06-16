import { useEffect, useState } from "react";
import ATSScore from "../components/ATSScore";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";

import PersonalInfoForm from "../components/PersonalInfoForm.jsx";
import ResumePreview from "../components/ResumePreview.jsx";
import TemplateSelector from "../components/TemplateSelector.jsx";
import ColorPicker from "../components/ColorPicker.jsx";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm.jsx";
import Experience from "../components/Experience.jsx";
import EducationForm from "../components/EducationForm.jsx";
import ProjectForm from "../components/ProjectForm.jsx";
import SkillsForm from "../components/SkillsForm.jsx";
import api from "../configs/api.js";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: " ",
    personal_info: {},
    professional_summary: " ",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "3882F6",
    public: false,
    cover_letter: "",
    cover_letter_company: "",
    cover_letter_job: "",
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
    { id: "coverletter", name: "Cover Letter", icon: FileText },
  ];

  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`);
      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadExistingResume();
  }, [resumeId]);

  const saveResume = async (overrides = {}) => {
    const nextResumeData = { ...resumeData, ...overrides };
    const image = nextResumeData.personal_info?.image;
    const resumeDataToSave = {
      ...nextResumeData,
      personal_info: {
        ...nextResumeData.personal_info,
        image: image instanceof File ? "" : image || "",
      },
    };

    const formData = new FormData();
    formData.append("resumeId", resumeId);
    formData.append("resumeData", JSON.stringify(resumeDataToSave));
    formData.append("removeBackground", String(removeBackground));
    if (image instanceof File) {
      formData.append("image", image);
    }

    const { data } = await api.put("/api/resumes/update", formData);
    setResumeData(data.resume);
    toast.success(data.message);
    return data.resume;
  };

  const changeResumeVisibility = async () => {
    try {
      await saveResume({ public: !resumeData.public });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleShare = async () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontendUrl + "/view/" + resumeId;

    try {
      setIsSharing(true);
      if (!resumeData.public) {
        await saveResume({ public: true });
      }

      if (navigator.share) {
        await navigator.share({ url: resumeUrl, text: "My Resume" });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(resumeUrl);
        toast.success("Share link copied");
      } else {
        window.prompt("Copy your resume link", resumeUrl);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const downloadResume = () => {
    window.print();
  };

  // Dynamic ATS Score computation
  const calculateATSScore = () => {
    let score = 30;
    const personal = resumeData.personal_info || {};
    if (personal.email && personal.phone) score += 15;
    if (personal.full_name && personal.profession) score += 10;
    if (resumeData.professional_summary && resumeData.professional_summary.trim().length > 30) score += 15;
    if (resumeData.experience && resumeData.experience.length > 0) {
      score += 15;
      if (resumeData.experience.some((exp) => exp.description && exp.description.trim().length > 50)) {
        score += 5;
      }
    }
    if (resumeData.education && resumeData.education.length > 0) score += 10;
    if (resumeData.project && resumeData.project.length > 0) score += 10;
    if (resumeData.skills && resumeData.skills.length > 0) {
      score += Math.min(10, resumeData.skills.length * 2);
    }
    return Math.min(100, score);
  };

  // Generate Cover Letter using AI
  const generateAICl = async () => {
    if (!resumeData.cover_letter_company?.trim() || !resumeData.cover_letter_job?.trim()) {
      toast.error("Please enter both target company and job title");
      return;
    }
    try {
      setIsGeneratingCL(true);
      const response = await api.post("/api/ai/generate-cover-letter", {
        resumeId,
        companyName: resumeData.cover_letter_company,
        jobTitle: resumeData.cover_letter_job,
      });
      setResumeData((prev) => ({
        ...prev,
        cover_letter: response.data.coverLetter,
      }));
      toast.success("Cover letter generated!");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsGeneratingCL(false);
    }
  };

  const copyCoverLetter = async () => {
    if (!resumeData.cover_letter?.trim()) return;
    try {
      await navigator.clipboard.writeText(resumeData.cover_letter);
      toast.success("Cover letter copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy cover letter");
    }
  };

  const downloadCoverLetter = () => {
    if (!resumeData.cover_letter?.trim()) return;
    const element = document.createElement("a");
    const file = new Blob([resumeData.cover_letter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${resumeData.cover_letter_company || "Company"}_Cover_Letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div>
      {/* Dashboard Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all font-medium text-sm"
        >
          <ArrowLeftIcon className="size-4" /> Back To Dashboard
        </Link>
      </div>

      {/* Main Container Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Form Box */}
          <div className="relative lg:col-span-5 rounded-lg">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-6 relative overflow-hidden">
              {/* Progress Bar */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-indigo-650 border-none transition-all duration-500"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />

              {/* Navigation Header Row Section */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />

                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0),
                        )
                      }
                      className="flex items-center gap-1 p-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1),
                      )
                    }
                    className={`flex items-center gap-1 p-2 px-3 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all cursor-pointer ${
                      activeSectionIndex === sections.length - 1
                        ? "opacity-50"
                        : ""
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Form Body Area */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "experience" && (
                  <Experience
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                    setResumeData={setResumeData}
                  />
                )}

                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, education: data }))
                    }
                  />
                )}
                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, project: data }))
                    }
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, skills: data }))
                    }
                  />
                )}

                {activeSection.id === "coverletter" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        AI Cover Letter Generator
                      </h3>
                      <p className="text-sm text-gray-500">
                        Generate a custom cover letter based on your resume experience
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Target Company
                        </label>
                        <input
                          type="text"
                          value={resumeData.cover_letter_company || ""}
                          onChange={(e) =>
                            setResumeData((prev) => ({
                              ...prev,
                              cover_letter_company: e.target.value,
                            }))
                          }
                          placeholder="e.g. Google"
                          className="px-3 py-2 text-sm rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Job Title / Role
                        </label>
                        <input
                          type="text"
                          value={resumeData.cover_letter_job || ""}
                          onChange={(e) =>
                            setResumeData((prev) => ({
                              ...prev,
                              cover_letter_job: e.target.value,
                            }))
                          }
                          placeholder="e.g. Software Engineer"
                          className="px-3 py-2 text-sm rounded-lg"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={generateAICl}
                      disabled={isGeneratingCL}
                      className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-750 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Sparkles className="size-4" />
                      {isGeneratingCL ? "Generating..." : "Generate AI Cover Letter"}
                    </button>

                    {resumeData.cover_letter && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-slate-800">
                            Your Cover Letter
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={copyCoverLetter}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded transition-colors cursor-pointer"
                            >
                              Copy
                            </button>
                            <button
                              type="button"
                              onClick={downloadCoverLetter}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded transition-colors cursor-pointer"
                            >
                              Download (.txt)
                            </button>
                          </div>
                        </div>
                        <textarea
                          value={resumeData.cover_letter || ""}
                          onChange={(e) =>
                            setResumeData((prev) => ({
                              ...prev,
                              cover_letter: e.target.value,
                            }))
                          }
                          rows={11}
                          className="w-full text-xs p-3.5 border border-gray-200 rounded-lg outline-none focus:ring focus:ring-indigo-500 font-sans resize-none bg-slate-50 leading-relaxed text-slate-750"
                          placeholder="Your cover letter will show here..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={async () => {
                  try {
                    await saveResume();
                  } catch (error) {
                    toast.error(error.response?.data?.message || error.message);
                  }
                }}
                className="bg-gradient-to-br from-indigo-150 to-indigo-250 ring hover:ring-indigo-400 transition-all rounded-md px-6 py-2 mt-6 text-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Panel - Preview Box */}
          <div className="lg:col-span-7 max-lg:mt-6 space-y-6">
            {/* Action Buttons Row */}
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Resume Preview</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors disabled:opacity-60 cursor-pointer font-medium"
                >
                  <Share2Icon className="size-4" />
                  {isSharing ? "Sharing..." : "Share"}
                </button>

                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center gap-2 px-4 py-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors cursor-pointer font-medium"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>

                <button
                  onClick={downloadResume}
                  className="flex items-center gap-2 px-4 py-2 text-xs bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 rounded-lg ring-indigo-300 hover:ring transition-colors cursor-pointer font-medium"
                >
                  <DownloadIcon className="size-4" />
                  Download
                </button>
              </div>
            </div>

            {/* ATS Score Card */}
            <ATSScore
              score={calculateATSScore()}
              accentColor={resumeData.accent_color}
            />

            {/* Resume Preview */}
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
              classes="py-4 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
