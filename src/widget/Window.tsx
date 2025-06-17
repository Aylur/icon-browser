import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import IconBox from "./IconBox"
import { copyToClipboard, getSettings, searchIcons } from "#/lib"
import { gettext as _ } from "gettext"
import { With, createState } from "gnim"

const Page = {
  SEARCH: "search",
  GRID: "grid",
  NOT_FOUND: "not-found",
}

const menu = [
  [_("Settings"), "app.preferences", "copy-symbolic"],
  [_("About"), "app.about", "copy-symbolic"],
] as const

export default function Window(props: {
  app: Adw.Application
  ref: (win: Adw.ApplicationWindow) => void
}) {
  let toasts: Adw.ToastOverlay
  let entry: Gtk.SearchEntry
  let stack: Gtk.Stack

  const { colored, showAll } = getSettings()

  const [selectedIcon, setSelectedIcon] = createState("")
  const [icons, setIcons] = createState(new Array<string>())

  function search({ text }: Gtk.SearchEntry) {
    entry.grab_focus()
    setSelectedIcon("")

    if (text === "") {
      stack.visibleChildName = Page.SEARCH
    } else {
      setIcons(searchIcons(text))
      stack.visibleChildName = icons.get().length > 0 ? Page.GRID : Page.NOT_FOUND
    }
  }

  function select(icon?: string) {
    if (icon) setSelectedIcon(icon)
    copyToClipboard(selectedIcon.get())

    toasts.add_toast(
      new Adw.Toast({
        title: _("Copied to clipboard"),
        timeout: 1,
      }),
    )
  }

  function init(win: Adw.ApplicationWindow) {
    entry.set_key_capture_widget(win)
    colored.subscribe(() => entry.emit("search-changed"))
    win.present()
    props.ref(win)
  }

  return (
    <Adw.ApplicationWindow
      $={init}
      application={props.app}
      defaultWidth={600}
      defaultHeight={500}
      widthRequest={360}
      heightRequest={300}
      title={_("Icon Browser")}
    >
      <Adw.ToolbarView
        topBarStyle={Adw.ToolbarStyle.RAISED}
        bottomBarStyle={Adw.ToolbarStyle.RAISED}
      >
        <Adw.HeaderBar $type="top" centeringPolicy={Adw.CenteringPolicy.STRICT}>
          <Gtk.Button
            $type="start"
            $={(self) => self.add_css_class("suggested-action")}
            visible={selectedIcon(Boolean)}
            onClicked={() => select()}
          >
            <Gtk.Box spacing={4}>
              <Gtk.Image iconName="edit-copy-symbolic" />
              <Gtk.Label label={_("Copy")} />
            </Gtk.Box>
          </Gtk.Button>
          <Adw.Clamp $type="title" tighteningThreshold={400} hexpand>
            <Gtk.SearchEntry
              $={(self) => (entry = self)}
              searchDelay={200}
              placeholderText={_("Search for icons by name")}
              onSearchChanged={search}
              onSearchStarted={(self) => self.grab_focus()}
            />
          </Adw.Clamp>
          <Gtk.MenuButton $type="end" iconName="open-menu-symbolic">
            <Gio.Menu
              $={(self) =>
                menu.map(([label, action, icon]) => {
                  const item = Gio.MenuItem.new(label, action)
                  item.set_icon(Gio.Icon.new_for_string(icon))
                  self.append_item(item)
                })
              }
            />
          </Gtk.MenuButton>
        </Adw.HeaderBar>
        <Adw.ToastOverlay $={(self) => (toasts = self)}>
          <Gtk.Stack $={(self) => (stack = self)}>
            <Adw.Bin $type="named" name={Page.SEARCH}>
              <With value={showAll}>
                {(all) =>
                  all ? (
                    <Gtk.ScrolledWindow
                      vexpand
                      hscrollbarPolicy={Gtk.PolicyType.NEVER}
                      vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                    >
                      <IconBox icons={searchIcons("")} onSelected={select} />
                    </Gtk.ScrolledWindow>
                  ) : (
                    <Adw.StatusPage
                      iconName="system-search-symbolic"
                      title={_("Start typing to search")}
                      description={_("Search for icons by their name")}
                    />
                  )
                }
              </With>
            </Adw.Bin>
            <Gtk.ScrolledWindow
              $type="named"
              name={Page.GRID}
              vexpand
              hscrollbarPolicy={Gtk.PolicyType.NEVER}
              vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            >
              <IconBox icons={icons} onSelected={select} />
            </Gtk.ScrolledWindow>
            <Adw.StatusPage
              $type="named"
              name={Page.NOT_FOUND}
              iconName="system-search-symbolic"
              title={_("No Results found")}
              description={_("Try a different search")}
            />
          </Gtk.Stack>
        </Adw.ToastOverlay>
        <Gtk.Box
          $type="bottom"
          halign={Gtk.Align.CENTER}
          hexpand
          marginTop={8}
          marginBottom={8}
          spacing={12}
          visible={selectedIcon(Boolean)}
        >
          <Gtk.Image iconName={selectedIcon} pixelSize={24} />
          <Gtk.Label label={selectedIcon} selectable />
        </Gtk.Box>
      </Adw.ToolbarView>
    </Adw.ApplicationWindow>
  )
}
