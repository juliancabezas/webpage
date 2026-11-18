---
type: blog
authors: [me]
title: "Working with CSV or TXT datasets larger than RAM in R using SQLite"
author: Julián Cabezas
date: '2019-04-01'
slug: large-datasets-r-sqlite
categories:
  - R
  - Tutorials
tags:
  - R
  - Tutorials
  - SQL
  - SQLite
  - bigdata
  - RAM
  - memory
  - csv
  - txt
  - microdata
  - census
  - 2017
  - Chile
image:
  caption: ''
  focal_point: ''
summary: "Use SQLite to work with datasets that exceed available RAM, illustrated with Chile’s 2017 census microdata."
header:
  image: ""
  caption: "The goal is to reach this level of inner peace"
output:
  blogdown::html_page:
    toc: true
    number_sections: false
    toc_depth: 4
---


<div id="TOC">
<ul>
<li><a href="#el-problema-del-maldito-ram-y-las-bases-de-datos-enormes">The RAM problem and enormous datasets</a></li>
<li><a href="#primero-lo-primero-cuanta-memoria-tengo-disponible">First things first: how much memory is available?</a></li>
<li><a href="#csv-o-txt-a-sqllite">CSV or TXT to SQLite</a><ul>
<li><a href="#los-benditos-paquetes">The packages you need</a></li>
<li><a href="#que-tan-grande-es-mi-base-de-datos-cuales-son-sus-caracteristicas">How large is the dataset, and what does it look like?</a></li>
<li><a href="#crear-la-ruta-a-la-base-de-datos">Create the database path</a></li>
<li><a href="#la-prometida-funcion">The promised function</a></li>
<li><a href="#mover-la-csv-o-txt-a-la-base-de-datos-sqllite">Move the CSV or TXT file into SQLite</a></li>
</ul></li>
<li><a href="#analizar-y-recoger-datos-con-dplyr">Analyse and retrieve data with dplyr</a></li>
</ul>
</div>

<div id="el-problema-del-maldito-ram-y-las-bases-de-datos-enormes" class="section level3">
<h3>The RAM problem and enormous datasets</h3>
<p>I do not know whether this happens to everyone, but whenever I start a new job, I seem to get <strong>the worst computer in the office</strong>: usually no more than 4 GB of RAM, and even 32-bit Windows if I am unlucky, as happened once. Since I use R for everything, large datasets can be difficult to handle, especially when they exceed the memory available to R. This tutorial also helps with <strong>enormous</strong> datasets.</p>
<p>We will check how much RAM is available to R and create a SQLite database. We can then retrieve manageable subsets and analyse them in memory, using a function I adapted from <a href="https://gist.github.com/vnijs/e53a68c957747e82c2e3">this gist by vnijs</a>.</p>
<p>We will use <a href="https://www.sqlite.org/index.html">SQLite</a> because it is easy to configure and run locally. PostgreSQL and MySQL are alternatives, but setting them up would be a little more involved.</p>
<p>This tutorial assumes intermediate-to-advanced R skills and some familiarity with SQL.</p>
</div>
<div id="primero-lo-primero-cuanta-memoria-tengo-disponible" class="section level3">
<h3>First things first: how much memory is available?</h3>
<p>To check the memory available to R, we will use the memory limit command shown below.</p>
<pre class="r"><code>memory.limit()</code></pre>
<pre><code>## [1] 16269</code></pre>
<p>I have approximately 16 GB of memory available, or about 16,000 MB—the RAM installed in this computer.</p>
<p><strong>Note:</strong> On a 32-bit operating system, the memory limit cannot exceed roughly 2–3 GB, regardless of how much RAM is installed.</p>
</div>
<div id="csv-o-txt-a-sqllite" class="section level3">
<h3>CSV or TXT to SQLite</h3>
<p>Suppose we have a <strong>HUGE</strong> CSV or TXT dataset. I will use Chile’s 2017 Population and Housing Census. It is not exceptionally large, but works well for this example. You can download it from <a href="http://www.ine.cl/docs/default-source/censos/censo-2017/base-de-datos/csv/microdatos-persona/microdato_censo2017-personas.rar?sfvrsn=3">Chile’s National Statistics Institute</a>.</p>
<p>Extract the RAR archive to obtain the CSV file. It is approximately 2.5 GB—not enormous, but potentially too large for R on a low-spec computer. Opening it in Excel can also be difficult.</p>
<p>I will extract the dataset into a folder called “Censo” on the C:/ drive.</p>
<div class="figure">
<img src="/img/archivo_censo.JPG" />

