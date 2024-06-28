import {
  getDataExtract,
  getDataExtractInfo as getDataExtractInfoByHttp,
  getDetailByExtractId
} from "@/utils/http/apis/";
import type { IDataExtract } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";
interface ISelectionOption {
  label: string;
  value: string;
}

export const useDataBindStore = defineStore("data-bind", () => {
  const dataExtractList = ref<IDataExtract[]>([]);
  const dataExtractInfoList = ref<Record<string, any>[]>([]);
  const dataExtractDetailOptions = ref<ISelectionOption[]>([]);
  const dataExtractKeyOptions = ref<ISelectionOption[]>([]);

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

  const getExtractDetail = async (extractId: number) => {
    const list = (await getDetailByExtractId(extractId)).detailList;
    dataExtractDetailOptions.value = Object.entries(list).map(([key, value]) => {
      return {
        label: value.name,
        value: value.id
      };
    });
  };

  return {
    dataExtractList,
    dataExtractKeyOptions,
    dataExtractDetailOptions,
    dataExtractInfoList,
    getDataExtractList,
    getDataExtractInfo,
    getExtractDetail
  };
});
