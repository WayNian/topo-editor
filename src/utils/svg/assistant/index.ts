import { useMenuStore } from "@/stores";
import type { IPath } from "@/types";
import { getSvgSize } from "@/utils/tools/common";
const menuStore = useMenuStore();

export const setInitTransform = () => {
  const { width, height } = getSvgSize();
  const mapWidth = menuStore.mapSize.width;
  const mapHeight = menuStore.mapSize.height;

  const aspectRatio = mapWidth / mapHeight;
  const scaleFactor = aspectRatio > 1 ? (width - 50) / mapWidth : (height - 50) / mapHeight;

  const scaledWidth = mapWidth * scaleFactor;
  const scaledHeight = mapHeight * scaleFactor;

  const x = (width - scaledWidth) / 2;
  const y = (height - scaledHeight) / 2;

  return { x, y, k: scaleFactor };
};

// 定义闪烁函数
export const blink = (path: IPath) => {
  // 设置初始状态（可见或隐藏）
  let visible = true;

  // 每 500 毫秒切换可见性状态
  const intervalId = setInterval(function () {
    // 使用过渡来改变可见性状态
    path
      .transition()
      .duration(250)
      .style("opacity", visible ? 0 : 1);

    visible = !visible;
  }, 500);

  // 在 5 秒后停止闪烁
  setTimeout(function () {
    clearInterval(intervalId);
    // 恢复原始状态
    path.transition().duration(0).style("opacity", 1);
  }, 5000);
};
