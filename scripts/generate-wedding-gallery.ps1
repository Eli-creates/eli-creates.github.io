$ErrorActionPreference = 'Stop'

$rootDir = Resolve-Path (Join-Path $PSScriptRoot '..')
$weddingDir = Join-Path $rootDir 'images\wedding'
$weddingHtmlPath = Join-Path $rootDir 'wedding.html'

$startMarker = '<!-- WEDDING-GALLERY:START -->'
$endMarker = '<!-- WEDDING-GALLERY:END -->'
$allowedExts = @('.jpg', '.jpeg', '.png', '.gif', '.webp')

function Escape-Html {
        param([string]$Value)
        $Value -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;' -replace '"', '&quot;' -replace "'", '&#39;'
}

function Build-Title {
        param([string]$FileName)
        $name = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
        $spaced = ($name -replace '[-_]+', ' ').Trim()
        if ([string]::IsNullOrWhiteSpace($spaced)) {
                return 'Wedding photo'
        }
        ($spaced -split '\s+' | ForEach-Object {
                if ($_.Length -gt 1) {
                        $_.Substring(0,1).ToUpper() + $_.Substring(1)
                } else {
                        $_.ToUpper()
                }
        }) -join ' '
}

function Get-Images {
        if (-not (Test-Path $weddingDir)) {
                return @()
        }
        Get-ChildItem -Path $weddingDir -File |
                Where-Object { $allowedExts -contains $_.Extension.ToLowerInvariant() } |
                Sort-Object Name
}

function Build-Markup {
        param([System.IO.FileInfo[]]$Files)
        $indent = '                                                                '

        if ($Files.Count -eq 0) {
                return "$indent<p>Add images to <strong>images/wedding/</strong> to populate the gallery.</p>"
        }

        $blocks = foreach ($file in $Files) {
                $title = Build-Title $file.Name
                $safeTitle = Escape-Html $title
                $src = "images/wedding/$($file.Name)"
                @(
                        "$indent<figure class=""event-photo-card"" role=""button"" tabindex=""0"" data-lightbox-src=""$src"" data-lightbox-title=""$safeTitle"">"
                        "$indent        <img src=""$src"" alt=""$safeTitle"" />"
                        "$indent        <figcaption><strong>$safeTitle</strong></figcaption>"
                        "$indent</figure>"
                ) -join "`n"
        }

        $blocks -join "`n"
}

function Update-WeddingHtml {
        param([string]$Markup)
        $html = Get-Content -Path $weddingHtmlPath -Raw
        $pattern = [regex]::Escape($startMarker) + '[\s\S]*?' + [regex]::Escape($endMarker)
        if (-not ([regex]::IsMatch($html, $pattern))) {
                throw 'Gallery markers not found in wedding.html.'
        }

        $replacement = "$startMarker`n$Markup`n$endMarker"
        $updated = [regex]::Replace($html, $pattern, $replacement)

        if ($updated -ne $html) {
                Set-Content -Path $weddingHtmlPath -Value $updated -Encoding UTF8
                Write-Host 'Updated wedding.html'
        } else {
                Write-Host 'wedding.html already up to date.'
        }
}

$files = Get-Images
$markup = Build-Markup -Files $files
Update-WeddingHtml -Markup $markup
