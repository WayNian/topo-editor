import mitt, { type Emitter } from "mitt";

import type { MittType } from "@/types";

const emitter: Emitter<MittType> = mitt<MittType>();

export default emitter;
