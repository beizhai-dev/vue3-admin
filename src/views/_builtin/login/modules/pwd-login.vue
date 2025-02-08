<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { MD5 } from 'crypto-js';
import { $t } from '@/locales';
import { getCaptchaImg } from '@/service/api/auth';
import { loginModuleRecord } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';
import { checkAndOpenTab } from '@/utils/browser-tabs';
import { useOwlEyes } from './owl-mixin';
const { handleFocus, handleBlur } = useOwlEyes();
defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  username: string;
  password: string;
  verifyCode: string;
  captchaId: string;
}

const model: FormModel = reactive({
  username: 'XencioAdmin',
  password: 'Xencio@2025',
  verifyCode: '',
  captchaId: ''
});
const captchaImg = ref('');
// 在组件挂载时获取验证码
onMounted(() => {
  refreshCaptcha();
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    username: formRules.username,
    password: formRules.pwd,
    verifyCode: formRules.verifyCode,
    captchaId: [] // 添加空规则
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login({
    username: model.username,
    password: MD5(model.password).toString(),
    verifyCode: model.verifyCode,
    captchaId: model.captchaId
  });
}
// 刷新验证码
async function refreshCaptcha() {
  const { data } = await getCaptchaImg({ width: 100, height: 40 });
  if (data) {
    captchaImg.value = data.img;
    model.captchaId = data.id;
  }
}
/*
type AccountKey = 'super' | 'admin' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  username: string;
  password: string;
}

const accounts = computed<Account[]>(() => [
  {
    key: 'super',
    label: $t('page.login.pwdLogin.superAdmin'),
    usename: 'Super',
    password: '123456'
  },
  {
    key: 'admin',
    label: $t('page.login.pwdLogin.admin'),
    usename: 'Admin',
    password: '123456'
  },
  {
    key: 'user',
    label: $t('page.login.pwdLogin.user'),
    usename: 'User',
    password: '123456'
  }
]);

async function handleAccountLogin(account: Account) {
  await authStore.login(account.usename, account.password);
}
  */
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem path="username">
      <NInput v-model:value="model.username" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </NFormItem>
    <!-- 添加验证码输入框 -->
    <NFormItem path="verifyCode">
      <NInput v-model:value="model.verifyCode" :placeholder="$t('page.login.common.codePlaceholder')">
        <template #suffix>
          <img :src="captchaImg" class="h-40px w-100px cursor-pointer" alt="验证码" @click="refreshCaptcha" />
        </template>
      </NInput>
    </NFormItem>
    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </NButton>
      </div>
      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <div class="flex-y-center justify-between gap-12px">
        <NButton class="flex-1" block @click="toggleLoginModule('code-login')">
          {{ $t(loginModuleRecord['code-login']) }}
        </NButton>
        <NButton class="flex-1" block @click="toggleLoginModule('register')">
          {{ $t(loginModuleRecord.register) }}
        </NButton>
      </div>
      <!--
 <NDivider class="text-14px text-#666 !m-0">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</NDivider>
      <div class="flex-center gap-12px">
        <NButton v-for="item in accounts" :key="item.key" type="primary" @click="handleAccountLogin(item)">
          {{ item.label }}
        </NButton>
      </div>
-->
    </NSpace>
  </NForm>
</template>

<style scoped></style>