</div>
<div id="los-benditos-paquetes" class="section level4">
<h4>The packages you need</h4>
<p>Make sure these five packages are installed:</p>
<ul>
<li><strong>readr</strong>: to read comma-, tab- or otherwise-delimited files.</li>
<li><strong>DBI and RSQLite</strong>: to communicate with databases and use SQLite.</li>
<li><strong>dplyr and dbplyr</strong>: to retrieve information from the database.</li>
</ul>
<pre class="r"><code>library(readr)
library(DBI)
library(RSQLite)
library(dplyr)
library(dbplyr)</code></pre>
</div>
<div id="que-tan-grande-es-mi-base-de-datos-cuales-son-sus-caracteristicas" class="section level4">
<h4>How large is the dataset, and what does it look like?</h4>
<p>First, define the dataset path and assign it to delim_file:</p>
<pre class="r"><code>delim_file &lt;- &quot;C:/Censo/Microdato_Censo2017-Personas.csv&quot;</code></pre>
<p>To inspect the file, read its first two lines using <strong>readLines</strong>.</p>
<pre class="r"><code>readLines(delim_file, n=2)</code></pre>
<pre><code>## [1] &quot;REGION;PROVINCIA;COMUNA;DC;AREA;ZC_LOC;ID_ZONA_LOC;NVIV;NHOGAR;PERSONAN;P07;P08;P09;P10;P10COMUNA;P10PAIS;P11;P11COMUNA;P11PAIS;P12;P12COMUNA;P12PAIS;P12A_LLEGADA;P12A_TRAMO;P13;P14;P15;P15A;P16;P16A;P16A_OTRO;P17;P18;P19;P20;P21M;P21A;P10PAIS_GRUPO;P11PAIS_GRUPO;P12PAIS_GRUPO;ESCOLARIDAD;P16A_GRUPO;REGION_15R;PROVINCIA_15R;COMUNA_15R;P10COMUNA_15R;P11COMUNA_15R;P12COMUNA_15R&quot;
## [2] &quot;15;152;15202;1;2;6;13225;1;1;1;1;1;73;1;98;998;3;15101;998;1;98;998;9998;98;2;4;6;2;1;2;98;7;98;98;98;98;9998;998;998;998;4;2;15;152;15202;98;15101;98&quot;</code></pre>
<p>We can now see the column names and identify the delimiter: a semicolon (;).</p>
<p>R cannot count rows by loading a file that does not fit in memory. Instead, we will use a PowerShell command (Get-Content) on Windows, or a system command (wc) on Linux.</p>
<p>To count the rows in the file—this takes a little while:</p>
<p>On Windows:</p>
<pre class="r"><code>total_records &lt;- system2(&quot;powershell&quot;, args = c(&quot;Get-content&quot;, delim_file, &quot;|&quot;, &quot;Measure-Object&quot;, &quot;–Line&quot;),
                         stdout = TRUE)
total_records &lt;- as.numeric(gsub(&quot;[^0-9]&quot;, &quot;&quot;, paste(total_records, collapse = &quot;&quot;))) - 1
total_records</code></pre>
<pre><code>## [1] 17574003</code></pre>
<p>There are 17,574,003 records, excluding the header. That matches the number of people recorded by the 2017 census.</p>
<p>Note: Windows 10 should work without problems. On Windows 7 or 8, check your PowerShell version using <a href="https://docs.microsoft.com/en-us/skypeforbusiness/set-up-your-computer-for-windows-powershell/download-and-install-windows-powershell-5-1">these Microsoft instructions</a>, and install PowerShell 5.1 by following <a href="https://docs.microsoft.com/en-us/powershell/scripting/install/installing-windows-powershell?view=powershell-6">this Microsoft guide</a>.</p>
<p>On Linux, it would look like this:</p>
<pre class="r"><code> total_records &lt;- system2(&quot;wc&quot;, args = c(&quot;-l&quot;, delim_file), stdout = TRUE) %&gt;%
 sub(normalizePath(delim_file), &quot;&quot;, .) %&gt;%
 as.integer() %&gt;%
       {
         . - 1
       }</code></pre>
