export const getScreenSize = () => {
  const width = window.screen.width;
  const height = window.screen.height;
  return { width, height };
};

export const getSvgSize = () => {
  const body = document.querySelector(".editor-layout");

  const width = body?.clientWidth || 0;
  const height = body?.clientHeight || 0;
  return { width, height };
};
