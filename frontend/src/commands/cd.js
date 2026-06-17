import { cd as apiCd } from "../api/file";

export default {
  description: {
    desc: "Change directory",
    format: "[path]",
  },
  execute: async ({ content }, { currDir, setCurrDir, setDirectory }) => {
    if (!content) return "Enter the name of directory.";

    const dirArray = resolvePath(content);
    if (!dirArray || dirArray.length === 0) return "Invalid path.";

    try {
      const data = await apiCd(dirArray, currDir);
      setCurrDir(data.currDir);
      setDirectory(data.pathArr);
      return "";
    } catch (error) {
      return error.message;
    }
  },
};

const resolvePath = (pathString) => {
  return pathString.split("/").filter((elem) => elem !== "");
};
