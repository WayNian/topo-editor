import * as d3 from "d3";

interface ISvgInfo {
  svgContent: string;
  svgContainerId: string;
}

/**
 * 数据更新类型
 */
enum ISvgDataType {
  COLOR = "color",
  SIZE = "size",
  VISIBILITY = "visibility",
  TEXT = "text",
  OPACITY = "opacity",
  TRANSFORM = "transform",
  STROKE_WIDTH = "stroke-width"
}

interface ISvgDataItem {
  domId: string;
  value: string | number | boolean;
  column: string; // 数据的字段
  dataType: "text" | "number" | "boolean"; // 数据类型
  conditions: {
    tagName: string; // circle, rect, path, text
    comparison?: string; // > < = >= <= greater less equal greaterEqual lessEqual
    threshold?: string | number | boolean;
    style: {
      data: string | number; // #ffffff 4px 100 (size or visibility value)
      type: string; // fill, stroke, color, border, width, height, radius, visibility, text, opacity, transform, stroke-width
    };
  }[];
}

export class SvgIcon {
  svgInfo;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | null = null;

  constructor(svgInfo: ISvgInfo, data: ISvgDataItem[]) {
    this.svgInfo = svgInfo;
    this.initIcon();
    this.update(data);
  }

  initIcon() {
    const { svgContent, svgContainerId } = this.svgInfo;
    this.svg = d3.select(`#${svgContainerId}`).html(svgContent).select<SVGSVGElement>("svg");
  }

  update(data: ISvgDataItem[]) {
    data.forEach((item) => {
      this.updateSvg(item);
    });
  }

  updateSvg(item: ISvgDataItem) {
    item.conditions.forEach((condition) => {
      const shouldUpdate = this.evaluateCondition(item.value, item.dataType, condition);
      if (shouldUpdate) {
        this.applyStyle(item.domId, condition.tagName, condition.style);
      }
    });
  }

  evaluateCondition(
    value: string | number | boolean,
    dataType: "text" | "number" | "boolean",
    condition: { comparison?: string; threshold?: string | number | boolean }
  ): boolean {
    const { comparison, threshold } = condition;
    if (dataType === "text") {
      return true; // Always update text
    } else if (dataType === "number") {
      if (comparison && threshold !== undefined) {
        return this.compareValues(value as number, comparison, threshold as number);
      }
      return true; // Update number if no comparison is provided
    } else if (dataType === "boolean") {
      if (comparison && threshold !== undefined) {
        return this.compareValues(value ? 1 : 0, comparison, threshold ? 1 : 0);
      }
      return Boolean(value); // Update based on boolean value
    }
    return false;
  }

  compareValues(value: number | string, comparison: string, threshold: number | string): boolean {
    if (typeof value === "number" && typeof threshold === "number") {
      switch (comparison) {
        case ">":
        case "greater":
          return value > threshold;
        case "<":
        case "less":
          return value < threshold;
        case "=":
        case "equal":
          return value === threshold;
        case ">=":
        case "greaterEqual":
          return value >= threshold;
        case "<=":
        case "lessEqual":
          return value <= threshold;
        default:
          return false;
      }
    } else if (typeof value === "string" && typeof threshold === "string") {
      switch (comparison) {
        case "=":
        case "equal":
          return value === threshold;
        default:
          return false;
      }
    }
    return false;
  }

  applyStyle(domId: string, tagName: string, style: { data: string | number; type: string }) {
    const element = this.svg?.select(`#${domId}`).select(`${tagName}`);
    if (element) {
      try {
        switch (style.type) {
          case "fill":
          case "stroke":
            element.style(style.type, style.data);
            break;
          case "border":
            element.style("stroke", style.data);
            break;
          case "color":
            element.style("fill", style.data);
            break;
          case "width":
            element.attr("width", style.data);
            break;
          case "height":
            element.attr("height", style.data);
            break;
          case "radius":
            element.attr("r", style.data);
            break;
          case "visibility":
            element.style("visibility", style.data ? "visible" : "hidden");
            break;
          case "text":
            element.text(style.data);
            break;
          case "opacity":
            element.style("opacity", style.data);
            break;
          case "transform":
            element.attr("transform", style.data);
            break;
          case "stroke-width":
            element.style("stroke-width", style.data);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(
          `Failed to apply style: ${style.type} with data: ${style.data} on element: ${domId}`,
          error
        );
      }
    }
  }
}
