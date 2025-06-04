import Gtk from "gi://Gtk"
import Gdk from "gi://Gdk"
import GLib from "gi://GLib"
import { getSettings, Colored } from "./settings"

function getTheme() {
  return Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!)
}

function isDir(...path: string[]) {
  return GLib.file_test(GLib.build_filenamev(path), GLib.FileTest.IS_DIR)
}

function isFile(...path: string[]) {
  return GLib.file_test(
    GLib.build_filenamev(path),
    GLib.FileTest.IS_REGULAR | GLib.FileTest.IS_SYMLINK,
  )
}

export function getThemeNames() {
  return (
    getTheme()
      .get_search_path()
      ?.flatMap((path) => {
        if (!isDir(path)) {
          return []
        }

        const dir = GLib.Dir.open(path, 0)
        const names: string[] = []

        let name: string
        while ((name = dir.read_name()) !== null) {
          if (isDir(path, name) && isFile(path, name, "index.theme")) names.push(name)
        }

        dir.close()
        return names
      })
      .filter((name) => name !== "hicolor" && name !== "default")
      .reduce((acc, name) => (acc.includes(name) ? acc : [name, ...acc]), [] as string[])
      .sort() || []
  )
}

export function searchIcons(search: string) {
  const symbolic = getSettings().colored.get()

  return getTheme()
    .icon_names.filter((name) => name.includes(search))
    .filter((name) => {
      if (symbolic === Colored.SYMBOLIC_ONLY) return name.endsWith("-symbolic")

      if (symbolic === Colored.COLORED_ONLY) return !name.endsWith("-symbolic")

      return true
    })
    .sort()
}
