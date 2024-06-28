import request from "../../http/index";
import { sm3Func } from "../secret/sm3Func";

interface Component {
  id: string;
  compCode: string;
  parentCode: string;
  parentPanel: string;
  sceneId: string;
  compConf: any;
  compDataBind?: string;
  compAnimation?: string;
  compScript?: string;
  compInteract?: string;
  compData?: string;
}

interface ComponentOption {
  property: any;
  compDataBind: any;
  compAnimation: any;
  compScript: any;
  compInteract: any;
  compData: any;
  resourceId: string;
}

function getTimestamp() {
  const now = new Date();
  let timestamp = now.getTime(); //获取当前系统时间
  const systime_diff = localStorage.getItem("systime_diff") || "";
  timestamp = timestamp + parseInt(systime_diff);
  return "" + timestamp;
}

const S4 = function () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
const guid = function () {
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
};

function getSignClient(nonceclient: string, timestamp: string) {
  const key = "wisinfo";
  const md5 = key + timestamp + nonceclient;
  return sm3Func(md5);
}

function ajaxGet(url: string) {
  const guidData = guid();
  const curTimeStamp = getTimestamp();
  return request.get({
    url: url,
    headers: {
      Authorization: localStorage.getItem("sessionID"),
      Timestamp: curTimeStamp,
      Nonceclient: guidData,
      Signclient: getSignClient(guidData, curTimeStamp)
    }
  });
}

/**
 * 公共方法 创建资源
 * @date 2021-06-29
 * @updated 2024-06-12
 * @param {any} routerHead 路由 默认""
 * @param {any} resourceCode 资源code compCode
 * @param {any} resourceId 资源id
 * @param {any} container 容器
 * @param {any} scale_f 默认1
 * @returns {any}
 */
export const publicResourceCreate = async (
  routerHead: string,
  resourceCode: string,
  resourceId: string,
  container: HTMLElement,
  scale: number
) => {
  const result2 = await ajaxGet(
    `${routerHead}/resourceManage/getComponentListByResourceId?resourceId=${resourceId}`
  );
  let components: Component[] = result2.data;
  components = createTree(components);
  const fragment = document.createDocumentFragment();

  components.forEach((one) => {
    const child = document.createElement("div");
    child.id = `comp_${one.id}`;
    child.style.width = `${one.compConf.basic.frame[2]}px`;
    child.style.height = `${one.compConf.basic.frame[3]}px`;
    child.style.left = `${one.compConf.basic.frame[0]}px`;
    child.style.top = `${one.compConf.basic.frame[1]}px`;
    child.style.position = "absolute";
    fragment.appendChild(child);
  });

  container.appendChild(fragment);

  setTimeout(() => {
    components.forEach((one, index) => {
      const compInfo = one;
      const compOption: ComponentOption = {
        property: compInfo.compConf || {},
        compDataBind: compInfo.compDataBind ? JSON.parse(compInfo.compDataBind) : {},
        compAnimation: compInfo.compAnimation ? JSON.parse(compInfo.compAnimation) : {},
        compScript: compInfo.compScript ? JSON.parse(compInfo.compScript) : {},
        compInteract: compInfo.compInteract ? JSON.parse(compInfo.compInteract) : {},
        compData: compInfo.compData ? JSON.parse(compInfo.compData) : {},
        resourceId: compInfo.sceneId
      };

      const compBasic = compInfo.compConf.basic;
      const id = compInfo.id;
      const containerElement = fragment
        ? (fragment.childNodes[index] as HTMLElement)
        : document.getElementById("comp_" + id);

      const compId = `${compInfo.id}`;
      const componentInfo: any = {
        block: compInfo.compConf,
        resourceCode: resourceCode,
        resourceId: resourceId,
        div: containerElement
      };

      try {
        componentInfo.widget = eval(
          `new ${compBasic.className}('${compId.split("_copy")[0]}', '${compBasic.code}', containerElement, 1, ${JSON.stringify(compOption)}, false)`
        );
      } catch (e) {
        console.error("Component creation failed:", e);
      }

      if (componentInfo.widget && componentInfo.widget.setScale) {
        componentInfo.widget.setScale(scale);
      }
    });
  }, 10);
};

const createTree = (list: Component[]): Component[] => {
  const tree: Component[] = [];
  const record: { [key: string]: Component } = {};
  const length = list.length;

  for (let i = 0; i < length; i++) {
    const item = list[i];
    record[item.compCode] = item;
  }

  for (let i = 0; i < length; i++) {
    const item = list[i];
    if (item.parentCode && item.parentPanel) {
      const parent = record[item.parentCode];
      if (parent) {
        if (typeof parent.compConf === "string") {
          parent.compConf = JSON.parse(parent.compConf);
        }
        const parentContainer = parent.compConf.containerJson.find(
          (pane: any) => pane.paneId === item.parentPanel
        );
        if (parentContainer) {
          if (typeof item.compConf === "string") {
            item.compConf = JSON.parse(item.compConf);
          }
          if (typeof item.compDataBind === "string" && item.compDataBind !== "") {
            item.compDataBind = JSON.parse(item.compDataBind);
          }
          const existingChildIndex = parentContainer.children.findIndex(
            (child: Component) => child.id === item.id
          );
          if (existingChildIndex !== -1) {
            parentContainer.children[existingChildIndex] = item;
          } else {
            parentContainer.children.push(item);
          }
        }
      }
    } else {
      if (typeof item.compConf === "string") {
        item.compConf = JSON.parse(item.compConf);
      }
      tree.push(item);
    }
  }

  return tree;
};
