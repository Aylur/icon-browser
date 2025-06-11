project(
  'icon-browser',
  version: run_command('cat', meson.project_source_root() / 'version').stdout().strip(),
)

app_id = 'dev.aylur.icon-browser'
resource = '/dev/aylur/icon-browser'

prefix = get_option('prefix')
datadir = prefix / get_option('datadir')
bindir = prefix / get_option('bindir')
libdir = prefix / get_option('libdir')
pkgdatadir = datadir / app_id

dependency('gtk4')
dependency('libadwaita-1')

subdir('data')

custom_target(
  input: configure_file(
    input: 'src/main.ts',
    output: app_id + '.js',
    configuration: {
      'gjs': find_program('gjs').full_path(),
      'version': meson.project_version(),
      'prefix': prefix,
      'libdir': libdir,
      'resource': resource,
    },
  ),
  command: [
    find_program('esbuild', required: true),
    '--bundle', '@INPUT@',
    '--format=esm',
    '--outfile=@OUTPUT@',
    '--sourcemap=inline',
    '--external:gi://*',
    '--external:resource://*',
    '--external:gettext',
    '--external:system',
    '--define:import.meta.appId="' + app_id + '"',
  ],
  output: meson.project_name(),
  install: true,
  install_dir: bindir,
)

import('gnome').post_install(
  # gtk_update_icon_cache: true,
  glib_compile_schemas: true,
  update_desktop_database: true,
)
