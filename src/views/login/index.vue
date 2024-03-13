<template>
  <div class="fixed w-full h-full bg-gradient-to-b from-#040715 to-#333438">
    <div class="loign-bg absolute w-full h-full bg-no-repeat bg-cover"></div>
    <img
      class="absolute h-13 top-5 left-15 object-cover"
      src="../../assets/images/login/logo.png"
      alt=""
    />
    <div
      class="absolute flex flex-col items-center left-30 top-1/2 -translate-y-100% pb-4 select-none text-transparent bg-gradient-to-r from-#f5f5f5 to-#b8b8b8 bg-clip-text"
    >
      <span class="text-5xl font-bold tracking-6px">SVG编辑器</span>
      <!-- <span class="text-2xl font-bold mt-2 tracking-tight">SVG EDITOR SYSTEM</span> -->
    </div>
    <n-card class="absolute w-100 top-1/2 right-30 -translate-y-50%">
      <h1 class="text-2xl font-bold w-full text-center mb-5">系统登录</h1>
      <n-form ref="formRef" label-placement="left" :model="formValue" :rules="rules" :size="size">
        <n-form-item path="user.userName">
          <n-input v-model:value="formValue.user.userName" placeholder="输入账号" :maxlength="16">
            <template #prefix>
              <!-- <n-icon :component="User" size="20" /> -->
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="user.password">
          <n-input
            v-model:value="formValue.user.password"
            type="password"
            show-password-on="mousedown"
            placeholder="输入密码"
            :maxlength="16"
          >
            <template #prefix>
              <!-- <n-icon :component="Lock" size="20" /> -->
            </template>
          </n-input>
        </n-form-item>
        <n-form-item>
          <div class="flex flex-1 justify-between">
            <n-button class="flex-1 mr-3" attr-type="button" @click="resetForm"> 重置 </n-button>
            <n-button
              class="flex-1 ml-3"
              attr-type="button"
              type="primary"
              @click="handleLoginClick"
            >
              登录
            </n-button>
          </div>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMessage } from "naive-ui";
import type { FormInst } from "naive-ui";
// import { User, Lock } from "@vicons/tabler";
import { login } from "@/utils/http/apis/login";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";

const router = useRouter();
const formRef = ref<FormInst | null>(null);
const message = useMessage();
const size = ref<"small" | "medium" | "large">("medium");
const formValue = ref({
  user: {
    userName: "wisAdmin",
    password: "Wiscom123"
  },
  phone: ""
});
const rules = {
  user: {
    userName: {
      required: true,
      message: "请输入账号",
      trigger: "blur"
    },
    password: {
      required: true,
      message: "请输入密码",
      trigger: ["blur"]
    }
  }
};

const resetForm = () => {
  formValue.value.user.userName = "";
  formValue.value.user.password = "";
};

const handleLoginClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      login(formValue.value.user).then((res: any) => {
        message.success("登录成功");
        Cookie.set("token", res.sessionId);
        router.replace("/");
      });
    }
  });
};
</script>

<style scoped>
.loign-bg {
  background-image: url("../../assets/images/login/login-bg.png");
}
</style>
