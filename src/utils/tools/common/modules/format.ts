export const formatObject = (data?: string): Record<string, string> => {
  if (!data) return {};
  if (typeof data === "object") return data;
  try {
    const obj: Record<string, any> = {};
    const d = JSON.parse(data);
    for (const key in d) {
      obj[key.trim()] = d[key];
    }
    return obj;
  } catch (error) {
    throw new Error("格式化对象失败");
    return {};
  }
};
