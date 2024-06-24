import type { IMetaSource, IMetaItem, IMetaIconDataBind } from "@/types";
import { MetaBaseIconList } from "@/utils/constant";
import { getGroupList, getMetaDataBind } from "@/utils/http/apis";
import { getImageUrl } from "@/utils/tools";
import type { TreeOption } from "naive-ui";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const getGroupData = (list: IMetaSource[]) => {
  return list.map((item) => {
    return {
      label: item.groupName,
      key: item.groupId,
      children: item.objList.map((obj) => {
        return {
          label: obj.objName,
          key: obj.objType
        };
      })
    };
  });
};

const getTableData = (list: IMetaSource[]) => {
  const urlPrefix = getImageUrl();
  return list
    .map((item) => {
      return item.objList.map((obj) => {
        return {
          ...obj,
          groupName: item.groupName
        };
      });
    })
    .flat()
    .map((item, index) => {
      return {
        ...item,
        objImg: urlPrefix + item.objImg,
        index: index + 1
      };
    });
};

const getSelectOption = (list: IMetaSource[]) => {
  return list
    .map((item) => {
      return item.objList.map((obj) => {
        return {
          label: obj.objName,
          value: obj.objType,
          row: obj
        };
      });
    })
    .flat();
};

export const useMetaStore = defineStore("meta", () => {
  const metaTableData = ref<IMetaItem[]>([]);
  const metaGroupData = ref<TreeOption[]>([]);
  const metaList = ref<IMetaSource[]>([]);
  const metaOptions = ref<{ label: string; value: string; row: IMetaItem }[]>([]);
  const metaIconDataBindList = ref<IMetaIconDataBind[]>([]);

  const getMetaData = async () => {
    const list = await getGroupList();
    metaGroupData.value = getGroupData(list);
    metaTableData.value = getTableData(list);
  };

  const getMetaList = async () => {
    metaList.value = await getGroupList();
    metaList.value.unshift(MetaBaseIconList);

    metaOptions.value = getSelectOption(metaList.value);
  };

  const groupSelectOptions = computed(() => {
    return metaGroupData.value.map((item) => {
      return {
        label: item.label,
        value: item.key
      };
    });
  });

  const getMetaIconData = async (objType: string, domId?: string) => {
    metaIconDataBindList.value = (await getMetaDataBind(objType, domId)).filter((item) => !!item);
  };

  return {
    metaGroupData,
    metaTableData,
    metaOptions,
    metaList,
    metaIconDataBindList,
    getMetaList,
    getMetaData,
    groupSelectOptions,
    getMetaIconData
  };
});
