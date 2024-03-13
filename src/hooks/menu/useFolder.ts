import { useTopoStore } from "@/stores/topo";
import { addMenuList } from "@/utils/http/apis/menu";
import type { FormRules } from "naive-ui";
import { ref } from "vue";

export const useFolder = () => {
  const folderRules: FormRules = {
    folderName: {
      required: true,
      message: "请输入文件夹名称",
      trigger: ["input", "blur"]
    }
  };

  const folderModel = ref({
    folderName: "",
    menuId: "0"
  });

  const resetFolderModel = () => {
    folderModel.value = {
      folderName: "",
      menuId: "0"
    };
  };

  const createFolder = () => {
    return addMenuList({
      menuName: folderModel.value.folderName,
      menuParId: "0"
    });
  };

  return {
    folderRules,
    folderModel,
    resetFolderModel,
    createFolder
  };
};
