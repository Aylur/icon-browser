{
  description = "Browse icons from themes installed on system";
  inputs.nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

  outputs = inputs: let
    systems = ["x86_64-linux"];
    forAllSystems = inputs.nixpkgs.lib.genAttrs systems;

    dependencies = forAllSystems (system: let
      pkgs = inputs.nixpkgs.legacyPackages.${system};
    in {
      nativeBuildInputs = with pkgs; [
        nodejs
        pnpm
        pkg-config
        meson
        ninja
        wrapGAppsHook4
        gobject-introspection
        desktop-file-utils
      ];
      buildInputs = with pkgs; [
        glib
        gjs
        libadwaita
        gtk4
      ];
    });
  in {
    devShells = forAllSystems (system: let
      pkgs = inputs.nixpkgs.legacyPackages.${system};
      deps = dependencies.${system};
    in {
      default = pkgs.mkShell {
        packages = deps.nativeBuildInputs ++ deps.buildInputs;
      };
    });

    packages = forAllSystems (system: let
      package = builtins.fromJSON (builtins.readFile ./package.json);
      pkgs = inputs.nixpkgs.legacyPackages.${system};
      deps = dependencies.${system};
    in {
      default = pkgs.stdenv.mkDerivation {
        name = package.name;
        version = package.version;
        buildInputs = deps.buildInputs;
        nativeBuildInputs = deps.nativeBuildInputs;
        src = pkgs.stdenv.mkDerivation {
          name = "src-with-deps";
          src = ./.;

          pnpmDeps = pkgs.fetchPnpmDeps {
            pname = "pnpm-deps";
            src = ./.;
            fetcherVersion = 4;
            hash = "sha256-hbUvoberd95MjBmHqehWp2oIXrMHjHR6+akbBE6n2cw=";
          };

          nativeBuildInputs = [
            pkgs.pnpm
            pkgs.pnpmConfigHook
          ];

          installPhase = ''
            mkdir $out
            cp -r * $out
          '';
        };
      };
    });
  };
}
