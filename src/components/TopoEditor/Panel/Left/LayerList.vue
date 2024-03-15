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
  <n-scrollbar style="max-height: calc(100vh - 100px)" @contextmenu="handleContentmenu">
    <n-tree
      block-line
      expand-on-click
      :data="store.menuList"
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
import type { IImportSvgData, ILink, IMapSource, IMenuSource, INode } from "@/types";
import { useTopoStore } from "@/stores/topo";
import EditMenuFileModal from "./Modal/EditMenuFileModal.vue";
import { deleteMap, deleteMenu } from "@/utils/http/apis/menu";
import { useCommonStore } from "@/stores/common";

const dialog = useDialog();
const store = useTopoStore();
const commonStore = useCommonStore();
const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);

const options = ref<TreeOption[]>([]);
const currentOption = ref<TreeOption | null>(null);
const upload = ref<HTMLInputElement | null>(null);
const editMenuFileModalRef = ref<InstanceType<typeof EditMenuFileModal> | null>(null);

const setMenu = (option?: TreeOption) => {
  if (!option) {
    options.value = [
      {
        label: "新建",
        key: "create"
      }
    ];
    return;
  }
  if (option.children) {
    options.value = [
      {
        label: "新建",
        key: "create"
      },
      {
        label: "编辑",
        key: "edit"
      },
      {
        label: "导入",
        key: "imoportAll"
      },
      {
        label: "删除",
        key: "delete"
      }
    ];
  } else {
    options.value = [
      {
        label: "编辑",
        key: "edit"
      },
      {
        label: "导入",
        key: "imoport",
        children: [
          {
            label: "增量",
            key: "imoportAddition"
          },
          {
            label: "全量",
            key: "imoportAll"
          }
        ]
      },
      {
        label: "删除",
        key: "delete"
      }
    ];
  }
};

const updatePrefixWithExpaned = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null;
    action: "expand" | "collapse" | "filter";
  }
) => {
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
      if (!option.children && !option.disabled) {
        currentOption.value = option;
        emitter.emit("on:selectMap", option.raw as IMapSource);
      }
    },
    onContextmenu(e: MouseEvent): void {
      setMenu(option);
      showDropdown.value = true;
      currentOption.value = option;
      x.value = e.clientX;
      y.value = e.clientY;
      e.preventDefault();
      e.stopPropagation();
    }
  };
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
      currentOption.value!.isMenu
        ? await deleteMenu(currentOption.value?.key as string)
        : await deleteMap(currentOption.value?.key as string);

      window.$message.success("删除成功");
      store.getMenuList();
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
    case "imoportAddition":
    case "imoportAll":
      commonStore.importType = key;
      upload.value?.click();
      break;
  }
};

const handleContentmenu = (e: MouseEvent) => {
  setMenu();
  showDropdown.value = true;
  currentOption.value = null;
  x.value = e.clientX;
  y.value = e.clientY;
  e.preventDefault();
  e.stopPropagation();
};

const handleCreateMenuFile = (isEdit: boolean) => {
  editMenuFileModalRef.value?.show(isEdit, currentOption.value);
};

onMounted(() => {
  store.getMenuList();
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
./Modal/EditMenuFileModal.vue./Modal/EditMenuFfileModal.vue
