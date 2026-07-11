import { defineSchemaList, Schema, Enum } from "gnim/schema"

const symbolic = new Enum("dev.aylur.icon-browser", [
  "both",
  "symbolic-only",
  "colored-only",
])

export const schema = new Schema({
  id: "dev.aylur.icon-browser",
  path: "/dev/aylur/icon-browser/",
})
  .key("show-all", "b", {
    default: false,
    summary: "Show all available icons",
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

export default defineSchemaList([schema])
