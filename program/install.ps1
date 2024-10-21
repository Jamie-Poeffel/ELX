$frameworks = @("gito", "c#", "python", "java")

cls
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
    } else {
        Write-Host "Invalid selection. Please try again."
        Show-Menu -options $options  # Wiederhole das Menü bei ungültiger Eingabe
    }
}

Show-Menu -options $frameworks
