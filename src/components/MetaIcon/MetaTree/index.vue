<template>
  <n-dropdown
    trigger="manual"
    placement="bottom-start"
    :show="showDropdown"
    :options="options"
    :x="x"
    :y="y"
    @select="handleSelect"
    @clickoutside="handleClickoutside"
  />

  <n-tree
    block-line
    expand-on-click
    :data="metaStore.metaGroupData"
    :default-expanded-keys="defaultExpandedKeys"
    :node-props="nodeProps"
  />
</template>

<script setup lang="ts">
import { useMetaStore } from "@/stores";
import type { IGroupModel } from "@/types";
import { deleteGroup as deleteGroupHttp } from "@/utils/http/apis";
import { useDialog, type TreeOption } from "naive-ui";
import { ref } from "vue";

const emit = defineEmits<{
  edit: [val: IGroupModel];
}>();
const metaStore = useMetaStore();
const dialog = useDialog();

const defaultExpandedKeys = ref([]);
const showDropdown = ref(false);
const group = ref<IGroupModel>();
const x = ref(0);
const y = ref(0);

const options = ref<TreeOption[]>([
  {
    label: "编辑",
    key: "edit"
  },
  {
    label: "删除",
    key: "delete"
  }
]);

const handleSelect = (key: string) => {
  showDropdown.value = false;
  switch (key) {
    case "edit":
      group.value && emit("edit", group.value);
      break;
    case "delete":
      deleteGroup();
      break;
    default:
      break;
  }
};

const handleClickoutside = () => {
  showDropdown.value = false;
};

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {},
    onContextmenu(e: MouseEvent): void {
      e.preventDefault();

      if (!option.children) return;

      group.value = {
        groupId: option.key as string,
        groupName: option.label as string
      };

      showDropdown.value = true;
      x.value = e.clientX;
      y.value = e.clientY;
    }
  };
};

const deleteGroup = () => {
  dialog.warning({
    title: "警告",
    content: "确定删除当前数据吗？",
    positiveText: "确定",
    negativeText: "取消",
    maskClosable: false,
    closeOnEsc: false,
    onPositiveClick: async () => {
      await deleteGroupHttp(group.value!.groupId);
      window.$message.success("删除成功");
      metaStore.getMetaList();
    },
    onAfterLeave: () => {}
  });
};
</script>

<style></style>
