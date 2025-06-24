# Copyright 2023 Star Rail Station
# Edit By WAYI @ Heybox App
# Update At 2024-06-20

[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

Add-Type -AssemblyName System.Web

$ProgressPreference = 'SilentlyContinue'

$game_path = ""

Write-Output "$([char]0x6b63)$([char]0x5728)$([char]0x83b7)$([char]0x53d6)$([char]0x62bd)$([char]0x5361)$([char]0x8bb0)$([char]0x5f55)$([char]0x94fe)$([char]0x63a5)"

if ($args.Length -eq 0) {
    $app_data = [Environment]::GetFolderPath('ApplicationData')
    $locallow_path = "$app_data\..\LocalLow\miHoYo\$([char]0x5d29)$([char]0x574f)$([char]0xff1a)$([char]0x661f)$([char]0x7a79)$([char]0x94c1)$([char]0x9053)\"

    $log_path = "$locallow_path\Player.log"

    if (-Not [IO.File]::Exists($log_path)) {
        Write-Output "$([char]0x627e)$([char]0x4e0d)$([char]0x5230)$([char]0x65e5)$([char]0x5fd7)$([char]0x6587)$([char]0x4ef6)"
        Write-Output "$([char]0x8bf7)$([char]0x786e)$([char]0x8ba4)$([char]0x60a8)$([char]0x542f)$([char]0x52a8)$([char]0x8fc7)$([char]0x56fd)$([char]0x670d)$([char]0x6e38)$([char]0x620f)"
        return
    }

    $log_lines = Get-Content $log_path -First 11

    if ([string]::IsNullOrEmpty($log_lines)) {
        $log_path = "$locallow_path\Player-prev.log"

        if (-Not [IO.File]::Exists($log_path)) {
            Write-Output "$([char]0x627e)$([char]0x4e0d)$([char]0x5230)$([char]0x65e5)$([char]0x5fd7)$([char]0x6587)$([char]0x4ef6)"
            Write-Output "$([char]0x8bf7)$([char]0x786e)$([char]0x8ba4)$([char]0x60a8)$([char]0x542f)$([char]0x52a8)$([char]0x8fc7)$([char]0x56fd)$([char]0x670d)$([char]0x6e38)$([char]0x620f)"
            return
        }

        $log_lines = Get-Content $log_path -First 11
    }

    if ([string]::IsNullOrEmpty($log_lines)) {
        Write-Output "$([char]0x627e)$([char]0x4e0d)$([char]0x5230)$([char]0x6e38)$([char]0x620f)$([char]0x8def)$([char]0x5f84)(1)"
        Write-Output "$([char]0x8bf7)$([char]0x8054)$([char]0x7cfb)$([char]0x5ba2)$([char]0x670d)$([char]0x8fdb)$([char]0x884c)$([char]0x53cd)$([char]0x9988)"
        return
    }

    $log_lines = $log_lines.split([Environment]::NewLine)

    for ($i = 0; $i -lt 10; $i++) {
        $log_line = $log_lines[$i]

        if ($log_line.startsWith("Loading player data from ")) {
            $game_path = $log_line.replace("Loading player data from ", "").replace("data.unity3d", "")
            break
        }
    }
} else {
    $game_path = $args[0]
}

if ([string]::IsNullOrEmpty($game_path)) {
    Write-Output "$([char]0x627e)$([char]0x4e0d)$([char]0x5230)$([char]0x6e38)$([char]0x620f)$([char]0x8def)$([char]0x5f84)(2)"
    Write-Output "$([char]0x8bf7)$([char]0x8054)$([char]0x7cfb)$([char]0x5ba2)$([char]0x670d)$([char]0x8fdb)$([char]0x884c)$([char]0x53cd)$([char]0x9988)"
}

$copy_path = [IO.Path]::GetTempPath() + [Guid]::NewGuid().ToString()

$cache_path = "$game_path/webCaches/Cache/Cache_Data/data_2"
$cache_folders = Get-ChildItem "$game_path/webCaches/" -Directory
$max_version = 0

for ($i = 0; $i -le $cache_folders.Length; $i++) {
    $cache_folder = $cache_folders[$i].Name
    if ($cache_folder -match '^\d+\.\d+\.\d+\.\d+$') {
        $version = [int]-join($cache_folder.Split("."))
        if ($version -ge $max_version) {
            $max_version = $version
            $cache_path = "$game_path/webCaches/$cache_folder/Cache/Cache_Data/data_2"
        }
    }
}

Copy-Item -Path $cache_path -Destination $copy_path
$cache_data = Get-Content -Encoding UTF8 -Raw $copy_path
Remove-Item -Path $copy_path

$cache_data_split = $cache_data -split '1/0/'

for ($i = $cache_data_split.Length - 1; $i -ge 0; $i--) {
    $line = $cache_data_split[$i]

    if ($line.StartsWith('http') -and $line.Contains("getGachaLog")) {
        $url = ($line -split "\0")[0]

        $res = Invoke-WebRequest -Uri $url -ContentType "application/json" -UseBasicParsing | ConvertFrom-Json

        if ($res.retcode -eq 0) {
            $uri = [Uri]$url
            $query = [Web.HttpUtility]::ParseQueryString($uri.Query)

            $keys = $query.AllKeys
            foreach ($key in $keys) {
                # Retain required params
                if ($key -eq "authkey") { continue }
                if ($key -eq "authkey_ver") { continue }
                if ($key -eq "sign_type") { continue }
                if ($key -eq "game_biz") { continue }
                if ($key -eq "lang") { continue }

                $query.Remove($key)
            }

            $latest_url = $uri.Scheme + "://" + $uri.Host + $uri.AbsolutePath + "?" + $query.ToString()

            Write-Output "$([char]0x5df2)$([char]0x83b7)$([char]0x5f97)$([char]0x62bd)$([char]0x5361)$([char]0x8bb0)$([char]0x5f55)$([char]0x94fe)$([char]0x63a5)"
            Write-Output $latest_url
            Set-Clipboard -Value $latest_url
            Write-Output "$([char]0x5df2)$([char]0x7c98)$([char]0x8d34)$([char]0x94fe)$([char]0x63a5)$([char]0x81f3)$([char]0x526a)$([char]0x5207)$([char]0x677f)"
            return;
        }
    }
}

Write-Output "$([char]0x65e0)$([char]0x6cd5)$([char]0x627e)$([char]0x5230)$([char]0x62bd)$([char]0x5361)$([char]0x8bb0)$([char]0x5f55)$([char]0x94fe)$([char]0x63a5)"
Write-Output "$([char]0x8bf7)$([char]0x786e)$([char]0x8ba4)$([char]0x60a8)$([char]0x0032)$([char]0x0034)$([char]0x5c0f)$([char]0x65f6)$([char]0x5185)$([char]0x6253)$([char]0x5f00)$([char]0x8fc7)$([char]0x6e38)$([char]0x620f)$([char]0x62bd)$([char]0x5361)$([char]0x5386)$([char]0x53f2)$([char]0x9875)$([char]0x9762)"