# Repository conversion notes

This repository was converted from an ESLint-config template into a dedicated
shared Stylelint config package.

Key conversion areas:

- Package identity and metadata switched to `stylelint-config-nick2bad4u`
- Runtime dependencies switched to Stylelint configs/plugins/formatters
- Public entrypoint now exports the shared Stylelint config
- Preset tests were rewritten for Stylelint config shape validation
