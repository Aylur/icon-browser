import App from "#/main"
import Adw from "gi://Adw?version=1"
import Gtk from "gi://Gtk?version=4.0"
import { Accessor, Portal } from "gnim"

function Icon(props: { icon: Accessor<string>; size: number }) {
  return (
    <Gtk.Box spacing={8} valign={Gtk.Align.END} orientation={Gtk.Orientation.VERTICAL}>
      <Gtk.Image valign={Gtk.Align.END} iconName={props.icon} pixelSize={props.size} />
      <Gtk.Label label={String(props.size)} />
    </Gtk.Box>
  )
}

export default function IconDetailsDialog(props: {
  iconName: Accessor<string>
  ref(dialog: Adw.Dialog): void
  onCopyName(icon: string): void
  onCopyFile(icon: string): void
}) {
  const t = App.gettext
  const { iconName, ref, onCopyName, onCopyFile } = props

  return (
    <Portal>
      <Adw.Dialog ref={ref} contentWidth={300} contentHeight={320}>
        <Adw.ToolbarView topBarStyle={Adw.ToolbarStyle.FLAT}>
          <Adw.HeaderBar slot="top">
            <Adw.WindowTitle slot="title" title={iconName} />
          </Adw.HeaderBar>
          <Gtk.Box
            marginBottom={12}
            marginTop={12}
            marginEnd={12}
            marginStart={12}
            spacing={12}
            orientation={Gtk.Orientation.VERTICAL}
          >
            <Gtk.Box marginBottom={24} hexpand halign={Gtk.Align.CENTER} spacing={12}>
              <Icon size={16} icon={iconName} />
              <Icon size={32} icon={iconName} />
              <Icon size={64} icon={iconName} />
            </Gtk.Box>
            <Gtk.Button
              class="pill"
              halign={Gtk.Align.CENTER}
              widthRequest={200}
              onClicked={() => onCopyName(iconName())}
            >
              {t("Copy Icon Name")}
            </Gtk.Button>
            <Gtk.Button
              class="pill"
              halign={Gtk.Align.CENTER}
              widthRequest={200}
              onClicked={() => onCopyFile(iconName())}
            >
              {t("Save As...")}
            </Gtk.Button>
          </Gtk.Box>
        </Adw.ToolbarView>
      </Adw.Dialog>
    </Portal>
  )
}
