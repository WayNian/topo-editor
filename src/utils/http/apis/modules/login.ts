import type { ILoginModel } from "@/types";
import request from "../../index";

export const login = (val: ILoginModel): Promise<void> => {
  return request.post({ url: "/login", data: val }).then((res) => {
    console.log("🚀 ~ request.post ~ res:", res);
  });
};
