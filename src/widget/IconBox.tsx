import Gtk from "gi://Gtk"
import Gdk from "gi://Gdk"
import IconItem from "./IconItem"
import { Accessor, For } from "gnim"

interface IconBoxProps {
  icons: Accessor<Array<string>> | Array<string>
  onSelected: (icon: string) => void
}

function uniq<T>(list: T[]) {
  return [...new Set(list).values()]
}

export default function IconBox({ onSelected, icons }: IconBoxProps) {
  let flowbox: Gtk.FlowBox

  const arr = icons instanceof Accessor ? icons(uniq) : new Accessor(() => uniq(icons))

  function onKeyPressed(_: Gtk.EventControllerKey, keyval: number) {
    if (keyval === Gdk.KEY_Return) {
      for (const child of flowbox.get_selected_children()) {
        onSelected((child as IconItem).iconName)
      }
    }
  }

  function childActivated(_: Gtk.FlowBox, boxchild: Gtk.FlowBoxChild) {
    const { iconName } = boxchild as IconItem
    onSelected(iconName)
  }

  return (
    <Gtk.FlowBox
      $={(self) => (flowbox = self)}
      valign={Gtk.Align.START}
      marginTop={12}
      marginBottom={12}
      marginEnd={32}
      marginStart={32}
      columnSpacing={4}
      rowSpacing={4}
      maxChildrenPerLine={99}
      onChildActivated={childActivated}
    >
      <Gtk.EventControllerKey onKeyPressed={onKeyPressed} />
      <For each={arr}>{(icon) => <IconItem iconName={icon} />}</For>
    </Gtk.FlowBox>
  )
}
