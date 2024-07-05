<template>
  <div class="flex flex-1 p-2">
    <div class="w-60 pl-4">
      <MetaTree @edit="editwAddGroupModal"></MetaTree>
    </div>

    <div class="flex flex-1 flex-col ml-2">
      <div class="flex my-2 justify-end">
        <n-button type="primary" size="small" class="mr-4" @click="editwAddGroupModal()">
          <template #icon>
            <n-icon>
              <AddFilled />
            </n-icon>
          </template>
          分组
        </n-button>
        <n-button type="info" size="small" @click="showEditMetaModal()">
          <template #icon>
            <n-icon>
              <AddFilled />
            </n-icon>
          </template>
          对象
        </n-button>
      </div>
      <n-data-table
        :columns="columns"
        :data="metaStore.metaTableData"
        :pagination="pagination"
        :bordered="false"
      />
    </div>
    <EditGroup ref="editGroupModalRef" />
    <EditMeta ref="editMetaModalRef" />
    <MetaIconData ref="metaIconDataRef"></MetaIconData>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from "vue";
import { NButton, NIcon, NImage, useDialog } from "naive-ui";

import AddFilled from "@/assets/images/icons/AddFilled.svg?component";
import DataObject from "@/assets/images/icons/DataObject.svg?component";
import Delete from "@/assets/images/icons/Delete.svg?component";
import ImageEdit24Regular from "@/assets/images/icons/ImageEdit24Regular.svg?component";
import MetaTree from "@/components/MetaIcon/MetaTree/index.vue";
import EditGroup from "@/components/MetaIcon/Modal/EditGroup.vue";
import EditMeta from "@/components/MetaIcon/Modal/EditMeta.vue";
import MetaIconData from "@/components/MetaIcon/Modal/MetaIconData/index.vue";
import { useMetaStore } from "@/stores";
import { useDataBindStore } from "@/stores/";
import type { IGroupModel,IMetaItem } from "@/types";
import { deleteMeta as deleteMetaByHttp } from "@/utils/http/apis";

const dialog = useDialog();

const metaStore = useMetaStore();
const dataBindStore = useDataBindStore();
const editGroupModalRef = ref<InstanceType<typeof EditGroup> | null>(null);
const editMetaModalRef = ref<InstanceType<typeof EditMeta> | null>(null);
const metaIconDataRef = ref<InstanceType<typeof MetaIconData> | null>(null);

const pagination = {
  pageSize: 10
};

const columns = [
  {
    title: "序号",
    key: "index"
  },
  {
    title: "类型",
    key: "objType"
  },
  {
    title: "名称",
    key: "objName"
  },
  {
    title: "关联组件",
    key: "compClass"
  },
  {
    title: "图标",
    key: "objImg",
    render(row: IMetaItem) {
      return h(NImage, {
        src: row.objImg,
        width: 30,
        height: 30
      });
    }
  },
  {
    title: "操作",
    key: "actions",
    width: 100,
    render(row: IMetaItem) {
      return [
        h(
          NButton,
          {
            text: true,
            type: "primary",
            title: "编辑",
            style: "font-size: 24px"
          },
          {
            default: () =>
              h(
                NIcon,
                {
                  size: 20,
                  class: "mr-2",
                  onClick: () => {
                    showEditMetaModal(row);
                  }
                },
                { default: () => h(ImageEdit24Regular) }
              )
          }
        ),
        h(
          NButton,
          {
            text: true,
            type: "primary",
            title: "数据",
            style: "font-size: 24px"
          },
          {
            default: () =>
              h(
                NIcon,
                {
                  size: 20,
                  class: "mr-2",
                  onClick: () => {
                    showDataBindModal(row);
                  }
                },
                { default: () => h(DataObject) }
              )
          }
        ),
        h(
          NButton,
          {
            text: true,
            type: "error",
            title: "删除",
            style: "font-size: 24px"
          },
          {
            default: () =>
              h(
                NIcon,
                {
                  size: 20,
                  onClick: () => {
                    deleteMeta(row);
                  }
                },
                { default: () => h(Delete) }
              )
          }
        )
      ];
    }
  }
];

const deleteMeta = (row: IMetaItem) => {
  dialog.warning({
    title: "警告",
    content: "确定删除当前数据吗？",
    positiveText: "确定",
    negativeText: "取消",
    maskClosable: false,
    closeOnEsc: false,
    onPositiveClick: async () => {
      await deleteMetaByHttp(row.objType);
      window.$message.success("删除成功");
      metaStore.getMetaData();
    },
    onAfterLeave: () => {}
  });
};

const editwAddGroupModal = (val?: IGroupModel) => {
  editGroupModalRef.value?.show(val);
};
const showEditMetaModal = (val?: IMetaItem) => {
  editMetaModalRef.value?.show(val);
};

const showDataBindModal = (val: IMetaItem) => {
  metaIconDataRef.value?.show(val);
};

onMounted(() => {
  metaStore.getMetaData();
  dataBindStore.getDataExtractList();
});
</script>

<style></style>
