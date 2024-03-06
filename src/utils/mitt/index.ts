import type { MittType } from "@/types";
import mitt, { type Emitter } from "mitt";

const emitter: Emitter<MittType> = mitt<MittType>();

export default emitter;
