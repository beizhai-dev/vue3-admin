<script setup lang="tsx">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { fetchBatchDeleteMenu, fetchDeleteMenu, fetchGetAllPages, fetchGetMenuList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord, menuTypeRecord } from '@/constants/business';
import SvgIcon from '@/components/custom/svg-icon.vue';
import MenuOperateModal, { type OperateType } from './modules/menu-operate-modal.vue';

const appStore = useAppStore();

const { bool: visible, setTrue: openModal } = useBoolean();

const wrapperRef = ref<HTMLElement | null>(null);

const { columns, columnChecks, data, loading, getData } = useTable({
  apiFn: fetchGetMenuList,
  needPagination: false,
  columns: () => [
    {
      type: 'selection',
      fixed: 'left',
      width: 50
    },
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center'
    },
    {
      key: 'id',
      width: 60,
      title: $t('page.manage.menu.id'),
      align: 'left'
    },
    {
      key: 'type',
      title: $t('page.manage.menu.menuType'),
      align: 'center',
      width: 80,
      render: row => {
        const tagMap: Record<Api.SystemManage.MenuType, NaiveUI.ThemeColor> = {
          0: 'default',
          1: 'primary',
          2: 'warning'
        };

        const label = $t(menuTypeRecord[row.type]);

        return <NTag type={tagMap[row.type]}>{label}</NTag>;
      }
    },
    {
      key: 'name',
      title: $t('page.manage.menu.menuName'),
      align: 'left',
      minWidth: 100,
      render: row => {
        const { i18nKey, name } = row;

        const label = i18nKey ? $t(i18nKey) : name;

        return <span>{label}</span>;
      }
    },
    {
      key: 'icon',
      title: $t('page.manage.menu.icon'),
      align: 'center',
      width: 60,
      render: row => {
        const icon = row.iconType === '1' ? row.icon : undefined;
        const localIcon = row.iconType === '2' ? row.icon : undefined;
        return row.type !== 2 ? (
          <div class="flex-center">
            <SvgIcon icon={icon} localIcon={localIcon} class="text-icon" />
          </div>
        ) : null;
      }
    },
    // {
    //   key: 'routeName',
    //   title: $t('page.manage.menu.routeName'),
    //   align: 'left',
    //   minWidth: 50
    // },
    {
      key: 'path',
      title: $t('page.manage.menu.routePath'),
      align: 'left',
      minWidth: 120
    },
    {
      key: 'status',
      title: $t('page.manage.menu.menuStatus'),
      align: 'center',
      width: 80,
      render: row => {
        if (row.status === null) {
          return null;
        }

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'warning'
        };

        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      key: 'hideInMenu',
      title: $t('page.manage.menu.hideInMenu'),
      align: 'center',
      width: 80,
      render: row => {
        const hide: CommonType.YesOrNo = row.hideInMenu ? 'Y' : 'N';

        const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
          Y: 'error',
          N: 'default'
        };

        const label = $t(yesOrNoRecord[hide]);

        return <NTag type={tagMap[hide]}>{label}</NTag>;
      }
    },
    {
      key: 'parentId',
      title: $t('page.manage.menu.parentId'),
      width: 90,
      align: 'center'
    },
    {
      key: 'permission',
      title: $t('page.manage.menu.type.permission'),
      align: 'left',
      width: 120
    },
    {
      key: 'orderNo',
      title: $t('page.manage.menu.order'),
      align: 'center',
      width: 60
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 230,
      fixed: 'right',
      render: row => {
        return (
          <div class="flex-center gap-8px">
            {row.type === 0 && (
              <NButton size="small" type="primary" ghost onClick={() => handleAddChildMenu(row)}>
                {$t('page.manage.menu.addChildMenu')}
              </NButton>
            )}
            {row.type === 1 && (
              <NButton size="small" type="primary" ghost onClick={() => handleAddPermission(row)}>
                {$t('page.manage.menu.addPermission')}
              </NButton>
            )}
            <NButton size="small" type="primary" ghost onClick={() => handleEdit(row)}>
              {$t('common.edit')}
            </NButton>
            <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
              {{
                default: () => $t('common.confirmDelete'),
                trigger: () => (
                  <NButton size="small" type="primary" ghost>
                    {$t('common.delete')}
                  </NButton>
                )
              }}
            </NPopconfirm>
          </div>
        );
      }
    }
  ]
});

const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, getData);

const operateType = ref<OperateType>('add');
function handleAdd() {
  operateType.value = 'add';
  openModal();
}

async function handleBatchDelete() {
  await fetchBatchDeleteMenu(checkedRowKeys.value);
  onBatchDeleted();
}

async function handleDelete(id: number) {
  await fetchDeleteMenu(id);
  onDeleted();
}

/** the edit menu data or the parent menu data when adding a child menu */
const editingData: Ref<Api.SystemManage.Menu | null> = ref(null);

function handleEdit(item: Api.SystemManage.Menu) {
  operateType.value = 'edit';
  editingData.value = { ...item };

  openModal();
}

function handleAddChildMenu(item: Api.SystemManage.Menu) {
  operateType.value = 'addChild';

  editingData.value = { ...item };

  openModal();
}

function handleAddPermission(item: Api.SystemManage.Menu) {
  operateType.value = 'addPermission';

  editingData.value = { ...item };

  openModal();
}

const allPages = ref<string[]>([]);

async function getAllPages() {
  const { data: pages } = await fetchGetAllPages();
  allPages.value = pages || [];
}

function init() {
  getAllPages();
}

// init
//  init();
</script>

<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden">
    <NCard :title="$t('page.manage.menu.title')" :bordered="false" size="small" class="flex-1-hidden">
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
        :scroll-x="1400"
        :loading="loading"
        :row-key="row => row.id"
        remote
        :pagination="false"
        class="sm:h-full"
      />
      <MenuOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-pages="allPages"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
