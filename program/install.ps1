$frameworks = @("gito")
$gitos = @("gito free", "gito premium")

Clear-Host
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
        $encryptedMessage = [System.Environment]::GetEnvironmentVariable("GITREPOACCESS")

        $password = [System.Environment]::GetEnvironmentVariable("ELXPASSKEY")
        $myPath = [System.Environment]::GetEnvironmentVariable("ELXPASSPATH")

        $pfxcert = Import-PfxCertificate -FilePath $myPath -CertStoreLocation Cert:\CurrentUser\My -Password $password

        $rsaPrivate = [System.Security.Cryptography.RSACryptoServiceProvider]::Create()
        $rsaPrivate.ImportParameters($pfxcert.PrivateKey.ExportParameters($true))

        $encryptedBytes = [System.Convert]::FromBase64String($encryptedMessage)
        $decryptedBytes = $rsaPrivate.Decrypt($encryptedBytes, $false)
        $decryptedMessage = [System.Text.Encoding]::UTF8.GetString($decryptedBytes)

        git clone $decryptedMessage
    }
    elseif ($gito -eq $gitos[1])
    {
        Write-Host "this tool is currently not awaliable"
    }
}
