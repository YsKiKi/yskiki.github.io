[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

Add-Type -AssemblyName System.Web

$ProgressPreference = 'SilentlyContinue'

$game_path = ""

Write-host "$([char]0x6b63)$([char]0x5728)$([char]0x83b7)$([char]0x53d6)$([char]0x62bd)$([char]0x5361)$([char]0x94fe)$([char]0x63a5)$([char]0x2026)$([char]0x2026)" -ForegroundColor Green

if ($args.Length -eq 0) {
    $app_data = [Environment]::GetFolderPath('ApplicationData')
    $locallow_path = "$app_data\..\LocalLow\miHoYo\$([char]0x7edd)$([char]0x533a)$([char]0x96f6)"

    $log_path = "$locallow_path\Player.log"

    if (-Not [IO.File]::Exists($log_path)) {
        Write-Output "Failed to locate log file!"
        Write-Output "Try using the Global client script?"
        return
    }

    $log_lines = Get-Content $log_path -First 10

    if ([string]::IsNullOrEmpty($log_lines)) {
        $log_path = "$locallow_path\Player-prev.log"

        if (-Not [IO.File]::Exists($log_path)) {
            Write-Output "Failed to locate log file!"
            Write-Output "Try using the Global client script?"
            return
        }

        $log_lines = Get-Content $log_path -First 10
    }

    if ([string]::IsNullOrEmpty($log_lines)) {
        Write-Output "Failed to locate game path! (1)"
        Write-Output "Please contact support at discord.gg/srs"
        return
    }

    $log_lines = $log_lines.split([Environment]::NewLine)

    for ($i = 0; $i -lt 10; $i++) {
        $log_line = $log_lines[$i]

        if ($log_line.startsWith("[Subsystems] Discovering subsystems at path ")) {
            $game_path = $log_line.replace("[Subsystems] Discovering subsystems at path ", "").replace("/UnitySubsystems", "")
            break
        }
    }
} else {
    $game_path = $args[0]
}

if ([string]::IsNullOrEmpty($game_path)) {
    Write-Output "Failed to locate game path! (2)"
    Write-Output "Please contact support at discord.gg/srs"
}

$copy_path = [IO.Path]::GetTempPath() + [Guid]::NewGuid().ToString()

$cache_path = "$game_path/webCaches/Cache/Cache_Data/data_2"
$cache_folders = Get-ChildItem "$game_path/webCaches/" -Directory
$max_version = 0

for ($i = 0; $i -le $cache_folders.Length; $i++) {
    $cache_folder = $cache_folders[$i].Name
    if ($cache_folder -match '^\d+\.\d+\.\d?\.\d+$') {
    # if ($cache_folder -match '^\d+\.\d+\.\d+\.\d+$') {
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

            Write-Output $latest_url
            Set-Clipboard -Value $latest_url
            Write-host "$([char]0x5df2)$([char]0x81ea)$([char]0x52a8)$([char]0x590d)$([char]0x5236)$([char]0x002c)$([char]0x8bf7)$([char]0x62d6)$([char]0x6258)$([char]0x5230)$([char]0x673a)$([char]0x5668)$([char]0x4eba)$([char]0x002f)$([char]0x5206)$([char]0x6790)$([char]0x5de5)$([char]0x5177)$([char]0x4f7f)$([char]0x7528)" -ForegroundColor Green
            return;
    }
}

Write-Output "Could not locate Warp History Url."
Write-Output "Please make sure to open the Warp history before running the script."