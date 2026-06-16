import { Briefcase, Plus, Sparkles, Trash } from "lucide-react";
import { useState } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";

const Experience = ({ data, onChange, setResumeData }) => {
  const [enhancingIndex, setEnhancingIndex] = useState(null);
  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };
  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };

    onChange(updated);
  };

  const enhanceDescription = async (index) => {
    const userContent = data[index]?.description;
    if (!userContent?.trim()) {
      toast.error("Please write a job description first");
      return;
    }
    try {
      setEnhancingIndex(index);
      const response = await api.post("/api/ai/enhance-job-desc", {
        userContent,
      });
      const enhancedJobDescription = response.data.enhancedJobDescription;
      const updated = [...data];
      updated[index] = {
        ...updated[index],
        description: enhancedJobDescription,
      };
      onChange(updated);
      setResumeData?.((prev) => ({ ...prev, experience: updated }));
      toast.success("Job description enhanced");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              Professional Experience
            </h3>
            <p className="text-sm text-gray-500">Add your job experience</p>
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            <Plus className="size-4" />
            Add Experience
          </button>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-5 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Now work expected added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>Experience #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={experience.company || ""}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  type="text"
                  placeholder="Company Name"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  value={experience.position || ""}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  type="text"
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  value={experience.start_date || ""}
                  onChange={(e) =>
                    updateExperience(index, "start_date", e.target.value)
                  }
                  type="month"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  value={experience.end_date || ""}
                  onChange={(e) =>
                    updateExperience(index, "end_date", e.target.value)
                  }
                  type="month"
                  disabled={experience.is_current}
                  className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100"
                />
              </div>
              <label htmlFor="" className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={experience.is_current || false}
                  onChange={(e) => {
                    updateExperience(
                      index,
                      "is_current",
                      e.target.checked ? true : false,
                    );
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Currently working here
                </span>
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor=""
                    className="text-sm font-medium text-gray-700"
                  >
                    Job Description
                  </label>
                  <button
                    type="button"
                    onClick={() => enhanceDescription(index)}
                    disabled={enhancingIndex === index}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {enhancingIndex === index ? "Enhancing..." : "Enhance with AI"}
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
                <textarea
                  value={experience.description || ""}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  rows={4}
                  name=""
                  id=""
                  className="w-full text-sm px-3 py-2 rounded-lg resize-none"
                  placeholder="Describe your key responsibilities and achievements...."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experience;
