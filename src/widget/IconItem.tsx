import Gtk from "gi://Gtk"
import { css } from "gjsx/gtk4/style"
import { register, property } from "gjsx/gobject"
import { getSettings } from "#/lib"
import { This, createBinding } from "gjsx"

void css`
  flowboxchild.icon-item {
    margin: 0;
    padding: 0;
    transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  flowboxchild.icon-item image {
    margin: 8px;
  }

  flowboxchild.icon-item:hover {
    background: alpha(currentColor, 0.07);
  }

  flowboxchild.icon-item:active {
    background: alpha(currentColor, 0.16);
  }

  flowboxchild.icon-item:selected {
    background: alpha(currentColor, 0.1);
  }
`

@register({ GTypeName: "IconItem" })
export default class IconItem extends Gtk.FlowBoxChild {
  @property(String) iconName: string

  constructor({ iconName = "" }: { iconName?: string }) {
    super()
    this.add_css_class("icon-item")
    this.iconName = iconName

    const { iconSize } = getSettings()

    void (
      <This this={this as IconItem}>
        <Gtk.Image iconName={createBinding(this, "iconName")} pixelSize={iconSize} />
      </This>
    )
  }
}
