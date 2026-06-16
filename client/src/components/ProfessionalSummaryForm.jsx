import { Sparkles } from "lucide-react"
import { useState } from "react"
import api from "../configs/api"
import toast from "react-hot-toast"


const ProfessionalSummaryForm = ({data,onChange,setResumeData}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const enhanceSummary = async () => {
    if (!data?.trim()) {
      toast.error("Please write a summary first");
      return;
    }
    try {
      setIsEnhancing(true);
      const response = await api.post("/api/ai/enhance-pro-sum", {
        userContent: data,
      });
      const enhancedSummary = response.data.enhancedSummary;
      onChange(enhancedSummary);
      setResumeData?.((prev) => ({
        ...prev,
        professional_summary: enhancedSummary,
      }));
      toast.success("Summary enhanced");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-4">
<div className="flex items-center justify-between">
<div>
    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">Professional Summary</h3>
<p className="text-sm text-gray-500">Add summary for your resume here</p>
</div>
<button type="button" onClick={enhanceSummary} disabled={isEnhancing} className="flex items-centr gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50">
<Sparkles className="size-4"/>
{isEnhancing ? "Enhancing..." : "AI Enhance"}
</button>
</div>
<div className="mt-6">
<textarea value={data||""} onChange={(e)=>onChange(e.target.value)} rows={7} className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none" placeholder="Write a compelling professional summary that highlights your key strengths and career objectives...."/>
    <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center">
      Tip : Keep it concise(3-4 sentences) and focus on your most relevant achievements and skills. 
    </p>
</div>

    </div>
  )
}

export default ProfessionalSummaryForm
