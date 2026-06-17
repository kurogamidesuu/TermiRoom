import { getChildren, getNode } from "../api/file";

export default {
  description: {
    desc: "List directory contents",
    format: "[path]",
  },
  execute: async ({ content }, { currDir }) => {
    const targetPath = content.trim() || ".";

    try {
      return await listDirectory(targetPath, currDir);
    } catch (error) {
      return `ls: ${error.message}`;
    }
  },
};

const listDirectory = async (path, currDir) => {
  let targetId;

  if (path === "." || path === "") {
    targetId = currDir;
  } else if (path === "..") {
    const curr = await getNode(currDir);
    if (!curr?.parent) {
      return `ls: Cannot access parent of root directory.`;
    }
    targetId = curr.parent;
  } else {
    targetId = path;
  }

  if (!targetId) {
    return `ls: cannot access '${path}': No such file or directory.`;
  }

  const node = await getNode(targetId);
  if (!node) {
    return `ls: cannot access '${path}': No such file or directory.`;
  }

  if (node.type === "file") {
    return node.content || "(empty file)";
  }

  const children = await getChildren(targetId);
  if (!children || children.length === 0) return "empty directory!";

  return children
    .map((child) => (child.type === "folder" ? `/${child.name}` : child.name))
    .join("\n");
};
