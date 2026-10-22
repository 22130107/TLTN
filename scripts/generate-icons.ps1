Add-Type -AssemblyName System.Drawing

$iconsDir = Join-Path $PSScriptRoot "..\public\icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
}

function Generate-HyunIcon {
    param (
        [int]$Size,
        [string]$FileName,
        [bool]$IsMaskable = $false
    )

    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 18, 18, 18))
    $g.FillRectangle($bgBrush, 0, 0, $Size, $Size)

    # Inner border / badge
    $margin = if ($IsMaskable) { [int]($Size * 0.15) } else { [int]($Size * 0.06) }
    $rectSize = $Size - ($margin * 2)

    # Accent Red Dot
    $dotSize = [int]($Size * 0.08)
    $dotX = $Size - $margin - $dotSize - [int]($Size * 0.04)
    $dotY = $margin + [int]($Size * 0.04)
    $redBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 239, 68, 68))
    $g.FillEllipse($redBrush, $dotX, $dotY, $dotSize, $dotSize)

    # White typography "HYUN"
    $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
    $fontSize = if ($IsMaskable) { $Size * 0.22 } else { $Size * 0.26 }
    $font = New-Object System.Drawing.Font ($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)

    $stringFormat = New-Object System.Drawing.StringFormat
    $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center

    $textRect = New-Object System.Drawing.RectangleF (0, ($Size * 0.04), $Size, $Size)
    $g.DrawString("HYUN", $font, $textBrush, $textRect, $stringFormat)

    # Subtitle "FOOD"
    $subFontSize = $fontSize * 0.32
    $subFont = New-Object System.Drawing.Font ($fontFamily, $subFontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $subBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(200, 160, 160, 160))
    $subRect = New-Object System.Drawing.RectangleF (0, ($Size * 0.32), $Size, $Size)
    $g.DrawString("VIETNAM", $subFont, $subBrush, $subRect, $stringFormat)

    $outPath = Join-Path $iconsDir $FileName
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $outPath ($Size x $Size)"
}

Generate-HyunIcon -Size 192 -FileName "icon-192.png"
Generate-HyunIcon -Size 512 -FileName "icon-512.png"
Generate-HyunIcon -Size 512 -FileName "icon-maskable.png" -IsMaskable $true
Generate-HyunIcon -Size 180 -FileName "apple-touch-icon.png"
