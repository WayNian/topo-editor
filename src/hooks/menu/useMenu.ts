import type { IMenuModel } from "@/types";
import { addMenu, updateMenu } from "@/utils/http/apis/";
import type { FormRules } from "naive-ui";
import { ref } from "vue";

export const useMenu = () => {
  const menuRules: FormRules = {
    menuName: {
      required: true,
      message: "请输入文件夹名称",
      trigger: ["input", "blur"]
    }
  };

  const menuModel = ref<IMenuModel>({
    menuName: "",
    menuParId: "0"
  });

  const resetMenuModel = () => {
    menuModel.value = {
      menuName: "",
      menuParId: "0"
    };
  };

  const addMenuFunc = () => {
    return addMenu(menuModel.value);
  };

  const updateMenuFunc = () => {
    return updateMenu(menuModel.value);
  };

  return {
    menuRules,
    menuModel,
    resetMenuModel,
    addMenuFunc,
    updateMenuFunc
  };
};
