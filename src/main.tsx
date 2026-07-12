import "./style.css"
import pkg from "../package.json"
import Adw from "gi://Adw?version=1"
import Gio from "gi://Gio?version=2.0"
import GLib from "gi://GLib?version=2.0"
import { register } from "gnim/gobject"
import { render } from "@gnim-js/gtk4"
import { createDomain } from "gnim/i18n"
import { createSettings } from "gnim/schema"
import { programArgs, programInvocationName } from "system"
import { schema } from "./dev.aylur.icon-browser.gschema"
import WindowContent from "./widget/WindowContet"
import Gtk from "gi://Gtk?version=4.0"
import PreferencesPage from "./widget/Preferences"

@register
export default class App extends Adw.Application {
  static instance: App
  static gettext = createDomain("dev.aylur.icon-themes")
  static settings = createSettings(schema)
  static isDev = !!GLib.getenv("GNIM_DEV")
  static window: Adw.ApplicationWindow
  static preferences: Adw.PreferencesDialog
  static about: Adw.AboutDialog

  constructor() {
    super({
      applicationId: "dev.aylur.icon-themes",
      flags: Gio.ApplicationFlags.DEFAULT_FLAGS,
    })
    this.setAction("about", this.showAbout)
    this.setAction("preferences", this.showSettings)
    this.set_accels_for_action("app.preferences", ["<Control>comma"])
  }

  vfunc_activate(): void {
    App.window.present()
  }

  private setAction(name: string, callback: () => void) {
    const action = new Gio.SimpleAction({ name })
    action.connect("activate", callback.bind(this))
    this.add_action(action)
  }

  private showSettings() {
    App.preferences.present(App.window)
  }

  private showAbout() {
    App.about.present(App.window)
  }

  vfunc_startup(this: App): void {
    super.vfunc_startup()
    const t = App.gettext

    const dispose = render(() => (
      <>
        <Adw.ApplicationWindow
          ref={(ref) => (App.window = ref)}
          application={this}
          defaultWidth={600}
          defaultHeight={500}
          widthRequest={360}
          heightRequest={360}
          title={t("Icon Browser")}
        >
          <Adw.ToolbarView
            topBarStyle={Adw.ToolbarStyle.RAISED}
            bottomBarStyle={Adw.ToolbarStyle.RAISED}
          >
            <WindowContent />
          </Adw.ToolbarView>
        </Adw.ApplicationWindow>
        <Adw.PreferencesDialog
          ref={(ref) => (App.preferences = ref)}
          title={t("Browser Preferences")}
        >
          <PreferencesPage />
        </Adw.PreferencesDialog>
        <Adw.AboutDialog
          ref={(ref) => (App.about = ref)}
          applicationName={t("Icon Browser")}
          applicationIcon="application-x-executable"
          developerName="Aylur"
          issueUrl={pkg.bugs.url}
          version={pkg.version}
          licenseType={Gtk.License.MIT_X11}
        />
      </>
    ))

    if (App.isDev) {
      App.window.add_css_class("devel")
    }

    this.connect("shutdown", dispose)
  }
}

/* main */ {
  const { gettext: t } = App.gettext
  GLib.set_prgname("icon-browser")
  GLib.set_application_name(t("Gnim Demo Adwaita App"))

  App.instance = new App()
  App.instance.runAsync([programInvocationName, ...programArgs]).catch(console.error)
}
