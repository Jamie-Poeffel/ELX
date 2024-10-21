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

$password = [guid]::NewGuid().ToString()
$myPath = Join-path $HOME + ".ssh\elxprivkey.pfx"

[System.Environment]::SetEnvironmentVariable("ELXPASSKEY", $password, [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("ELXPASSPATH", $myPath, [System.EnvironmentVariableTarget]::User)

$cert = New-SelfSignedCertificate -Type Custom -KeyAlgorithm RSA -KeyLength 2048 -HashAlgorithm SHA256 -KeyExportPolicy Exportable -Subject "CN=GenerateedCert" -CertStoreLocation "Cert:\CurrentUser\My"
Export-PfxCertificate -Cert "Cert:\CurrentUser\My\$($cert.Thumbprint)" -FilePath $myPath -Password (ConvertTo-SecureString -String $password -Force -AsPlainText) 

