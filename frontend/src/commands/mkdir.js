import { createNode } from "../api/file";

export default {
  description: {
    dsec: "Create new directory",
    format: "[name]",
  },
  execute: async ({ content }, { currDir }) => {
    const dirName = content.trim();
    if (!dirName) return "Enter the name of directory.";

    try {
      const node = await createNode(dirName, "folder", currDir);
      return `created /${node.name}`;
    } catch (error) {
      return error.message;
    }
  },
};
