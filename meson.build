project(
  'icon-browser',
  version: run_command('pnpm', 'pkg', 'get', 'version', '--json=false').stdout().strip(),
)

name = meson.project_name()
root = meson.project_source_root()
prefix = get_option('prefix')
datadir = get_option('datadir')
bindir = get_option('bindir')
libdir = get_option('libdir')

gnim = find_program('gnim', 'node_modules/.bin/gnim')
app_id = 'dev.aylur.icon-browser'

dependency('libadwaita-1')
dependency('gtk4')

# bundle
custom_target(
  command: [
    gnim,
    'bundle',
    root / 'src' / 'main.tsx',
    '--id', app_id,
  ],
  install: true,
  install_dir: prefix / datadir / app_id,
  output: 'gresource',
)

# executable
custom_target(
  command: [
    gnim,
    'exe',
    prefix / datadir / app_id / 'gresource',
    '-o', name,
    '--id', app_id,
    '--prefix', prefix,
    '--datadir', datadir,
    '--libdir', libdir,
  ],
  output: name,
  install: true,
  install_dir: prefix / bindir,
)

# schemas
custom_target(
  command: [gnim, 'schemas', root / 'src', '-o', 'schemas'],
  output: 'schemas',
  install: true,
  install_dir: prefix / datadir / 'glib-2.0',
)

# desktop file
configure_file(
  input: 'data/in.desktop',
  output: app_id + '.desktop',
  configuration: {'EXEC': bindir / meson.project_name()},
  install: true,
  install_dir: datadir / 'applications',
)

# post install
import('gnome').post_install(
  glib_compile_schemas: true,
  update_desktop_database: true,
)
