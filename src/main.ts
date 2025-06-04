import { gettext as _ } from "gettext"
import { register } from "gjsx/gobject"
import { apply, css } from "gjsx/gtk4/style"
import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import Window from "./widget/Window"
import Preferences from "./widget/Preferences"
import { initSettings } from "./lib"

void css`
  toast {
    background: black;
  }
`

@register({ GTypeName: "IconThemeBrowser" })
export default class IconThemeBrowser extends Adw.Application {
  declare window: Adw.ApplicationWindow
  declare preferences: Adw.PreferencesDialog
  declare about: Adw.AboutDialog

  constructor() {
    super({ application_id: pkg.name })
    this.setAction("about", this.showAbout)
    this.setAction("preferences", this.showSettings)
    this.set_accels_for_action("app.preferences", ["<Control>comma"])
  }

  vfunc_activate() {
    initSettings()
    apply()

    if (!this.window) this.window = Window({ app: this }) as Adw.ApplicationWindow

    this.window.present()
  }

  setAction(name: string, callback: () => void) {
    const action = new Gio.SimpleAction({ name })
    action.connect("activate", callback.bind(this))
    this.add_action(action)
  }

  showSettings() {
    if (!this.preferences) this.preferences = Preferences() as Adw.PreferencesDialog

    this.preferences.present(this.window)
  }

  showAbout() {
    if (!this.about) {
      this.about = new Adw.AboutDialog({
        application_name: _("Icon Browser"),
        application_icon: "application-x-executable",
        developer_name: "Aylur",
        issue_url: "https://github.com/aylur/icon-browser",
        version: pkg.version,
        license_type: Gtk.License.MIT_X11,
      })
    }

    this.about.present(this.window)
  }

  static main(args: string[]) {
    return new IconThemeBrowser().runAsync(args)
  }
}
