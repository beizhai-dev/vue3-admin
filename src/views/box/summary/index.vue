<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { fetchBoxSummary } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import BoxSummaryOperate from './modules/summary-operate.vue';
import BoxSummarySearch from './modules/summary-search.vue';

const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchBoxSummary,
  showTotal: true,
  apiParams: {
    current: 1,
    size: 10,
    environment: null,
    customerName: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'environment',
      title: '所属环境',
      align: 'center',
      width: 100
    },
    {
      key: 'isMultiTenant',
      title: '是否为多租户',
      align: 'center',
      width: 100,
      render: row => {
        return <NTag type={row.isMultiTenant ? 'success' : 'warning'}>{row.isMultiTenant ? '是' : '否'}</NTag>;
      }
    },
    {
      key: 'customerName',
      title: '客户名称',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'serviceUrl',
      title: '服务地址',
      align: 'center',
      render: row => (
        <NButton text type="primary" onClick={() => window.open(row.serviceUrl)} disabled={!row.serviceUrl}>
          {row.serviceUrl || '暂无'}
        </NButton>
      )
    },
    {
      key: 'username',
      title: '登录用户名',
      align: 'center',
      width: 120
    },
    {
      key: 'remark',
      title: '备注',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'opsDoc',
      title: '运维文档',
      align: 'center',
      render: row => (
        <NButton text type="primary" onClick={() => window.open(row.opsDoc)} disabled={!row.opsDoc}>
          {row.opsDoc ? '查看' : '暂无'}
        </NButton>
      )
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

function handleDelete(id: number) {
  // request
  console.log(id);

  onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <BoxSummarySearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="银企通服务登记" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <BoxSummaryOperate
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
