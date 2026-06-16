import ClassicTemplate from "../assets/ClassicTemplate";
import MinimalImageTemplate from "../assets/MinimalImageTemplate";
import MinimalTemplate from "../assets/MinimalTemplate";
import ModernTemplate from "../assets/ModernTemplate";

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;

      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;

      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;

      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  return (
    <div className="w-full bg-gray-100">
      <div
        id="resume-preview"
        className={`border border-gray-200 print:shadow-none print:border-none ${classes}`}
      >
        {renderTemplate()}

        <style>
          {`
            @page {
              size: letter;
              margin: 0;
            }

            @media print {
              html,
              body {
                width: 8.5in;
                height: 11in;
                overflow: hidden;
              }

              body * {
                visibility: hidden;
              }

              #resume-preview,
              #resume-preview * {
                visibility: visible;
              }

              #resume-preview {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                margin: 0;
                padding: 0;
                box-shadow: none !important;
                border: none !important;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default ResumePreview;