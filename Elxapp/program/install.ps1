$frameworks = @("gito")
$gitos = @("gito free")

if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator))
{
    # If not admin, restart PowerShell as admin
    $newProcess = New-Object System.Diagnostics.ProcessStartInfo "PowerShell";
    $newProcess.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"";
    $newProcess.Verb = "runas"; # Force PowerShell to run as administrator
    [System.Diagnostics.Process]::Start($newProcess) | Out-Null;
    Exit;
}
function Show-Menu {
    param (
        [string[]]$options
    )
    
    Write-Host "Select a framework:"
    for ($i = 0; $i -lt $options.Length; $i++) {
        Write-Host "$($i + 1). $($options[$i])"
    }
    
    $selection = Read-Host "Enter the number of your choice"
    
    if ($selection -match '^\d+$' -and [int]$selection -le $options.Length -and [int]$selection -ge 1) {
        $chosenFramework = $options[$selection - 1]
        Write-Host "You selected: $chosenFramework"
        return $chosenFramework
    } else {
        Write-Host "Invalid selection. Please try again."
        Show-Menu -options $options  # Wiederhole das Menü bei ungültiger Eingabe
    }
}

$chosen = Show-Menu -options $frameworks

if ($chosen -eq $frameworks[0]){
    Clear-Host
    $gito = Show-Menu -options $gitos

    if ($gito -eq $gitos[0])
    {   
        $repo = [System.Environment]::GetEnvironmentVariable("GITREPOACCESS")

        Set-Location C:/windows/system32/ELW

        git clone $repo

        Set-Location ./free-gito

        & ./install.bat


    }
    elseif ($gito -eq $gitos[1])
    {
        Write-Host "this tool is currently not awaliable"
    }
}
