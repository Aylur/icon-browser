import { defineSchemaList, Schema, Enum } from "gnim/schema"

const symbolic = new Enum("dev.aylur.icon-browser.symbolic", [
  "both",
  "symbolic-only",
  "colored-only",
])

const selectBehavior = new Enum("dev.aylur.icon-browser.select-behavior", [
  "copy-name",
  "copy-file",
  "open-dialog",
])

export const schema = new Schema({
  id: "dev.aylur.icon-browser",
  path: "/dev/aylur/icon-browser/",
})
  .key("icon-size", "u", {
    default: 52,
    summary: "Size of icons in the list view.",
  })
  .key("theme-name", "s", {
    default: "Adwaita",
    summary: "Theme of the icons",
  })
  .key("colored", symbolic, {
    default: "both",
  })
  .key("select-behavior", selectBehavior, {
    default: "open-dialog",
  })

export default defineSchemaList([schema])
