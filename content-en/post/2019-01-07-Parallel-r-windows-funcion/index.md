---
type: blog
authors: [me]
title: "A function for parallel processing on Windows and servers (R parallelisation, part 2)"
author: Julián Cabezas
date: '2019-01-24'
slug: parallel-cluster-function
categories:
  - parallel
  - R
  - Tutorials
  - windows
  - servers
tags:
  - parallel
  - windows
  - R
  - tutorials
  - servers
image:
  caption: ''
  focal_point: ''
summary: "A helper function for creating clusters on Windows and servers: the second part of the R parallelisation tutorial."
header:
  image: ""
  caption: ""
output:
  blogdown::html_page:
    toc: true
    number_sections: false
    toc_depth: 2
image_preview: "headers/parallel.png"
---

<div id="TOC">
<ul>
<li><a href="#el-problema-crear-clusters-es-tedioso">The problem: creating clusters is tedious</a></li>
<li><a href="#la-solucion-una-funcion-para-clear-clusters">The solution: a function to create clusters</a></li>
<li><a href="#un-pequeno-y-reciclado-ejemplo">A small, recycled example</a></li>
</ul>
</div>

<p>This short tutorial is the second part of my introduction to parallelising R on Windows. <a href="/en/post/parallel-r-windows/">I recommend reading the first part</a>.</p>
<div id="el-problema-crear-clusters-es-tedioso" class="section level2">
<h2>The problem: creating clusters is tedious</h2>
<p>Creating clusters can be tedious: loading packages one by one and exporting datasets is slow, and it is easy to forget a crucial package. We want a more convenient approach. We may also be working on a server without Internet access, which complicates package installation.</p>
</div>
<div id="la-solucion-una-funcion-para-clear-clusters" class="section level2">
<h2>The solution: a function to create clusters</h2>
<p>I created a function, available in <a href="https://github.com/juliancabezas/random_functions/blob/master/create_cluster">this GitHub file</a>. To give credit where it is due, it is inspired by <a href="https://github.com/nathanvan/parallelsugar">parallelsugar</a>, with a few modifications.</p>
<p>The function creates a cluster with <em>n</em> nodes, specified by the <em>nnodes</em> argument.</p>
<p>create_cluster is designed to work on servers. When they have no Internet connection, packages can be installed in a shared folder and loaded from there. Use <em>libroute</em> to specify the library path.</p>

```r
create_cluster <- function(nnodes, libroute = NULL) {

  # nnodes: Number of nodes
  # libroute: Provided library route (different of the default library)

  tryCatch({
    cl <- parallel::makeCluster(nnodes) # Create an empty cluster with n nodes

    loaded.package.names <- c( # Find the loaded packages in the session
      sessionInfo()$basePkgs, # base packages
      names(sessionInfo()$otherPkgs)
    ) # aditional loaded packages
    # Send the packages and the complete environment to the cluster
    parallel::clusterExport(cl,
      "loaded.package.names", # loaded packages
      envir = environment()
    ) # "Environment"

    ## Charge the packages in all nodes
    if (is.null(libroute)) { # Use default library location
      parallel::parLapply(cl, 1:length(cl), function(xx) {
        lapply(loaded.package.names, function(yy) {
          library(yy, character.only = TRUE)
        })
      })
    } else {
      # If we provide a library location use it (useful when working in remote machines)
      parallel::parLapply(cl, 1:length(cl), function(xx) {
        lapply(loaded.package.names, function(yy) {
          library(yy, character.only = TRUE, lib.loc = libroute)
        })
      })
    }
  })
  return(cl) # The result is the cluster
}
```

</div>
<div id="un-pequeno-y-reciclado-ejemplo" class="section level2">
<h2>A small, recycled example</h2>
<p>In the example from the previous tutorial, we used <em>clusterCall</em> to load <em>randomForest</em>. Here, if the package and any other dependencies are already loaded in our session, we can export them to the nodes in one step.</p>
<p>First, load the package and create the function:</p>

```r
library(randomForest)

rf_boot_fun <- function(iter, data, n_sample) {
  ind <- sample(1:nrow(data), size = n_sample)
  data_sample <- data[ind, ]
  # Fit the Random Forest model
  model1 <- randomForest(Sepal.Length ~ Petal.Length, data = data_sample)
  # Extract the pseudo-R2
  R2 <- model1$rsq[length(model1$rsq)]
  # Extract the MSE
  MSE <- model1$mse[length(model1$mse)]
  results <- c("R2" = R2, "MSE" = MSE)
  return(results)
}
```

<p>Now I can apply the function with <em>parLapply</em>.</p>

```r
library(parallel)

# Define a library path (optional)
ruta_libreria <- "C:/Users/Julian/Documents/R/win-library/3.5"

# This can simply be nuevoclus<-create_cluster(4)
nuevoclus <- create_cluster(4, ruta_libreria)

# 10,000 iterations of our function using the "iris" dataset
results <- parLapply(nuevoclus, 1:10000, rf_boot_fun, data = iris, n_sample = 100)

stopCluster(nuevoclus) # Close the cluster; do not forget this step

# The first two results
head(results, n = 2)
```

```text
## [[1]]
##       R2      MSE
## 0.778244 0.174310
##
## [[2]]
##        R2       MSE
## 0.6912495 0.1865890
```

<p>Done—parallelisation is much easier now!</p>
<div class="figure">
<img src="https://media.giphy.com/media/uTuLngvL9p0Xe/giphy.gif" />

</div>
<p><strong>I hope you find this useful!</strong></p>
<p><strong>I welcome your comments and questions!</strong></p>
</div>
