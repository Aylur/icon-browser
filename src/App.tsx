import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import { bugs } from "../package.json"
import { gettext as _ } from "gettext"
import { register } from "gjsx/gobject"
import { apply, css } from "gjsx/gtk4/style"
import { initSettings } from "#/lib"
import { createRoot } from "gjsx"
import Window from "#/widget/Window"
import Preferences from "#/widget/Preferences"

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
    super({ application_id: import.meta.appId })
    this.setAction("about", this.showAbout)
    this.setAction("preferences", this.showSettings)
    this.set_accels_for_action("app.preferences", ["<Control>comma"])
  }

  vfunc_activate() {
    if (this.window) {
      return this.window.present()
    }

    initSettings()
    apply()

    createRoot(() => (
      <>
        <Window app={this} ref={(self) => (this.window = self)} />
        <Preferences ref={(self) => (this.preferences = self)} />
        <Adw.AboutDialog
          $={(self) => (this.about = self)}
          applicationName={_("Icon Browser")}
          applicationIcon="application-x-executable"
          developerName="Aylur"
          issueUrl={bugs.url}
          version={pkg.version}
          licenseType={Gtk.License.MIT_X11}
        />
      </>
    ))
  }

  private setAction(name: string, callback: () => void) {
    const action = new Gio.SimpleAction({ name })
    action.connect("activate", callback.bind(this))
    this.add_action(action)
  }

  private showSettings() {
    this.preferences.present(this.window)
  }

  private showAbout() {
    this.about.present(this.window)
  }

  static main(args: string[]) {
    return new IconThemeBrowser().runAsync(args)
  }
}
