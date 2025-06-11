import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import { getThemeNames } from "./icon"
import { createBinding as bind } from "gjsx"

export enum Colored {
  BOTH,
  SYMBOLIC_ONLY,
  COLORED_ONLY,
}

const SHOW_ALL = "show-all"
const ICON_SIZE = "icon-size"
const THEME_NAME = "theme-name"
const COLORED = "colored"

let appSettings: Gio.Settings
let gtkSettings: Gtk.Settings
let settings: ReturnType<typeof createSettings>

export function initSettings() {
  appSettings = new Gio.Settings({ schema_id: import.meta.appId })
  gtkSettings = Gtk.Settings.get_default()!

  const name = appSettings.get_string(THEME_NAME)

  if (getThemeNames().includes(name)) {
    gtkSettings.gtk_icon_theme_name = name
  } else {
    appSettings.set_string(THEME_NAME, gtkSettings.gtk_icon_theme_name)
  }

  settings = createSettings()
}

function createSettings() {
  return {
    showAll: bind<boolean>(appSettings, SHOW_ALL),
    setShowAll: (v: boolean) => appSettings.set_boolean(SHOW_ALL, v),

    iconSize: bind<number>(appSettings, ICON_SIZE),
    setIconSize: (v: number) => appSettings.set_uint(ICON_SIZE, v),

    themeName: bind<string>(appSettings, THEME_NAME),
    setThemeName: (v: string) => appSettings.set_string(THEME_NAME, v),

    colored: bind<Colored>(appSettings, COLORED)(() => appSettings.get_enum(COLORED)),
    setColored: (v: Colored) => appSettings.set_enum(COLORED, v),

    theme: bind(gtkSettings, "gtkIconThemeName"),
    setTheme: (v: string) => (gtkSettings.gtkIconThemeName = v),
  }
}

export function getSettings() {
  return settings
}
