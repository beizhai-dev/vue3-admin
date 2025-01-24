import { $t } from '@/locales';

/** 环境选项 */
export const ENVIRONMENT_OPTIONS = [
  { label: () => $t('page.box.summary.environment.X'), value: 'X' },
  { label: () => $t('page.box.summary.environment.GO'), value: 'GO' },
  { label: () => $t('page.box.summary.environment.ICBC'), value: 'ICBC' },
  { label: () => $t('page.box.summary.environment.LOCAL'), value: 'LOCAL' }
] as const;

/** 环境映射 */
export const ENVIRONMENT_MAP = {
  X: () => $t('page.box.summary.environment.X'),
  GO: () => $t('page.box.summary.environment.GO'),
  ICBC: () => $t('page.box.summary.environment.ICBC'),
  LOCAL: () => $t('page.box.summary.environment.LOCAL')
} as const;

/** 环境类型 */
export type EnvironmentType = 'X' | 'GO' | 'ICBC' | 'LOCAL';
