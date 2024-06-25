import { getDataExtract, getDataExtractInfo as getDataExtractInfoByHttp } from "@/utils/http/apis/";
import type { IDataExtract } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDataBindStore = defineStore("data-bind", () => {
  const dataExtractList = ref<IDataExtract[]>([]);
  const dataExtractInfoList = ref<Record<string, any>[]>([]);
  const dataExtractKeyOptions = ref<Record<string, any>[]>([]);

  const getDataExtractList = async () => {
    dataExtractList.value = await getDataExtract();
  };

  const getDataExtractInfo = async (id: number) => {
    dataExtractInfoList.value = await getDataExtractInfoByHttp(id);

    dataExtractKeyOptions.value = Object.entries(dataExtractInfoList.value[0]).map(([key]) => {
      return {
        label: key,
        value: key
      };
    });
  };

  return {
    dataExtractList,
    dataExtractKeyOptions,
    dataExtractInfoList,
    getDataExtractList,
    getDataExtractInfo
  };
});
