import { useTopoStore } from "@/stores/topo";
import type { IMapModel } from "@/types";
import { addMap } from "@/utils/http/apis/menu";
import type { FormItemRule, FormRules } from "naive-ui";
import { ref } from "vue";

export const useFile = () => {
  const store = useTopoStore();
  const fileRules: FormRules = {
    mapName: {
      required: true,
      message: "请输入文件夹名称",
      trigger: ["input", "blur"]
    },
    width: {
      required: true,
      validator(rule: FormItemRule, value: number) {
        if (value <= 0) {
          return new Error("宽度需要大于0");
        }
        return true;
      },
      trigger: ["input", "blur"]
    },
    height: {
      required: true,
      validator(rule: FormItemRule, value: number) {
        if (value <= 0) {
          return new Error("高度需要大于0");
        }
        return true;
      },
      trigger: ["input", "blur"]
    }
  };

  const fileModel = ref<IMapModel>({
    mapName: "",
    mapSize: "",
    width: 0,
    height: 0,
    background: "",
    mapIndex: 1,
    externalBind: {},
    internalBind: {},
    description: {},
    menuId: "0"
  });

  const resetFileMoel = () => {
    fileModel.value = {
      mapName: "",
      mapSize: "",
      width: 0,
      height: 0,
      background: "",
      mapIndex: 1,
      externalBind: {},
      internalBind: {},
      description: {},
      menuId: "0"
    };
  };

  const createFile = () => {
    return addMap({
      ...fileModel.value,
      mapSize: `${fileModel.value.width}*${fileModel.value.height}`
    });
  };

  return {
    fileRules,
    fileModel,
    resetFileMoel,
    createFile
  };
};
