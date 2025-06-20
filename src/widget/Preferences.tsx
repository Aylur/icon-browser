import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import Gdk from "gi://Gdk"
import { gettext as _ } from "gettext"
import { getSettings, getThemeNames } from "#/lib"

export default function Preferences({ ref }: { ref: (dialog: Adw.PreferencesDialog) => void }) {
  let dialog: Adw.PreferencesDialog

  const themes = getThemeNames()
  const { showAll, setShowAll, iconSize, setIconSize, theme, setTheme, colored, setColored } =
    getSettings()

  function onKeyPressed(_: Gtk.EventControllerKey, keyval: number) {
    if (keyval === Gdk.KEY_Escape) {
      dialog.close()
    }
  }

  function init(self: Adw.PreferencesDialog) {
    dialog = self
    ref(self)
  }

  return (
    <Adw.PreferencesDialog $={init} title={_("Browser Preferences")}>
      <Gtk.EventControllerKey onKeyPressed={onKeyPressed} />
      <Adw.PreferencesPage title={_("Browser Preferences")}>
        <Adw.PreferencesGroup>
          <Adw.SwitchRow
            title={_("Show All Icons")}
            subtitle={_(
              "Turning this on might cause some lag if the theme contains a lot of icons",
            )}
            active={showAll}
            onNotifyActive={({ active }) => setShowAll(active)}
          />
          <Adw.SpinRow title={_("Icon Size")} subtitle={_("Size of the icons in the grid")}>
            <Gtk.Adjustment
              lower={8}
              upper={128}
              stepIncrement={1}
              pageIncrement={4}
              value={iconSize}
              onNotifyValue={({ value }) => setIconSize(value)}
            />
          </Adw.SpinRow>
          <Adw.ComboRow
            title={_("Theme")}
            subtitle={_("Theme of the icons in the grid")}
            enableSearch
            model={Gtk.StringList.new(themes)}
            selected={themes.findIndex((v) => v == theme.get())}
            onNotifySelected={({ selected }) => setTheme(themes[selected])}
          />
          <Adw.ComboRow
            title={_("Color")}
            subtitle={_("What kind of icons to show")}
            model={Gtk.StringList.new([_("Both"), _("Symbolic Only"), _("Colored Only")])}
            selected={colored}
            onNotifySelected={({ selected }) => setColored(selected)}
          />
        </Adw.PreferencesGroup>
      </Adw.PreferencesPage>
    </Adw.PreferencesDialog>
  )
}
