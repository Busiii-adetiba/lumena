param(
    [int]$StartNum = 217,
    [int]$EndNum = 312,
    [double]$DelaySeconds = 1.5
)

$content = Get-Content -Raw "ISSUES.md"
$pattern = '(?ms)#### #(\d+)\s+([^\r\n]+)\r?\n(.*?)(?=(?:#### #|\r?\n---|\z))'
$matches = [regex]::Matches($content, $pattern)

Write-Host "Total issue specs matched: $($matches.Count)" -ForegroundColor Cyan

$tempBodyPath = Join-Path $env:TEMP "gh_issue_body_tmp.md"

foreach ($match in $matches) {
    $num = [int]$match.Groups[1].Value
    $title = $match.Groups[2].Value.Trim()
    $bodyRaw = $match.Groups[3].Value.Trim()

    if ($num -lt $StartNum -or $num -gt $EndNum) {
        continue
    }

    # Determine labels based on category and title keywords
    $labels = [System.Collections.Generic.List[string]]::new()
    $labels.Add("Stellar Wave")

    if ($title -match '^\[Contract\]') {
        $labels.Add("soroban")
        $labels.Add("enhancement")
    } elseif ($title -match '^\[Backend\]') {
        $labels.Add("server")
        $labels.Add("enhancement")
    } elseif ($title -match '^\[Frontend\]') {
        $labels.Add("react")
        $labels.Add("enhancement")
    } elseif ($title -match '^\[Core\]') {
        $labels.Add("core")
        $labels.Add("enhancement")
    } elseif ($title -match '^\[Tooling\]') {
        $labels.Add("tooling")
        $labels.Add("developer-experience")
    } else {
        $labels.Add("enhancement")
    }

    if ($title -match 'Security|Fraud|Audit|Encrypt|Sanitiz|Key Vault|HSM|Tamper') {
        $labels.Add("security")
    }
    if ($title -match 'Docs|Tutorial|Guide') {
        $labels.Add("documentation")
    }
    if ($title -match 'Benchmark|Performance|Profiling|Load') {
        $labels.Add("performance")
    }
    if ($title -match 'CI|Pipeline|Docker|Compose|Workflow') {
        $labels.Add("ci-cd")
    }
    if ($title -match 'Fuzz|Test|Canary|Probing') {
        $labels.Add("testing")
    }

    $labelArg = ($labels | Select-Object -Unique) -join ","

    $formattedBody = "## Overview`n`nThis issue is part of the **Lumen** roadmap and the **Stellar Wave** contributor program.`n`n" + $bodyRaw + "`n`n---`n`n### How to Contribute`n1. Fork the repo and create your branch: ``git checkout -b feature/issue-$num```n2. Implement the changes with corresponding tests.`n3. Submit a Pull Request referencing this issue: ``Fixes #$num```n"

    $formattedBody | Out-File -FilePath $tempBodyPath -Encoding utf8

    Write-Host "Creating Issue #$($num): $title" -ForegroundColor Yellow
    
    $created = $false
    $retries = 0

    while (-not $created -and $retries -lt 3) {
        $out = gh issue create --title "$title" --body-file "$tempBodyPath" --label "$labelArg"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ #$($num) created: $out" -ForegroundColor Green
            $created = $true
        } else {
            Write-Host "Warning: Failed to create #$($num), retrying..." -ForegroundColor DarkYellow
            Start-Sleep -Seconds 10
            $retries++
        }
    }

    Start-Sleep -Seconds $DelaySeconds
}

if (Test-Path $tempBodyPath) {
    Remove-Item $tempBodyPath -Force
}

Write-Host "Batch finished!" -ForegroundColor Cyan
