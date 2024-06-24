import { getDataExtract, getDataExtractInfo as getDataExtractInfoByHttp } from "@/utils/http/apis/";
import type { IDataExtract } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDataBindStore = defineStore("data-bind", () => {
  const dataExtractList = ref<IDataExtract[]>([]);
  const dataExtractInfo = ref<
    {
      index: number;
      key: string;
    }[]
  >([]);

  const getDataExtractList = async () => {
    dataExtractList.value = await getDataExtract();
  };

  const getDataExtractInfo = async (id: number) => {
    const objectInfo = (await getDataExtractInfoByHttp(id)).data[0];
    dataExtractInfo.value = Object.entries(objectInfo).map(([key], index) => {
      return {
        index: index + 1,
        key
        // value: String(value)
      };
    });
  };
  return {
    dataExtractList,
    dataExtractInfo,
    getDataExtractList,
    getDataExtractInfo
  };
});
