import { IconList } from "#/lib"
import App from "#/main"
import { createListItemFactory } from "@gnim-js/gtk4/listItemFactory"
import Gtk from "gi://Gtk?version=4.0"
import { Accessor, computed, newObject } from "gnim"

export default function IconGrid(props: {
  model: Accessor<IconList>
  onActivated: (icon: string) => void
  onSelected: (icon: string) => void
}) {
  const model = newObject(Gtk.SingleSelection, {
    model: props.model,
    onSelectionChanged() {
      if (model.selectedItem instanceof Gtk.StringObject) {
        props.onSelected(model.selectedItem.string)
      }
    },
  })

  function onActivate() {
    if (model.selectedItem instanceof Gtk.StringObject) {
      props.onActivated(model.selectedItem.string)
    }
  }

  return (
    <Gtk.GridView
      class="icon-grid"
      model={model}
      maxColumns={12}
      singleClickActivate
      onActivate={onActivate}
      factory={createListItemFactory<Gtk.StringObject>((item) => (
        <Gtk.Image
          widthRequest={50}
          heightRequest={50}
          pixelSize={App.settings.iconSize}
          iconName={computed(() => item()?.get_item()?.get_string() ?? null)}
        />
      ))}
    />
  )
}
