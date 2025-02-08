<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { enableStatusOptions, menuIconTypeOptions, menuTypeOptions } from '@/constants/business';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { getLocalIcons } from '@/utils/icon';
import { fetchAddMenu, fetchGetAllRoles, fetchUpdateMenu } from '@/service/api';
import {
  getLayoutAndPage,
  getPathParamFromRoutePath,
  getRoutePathByRouteName,
  getRoutePathWithParam,
  transformLayoutAndPageToComponent
} from './shared';

defineOptions({
  name: 'MenuOperateModal'
});

export type OperateType = NaiveUI.TableOperateType | 'addChild' | 'addPermission';

interface Props {
  /** the type of operation */
  operateType: OperateType;
  /** the edit menu data or the parent menu data when adding a child menu */
  rowData?: Api.SystemManage.Menu | null;
  /** all pages */
  allPages: string[];
}

const props = defineProps<Props>();

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
  const titles: Record<OperateType, string> = {
    add: $t('page.manage.menu.addMenu'),
    addChild: $t('page.manage.menu.addChildMenu'),
    edit: $t('page.manage.menu.editMenu'),
    addPermission: $t('page.manage.menu.addPermission')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Menu,
  | 'type'
  | 'name'
  | 'routeName'
  | 'path'
  | 'component'
  | 'orderNo'
  | 'i18nKey'
  | 'icon'
  | 'iconType'
  | 'status'
  | 'parentId'
  | 'keepAlive'
  | 'constant'
  | 'href'
  | 'hideInMenu'
  | 'activeMenu'
  | 'multiTab'
  | 'fixedIndexInTab'
  | 'id'
> & {
  query: NonNullable<Api.SystemManage.Menu['query']>;
  layout: string;
  page: string;
  permission: string;
  pathParam: string;
};

const model = ref(createDefaultModel());
// 根据type判断是目录还是菜单还是权限
const menuName = computed(() => {
  if (model.value.type === 2) {
    return $t('page.manage.menu.permissionName');
  } else if (model.value.type === 0) {
    return $t('page.manage.menu.directoryName');
  }
  return $t('page.manage.menu.menuName');
});
const formMenuName = computed(() => {
  if (model.value.type === 2) {
    return $t('page.manage.menu.form.permissionName');
  } else if (model.value.type === 0) {
    return $t('page.manage.menu.form.directoryName');
  }
  return $t('page.manage.menu.form.menuName');
});

function createDefaultModel(): Model {
  return {
    type: 0,
    name: '',
    routeName: '',
    path: '',
    pathParam: '',
    component: '',
    layout: '',
    page: '',
    permission: '',
    i18nKey: null,
    icon: '',
    iconType: '1',
    parentId: 0,
    status: '1',
    keepAlive: 0,
    constant: 0,
    orderNo: 0,
    href: null,
    hideInMenu: 0,
    activeMenu: null,
    multiTab: 0,
    fixedIndexInTab: null,
    query: [],
    id: 0
  };
}

type RuleKey = Extract<keyof Model, 'name' | 'status' | 'routeName' | 'path'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  status: defaultRequiredRule,
  routeName: defaultRequiredRule,
  path: defaultRequiredRule
};

const disabledMenuType = computed(() => ['edit', 'addChild', 'addPermission'].includes(props.operateType));

const localIcons = getLocalIcons();
const localIconOptions = localIcons.map<SelectOption>(item => ({
  label: () => (
    <div class="flex-y-center gap-16px">
      <SvgIcon localIcon={item} class="text-icon" />
      <span>{item}</span>
    </div>
  ),
  value: item
}));

const showLayout = computed(() => model.value.parentId === 0);

const showPage = computed(() => model.value.type === 1);
const showPermission = computed(() => [2, 1].includes(model.value.type));

const pageOptions = computed(() => {
  const allPages = [...props.allPages];

  if (model.value.routeName && !allPages.includes(model.value.routeName)) {
    allPages.unshift(model.value.routeName);
  }

  const opts: CommonType.Option[] = allPages.map(page => ({
    label: page,
    value: page
  }));

  return opts;
});

