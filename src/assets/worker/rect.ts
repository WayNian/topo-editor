import type { ILink, ISVGG } from "@/types";

const setLinkRect = (enterG: ISVGG<ILink, SVGGElement>) => {
  enterG.each(function (d) {
    const { x, y, width, height } = this.getBBox();
    d.x = x;
    d.y = y;
    d.width = width;
    d.height = height;
  });
};

onmessage = (e) => {
  setLinkRect(e.data);
  //   postMessage(workerResult);
};
