import { useTopoStore } from "@/stores/topo";
import { draw } from "@/utils/draw";
import emitter from "@/utils/mitt";
import { onMounted } from "vue";
import { formatLinks } from "@/utils/tools/data";

export const useTopoEditor = () => {
  const store = useTopoStore();
  const initEvent = () => {
    emitter.on("on:draw", ({ nodes, links }) => {
      store.topoNodes = nodes;
      store.topoLinks = formatLinks(links);
      draw();
    });
  };
  onMounted(() => {
    // draw();
    initEvent();
  });
};
