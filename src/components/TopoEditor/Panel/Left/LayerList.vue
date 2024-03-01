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
</template>

<script setup lang="ts">
import { h } from "vue";
import { useMessage, NIcon, type TreeOption } from "naive-ui";
import { Folder, FolderOpenOutline, FileTrayFullOutline } from "@vicons/ionicons5";

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
    }
  };
};
</script>

<style scoped></style>
