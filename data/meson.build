configure_file(
  input: 'in.desktop',
  output: app_id + '.desktop',
  configuration: {'EXEC': bindir / meson.project_name()},
  install: true,
  install_dir: datadir / 'applications',
)

configure_file(
  input: 'in.gschema.xml',
  output: app_id + '.gschema.xml',
  configuration: {
    'RESOURCE': resource,
    'APP_ID': app_id,
  },
  install: true,
  install_dir: datadir / 'glib-2.0' / 'schemas',
)
