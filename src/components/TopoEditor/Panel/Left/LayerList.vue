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
</template>

<script setup lang="ts">
import { h, ref } from "vue";
import { useMessage, NIcon, type TreeOption, type DropdownOption } from "naive-ui";
import { Folder, FolderOpenOutline, FileTrayFullOutline } from "@vicons/ionicons5";

const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);

const options = ref<TreeOption[]>([]);

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
const message = useMessage();

const setMenu = (option: TreeOption) => {
  if (option.children) {
    options.value = [
      {
        label: "新建",
        key: "newFile"
      },
      {
        label: "导入",
        key: ""
      },
      {
        label: "删除",
        key: "delete"
      }
    ];
  } else {
    options.value = [
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
      }
    },
    onContextmenu(e: MouseEvent): void {
      showDropdown.value = true;
      setMenu(option);
      x.value = e.clientX;
      y.value = e.clientY;
      console.log(e.clientX, e.clientY);
      e.preventDefault();
    }
  };
};

const handleSelect = (key: string | number, option: DropdownOption) => {
  showDropdown.value = false;
};
</script>

<style>
.n-tree-node-content__text {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
