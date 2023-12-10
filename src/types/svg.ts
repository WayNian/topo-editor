import type { EnterElement } from "d3";
import type { ILink } from "./data";

export type ISVG = d3.Selection<SVGSVGElement, any, HTMLElement, any>;

export type ISVGG<T, V extends d3.BaseType | SVGGElement> = d3.Selection<SVGGElement, T, V, any>;

export type ISVGRect<T> = d3.Selection<SVGRectElement, T, HTMLElement | SVGGElement, any>;

export type ISVGCircle<T> = d3.Selection<SVGCircleElement, T, HTMLElement | SVGGElement, any>;

export type ISVGEllipse<T> = d3.Selection<SVGEllipseElement, T, HTMLElement | SVGGElement, any>;

export type ISVGText<T> = d3.Selection<SVGTextElement, T, HTMLElement | SVGGElement, any>;

export type ISVGTspant<T> = d3.Selection<SVGTSpanElement, T, HTMLElement | SVGGElement, any>;

export type ISVGForeignObject<T> = d3.Selection<
  SVGForeignObjectElement,
  T,
  HTMLElement | SVGGElement,
  any
>;

export type IPath = d3.Selection<SVGPathElement, ILink, any, any>;

export type ISVGBase<T> = d3.Selection<d3.BaseType, T, d3.BaseType, any>;

export type IEnter<T> = d3.Selection<EnterElement, T, SVGGElement, any>;

export type IUpdate<T> = d3.Selection<SVGGElement, T, SVGGElement, any>;

export type IExit<T> = d3.Selection<SVGGElement, T, SVGGElement, any>;
