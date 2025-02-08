<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { ENVIRONMENT_OPTIONS } from '@/views/box/summary/dict';
import { createBoxSummary, updateBoxSummary } from '@/service/api';
defineOptions({
  name: 'BoxSummaryOperate'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Box.Summary | null;
}

const props = defineProps<Props>();
const environmentOptions = computed(() =>
  ENVIRONMENT_OPTIONS.map(item => ({
    label: item.label(),
    value: item.value
  }))
);
interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.box.summary.addService'),
    edit: $t('page.box.summary.editService')
  };
  return titles[props.operateType];
});

type Model = {
  id?: number;
  environment: string | null;
  isMultiTenant: boolean;
  customerName: string;
  serviceUrl: string;
  username: string;
  password: string;
  remark: string;
  opsDoc: string;
};

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    environment: null,
    isMultiTenant: false,
    customerName: '',
    serviceUrl: '',
    username: '',
    password: '',
    remark: '',
    opsDoc: ''
  };
}

const rules: Record<string, App.Global.FormRule[]> = {
  environment: [defaultRequiredRule],
  isMultiTenant: [defaultRequiredRule],
  customerName: [defaultRequiredRule],
  serviceUrl: [defaultRequiredRule],
  username: [defaultRequiredRule],
  password: [
    defaultRequiredRule,
    {
      validator: (rule, value) => value.length >= 6,
      message: '密码长度至少6位',
      trigger: 'blur'
    }
  ]
};

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // 提交接口
  if (props.operateType === 'add') {
    await createBoxSummary(model.value);
    window.$message?.success($t('common.addSuccess'));
  } else {
    await updateBoxSummary(props.rowData?.id || 0, model.value);
    window.$message?.success($t('common.updateSuccess'));
  }
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="所属环境" path="environment">
          <NSelect v-model:value="model.environment" :options="environmentOptions" placeholder="请选择环境" />
        </NFormItem>
        <NFormItem label="是否多租户" path="isMultiTenant">
          <NSwitch v-model:value="model.isMultiTenant" />
        </NFormItem>
        <NFormItem label="客户名称" path="customerName">
          <NInput v-model:value="model.customerName" placeholder="请输入客户名称" />
        </NFormItem>
        <NFormItem label="服务地址" path="serviceUrl">
          <NInput v-model:value="model.serviceUrl" placeholder="请输入服务地址" />
        </NFormItem>
        <NFormItem label="登录用户名" path="username">
          <NInput v-model:value="model.username" placeholder="请输入登录用户名" />
        </NFormItem>
        <NFormItem label="登录密码" path="password">
          <NInput
            v-model:value="model.password"
            type="password"
            show-password-on="click"
            placeholder="请输入登录密码"
          />
        </NFormItem>
        <NFormItem label="运维文档" path="opsDoc">
          <NInput v-model:value="model.opsDoc" placeholder="请输入运维文档地址" />
        </NFormItem>
        <NFormItem label="备注" path="remark">
          <NInput
            v-model:value="model.remark"
            type="textarea"
            placeholder="请输入备注"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
