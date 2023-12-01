import type { EnterElement } from "d3";

export type ISVG = d3.Selection<SVGSVGElement, any, HTMLElement, any>;

export type ISVGG<T, V extends d3.BaseType | SVGGElement> = d3.Selection<SVGGElement, T, V, any>;

export type ISVGRect<T> = d3.Selection<SVGRectElement, T, HTMLElement | SVGGElement, any>;

export type IEnter<T> = d3.Selection<EnterElement, T, SVGGElement, any>;

export type IUpdate<T> = d3.Selection<SVGGElement, T, SVGGElement, any>;

export type IExit<T> = d3.Selection<SVGGElement, T, SVGGElement, any>;
