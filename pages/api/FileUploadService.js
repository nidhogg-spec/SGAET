import axios from "axios";

const upload = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);

  return axios.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

const getFiles = () => {
  return axios.get("/files");
};

const FileUploadService = {
  upload,
  getFiles,
};

export default FileUploadService; 
