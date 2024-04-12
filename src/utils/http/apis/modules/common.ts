import request from "../../index";

export const uploadFile = (file: FormData) => {
  return request.post<string>({
    url: "/topoEdit/uploadIcon",
    data: file,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
