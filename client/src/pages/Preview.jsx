import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import api from "../configs/api";

const Preview = () => {
  const {resumeId}=useParams()
const[isLoading, setIsLoading]=useState(true)
  const[resumeData,setResumeData]=useState(null)
  const loadResume=async()=>{
    try {
      const { data } = await api.get(`/api/resumes/public/${resumeId}`);
      setResumeData(data.resume);
    } catch (error) {
      setResumeData(null);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    loadResume();

  },[resumeId])
  return resumeData? (
    <div className="bg-slate-100">
       <div className="max-w-3xl mx-auto py-10">
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes="py-4 bg-white"/>
       </div>
    </div>
  ):(
<div>
{isLoading?<Loader/>:(
  <div className="text-center mt-50">
  <p className="text-4xl text-slate-400 font-medium">
    Resume not found
  </p>

  <a
    href="/"
    className="mt-6 inline-flex bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-6 py-3 items-center transition-colors"
  >
    <ArrowLeftIcon className="mr-2 size-4" />
    Go to Home Page
  </a>
</div>
)}
</div>
  )
}

export default Preview;
