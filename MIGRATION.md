# Stylelint Migration Guide

> **PowerShell migration recipe** — run these steps in each package.

---

## 1. Uninstall stylelint ecosystem dependencies now managed by the shared config

```powershell
# Run from a package root (where package.json exists)

$pkg = Get-Content package.json -Raw | ConvertFrom-Json
$depNames = @()
if ($pkg.dependencies)    { $depNames += $pkg.dependencies.PSObject.Properties.Name }
if ($pkg.devDependencies) { $depNames += $pkg.devDependencies.PSObject.Properties.Name }

# Anything this shared config already bundles/manages
$managedRegex = '^(stylelint($|-)|@stylistic/stylelint-plugin$|@stylelint-types/stylelint-(order|stylistic)$|@double-great/stylelint-a11y$|postcss-(html|scss|styled-jsx|styled-syntax)$)'

$toRemove = $depNames |
  Sort-Object -Unique |
  Where-Object {
    $_ -match $managedRegex -and
    $_ -ne 'stylelint-config-nick2bad4u' -and
    $_ -ne 'stylelint'
  }

if ($toRemove.Count -gt 0) {
  npm uninstall $toRemove --force
  Write-Host "Removed:" ($toRemove -join ', ')
} else {
  Write-Host "No managed stylelint deps found to remove."
}
```

---

## 2. Install the shared config package (and peer stylelint)

```powershell
npm install --save-dev stylelint-config-nick2bad4u stylelint --force
```

---

## 3. Replace local stylelint config with shared import

```powershell
@'
import sharedConfig from "stylelint-config-nick2bad4u";

/**
 * @type {import("stylelint").Config}
 */
const stylelintConfig = {
    ...sharedConfig,
    // Your overrides here
};

export default stylelintConfig;

'@ | Set-Content -Path .\stylelint.config.mjs -Encoding utf8
```

**Optional cleanup** (if you previously used rc files):

```powershell
Get-ChildItem -Force -Name .stylelintrc* | ForEach-Object { Remove-Item $_ -Force }
```

---

## 4. Quick verify

```powershell
npx stylelint "**/*.{css,scss,sass}" --allow-empty-input
```

---

If you want, I can also give you a **monorepo loop version** that runs this across every workspace package automatically.

```powershell
# --- Stylelint Migration: One‑Shot Script ---
# Run this from the root of each package you want to migrate.

Write-Host "`n🔧 Starting Stylelint migration..." -ForegroundColor Cyan

# 1) Detect and uninstall stylelint ecosystem deps now managed by the shared config
Write-Host "📦 Scanning package.json for stylelint-related dependencies..."

$pkg = Get-Content package.json -Raw | ConvertFrom-Json
$depNames = @()

if ($pkg.dependencies)    { $depNames += $pkg.dependencies.PSObject.Properties.Name }
if ($pkg.devDependencies) { $depNames += $pkg.devDependencies.PSObject.Properties.Name }

$managedRegex = '^(stylelint($|-)|@stylistic/stylelint-plugin$|@stylelint-types/stylelint-(order|stylistic)$|@double-great/stylelint-a11y$|postcss-(html|scss|styled-jsx|styled-syntax)$)'

$toRemove = $depNames |
  Sort-Object -Unique |
  Where-Object {
    $_ -match $managedRegex -and
    $_ -ne 'stylelint-config-nick2bad4u' -and
    $_ -ne 'stylelint'
  }

if ($toRemove.Count -gt 0) {
  Write-Host "🗑️ Removing managed stylelint deps: $($toRemove -join ', ')"
  npm uninstall $toRemove --force
} else {
  Write-Host "✔️ No managed stylelint deps found to remove."
}

# 2) Install shared config + peer stylelint
Write-Host "📥 Installing stylelint-config-nick2bad4u + stylelint..."
npm install --save-dev stylelint-config-nick2bad4u stylelint --force

# 3) Write new stylelint.config.mjs using shared config import
Write-Host "📝 Writing stylelint.config.mjs..."
@'
import sharedConfig from "stylelint-config-nick2bad4u";

/**
 * @type {import("stylelint").Config}
 */
const stylelintConfig = {
    ...sharedConfig,
    // Your overrides here
};

export default stylelintConfig;

'@ | Set-Content -Path .\stylelint.config.mjs -Encoding utf8

# 4) Remove legacy .stylelintrc* files
Write-Host "🧹 Removing old Stylelint config files..."
Get-ChildItem -Force -Name .stylelintrc* | ForEach-Object {
  Remove-Item $_ -Force -ErrorAction SilentlyContinue
}

# 5) Verify
Write-Host "🔍 Running Stylelint check..."
npx stylelint "**/*.{css,scss,sass}" --allow-empty-input

Write-Host "`n🎉 Stylelint migration complete!" -ForegroundColor Green
```
