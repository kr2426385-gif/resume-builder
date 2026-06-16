import { Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";

const SkillsForm = ({ data = [], onChange }) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    const skill = newSkill.trim();

    if (skill && !data.includes(skill)) {
      onChange([...data, skill]);
      setNewSkill("");
    }
  };

  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
        <h3 className="text-xl font-bold text-gray-800">
          Skills
        </h3>

        <p className="text-sm text-gray-600 mt-1">
          Showcase your technical and professional expertise
        </p>
      </div>

      {/* Add Skill Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Add a skill (React, Java, SQL, Leadership...)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="button"
            onClick={addSkill}
            disabled={!newSkill.trim()}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Skills List */}
      {data.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-700">
              Added Skills
            </h4>

            <span className="px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
              {data.length} Skills
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {data.map((skill, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-800 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <span className="font-medium">
                  {skill}
                </span>

                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="opacity-70 hover:opacity-100 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl py-12 text-center">
          <Sparkles className="w-12 h-12 mx-auto text-indigo-300 mb-3" />

          <h4 className="font-semibold text-gray-700">
            No Skills Added
          </h4>

          <p className="text-sm text-gray-500 mt-1">
            Start adding skills to strengthen your resume.
          </p>
        </div>
      )}

      {/* Suggested Skills */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h4 className="font-semibold text-gray-700 mb-3">
          Suggested Skills
        </h4>

        <div className="flex flex-wrap gap-2">
          {[
            "React",
            "JavaScript",
            "Node.js",
            "Java",
            "Python",
            "SQL",
            "MongoDB",
            "AWS",
            "Git",
            "Leadership",
            "Communication",
            "Teamwork",
          ].map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => {
                if (!data.includes(skill)) {
                  onChange([...data, skill]);
                }
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 rounded-full transition-colors"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Resume Tip:</strong> Include 8–12 relevant skills.
          Mix technical skills (React, Java, SQL, AWS) with soft skills
          (Leadership, Communication, Teamwork) for a stronger resume.
        </p>
      </div>
    </div>
  );
};

export default SkillsForm;