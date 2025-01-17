<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';

defineOptions({
  name: 'BoxSummarySearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<{
  environment: string | null;
  customerName: string | null;
}>('model', { required: true });

const environmentOptions = [
  { label: 'X环境', value: 'X' },
  { label: 'GO环境', value: 'GO' },
  { label: 'ICBC环境', value: 'ICBC' }
];

async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="bank-enterprise-search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="所属环境" path="environment" class="pr-24px">
              <NSelect
                v-model:value="model.environment"
                placeholder="请选择环境"
                :options="environmentOptions"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="客户名称" path="customerName" class="pr-24px">
              <NInput v-model:value="model.customerName" placeholder="请输入客户名称" />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
