# Check if the script is running as administrator
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator))
{
    # If not admin, restart PowerShell as admin
    $newProcess = New-Object System.Diagnostics.ProcessStartInfo "PowerShell";
    $newProcess.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"";
    $newProcess.Verb = "runas"; # Force PowerShell to run as administrator
    [System.Diagnostics.Process]::Start($newProcess) | Out-Null;
    Exit;
}

$deviceFlowUrl = "https://github.com/login/device/code"

$clientId = "Ov23li47HJN8WlvBW6nk"

$body = @{
    client_id = $clientId
    scope     = "repo,user"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri $deviceFlowUrl -Method Post -Body $body -ContentType "application/json"

$userCode = $response.user_code
$deviceCode = $response.device_code
$verificationUri = $response.$verification_uri

Write-Host "Bitte gehe zu $verificationUri und gebe den Code $userCode ein."

Start-Sleep -Seconds 1

Start-Process "msedge.exe" $verificationUri


$tokenUrl = "https://github.com/login/oauth/access_token"

$pollingInterval = 5

while ($true)
{
    Start-Sleep -Seconds $pollingInterval

    $tokenBody = @{
        client_id       = $clientId
        device_code     = $deviceCode
        grant_type      = "urn:ietf:params:outh:grant-type:device_code"
    } | ConvertTo-Json

    $tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $tokenBody -ContentType "application/json"

    if ($tokenResponse.access_token) {
        Write-Host "Access Token erhalten"
        break
    } elseif ($tokenResponse.error -eq "authorization_pending") {
        Write-Host "Warte auf Benutzergenehmigung..."
    } else {
        Write-Host "Fehler: $($tokenResponse.error)"
        break
    }
}

$baseUrl = "https://api.github.com"

$token = $tokenResponse.access_token

$username = "Lynquity"
$repo = "free-gito"

$apiUrl = "$baseUrl/repos/$username/$repo"

$headers = @{
    "Authorization" = "token $token"
    "User-Agent" = "PowerShell"
}

$response = Invoke-RestMethod -Uri $apiUrl -Method Get -Headers $headers



$password = [guid]::NewGuid().ToString()
$myPath = Join-path $HOME + ".ssh\elxprivkey.pfx"
$GitACCESS = $response.clone_url

[System.Environment]::SetEnvironmentVariable("ELXPASSKEY", $password, [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("ELXPASSPATH", $myPath, [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("GITREPOACCESS", $GitACCESS, [System.EnvironmentVariableTarget]::User)

$cert = New-SelfSignedCertificate -Type Custom -KeyAlgorithm RSA -KeyLength 2048 -HashAlgorithm SHA256 -KeyExportPolicy Exportable -Subject "CN=GenerateedCert" -CertStoreLocation "Cert:\CurrentUser\My"
Export-PfxCertificate -Cert "Cert:\CurrentUser\My\$($cert.Thumbprint)" -FilePath $myPath -Password (ConvertTo-SecureString -String $password -Force -AsPlainText) 

