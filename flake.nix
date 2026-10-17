{
  description = "Development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    nix-claude-code.url = "github:ryoppippi/nix-claude-code";
  };

  outputs = { self, nixpkgs, flake-utils, nix-claude-code }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          # Claude Code is unfree; nothing else is allowed in by accident
          config.allowUnfreePredicate = pkg: nixpkgs.lib.getName pkg == "claude-code";
        };

        # The project's tools. Add new ones here, e.g. with pkgs; [ nodejs python3 ]
        tools = with pkgs; [
          jdk21_headless # backend build and Spotless
          maven
          nodejs_22      # frontend build, lint and Prettier
          jq             # used by the Claude Code formatting hook
          gh             # PRs and CI from the terminal; credential helper for git push
        ];

        claude = nix-claude-code.packages.${system}.default;
      in
      {
        # nix develop
        devShells.default = pkgs.mkShell {
          packages = tools ++ [ claude ];

          # Versions come from the Nix packages, so the banner costs no process startups
          # (except Claude Code, whose package does not expose a version attribute reliably).
          shellHook = ''
            echo ""
            echo "🛠️  itacatl dev toolkit"
            echo "   ☕ Java     ${pkgs.jdk21_headless.version}"
            echo "   📦 Maven    ${pkgs.maven.version}"
            echo "   🟢 Node.js  ${pkgs.nodejs_22.version}"
            echo "   🔍 jq       ${pkgs.jq.version}"
            echo "   🐙 gh       ${pkgs.gh.version}"
            echo "   🤖 Claude   $(claude --version | cut -d' ' -f1)"
            echo ""
          '';
        };
      }
    );
}
