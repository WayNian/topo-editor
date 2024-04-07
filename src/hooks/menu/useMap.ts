import type { IMapModel } from "@/types";
import { addMap, updateMap } from "@/utils/http/apis/";
import type { FormItemRule, FormRules } from "naive-ui";
import { ref } from "vue";

export const useMap = () => {
  const mapRules: FormRules = {
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

  const mapModel = ref<IMapModel>({
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

  const resetMapModel = () => {
    mapModel.value = {
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

  const getParams = () => {
    return {
      ...mapModel.value,
      mapSize: `${mapModel.value.width}*${mapModel.value.height}`
    };
  };

  const addMapFunc = () => {
    const params = getParams();
    return addMap(params);
  };

  const updateMapFunc = () => {
    const params = getParams();
    return updateMap(params);
  };

  return {
    mapRules,
    mapModel,
    resetMapModel,
    addMapFunc,
    updateMapFunc
  };
};
