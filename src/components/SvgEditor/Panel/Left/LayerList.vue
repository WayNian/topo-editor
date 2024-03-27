<template>
  <div class="flex justify-end">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-icon size="24" class="cursor-pointer" @click="handleCreateMenuFile(false)">
          <Add />
        </n-icon>
      </template>
      创建目录
    </n-tooltip>
  </div>
  <n-divider />
  <n-scrollbar style="height: calc(100vh - 150px)" @contextmenu="handleContentmenu">
    <n-tree
      :expanded-keys="menuStore.expandedKeys"
      block-line
      expand-on-click
      :data="menuStore.menuList"
      :node-props="nodeProps"
      :on-update:expanded-keys="updatePrefixWithExpaned"
    />
  </n-scrollbar>

  <n-dropdown
    trigger="manual"
    placement="bottom-start"
    :show="showDropdown"
    :options="options"
    :x="x"
    :y="y"
    @select="handleSelect"
    @clickoutside="() => (showDropdown = false)"
  ></n-dropdown>

  <input type="file" style="display: none" ref="upload" accept=".svg" @change="handleChange" />
  <EditMenuFileModal ref="editMenuFileModalRef"></EditMenuFileModal>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from "vue";
import { NIcon, type TreeOption, useDialog } from "naive-ui";
import { Folder, FolderOpenOutline, Add } from "@vicons/ionicons5";
import { parseSvg } from "@/utils/parse";
import emitter from "@/utils/mitt";
import type { IImportSvgData, IMapSource, IMenuSource } from "@/types";
import EditMenuFileModal from "./Modal/EditMenuFileModal.vue";
import { deleteMap, deleteMenu } from "@/utils/http/apis/menu";
import { useCommonStore } from "@/stores/";
import { useMenuStore } from "@/stores/";
import { getContextMenu } from "@/utils/assistant/";
import { clearSvg } from "@/utils/svg/draw/svg";

const dialog = useDialog();
const commonStore = useCommonStore();
const menuStore = useMenuStore();
const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);

const options = ref<TreeOption[]>([]);
const currentMenu = ref<TreeOption | null>(null);
const upload = ref<HTMLInputElement | null>(null);
const editMenuFileModalRef = ref<InstanceType<typeof EditMenuFileModal> | null>(null);

const updatePrefixWithExpaned = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null;
    action: "expand" | "collapse" | "filter";
  }
) => {
  menuStore.expandedKeys = _keys;
  if (!meta.node) return;
  switch (meta.action) {
    case "expand":
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(FolderOpenOutline)
        });
      break;
    case "collapse":
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(Folder)
        });
      break;
  }
};

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    title: option.label,
    onClick() {
      menuStore.currentMenu = option.raw as IMapSource | IMenuSource;
      if (!option.children && !option.disabled) {
        currentMenu.value = option;
        emitter.emit("on:selectMap", option.raw as IMapSource);
      }
    },
    onContextmenu(e: MouseEvent): void {
      options.value = getContextMenu(option);
      showDropdown.value = true;
      x.value = e.clientX;
      y.value = e.clientY;
      menuStore.currentMenu = option.raw as IMapSource | IMenuSource;

      //   if (!option.children && !option.disabled) {
      //     emitter.emit("on:selectMap", option.raw as IMapSource);
      //   }

      e.preventDefault();
      e.stopPropagation();
    }
  };
};

const onDeleteSuccess = () => {
  window.$message.success("删除成功");
  menuStore.setMapInfo();
  menuStore.getMenuList();
  //   删除当前选择的菜单
  if (
    currentMenu.value!.isMenu &&
    currentMenu.value?.key === (menuStore.currentMenu as IMapSource).mapId
  ) {
    menuStore.currentMenu = null;
    clearSvg();
  }
};

const deleteMenuMap = () => {
  dialog.warning({
    title: "警告",
    content: "确定删除当前数据吗？",
    positiveText: "确定",
    negativeText: "取消",
    maskClosable: false,
    closeOnEsc: false,
    onPositiveClick: async () => {
      currentMenu.value!.isMenu
        ? await deleteMenu(currentMenu.value?.key as string)
        : await deleteMap(currentMenu.value?.key as string);

      onDeleteSuccess();
    },
    onAfterLeave: () => {}
  });
};

const handleChange = () => {
  const file = upload.value?.files?.[0];
  if (!file) return;
  parseSvg(file)
    ?.then((res) => {
      emitter.emit("on:importSvg", res as IImportSvgData);
    })
    .finally(() => {
      upload.value!.value = "";
    });
};

const handleSelect = (key: string | number) => {
  showDropdown.value = false;
  switch (key) {
    case "create":
      handleCreateMenuFile(false);
      break;
    case "edit":
      handleCreateMenuFile(true);
      break;
    case "delete":
      deleteMenuMap();
      break;
    case "import":
    case "importAddition":
    case "importAll":
      commonStore.importType = key;
      upload.value?.click();
      break;
  }
};

const handleContentmenu = (e: MouseEvent) => {
  options.value = getContextMenu();
  showDropdown.value = true;
  currentMenu.value = null;
  x.value = e.clientX;
  y.value = e.clientY;
  e.preventDefault();
  e.stopPropagation();
};

const handleCreateMenuFile = (isEdit: boolean) => {
  editMenuFileModalRef.value?.show(isEdit, currentMenu.value);
};

onMounted(() => {
  menuStore.getMenuList();
});
</script>

<style>
.n-tree-node-content__text {
  text-overflow: ellipsis;
  overflow: hidden;
}

.n-divider:not(.n-divider--vertical) {
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>
