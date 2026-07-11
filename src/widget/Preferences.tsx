import { getThemeNames } from "#/lib"
import App from "#/main"
import Adw from "gi://Adw?version=1"
import Gtk from "gi://Gtk?version=4.0"
import { bind } from "gnim"

export default function PreferencesPage() {
  const t = App.gettext
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const gtkSettings = Gtk.Settings.get_default()!
  const themes = getThemeNames()
  const theme = bind(gtkSettings, "gtk-icon-theme-name")
  const {
    showAll,
    setShowAll,
    iconSize,
    setIconSize,
    colored,
    setColored,
    selectBehavior,
    setSelectBehavior,
  } = App.settings

  return (
    <Adw.PreferencesPage title={t("Browser Preferences")}>
      <Adw.PreferencesGroup>
        <Adw.SwitchRow
          title={t("Show All Icons")}
          subtitle={t(
            "Turning this on might cause some lag if the theme contains a lot of icons",
          )}
          active={showAll}
          onNotifyActive={({ active }) => setShowAll(active)}
        />
        <Adw.SpinRow title={t("Icon Size")} subtitle={t("Size of the icons in the grid")}>
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
          title={t("Theme")}
          subtitle={t("Theme of the icons in the grid")}
          enableSearch
          model={Gtk.StringList.new(themes)}
          selected={themes.findIndex((v) => v == theme.peek())}
          onNotifySelected={({ selected }) =>
            (gtkSettings.gtkIconThemeName = themes[selected])
          }
        />
        <Adw.ComboRow
          title={t("Color")}
          subtitle={t("What kind of icons to show")}
          model={Gtk.StringList.new([t("Both"), t("Symbolic Only"), t("Colored Only")])}
          selected={colored.as(
            (v) => ({ both: 0, "symbolic-only": 1, "colored-only": 2 })[v],
          )}
          onNotifySelected={({ selected }) =>
            setColored((["both", "symbolic-only", "colored-only"] as const)[selected])
          }
        />
        <Adw.ComboRow
          title={t("Select Behaviour")}
          subtitle={t("Action that should happen on icon selection")}
          model={Gtk.StringList.new([t("Copy Name"), t("Copy File"), t("Open Dialog")])}
          selected={selectBehavior.as(
            (v) => ({ "copy-name": 0, "copy-file": 1, "open-dialog": 2 })[v],
          )}
          onNotifySelected={({ selected }) =>
            setSelectBehavior(
              (["copy-name", "copy-file", "open-dialog"] as const)[selected],
            )
          }
        />
      </Adw.PreferencesGroup>
    </Adw.PreferencesPage>
  )
}
