import App from "#/main"
import Gdk from "gi://Gdk?version=4.0"
import Gio from "gi://Gio?version=2.0"
import GLib from "gi://GLib?version=2.0"
import GObject from "gi://GObject?version=2.0"
import Gtk from "gi://Gtk?version=4.0"

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

export interface IconList extends Gio.ListModel {
  get_item_type(): GObject.GType<Gtk.StringObject>
  get_item(position: number): Gtk.StringObject | null
  [Symbol.iterator](): IterableIterator<Gtk.StringObject>
}

// creating a subclass and implementing Gio.ListModel caused
// a lot of crashes, and I don't care about it enough to spend more time on it
export function iconList(search?: string): IconList {
  const symbolic = App.settings.colored()

  const items = getTheme()
    .iconNames.filter((name) => name.includes(search ?? ""))
    .filter((name) => {
      if (symbolic === "symbolic-only") return name.endsWith("-symbolic")
      if (symbolic === "colored-only") return !name.endsWith("-symbolic")
      return true
    })
    .sort()
    .map((s) => Gtk.StringObject.new(s))

  const list = Gio.ListStore.new(Gtk.StringObject)
  for (const item of items) {
    list.append(item)
  }

  return list as IconList
}
