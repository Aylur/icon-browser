import { copyToClipboard, iconList } from "#/lib"
import App from "#/main"
import Adw from "gi://Adw?version=1"
import Gio from "gi://Gio?version=2.0"
import Gtk from "gi://Gtk?version=4.0"
import { computed, createState, effect, With } from "gnim"
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

  function onSelect(icon?: string) {
    if (icon) setSelectedIcon(icon)
    copyToClipboard(selectedIcon.peek())

    toasts.add_toast(
      new Adw.Toast({
        title: t("Copied to clipboard"),
        timeout: 1,
      }),
    )
  }

  effect(() => {
    entry.set_key_capture_widget(App.window)
  })

  return (
    <Adw.ToolbarView
      topBarStyle={Adw.ToolbarStyle.RAISED}
      bottomBarStyle={Adw.ToolbarStyle.RAISED}
    >
      <Adw.HeaderBar slot="top" centeringPolicy={Adw.CenteringPolicy.STRICT}>
        <Gtk.Button
          slot="start"
          ref={(self) => self.add_css_class("suggested-action")}
          visible={hasSelectedIcon}
          onClicked={() => onSelect()}
        >
          <Gtk.Box spacing={4}>
            <Gtk.Image iconName="edit-copy-symbolic" />
            <Gtk.Label label={t("Copy")} />
          </Gtk.Box>
        </Gtk.Button>
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
            <With value={settings.showAll}>
              {(all) =>
                all ? (
                  <Gtk.ScrolledWindow
                    vexpand
                    hscrollbarPolicy={Gtk.PolicyType.NEVER}
                    vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                  >
                    <IconGrid model={allIcons} onSelected={onSelect} />
                  </Gtk.ScrolledWindow>
                ) : (
                  <Adw.StatusPage
                    iconName="system-search-symbolic"
                    title={t("Start typing to search")}
                    description={t("Search for icons by their name")}
                  />
                )
              }
            </With>
          </Adw.Bin>
          <Gtk.ScrolledWindow
            slot="named"
            name={Page.GRID}
            vexpand
            hscrollbarPolicy={Gtk.PolicyType.NEVER}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
          >
            <IconGrid model={list} onSelected={onSelect} />
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
    </Adw.ToolbarView>
  )
}
