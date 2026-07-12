import { copyIconFile, copyToClipboard, iconList } from "#/lib"
import App from "#/main"
import Adw from "gi://Adw?version=1"
import Gio from "gi://Gio?version=2.0"
import GLib from "gi://GLib?version=2.0"
import Gtk from "gi://Gtk?version=4.0"
import { computed, createState, effect } from "gnim"
import IconDetailsDialog from "./IconDetailsDialog"
import IconGrid from "./IconGrid"

const Page = {
  SEARCH: "search",
  GRID: "grid",
  NOT_FOUND: "not-found",
}

export default function WindowContent() {
  const t = App.gettext
  const settings = App.settings

  let entry: Gtk.SearchEntry
  let toasts: Adw.ToastOverlay
  let dialog: Adw.Dialog

  const [search, setSearch] = createState("")
  const [stackChild, setStackChild] = createState(Page.SEARCH)
  const [selectedIcon, setSelectedIcon] = createState("")
  const hasSelectedIcon = computed(() => !!selectedIcon())
  const allIcons = computed(() => iconList())
  const list = computed(() => iconList(search()))

  const menu = [
    [t("Settings"), "app.preferences", "copy-symbolic"],
    [t("About"), "app.about", "copy-symbolic"],
  ]

  function buildMenu(self: Gio.Menu) {
    for (const [label, action, icon] of menu) {
      const item = Gio.MenuItem.new(label, action)
      item.set_icon(Gio.Icon.new_for_string(icon))
      self.append_item(item)
    }
  }

  function onSearch(entry: Gtk.SearchEntry) {
    entry.grab_focus()
    setSelectedIcon("")

    if (entry.text === "") {
      setStackChild(Page.SEARCH)
    } else {
      setSearch(entry.text)
      setStackChild(list().get_n_items() > 0 ? Page.GRID : Page.NOT_FOUND)
    }
  }

  function copyName(icon: string) {
    copyToClipboard(icon)
    toasts.add_toast(new Adw.Toast({ title: t("Copied to clipboard"), timeout: 1 }))
  }

  function copyFile(icon: string) {
    copyIconFile(icon)
      .catch((e) => {
        const error =
          e instanceof Error || e instanceof GLib.Error ? e.message : String(e)
        toasts.add_toast(new Adw.Toast({ title: error, timeout: 1 }))
        console.error(error)
      })
      .then((success) => {
        if (success) {
          toasts.add_toast(new Adw.Toast({ title: t("Copied Icon"), timeout: 1 }))
        }
      })
  }

  function onSelect(icon: string) {
    setSelectedIcon(icon)

    switch (settings.selectBehavior.peek()) {
      case "copy-name":
        copyName(icon)
        break
      case "copy-file":
        copyFile(icon)
        break
      case "open-dialog":
        return dialog.present(App.window)
    }
  }

  effect(() => {
    entry.set_key_capture_widget(App.window)
  })

  return (
    <>
      <IconDetailsDialog
        onCopyName={copyName}
        onCopyFile={copyFile}
        iconName={selectedIcon}
        ref={(ref) => (dialog = ref)}
      />
      <Adw.HeaderBar slot="top" centeringPolicy={Adw.CenteringPolicy.STRICT}>
        <Adw.Clamp slot="title" tighteningThreshold={400} hexpand>
          <Gtk.SearchEntry
            ref={(self) => (entry = self)}
            searchDelay={200}
            placeholderText={t("Search for icons by name")}
            onSearchChanged={onSearch}
            onSearchStarted={(self) => self.grab_focus()}
          />
        </Adw.Clamp>
        <Gtk.MenuButton slot="end" iconName="open-menu-symbolic">
          <Gio.Menu ref={buildMenu} />
        </Gtk.MenuButton>
      </Adw.HeaderBar>
      <Adw.ToastOverlay ref={(self) => (toasts = self)}>
        <Gtk.Stack visibleChildName={stackChild}>
          <Adw.Bin slot="named" name={Page.SEARCH}>
            <Gtk.ScrolledWindow
              vexpand
              hscrollbarPolicy={Gtk.PolicyType.NEVER}
              vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            >
              <IconGrid
                model={allIcons}
                onActivated={onSelect}
                onSelected={setSelectedIcon}
              />
            </Gtk.ScrolledWindow>
          </Adw.Bin>
          <Gtk.ScrolledWindow
            slot="named"
            name={Page.GRID}
            vexpand
            hscrollbarPolicy={Gtk.PolicyType.NEVER}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
          >
            <IconGrid model={list} onActivated={onSelect} onSelected={setSelectedIcon} />
          </Gtk.ScrolledWindow>
          <Adw.StatusPage
            slot="named"
            name={Page.NOT_FOUND}
            iconName="system-search-symbolic"
            title={t("No Results found")}
            description={t("Try a different search")}
          />
        </Gtk.Stack>
      </Adw.ToastOverlay>
      <Gtk.Box
        slot="bottom"
        halign={Gtk.Align.CENTER}
        hexpand
        marginTop={8}
        marginBottom={8}
        spacing={12}
        visible={hasSelectedIcon}
      >
        <Gtk.Image iconName={selectedIcon} pixelSize={24} />
        <Gtk.Label label={selectedIcon} selectable />
      </Gtk.Box>
    </>
  )
}
