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

// 12,32
export const getPosition = (val: string) => {
  const [x, y] = val.split(",").map((item) => Number(item));
  return { x, y };
};

// 1920*1080
export const getSize = (val: string) => {
  const [width, height] = val.split("*").map((item) => Number(item));
  return { width, height };
};