</div>
<div id="crear-la-ruta-a-la-base-de-datos" class="section level4">
<h4>Create the database path</h4>
<p>Choose a path for the future database file, with the extension .sqlite3.</p>
<p>Define the database path and the table name. We will need the table name to retrieve data later. Another advantage of SQLite databases is that they can contain several tables.</p>
<pre class="r"><code>table_name_censo &lt;- &quot;censo2017&quot;
sqlite_file_censo &lt;- &quot;C:/Censo/censo2017.sqlite3&quot;</code></pre>
</div>
<div id="la-prometida-funcion" class="section level4">
<h4>The promised function</h4>
<p>With the total row count, file paths and delimiter (comma, semicolon, space, and so on) identified, we can use the following function:</p>
<pre class="r"><code>read_delim2sqlite &lt;- function(delim_file, delim, sqlite_file, table_name, batch_size = 10000, OS = &quot;Windows&quot;) {

  ## establish a connection to the database
  condb &lt;- dbConnect(SQLite(), sqlite_file)

  ## get the total number of records in the file
  # in Unix
  if (OS == &quot;Unix&quot;) {
    total_records &lt;- system2(&quot;wc&quot;, args = c(&quot;-l&quot;, delim_file), stdout = TRUE) %&gt;%
      sub(normalizePath(delim_file), &quot;&quot;, .) %&gt;%
      as.integer() %&gt;%
      {
        . - 1
      }
  } else {
    # In windows
    total_records &lt;- system2(&quot;powershell&quot;, args = c(&quot;Get-content&quot;, delim_file, &quot;|&quot;, &quot;Measure-Object&quot;, &quot;–Line&quot;), stdout = TRUE)
    total_records &lt;- as.numeric(gsub(&quot;[^0-9]&quot;, &quot;&quot;, paste(total_records, collapse = &quot;&quot;))) - 1
  }

  message(&quot;Total records: &quot;, total_records)

  ## find the number of passes needed based on size of each batch
  passes &lt;- total_records %/% batch_size
  remaining &lt;- total_records %% batch_size

  message(&quot;Total Passes to complete: &quot;, passes)

  ## first pass determines header and column types
  dat &lt;- read_delim(delim_file, delim, n_max = batch_size, progress = FALSE) %&gt;% as.data.frame()
  if (nrow(problems(dat)) &gt; 0) print(problems(dat))
  col_names &lt;- colnames(dat)
  col_types &lt;- c(character = &quot;c&quot;, numeric = &quot;d&quot;, integer = &quot;i&quot;, logical = &quot;l&quot;, Date = &quot;c&quot;) %&gt;%
    .[sapply(dat, class)] %&gt;%
    paste0(collapse = &quot;&quot;)

  ## write to database table
  dbWriteTable(condb, table_name, dat, overwrite = TRUE)

  ## multiple passes
  for (p in 2:passes) {
    message(&quot;Pass number: &quot;, p, &quot;, Progress:&quot;, round(p / passes, 2) * 100, &quot;%&quot;)
    read_delim(delim_file, delim,
      col_names = col_names, col_types = col_types,
      skip = (p - 1) * batch_size + 1, n_max = batch_size, progress = FALSE
    ) %&gt;%
      as.data.frame() %&gt;%
      dbWriteTable(condb, table_name, ., append = TRUE)
  }

  if (remaining) {
    read_delim(delim_file, delim,
      col_names = col_names, col_types = col_types,
      skip = p * batch_size + 1, n_max = remaining, progress = FALSE
    ) %&gt;%
      as.data.frame() %&gt;%
      dbWriteTable(condb, table_name, ., append = TRUE)
  }

  ## close the database connection
  dbDisconnect(condb)
}</code></pre>
<p>The function may look intimidating, but it is fairly straightforward. It reads the file in chunks of batch_size rows using read_delim from readr, inserts each chunk into the SQLite database, and repeats the process through the final line.</p>
<p>The function arguments are:</p>
<p><strong>delim_file</strong>: path to the delimited file, in this case the census dataset. <strong>delim</strong>: delimiter character, a semicolon here. <strong>sqlite_file</strong>: path to the SQLite database, ending in “.sqlite3”. <strong>table_name</strong>: name of the table within the SQLite database. <strong>batch_size</strong>: number of records to read in each iteration. <strong>OS</strong>: the operating system, either “Windows” or “Unix”; the Unix option was tested on Linux, not macOS.</p>
</div>
<div id="mover-la-csv-o-txt-a-la-base-de-datos-sqllite" class="section level4">
<h4>Move the CSV or TXT file into SQLite</h4>
<p>We are ready to use the function. To avoid running out of RAM, I will transfer the dataset in batches of one million rows. It should finish in 18 iterations.</p>
<p><strong>This will take a few minutes—time to make some mate!</strong></p>
<pre class="r"><code>read_delim2sqlite(delim_file, delim=&quot;;&quot;, sqlite_file = sqlite_file_censo,
                  table_name = table_name_censo, batch_size=1000000)</code></pre>