const layoutOptions: CommonType.Option[] = [
  {
    label: 'base',
    value: 'base'
  },
  {
    label: 'blank',
    value: 'blank'
  }
];

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  const { error, data } = await fetchGetAllRoles();

  if (!error) {
    const options = data.map(item => ({
      label: item.roleName,
      value: item.roleCode
    }));

    roleOptions.value = [...options];
  }
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (!props.rowData) return;

  if (props.operateType === 'addChild') {
    const { id } = props.rowData;

    Object.assign(model.value, { parentId: id, type: 1 });
  }
  if (props.operateType === 'addPermission') {
    const { id } = props.rowData;

    Object.assign(model.value, { parentId: id, type: 2 });
  }

  if (props.operateType === 'edit') {
    const { component, ...rest } = props.rowData;

    const { layout, page } = getLayoutAndPage(component);
    const { path, param } = getPathParamFromRoutePath(rest.path || '');

    Object.assign(model.value, rest, { layout, page, routePath: path, pathParam: param });
  }

  if (!model.value.query) {
    model.value.query = [];
  }
}

function closeDrawer() {
  visible.value = false;
}

function handleUpdateRoutePathByRouteName() {
  if (model.value.routeName) {
    model.value.path = getRoutePathByRouteName(model.value.routeName);
  } else {
    model.value.path = '';
  }
}

function handleUpdateI18nKeyByRouteName() {
  if (model.value.routeName) {
    model.value.i18nKey = `route.${model.value.routeName}` as App.I18n.I18nKey;
  } else {
    model.value.i18nKey = null;
  }
}

function handleCreateButton() {
  const buttonItem: Api.SystemManage.MenuButton = {
    code: '',
    desc: ''
  };

  return buttonItem;
}

function getSubmitParams() {
  const { layout, page, pathParam, ...params } = model.value;

  const component = transformLayoutAndPageToComponent(layout, page);
  const routePath = getRoutePathWithParam(model.value.path, pathParam);

  params.component = component;
  params.path = routePath;
  return params;
}

async function handleSubmit() {
  await validate();

  const params = getSubmitParams();

  const { error } = await (props.operateType === 'edit' ? fetchUpdateMenu(params.id, params) : fetchAddMenu(params));

  if (!error) {
    window.$message?.success(props.operateType === 'edit' ? $t('common.updateSuccess') : $t('common.addSuccess'));
    closeDrawer();
    emit('submitted');
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    // getRoleOptions();
  }
});

