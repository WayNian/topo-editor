import type { ILink, ISVGG } from "@/types";

const setLinkRect = (enterG: ISVGG<ILink, SVGGElement>) => {
  enterG.each(function (d) {
    d.rect = this.getBBox();
    console.log("🚀 ~  d.rect:", d.rect);
  });
};

onmessage = (e) => {
  setLinkRect(e.data);
  //   postMessage(workerResult);
};