<pre><code>## Total records: 17574003</code></pre>
<pre><code>## Total Passes to complete: 17</code></pre>
<pre><code>## Parsed with column specification:
## cols(
##   .default = col_integer(),
##   P18 = col_character()
## )</code></pre>
<pre><code>## See spec(...) for full column specifications.</code></pre>
<pre><code>## Pass number: 2, Progress:12%</code></pre>
<pre><code>## Pass number: 3, Progress:18%</code></pre>
<pre><code>## Pass number: 4, Progress:24%</code></pre>
<pre><code>## Pass number: 5, Progress:29%</code></pre>
<pre><code>## Pass number: 6, Progress:35%</code></pre>
<pre><code>## Pass number: 7, Progress:41%</code></pre>
<pre><code>## Pass number: 8, Progress:47%</code></pre>
<pre><code>## Pass number: 9, Progress:53%</code></pre>
<pre><code>## Pass number: 10, Progress:59%</code></pre>
<pre><code>## Pass number: 11, Progress:65%</code></pre>
<pre><code>## Pass number: 12, Progress:71%</code></pre>
<pre><code>## Pass number: 13, Progress:76%</code></pre>
<pre><code>## Pass number: 14, Progress:82%</code></pre>
<pre><code>## Pass number: 15, Progress:88%</code></pre>
<pre><code>## Pass number: 16, Progress:94%</code></pre>
<pre><code>## Pass number: 17, Progress:100%</code></pre>
<p>We only need to run this lengthy conversion once. It creates a .sqlite3 file that is slightly smaller than the CSV.</p>
<div class="figure">
<img src="/img/archivo_censo_sqlite.JPG" alt="SQLite file created" />
<p class="caption">SQLite file created</p>
</div>
</div>
</div>
<div id="analizar-y-recoger-datos-con-dplyr" class="section level3">
<h3>Analyse and retrieve data with dplyr</h3>
<p>To start retrieving data from the table, first connect to the database.</p>
<pre class="r"><code>con &lt;- dbConnect(SQLite(), sqlite_file_censo)
con</code></pre>
<pre><code>## &lt;SQLiteConnection&gt;
##   Path: C:\Censo\censo2017.sqlite3
##   Extensions: TRUE</code></pre>
<p>We can inspect the connection details and the table name assigned to the dataset.</p>
<pre class="r"><code>dbListTables(con)</code></pre>
<pre><code>## [1] &quot;censo2017&quot;</code></pre>
<p>Create an object representing the data. It does not load the dataset into RAM: it is only a connection, which is why the total row count is not shown.</p>
<pre class="r"><code>datos_db &lt;- tbl(con, &quot;censo2017&quot;)
datos_db</code></pre>
<pre><code>## # Source:   table&lt;censo2017&gt; [?? x 48]
## # Database: sqlite 3.22.0 [C:\Censo\censo2017.sqlite3]
##    REGION PROVINCIA COMUNA    DC  AREA ZC_LOC ID_ZONA_LOC  NVIV NHOGAR
##     &lt;int&gt;     &lt;int&gt;  &lt;int&gt; &lt;int&gt; &lt;int&gt;  &lt;int&gt;       &lt;int&gt; &lt;int&gt;  &lt;int&gt;
##  1     15       152  15202     1     2      6       13225     1      1
##  2     15       152  15202     1     2      6       13225     3      1
##  3     15       152  15202     1     2      6       13225     3      1
##  4     15       152  15202     1     2      6       13225     3      1
##  5     15       152  15202     1     2      6       13225     3      1
##  6     15       152  15202     1     2      6       13225     9      1
##  7     15       152  15202     1     2      6       13225     9      1
##  8     15       152  15202     1     2      6       13225     9      1
##  9     15       152  15202     1     2      6       13225     9      1
## 10     15       152  15202     1     2      6       13225    10      1
## # ... with more rows, and 39 more variables: PERSONAN &lt;int&gt;, P07 &lt;int&gt;,
## #   P08 &lt;int&gt;, P09 &lt;int&gt;, P10 &lt;int&gt;, P10COMUNA &lt;int&gt;, P10PAIS &lt;int&gt;,
## #   P11 &lt;int&gt;, P11COMUNA &lt;int&gt;, P11PAIS &lt;int&gt;, P12 &lt;int&gt;, P12COMUNA &lt;int&gt;,
## #   P12PAIS &lt;int&gt;, P12A_LLEGADA &lt;int&gt;, P12A_TRAMO &lt;int&gt;, P13 &lt;int&gt;,
## #   P14 &lt;int&gt;, P15 &lt;int&gt;, P15A &lt;int&gt;, P16 &lt;int&gt;, P16A &lt;int&gt;,
## #   P16A_OTRO &lt;int&gt;, P17 &lt;int&gt;, P18 &lt;chr&gt;, P19 &lt;int&gt;, P20 &lt;int&gt;,
## #   P21M &lt;int&gt;, P21A &lt;int&gt;, P10PAIS_GRUPO &lt;int&gt;, P11PAIS_GRUPO &lt;int&gt;,
## #   P12PAIS_GRUPO &lt;int&gt;, ESCOLARIDAD &lt;int&gt;, P16A_GRUPO &lt;int&gt;,
## #   REGION_15R &lt;int&gt;, PROVINCIA_15R &lt;int&gt;, COMUNA_15R &lt;int&gt;,
## #   P10COMUNA_15R &lt;int&gt;, P11COMUNA_15R &lt;int&gt;, P12COMUNA_15R &lt;int&gt;</code></pre>
<p>Now we can use dplyr verbs. For example, we might retrieve a vector of ages to make a histogram. In the census dataset, age is stored in P09.</p>
<pre class="r"><code>edades &lt;- datos_db %&gt;%
  select(P09)

