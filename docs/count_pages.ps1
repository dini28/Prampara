$word = New-Object -ComObject Word.Application
$word.Visible = $false
$path = "e:\4th year\parampara-path\docs\Parampara_Path_Major_Project_Synopsis.docx"
$doc = $word.Documents.Open($path)
$pages = $doc.ComputeStatistics(2)
$words = $doc.ComputeStatistics(0)
Write-Host "Pages: $pages"
Write-Host "Words: $words"
$doc.Close($false)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
