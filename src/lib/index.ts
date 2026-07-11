import Gdk from "gi://Gdk?version=4.0"

export * from "./icon"

export function copyToClipboard(text: string) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cb = Gdk.Display.get_default()!.get_clipboard()!
  cb.set_content(
    Gdk.ContentProvider.new_for_bytes("text/plain", new TextEncoder().encode(text)),
  )
}
