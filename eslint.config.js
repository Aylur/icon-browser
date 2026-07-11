// @ts-check
import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig({
  ignores: [".gnim/**/*", "dist/**/*"],
  files: ["**/*.{tsx,ts}"],
  extends: [js.configs.recommended, tseslint.configs.strict],
})
