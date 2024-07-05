// uno.config.ts
import transformerDirectives from "@unocss/transformer-directives";

import { defineConfig } from "unocss";
import { presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno()],
  transformers: [transformerDirectives()]
});
