$t = 'C:\Proyectos\webpagepersonal\.migration\tools'
$env:PATH = "$t\hugo;$t\golang\go\bin;$t\node\node-v22.23.5-win-x64;" + $env:PATH
Set-Location 'C:\Proyectos\webpagepersonal'
hugo server --disableFastRender --port 1313
