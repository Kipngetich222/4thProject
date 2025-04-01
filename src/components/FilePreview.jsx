import React from "react";
import { FiDownload, FiFile, FiImage, FiVideo } from "react-icons/fi";

const FilePreview = ({ fileUrl, fileType, fileName }) => {
  const getFileIcon = () => {
    switch (fileType) {
      case "image":
        return <FiImage size={48} className="text-blue-500" />;
      case "video":
        return <FiVideo size={48} className="text-red-500" />;
      default:
        return <FiFile size={48} className="text-gray-500" />;
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex flex-col items-center">
        {fileType === "image" ? (
          <img
            src={fileUrl}
            alt="Preview"
            className="max-w-full h-auto rounded mb-2 max-h-64"
          />
        ) : (
          <div className="my-4">{getFileIcon()}</div>
        )}

        <p className="text-sm text-gray-600 mb-2 text-center truncate w-full">
          {fileName || "File"}
        </p>

        <a
          href={fileUrl}
          download
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiDownload className="mr-1" />
          Download
        </a>
      </div>
    </div>
  );
};

export default FilePreview;
