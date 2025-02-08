<script lang="ts" setup>
defineOptions({ name: 'SystemLogo' });

interface Props {
  height?: number;
}

withDefaults(defineProps<Props>(), {
  height: 56
});
</script>

<template>
  <div>
    <img src="@/assets/imgs/logo.png" class="logo-image" :style="{ width: height + 'px', height: height + 'px' }" />
  </div>
</template>

<style scoped></style>
