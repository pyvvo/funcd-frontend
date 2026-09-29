# Format the code with Oxfmt for the UI package
[group('fmt')]
fmt-ui:
    yarn vp fmt ./packages/ui/

# Format all package
[group('fmt')]
fmt-all *target:
    yarn vp fmt {{target}}

# Linter the code with Oxlint for the UI package
[group('lint')]
lint-ui:
    yarn vp lint --fix ./packages/ui/

# Linter the code with Oxlint for all package
[group('lint')]
lint-all *target:
    yarn vp lint --fix {{target}}

# Launch the UI application in dev mode
[group('dev')]
dev-ui:
    yarn ui dev

# Building the UI application for production
[group('build')]
build-ui:
    yarn ui build
