export const getExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts[parts.length - 1] ?? "";
};

export const isImage = (filename?: string) => {
  if (filename == null) return false;
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case "jpg":
    case "gif":
    case "bmp":
    case "png":
      return true;
  }
  return false;
};

export const isVideo = (filename?: string) => {
  if (filename == null) return false;
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case "m4v":
    case "avi":
    case "mpg":
    case "mp4":
    case "mkv":
    case "webm":
      return true;
  }
  return false;
};
