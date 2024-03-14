import type { IMenuModel } from "@/types";
import { addMenuList } from "@/utils/http/apis/menu";
import type { FormRules } from "naive-ui";
import { ref } from "vue";

export const useMenu = () => {
  const menuRules: FormRules = {
    folderName: {
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

  const createMenu = () => {
    return addMenuList(menuModel.value);
  };

  return {
    menuRules,
    menuModel,
    resetMenuModel,
    createMenu
  };
};