edades</code></pre>
<pre><code>## # Source:   lazy query [?? x 1]
## # Database: sqlite 3.22.0 [C:\Censo\censo2017.sqlite3]
##      P09
##    &lt;int&gt;
##  1    73
##  2    78
##  3    78
##  4    52
##  5    44
##  6    39
##  7    35
##  8    13
##  9    12
## 10    65
## # ... with more rows</code></pre>
<p>Everything looks fine, but the object is still a connection. R is using lazy evaluation: it performs only part of the operation to avoid unnecessary work.</p>
<p>We can also confirm this in the environment:</p>
<div class="figure">
<img src="/img/archivo_censo_con.JPG" />

</div>
<p>As you can see, even the row count is unavailable:</p>
<pre class="r"><code>nrow(edades)</code></pre>
<pre><code>## [1] NA</code></pre>
<p>To bring this column into RAM, use <strong>collect</strong>. I recommend <strong>always</strong> using it when you need a complete in-memory object rather than a database connection.</p>
<pre class="r"><code>edades&lt;-collect(edades)

nrow(edades)</code></pre>
<pre><code>## [1] 17574003</code></pre>
<pre class="r"><code>edades</code></pre>
<pre><code>## # A tibble: 17,574,003 x 1
##      P09
##    &lt;int&gt;
##  1    73
##  2    78
##  3    78
##  4    52
##  5    44
##  6    39
##  7    35
##  8    13
##  9    12
## 10    65
## # ... with 17,573,993 more rows</code></pre>
<p>Now it works!</p>
<p>Another example: P09 represents age and P08 represents sex. Suppose we want the average age of men (sex = 1) by region. Do not forget <strong>collect</strong>!</p>
<pre class="r"><code>hombres_edad &lt;- datos_db %&gt;%
  filter(P08==1) %&gt;%
  group_by(REGION) %&gt;%
  summarise(Edad_media = mean(P09))

hombres_edad &lt;- collect(hombres_edad)</code></pre>
<pre><code>## Warning: Missing values are always removed in SQL.
## Use `AVG(x, na.rm = TRUE)` to silence this warning</code></pre>
<pre class="r"><code>hombres_edad</code></pre>
<pre><code>## # A tibble: 16 x 2
##    REGION Edad_media
##     &lt;int&gt;      &lt;dbl&gt;
##  1      1       32.1
##  2      2       33.0
##  3      3       33.7
##  4      4       34.6
##  5      5       35.8
##  6      6       35.7
##  7      7       35.9
##  8      8       35.0
##  9      9       35.3
## 10     10       35.1
## 11     11       34.2
## 12     12       35.9
## 13     13       34.2
## 14     14       35.7
## 15     15       33.5
## 16     16       36.8</code></pre>
<p>We can now work with large structured datasets, retrieve subsets and perform analyses.</p>
<p>I hope you enjoyed this tutorial. Feel free to get in touch!</p>
<div class="figure">
<img src="https://media.giphy.com/media/3hvmlYNsOTFWE/giphy.gif" />

</div>
</div>
