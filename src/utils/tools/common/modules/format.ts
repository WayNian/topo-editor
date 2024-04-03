export const formatObject = (data?: string): Record<string, string> => {
  if (!data) return {};
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};
