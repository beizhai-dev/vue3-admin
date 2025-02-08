<script setup lang="ts">
import { $t } from '@/locales';
import { useThemeStore } from '@/store/modules/theme';
const themeStore = useThemeStore();
defineOptions({
  name: 'GlobalLogo'
});

interface Props {
  /** Whether to show the title */
  showTitle?: boolean;
}

withDefaults(defineProps<Props>(), {
  showTitle: true
});
</script>

<template>
  <RouterLink to="/" class="w-full flex-center nowrap-hidden">
    <div class="logo-container flex-center nowrap-hidden">
      <SystemLogo class="my-12px text-primary" :height="themeStore.header.height - 16" />
      <h2 v-show="showTitle" class="pl-8px text-20px text-primary font-bold transition duration-300 ease-in-out">
        {{ $t('system.title') }}
      </h2>
    </div>
  </RouterLink>
</template>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;

  /* 添加上下内边距 4px */
  padding-top: 4px;
  padding-bottom: 4px;
  overflow: hidden;
}
</style>
