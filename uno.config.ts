// uno.config.ts
import { defineConfig } from "unocss";
import { presetUno } from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  presets: [presetUno()],
  transformers: [transformerDirectives()]
});