watch(
  () => model.value.routeName,
  () => {
    handleUpdateRoutePathByRouteName();
    handleUpdateI18nKeyByRouteName();
  }
);
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-800px">
    <NScrollbar class="h-480px pr-20px">
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
        <NGrid responsive="screen" item-responsive>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.menuType')" path="type">
            <NRadioGroup v-model:value="model.type" :disabled="disabledMenuType">
              <NRadio v-for="item in menuTypeOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.parentId')" path="parentId">
            <NInputNumber v-model:value="model.parentId" :disabled="disabledMenuType" :show-button="false" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="menuName" path="name">
            <NInput v-model:value="model.name" :placeholder="formMenuName" />
          </NFormItemGi>
          <NFormItemGi
            v-if="showPermission"
            span="24 m:12"
            :label="$t('page.manage.menu.type.permission')"
            path="permission"
          >
            <NInput v-model:value="model.permission" :placeholder="$t('page.manage.menu.form.permission')" />
          </NFormItemGi>
          <template v-if="model.type !== 2">
            <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.routeName')" path="routeName">
              <NInput v-model:value="model.routeName" :placeholder="$t('page.manage.menu.form.routeName')" />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.routePath')" path="path">
              <NInput v-model:value="model.path" disabled :placeholder="$t('page.manage.menu.form.routePath')" />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.pathParam')" path="pathParam">
              <NInput v-model:value="model.pathParam" :placeholder="$t('page.manage.menu.form.pathParam')" />
            </NFormItemGi>
            <NFormItemGi v-if="showLayout" span="24 m:12" :label="$t('page.manage.menu.layout')" path="layout">
              <NSelect
                v-model:value="model.layout"
                :options="layoutOptions"
                :placeholder="$t('page.manage.menu.form.layout')"
              />
            </NFormItemGi>
            <NFormItemGi v-if="showPage" span="24 m:12" :label="$t('page.manage.menu.page')" path="page">
              <NSelect
                v-model:value="model.page"
                :options="pageOptions"
                :placeholder="$t('page.manage.menu.form.page')"
              />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.iconTypeTitle')" path="iconType">
              <NRadioGroup v-model:value="model.iconType">
                <NRadio
                  v-for="item in menuIconTypeOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="$t(item.label)"
                />
              </NRadioGroup>
            </NFormItemGi>
            <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.icon')" path="icon">
              <template v-if="model.iconType === '1'">
                <NInput v-model:value="model.icon" :placeholder="$t('page.manage.menu.form.icon')" class="flex-1">
                  <template #suffix>
                    <SvgIcon v-if="model.icon" :icon="model.icon" class="text-icon" />
                  </template>
                </NInput>
              </template>
              <template v-if="model.iconType === '2'">
                <NSelect
                  v-model:value="model.icon"
                  :placeholder="$t('page.manage.menu.form.localIcon')"
                  :options="localIconOptions"
                />
              </template>
            </NFormItemGi>
            <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.keepAlive')" path="keepAlive">
              <NRadioGroup v-model:value="model.keepAlive">
                <NRadio :value="1" :label="$t('common.yesOrNo.yes')" />
                <NRadio :value="0" :label="$t('common.yesOrNo.no')" />
              </NRadioGroup>
            </NFormItemGi>
            <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.constant')" path="constant">
              <NRadioGroup v-model:value="model.constant">
                <NRadio :value="1" :label="$t('common.yesOrNo.yes')" />
                <NRadio :value="0" :label="$t('common.yesOrNo.no')" />
              </NRadioGroup>
            </NFormItemGi>
            <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.href')" path="href">
              <NInput v-model:value="model.href" :placeholder="$t('page.manage.menu.form.href')" />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.hideInMenu')" path="hideInMenu">
              <NRadioGroup v-model:value="model.hideInMenu">
                <NRadio :value="1" :label="$t('common.yesOrNo.yes')" />
                <NRadio :value="0" :label="$t('common.yesOrNo.no')" />
              </NRadioGroup>
            </NFormItemGi>
            <NFormItemGi
              v-if="model.hideInMenu"
              span="24 m:12"
              :label="$t('page.manage.menu.activeMenu')"
              path="activeMenu"
            >
              <NSelect
                v-model:value="model.activeMenu"
                :options="pageOptions"
                clearable
                :placeholder="$t('page.manage.menu.form.activeMenu')"
              />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.multiTab')" path="multiTab">
              <NRadioGroup v-model:value="model.multiTab">
                <NRadio :value="1" :label="$t('common.yesOrNo.yes')" />
                <NRadio :value="0" :label="$t('common.yesOrNo.no')" />
              </NRadioGroup>
            </NFormItemGi>
            <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.fixedIndexInTab')" path="fixedIndexInTab">
              <NInputNumber
                v-model:value="model.fixedIndexInTab"
                class="w-full"
                clearable
                :placeholder="$t('page.manage.menu.form.fixedIndexInTab')"
              />
            </NFormItemGi>
          </template>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.i18nKey')" path="i18nKey">
            <NInput v-model:value="model.i18nKey" :placeholder="$t('page.manage.menu.form.i18nKey')" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.order')" path="orderNo">
            <NInputNumber
              v-model:value="model.orderNo"
              class="w-full"
              :placeholder="$t('page.manage.menu.form.order')"
            />
          </NFormItemGi>

          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.menuStatus')" path="status">
            <NRadioGroup v-model:value="model.status">
              <NRadio
                v-for="item in enableStatusOptions"
                :key="item.value"
                :value="item.value"
                :label="$t(item.label)"
              />
            </NRadioGroup>
          </NFormItemGi>

          <!--
 <NFormItemGi span="24" :label="$t('page.manage.menu.query')">
            <NDynamicInput
              v-model:value="model.query"
              preset="pair"
              :key-placeholder="$t('page.manage.menu.form.queryKey')"
              :value-placeholder="$t('page.manage.menu.form.queryValue')"
            >
              <template #action="{ index, create, remove }">
                <NSpace class="ml-12px">
                  <NButton size="medium" @click="() => create(index)">
                    <icon-ic:round-plus class="text-icon" />
                  </NButton>
                  <NButton size="medium" @click="() => remove(index)">
                    <icon-ic-round-remove class="text-icon" />
                  </NButton>
                </NSpace>
              </template>
            </NDynamicInput>
          </NFormItemGi>
-->
        </NGrid>
      </NForm>
    </NScrollbar>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
