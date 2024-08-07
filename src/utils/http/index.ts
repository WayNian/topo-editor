import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig} from "axios";
import axios from "axios";

import type { ResponseModel, UploadFileItemModel, UploadRequestConfig } from "@/types/";

import { HttpCodeConfig } from "./code";
import { getToken } from "./token";

class HttpRequest {
  service: AxiosInstance;

  constructor() {
    this.service = axios.create({
      baseURL: import.meta.env.VITE_APP_BASE_URL,
      timeout: 5 * 1000
    });

    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        /**
         * set your config
         */
        // if (import.meta.env.VITE_APP_TOKEN_KEY && getToken()) {
        //     config.headers[import.meta.env.VITE_APP_TOKEN_KEY] = getToken()
        // }
        config.headers.Authorization = getToken();

        return config;
      },
      (error: AxiosError) => {
        console.error("requestError: ", error);
        return Promise.reject(error);
      },
      {
        synchronous: false,
        runWhen: (config: InternalAxiosRequestConfig) => {
          // do something

          // if return true, axios will execution interceptor method
          return true;
        }
      }
    );

    this.service.interceptors.response.use(
      (response: AxiosResponse<ResponseModel>): AxiosResponse["data"] => {
        const { data, status } = response;
        if (status === HttpCodeConfig.success) {
          const { code, message } = data;
          switch (code) {
            case "0000":
              return data.data;
              break;
            default:
              window.$message.error(message);
              return Promise.reject(message);
              break;
          }
        } else {
          window.$message.error("请求失败");
          return Promise.reject(data.message);
        }
      },
      (error: any) => {
        window.$message.error("请求失败");
        return Promise.reject(error);
      }
    );
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    /**
     * TODO: execute other methods according to config
     */
    return new Promise((resolve, reject) => {
      try {
        this.service
          .request<ResponseModel<T>>(config)
          .then((res: AxiosResponse["data"]) => {
            resolve(res as T);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (err) {
        return Promise.reject(err);
      }
    });
  }

  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ method: "GET", ...config });
  }
  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ method: "POST", ...config });
  }
  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ method: "PUT", ...config });
  }
  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ method: "DELETE", ...config });
  }
  upload<T = string>(
    fileItem: UploadFileItemModel,
    config?: UploadRequestConfig
  ): Promise<ResponseModel<T>> | null {
    if (!import.meta.env.VITE_UPLOAD_URL) return null;

    const fd = new FormData();
    fd.append(fileItem.name, fileItem.value);
    let configCopy: UploadRequestConfig;
    if (!config) {
      configCopy = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
    } else {
      config.headers!["Content-Type"] = "multipart/form-data";
      configCopy = config;
    }
    return this.request({ url: import.meta.env.VITE_UPLOAD_URL, data: fd, ...configCopy });
  }
}

const httpRequest = new HttpRequest();
export default httpRequest;
