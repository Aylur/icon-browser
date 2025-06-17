{
  description = "Browse icons from themes installed on system";
  inputs.nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};

    inherit (builtins) replaceStrings readFile;
    version = replaceStrings ["\n"] [""] (readFile ./version);

    nativeBuildInputs = with pkgs; [
      wrapGAppsHook4
      gobject-introspection
      meson
      pkg-config
      ninja
      desktop-file-utils
      esbuild
    ];

    buildInputs = with pkgs; [
      gjs
      glib
      gtk4
      libadwaita
    ];
  in {
    packages.${system}.default = pkgs.stdenv.mkDerivation {
      inherit version buildInputs nativeBuildInputs;
      pname = "icon-browser";
      src = pkgs.buildNpmPackage {
        name = "source";
        src = ./.;
        npmDepsHash = "sha256-tzgbe+fSbBfU5rNPB64fvomTtsMKm/skDJfzGTKXAMY=";
        dontBuild = true;
        installPhase = ''
          mkdir -p $out
          cp * -r $out
        '';
      };
    };

    devShells.${system}.default = pkgs.mkShell {
      packages =
        buildInputs
        ++ nativeBuildInputs
        ++ (with pkgs; [
          mesonlsp
          vtsls
          vscode-langservers-extracted
        ]);
    };
  };
}
