import { useTopo } from "@/stores/topo";
import { draw } from "@/utils/draw";
import emitter from "@/utils/mitt";
import { onMounted } from "vue";
import { formatLinks } from "@/utils/tools/data";

export const useTopoEditor = () => {
  const store = useTopo();
  const initEvent = () => {
    emitter.on("on:draw", ({ nodes, links, svgSize }) => {
      store.topoNodes = nodes;
      store.topoLinks = formatLinks(links);
      store.svgSize = svgSize;
      draw();
    });
  };
  onMounted(() => {
    draw();
    initEvent();
  });
};
