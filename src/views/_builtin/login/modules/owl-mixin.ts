import { useOwlStore } from '@/store/modules/owl';
/** 焦点 Composable */
export function useOwlEyes() {
  // 焦点Store
  const owlStore = useOwlStore();

  // 失去焦点
  const handleBlur = () => {
    owlStore.setPasswordFocused(false);
  };

  // 获取焦点
  const handleFocus = () => {
    owlStore.setPasswordFocused(true);
  };

  return { handleFocus, handleBlur };
}
