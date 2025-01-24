export function checkAndOpenTab() {
  // 打开一个空白标签页，但不切换焦点
  const openNewTab = () => {
    const newTab = window.open('about:blank', '_blank');
    // 将焦点切回当前窗口
    setTimeout(() => {
      window.focus();
    }, 100);
    return newTab;
  };

  // 如果是登录页且只有一个标签页，则打开新标签页
  if (window.opener === null) {
    openNewTab();
  }
}
