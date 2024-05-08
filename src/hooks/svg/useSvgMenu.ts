import RemoveSingleFromSublayer from "@/components/SvgEditor/Modal/Sublayer/RemoveSingleFromSublayer.vue";
import MoveToSublayerModal from "@/components/SvgEditor/Modal/Sublayer/MoveToSublayer.vue";
import { useDataStore, useMapStore } from "@/stores";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useDialog, type DropdownOption } from "naive-ui";
import emitter from "@/utils/mitt";
import { align, deleteNodesLinks } from "@/utils/tools";

export const useSvgMenu = () => {
  const dialog = useDialog();
  const mapStore = useMapStore();
  const dataStore = useDataStore();

  const removeSingleFromSublayerRef = ref<InstanceType<typeof RemoveSingleFromSublayer> | null>(
    null
  );
  const moveToSublayerModalRef = ref<InstanceType<typeof MoveToSublayerModal> | null>(null);

  const deleteGroup = () => {
    const { nodesSelected, linksSelected } = dataStore;
    if (!nodesSelected.length && !linksSelected.length) {
      window.$message.warning("请选择需要删除的数据");
    } else {
      dialog.warning({
        title: "警告",
        content: "确定删除当前数据吗？",
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        closeOnEsc: false,
        onPositiveClick: async () => {
          deleteNodesLinks();
        },
        onAfterLeave: () => {}
      });
    }
  };

  const handleSelect = (key: string, option: DropdownOption) => {
    mapStore.isMenuVisible = false;
    if (option.parent === "Align") {
      align(key);
      return;
    }

    switch (key) {
      case "UpdateSublayer":
        moveToSublayerModalRef.value?.show();
        break;
      case "RemoveMultiFromSublayer":
        removeSingleFromSublayerRef.value?.show();
        break;
      case "Delete":
        deleteGroup();
        break;
    }
  };

  const handleContenxtMenu = (e: MouseEvent) => {
    e.preventDefault();
    const mapId = mapStore.mapInfo?.mapId;
    if (!mapId) return;
    mapStore.showMapMenu(
      {
        x: e.clientX,
        y: e.clientY
      },
      "svg"
    );
  };

  const initEvent = () => {
    emitter.on("on:delete", deleteGroup);
  };

  const offEvent = () => {
    emitter.off("on:delete", deleteGroup);
  };

  onMounted(() => {
    initEvent();
  });

  onBeforeUnmount(() => {
    offEvent();
  });

  return {
    removeSingleFromSublayerRef,
    moveToSublayerModalRef,
    handleSelect,
    handleContenxtMenu
  };
};
