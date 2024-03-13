<template>
  <div class="flex justify-end">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-icon size="24" class="cursor-pointer" @click="handleAddFolder">
          <Add />
        </n-icon>
      </template>
      新增文件夹
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
  <AddFileModal ref="addFileModalRef"></AddFileModal>
  <AddFolderModal ref="addFolderModalRef"></AddFolderModal>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from "vue";
import { useMessage, NIcon, type TreeOption, type DropdownOption } from "naive-ui";
import { Folder, FolderOpenOutline, Add } from "@vicons/ionicons5";
import { parseSvg } from "@/utils/parse";
import emitter from "@/utils/mitt";
import type { ILink, INode } from "@/types";
import { useTopo } from "@/stores/topo";
import AddFileModal from "./Modal/AddFileModal.vue";
import AddFolderModal from "./Modal/AddFolderModal.vue";

const message = useMessage();
const store = useTopo();
const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);

const options = ref<TreeOption[]>([]);
const currentOption = ref<TreeOption | null>(null);
const upload = ref<HTMLInputElement | null>(null);
const addFileModalRef = ref<InstanceType<typeof AddFileModal> | null>(null);
const addFolderModalRef = ref<InstanceType<typeof AddFolderModal>>();

const setMenu = (option?: TreeOption) => {
  if (!option) {
    options.value = [
      {
        label: "新建",
        key: "newFile"
      }
    ];
    return;
  }
  if (option.children) {
    options.value = [
      {
        label: "新建",
        key: "newFile"
      },
      {
        label: "编辑",
        key: "edit"
      },
      {
        label: "导入",
        key: "imoport"
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
        key: "imoport"
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
        message.info("[Click] " + option.label);
        currentOption.value = option;
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

const deleteFile = () => {
  if (currentOption.value) {
    message.info("删除文件");
  }
};

const handleChange = () => {
  const file = upload.value?.files?.[0];
  if (!file) return;
  parseSvg(file)
    ?.then((res) => {
      const r = res as {
        nodes: INode[];
        links: ILink[];
      };
      emitter.emit("on:draw", r);
    })
    .finally(() => {
      upload.value!.value = "";
    });
};

const handleSelect = (key: string | number, option: DropdownOption) => {
  showDropdown.value = false;
  switch (key) {
    case "newFile":
      addFileModalRef.value?.show(currentOption.value?.key as string);
      break;
    case "edit":
      message.info("编辑文件");
      break;
    case "delete":
      message.info("删除文件");
      deleteFile();
      break;
    case "imoport":
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

const handleAddFolder = () => {
  addFolderModalRef.value?.show();
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
