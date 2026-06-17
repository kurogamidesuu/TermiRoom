import { cd as apiCd } from "../api/file";

export default {
  description: {
    desc: "Change directory",
    format: "[path]",
  },
  execute: ({ content }, { currDir, setCurrDir, directory, setDirectory }) => {
    if (!content) return "Enter the name of directory.";

    const dirArray = resolvePath(content);
    if (!dirArray || dirArray.length === 0) return "Invalid path.";

    const originalDirectory = [...directory];

    let optimisticPath = [...directory];
    for (const segment of dirArray) {
      if (segment === "..") {
        optimisticPath.pop();
      } else {
        optimisticPath.push(segment);
      }
    }
    setDirectory(optimisticPath);

    apiCd(dirArray, currDir)
      .then((data) => {
        setCurrDir(data.currDir);
        setDirectory(data.pathArr);
      })
      .catch((error) => {
        setDirectory(originalDirectory);
        console.error("Optimistic cd failed:", error.message);
      });

    return "";
  },
};

const resolvePath = (pathString) => {
  return pathString.split("/").filter((elem) => elem !== "");
};
