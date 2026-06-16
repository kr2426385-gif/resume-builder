import {
  FilePenIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resume");
      setAllResumes(data.resumes || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const createResume = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/api/resumes/create", { title });
      toast.success(data.message);
      setShowCreateResume(false);
      setTitle("");
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    if (!resume) {
      toast.error("Please select a PDF resume");
      return;
    }
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post("/api/ai/upload-resume", {
        title,
        resumeText,
      });
      toast.success("Resume uploaded successfully");
      setShowUploadResume(false);
      setTitle("");
      setResume(null);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const editTitle = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.put("/api/resumes/update", {
        resumeId: editResumeId,
        title,
      });
      setAllResumes((prev) =>
        prev.map((item) => (item._id === editResumeId ? data.resume : item)),
      );
      toast.success(data.message);
      setEditResumeId("");
      setTitle("");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  const deleteResume = async (resumeId) => {
    const confirm=window.confirm('Are you sure you want to delete this resume')
    if(confirm){
      try {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`);
        setAllResumes(prev=>prev.filter(resume=>resume._id!==resumeId))
        toast.success(data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="p-4">
      {/* Welcome text */}
      <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
        Welcome, {user?.name || "User"}
      </p>

      {/* Cards */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300"
        >
          <PlusIcon className="size-11 p-2.5 bg-indigo-500 text-white rounded-full" />
          <p className="text-sm group-hover:text-indigo-800 transition=all duration-300">
            Create Resume
          </p>
        </button>

        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300"
        >
          <UploadCloudIcon className="size-11 p-2.5 bg-purple-500 text-white rounded-full" />
          <p>Upload Existing</p>
        </button>
      </div>

      <hr className="my-6" />

      {/* Resume Grid */}
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length];

          return (
            <button
              key={index}
              onClick={() => navigate(`/app/builder/${resume._id}`)}
              className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group"
              style={{
                background: baseColor + "10",
                borderColor: baseColor + "40",
              }}
            >
              <FilePenIcon style={{ color: baseColor }} />

              <p style={{ color: baseColor }}>{resume.title}</p>

              <p className="absolute bottom-1 text-[11px]">
                Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

               <div onClick={e=>e.stopPropagation()} className="absolute top-1 right-1 hidden group-hover:flex">
                <TrashIcon onClick={()=>deleteResume(resume._id)} className="size-7 p-1 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                <PencilIcon onClick={()=>{setEditResumeId(resume._id);setTitle(resume.title)}} className="size-7 p-1 hover:bg-white/50 rounded text-slate-700 transition-colors" />
              </div>
            </button> ) 
           })}

        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-indigo-600 ring-indigo-800 outline-none"
                required
              />

              <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition-colors">
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload Resume</h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-indigo-600 ring-indigo-800 outline-none"
                required
              />
              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  Select resume file
                  <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-indigo-500 hover:text-indigo-700 cursor-pointer transition-colors">
                    {resume ? (
                      <p className="text-indigo-700">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14 stroke-1" />
                        <p>Upload Resume</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>
              <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition-colors">
                Upload Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId("")}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-indigo-600 ring-indigo-800 outline-none"
                required
              />

              <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800 transition-colors">
                Save Title
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
