$hookPath = Join-Path $PSScriptRoot 'git-hooks'
if (-not (Test-Path $hookPath)) {
    throw "Expected hooks directory at $hookPath"
}

git config core.hooksPath $hookPath
node "$PSScriptRoot/update-readme-branches.mjs"
