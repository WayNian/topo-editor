import type { IMetaSource, IMetaTableItem } from "@/types";
import { getGroupList } from "@/utils/http/apis";
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
        index: index + 1
      };
    });
};

export const useMetaStore = defineStore("meta", () => {
  const metaTableData = ref<IMetaTableItem[]>([]);
  const metaGroupData = ref<TreeOption[]>([]);

  const getMetaList = async () => {
    const list = await getGroupList();
    metaGroupData.value = getGroupData(list);
    metaTableData.value = getTableData(list);
  };

  const groupSelectOptions = computed(() => {
    return metaGroupData.value.map((item) => {
      return {
        label: item.label,
        value: item.key
      };
    });
  });

  return { metaGroupData, metaTableData, getMetaList, groupSelectOptions };
});
