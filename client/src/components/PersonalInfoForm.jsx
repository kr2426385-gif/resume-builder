
import {
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
  User,
  Globe,
} from "lucide-react";

const CustomLinkedinIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const PersonalInfoForm = ({
  data = {},
  onChange,
  removeBackground,
  setRemoveBackground,
}) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  // 1. 🟢 Compute the image source on the fly during render without using state or hooks
  let imageSrc = "";
  if (data.image) {
    imageSrc = typeof data.image === "string" 
      ? data.image 
      : URL.createObjectURL(data.image);
  }

  const fields = [
    {
      key: "full_name",
      label: "Full Name",
      icon: User,
      type: "text",
      required: true,
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      required: true,
    },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { key: "location", label: "Location", icon: MapPin, type: "text" },
    {
      key: "profession",
      label: "Profession",
      icon: BriefcaseBusiness,
      type: "text",
    },
    { key: "linkedin", label: "LinkedIn Profile", icon: CustomLinkedinIcon, type: "text" },
    { key: "website", label: "Personal Website", icon: Globe, type: "url" },
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h3>
      <p className="text-sm text-gray-600">
        Get started with your personal information
      </p>

      <div className="flex items-center gap-2">
        <label htmlFor="image-upload" className="cursor-pointer">
          {imageSrc ? (
            <img
              /* 2. 🟢 Uses the purely computed string safely */
              src={imageSrc}
              alt="user-image"
              className="w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80"
            />
          ) : (
            <div className="inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700">
              <User className="size-10 p-2.5 border rounded-full" />
              <span>Upload user image</span>
            </div>
          )}
        </label>

        <input
          id="image-upload"
          type="file"
          accept="image/jpeg, image/png"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleChange("image", e.target.files[0]);
            }
          }}
        />

        {typeof data.image === "object" && data.image !== null && (
          <div className="flex flex-col gap-1 pl-4 text-sm mt-5">
            <p className="text-gray-600">Remove Background</p>
            <label className="inline-flex items-center cursor-pointer text-gray-900 gap-3">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => setRemoveBackground((prev) => !prev)}
                checked={removeBackground}
              />
              <div className="relative w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-200">
                <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
              </div>
            </label>
          </div>
        )}
      </div>

      {fields.map((field) => {
        const Icon = field.icon;
        return (
          <div key={field.key} className="space-y-1 mt-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Icon className="size-4" />
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              value={data[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PersonalInfoForm;