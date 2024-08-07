import { onBeforeUnmount, onMounted, ref } from "vue";
import { type DropdownOption,useDialog } from "naive-ui";

import AddGroup from "@/components/SvgEditor/Modal/Group/Add.vue";
import MoveToSublayerModal from "@/components/SvgEditor/Modal/Sublayer/MoveToSublayer.vue";
import RemoveSingleFromSublayer from "@/components/SvgEditor/Modal/Sublayer/RemoveSingleFromSublayer.vue";
import { useDataStore, useMapStore } from "@/stores";
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
  const addGroupRef = ref<InstanceType<typeof AddGroup> | null>(null);

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

  const lock = () => {
    const { nodesSelected, linksSelected } = dataStore;
    nodesSelected.forEach((node) => {
      node.locked = !node.locked;
    });
    linksSelected.forEach((link) => {
      link.locked = !link.locked;
    });
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
      case "AddGroup":
        addGroupRef.value?.show();
        break;
      case "Lock":
        lock();
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
    addGroupRef,
    handleSelect,
    handleContenxtMenu
  };
};
