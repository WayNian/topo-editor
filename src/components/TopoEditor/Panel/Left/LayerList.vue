<template>
  <n-scrollbar style="max-height: calc(100vh - 100px)">
    <n-tree
      block-line
      expand-on-click
      :data="data"
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
</template>

<script setup lang="ts">
import { h, ref } from "vue";
import { useMessage, NIcon, type TreeOption, type DropdownOption } from "naive-ui";
import { Folder, FolderOpenOutline, FileTrayFullOutline } from "@vicons/ionicons5";
import { parseSvg } from "@/utils/parse";
import emitter from "@/utils/mitt";
import type { ILink, INode } from "@/types";

const message = useMessage();
const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);

const options = ref<TreeOption[]>([]);
const currentOption = ref<TreeOption | null>(null);
const upload = ref<HTMLInputElement | null>(null);

const data = [
  {
    key: "文件夹",
    label: "文件夹",
    prefix: () =>
      h(NIcon, null, {
        default: () => h(Folder)
      }),
    children: [
      {
        label: "template.txt",
        key: "template1.txt",
        prefix: () =>
          h(NIcon, null, {
            default: () => h(FileTrayFullOutline)
          })
      },

      {
        label: "template.txt",
        key: "template.txt",
        prefix: () =>
          h(NIcon, null, {
            default: () => h(FileTrayFullOutline)
          })
      }
    ]
  },
  {
    key: "文件夹1",
    label: "文件夹1",
    prefix: () =>
      h(NIcon, null, {
        default: () => h(Folder)
      }),
    children: [
      {
        label: "templaaaaaaaaaaaaaaaate.txt",
        key: "templateaaaaaaaaaaaaa1.txt",
        prefix: () =>
          h(NIcon, null, {
            default: () => h(FileTrayFullOutline)
          })
      },

      {
        label: "template.txt",
        key: "template.txt",
        prefix: () =>
          h(NIcon, null, {
            default: () => h(FileTrayFullOutline)
          })
      }
    ]
  }
];

const setMenu = (option: TreeOption) => {
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
      message.info("新建文件");
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
</script>

<style>
.n-tree-node-content__text {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
