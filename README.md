# Icon Browser

A simple application that lets you browse the icons of your system-installed icon themes.

![dark](https://github.com/Aylur/icon-browser/blob/main/data/screenshots/dark.png)

## Nix

```sh
nix run github:aylur/icon-browser
```

## Install from source

```sh
git clone https://github.com/Aylur/icon-browser.git
cd icon-browser
pnpm install
meson setup build
meson install -C build
```

## TODO

- [ ] fuzzy query
- [x] preferences page
- [ ] preset categories similar to
      [icon-library](https://gitlab.gnome.org/World/design/icon-library)
- [ ] add desktop icon
