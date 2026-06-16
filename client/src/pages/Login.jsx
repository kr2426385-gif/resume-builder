import React from "react";
import { Mail, User2Icon, Lock, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");

  const [state, setState] = React.useState(urlState || "login");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(`/api/users/${state}`, formData);
      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success(data.message);
      navigate("/app");
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="grid lg:grid-cols-12 min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      {/* Left Column: Branding / Visual Panel */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-gradient-to-tr from-indigo-700 via-indigo-800 to-purple-900 text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-25 animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-screen filter blur-[100px] opacity-25 animate-pulse" />

        {/* Top brand header */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <Sparkles className="size-6 text-indigo-200" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            ResumeCraft AI
          </span>
        </div>

        {/* Mid marketing text & visual mockup */}
        <div className="my-auto space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
              Create a Standout Resume with the Power of AI
            </h2>
            <p className="text-lg text-indigo-150/90 font-light leading-relaxed">
              Enhance descriptions, format templates, and optimize your resume for ATS algorithms automatically.
            </p>
          </div>

          {/* List of Features */}
          <div className="space-y-3">
            {[
              "Instant AI Professional Summary Enhancement",
              "Sleek & Tailored Templates (Vibrant Colors)",
              "ATS-Optimized Sections & Formats",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-shrink-0 p-1 bg-white/10 rounded-full border border-white/20">
                  <CheckCircle2 className="size-4 text-emerald-300" />
                </div>
                <span className="text-sm font-medium text-slate-100">{feature}</span>
              </div>
            ))}
          </div>

          {/* Mock Floating AI Enhance Card */}
          <div className="mt-6 p-5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">AI Optimizer</span>
              </div>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/20">
                Active
              </span>
            </div>
            <p className="text-xs italic text-slate-200/90 leading-relaxed">
              "Enhanced professional summary to align with industry expectations. Summary word count optimized, key metrics highlighted, and ATS keywords integrated."
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-300 relative z-10">
          © {new Date().getFullYear()} ResumeCraft AI. All rights reserved.
        </div>
      </div>

      {/* Right Column: Credentials Form */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-20 relative bg-slate-50/50">
        <div className="w-full max-w-md bg-white border border-slate-200/60 p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-100/40 relative z-10 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-slate-900 text-3xl font-bold tracking-tight">
              {state === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              {state === "login"
                ? "Sign in to access your resumes and dashboard"
                : "Register now to start building your AI resume"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (for registration) */}
            {state !== "login" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Full Name</label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                    <User2Icon size={16} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm h-12 pl-11 pr-4 rounded-xl transition-all duration-200 shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm h-12 pl-11 pr-4 rounded-xl transition-all duration-200 shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                {state === "login" && (
                  <button
                    type="button"
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm h-12 pl-11 pr-12 rounded-xl transition-all duration-200 shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-450 hover:text-slate-700 transition-colors duration-250 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-white font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{state === "login" ? "Sign In" : "Sign Up"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle login/register */}
          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
              {state === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setState(state === "login" ? "register" : "login")}
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors focus:outline-none"
              >
                {state === "login" ? "Sign up here" : "Sign in here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
