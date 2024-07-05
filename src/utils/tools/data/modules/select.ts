import { debounce } from "radash";

import { useDataStore } from "@/stores";

/**
 * 通过selection获取nodes和links，根据选择框左上角和右下角的坐标，获取跟选择框有交集的link和node数据
 * @param startPoints
 * @param endPoints
 */
const selectNodesLinks = (startPoints: number[], endPoints: number[]) => {
  const dataStore = useDataStore();
  dataStore.nodes.forEach((node) => {
    // 计算节点的边界框
    const nodeRect = {
      left: node.x,
      right: node.x + node.width,
      top: node.y,
      bottom: node.y + node.height
    };

    // 计算选择框的边界框
    const selectionRect = {
      left: Math.min(startPoints[0], endPoints[0]),
      right: Math.max(startPoints[0], endPoints[0]),
      top: Math.min(startPoints[1], endPoints[1]),
      bottom: Math.max(startPoints[1], endPoints[1])
    };

    // 判断两个边界框是否相交
    if (
      nodeRect.left < selectionRect.right &&
      nodeRect.right > selectionRect.left &&
      nodeRect.top < selectionRect.bottom &&
      nodeRect.bottom > selectionRect.top
    ) {
      node.selected = true;
    } else {
      node.selected = false;
    }
  });

  dataStore.links.forEach((link) => {
    // 计算连线的边界框
    const linkRect = {
      left: link.x,
      right: link.x + link.width,
      top: link.y,
      bottom: link.y + link.height
    };

    // 计算选择框的边界框
    const selectionRect = {
      left: Math.min(startPoints[0], endPoints[0]),
      right: Math.max(startPoints[0], endPoints[0]),
      top: Math.min(startPoints[1], endPoints[1]),
      bottom: Math.max(startPoints[1], endPoints[1])
    };

    // 判断两个边界框是否相交
    if (
      linkRect.left < selectionRect.right &&
      linkRect.right > selectionRect.left &&
      linkRect.top < selectionRect.bottom &&
      linkRect.bottom > selectionRect.top
    ) {
      link.selected = true;
    } else {
      link.selected = false;
    }
  });
};

export const selectNodesLinksByDebounce = debounce({ delay: 50 }, selectNodesLinks);
