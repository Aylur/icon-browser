#!@gjs@ -m

import { exit, programArgs, programInvocationName } from "system"

imports.package.init({
  name: import.meta.appId,
  version: "@version@",
  prefix: "@prefix@",
  libdir: "@libdir@",
})

pkg.initGettext()

const module = await import("../src/App")
const exitCode = await module.default.main([programInvocationName, ...programArgs])
exit(exitCode)
