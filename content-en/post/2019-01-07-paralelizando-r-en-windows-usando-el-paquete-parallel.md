---
type: blog
authors: [me]
title: "Parallelising R on Windows with the parallel package"
author: Julian Cabezas
date: '2019-01-07'
slug: parallel-r-windows
categories:
  - R
  - Tutorials
  - parallel
  - windows
  - parlapply
  - machine learning
  - SVM
  - tune
tags:
  - parallel
  - windows
  - R
  - tutorials
summary: "A tutorial on speeding up R workflows using multiple processor cores."
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
<li><a href="#por-que-paralelizar">Why parallelise?</a></li>
<li><a href="#convertir-tu-loop-en-una-funcion">Turn your loop into a function</a></li>
<li><a href="#usando-la-funcion-lapply">Using lapply</a></li>
<li><a href="#el-paquete-parallel">The parallel package</a></li>
<li><a href="#un-ejemplo-mas-realista-usando-machine-learning">A more realistic example: machine learning</a></li>
</ul>
</div>

<div id="por-que-paralelizar" class="section level2">
<h2>Why parallelise?</h2>
<p>You have been asked to run code that takes 20 hours to finish. It applies the same function to different parameters or datasets many, <strong>many</strong> times.</p>
<p>That might not seem like a problem, but requests often arrive <del>yesterday</del> without 20 hours of notice. If you are wondering why your PC or workstation has 4, 8 or 16 cores, this tutorial is for you!</p>
<p>Parallelising R processes can be difficult. Add <del>bad luck</del> Windows to the equation, and it can feel almost impossible.</p>
<p>In this tutorial (<strong>the first on this website!</strong>), we will introduce parallel processing in R on Windows. We will start with the <strong>apply</strong> family, explore the parallel package and create a Windows cluster, before finishing with a common <em>machine learning</em> application.</p>
<div id="nivel-de-este-tutorial" class="section level4">
<h4>Tutorial level</h4>
<p>This tutorial assumes you are an intermediate or advanced R user.</p>
</div>
</div>
<div id="convertir-tu-loop-en-una-funcion" class="section level2">
<h2>Turn your loop into a function</h2>
<p>We will use the <strong>iris</strong> dataset, familiar to many R users. It contains petal and sepal length and width measurements for three flower species.</p>

```r
data(iris)
knitr::kable(head(iris))
```

<table>
<thead>
<tr class="header">
<th align="right">Sepal.Length</th>
<th align="right">Sepal.Width</th>
<th align="right">Petal.Length</th>
<th align="right">Petal.Width</th>
<th align="left">Species</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="right">5.1</td>
<td align="right">3.5</td>
<td align="right">1.4</td>
<td align="right">0.2</td>
<td align="left">setosa</td>
</tr>
<tr class="even">
<td align="right">4.9</td>
<td align="right">3.0</td>
<td align="right">1.4</td>
<td align="right">0.2</td>
<td align="left">setosa</td>
</tr>
<tr class="odd">
<td align="right">4.7</td>
<td align="right">3.2</td>
<td align="right">1.3</td>
<td align="right">0.2</td>
<td align="left">setosa</td>
</tr>
<tr class="even">
<td align="right">4.6</td>
<td align="right">3.1</td>
<td align="right">1.5</td>
<td align="right">0.2</td>
<td align="left">setosa</td>
</tr>
<tr class="odd">
<td align="right">5.0</td>
<td align="right">3.6</td>
<td align="right">1.4</td>
<td align="right">0.2</td>
<td align="left">setosa</td>
</tr>
<tr class="even">
<td align="right">5.4</td>
<td align="right">3.9</td>
<td align="right">1.7</td>
<td align="right">0.4</td>
<td align="left">setosa</td>
</tr>
</tbody>
</table>
<p>Suppose a colleague wants to fit a linear model relating petals to sepals. Because the sample is small (150 individuals), you are asked to run 20,000 bootstrap iterations to examine the model coefficients and R<sup>2</sup>.</p>
<p>We can do this with a loop that draws a sample of 100 individuals (two-thirds of the dataset), fits a linear model, and saves the R<sup>2</sup> and coefficients in a data frame.</p>

```r
# Create an empty data frame to store the results
results <- data.frame()

system.time({
  for (i in 1:20000) {
    # Draw a sample of 100 numbers between 1 and 150
    ind <- sample(1:nrow(iris), size = 100)
    iris_sample <- iris[ind, ]
    # Fit a linear model using petal and sepal measurements
    model1 <- lm(iris_sample[, "Sepal.Length"] ~ iris_sample[, "Petal.Length"])

    # Extract R2 and the coefficients
    R2 <- summary(model1)$r.squared
    coef <- coefficients(model1)
    # Combine everything in the results data frame
    results <- rbind(results, c(R2, coef))
  }
})
```

```text
##    user  system elapsed
##   20.90    0.03   20.95
```

<p>The algorithm takes just over 20 seconds. That may be acceptable now, but what if tomorrow you need to do the same thing with half a million observations?</p>
<p>The problem is that the loop uses only one processor core, running one iteration after another. This is not very efficient.</p>
<p>The first step towards parallelisation is to turn the loop into a function. Here the only argument will be an iteration vector, “iter”, which lets us request more iterations.</p>

```r
lm_boot_fun <- function(iter) {
  ind <- sample(1:nrow(iris), size = 100)
  iris_sample <- iris[ind, ]
  model1 <- lm(iris_sample[, "Sepal.Length"] ~ iris_sample[, "Petal.Length"])
  R2 <- summary(model1)$r.squared
  coef <- coefficients(model1)
  # Create a vector of results
  results <- c("R2" = R2, coef)
  # Return the function output
  return(results)
}
```

<p>Let us test the function. As the following code shows, it returns a result regardless of the argument we pass.</p>

```r
result <- lm_boot_fun(1)
result
```

```text
##                            R2                   (Intercept)
##                     0.7554039                     4.3353075
## iris_sample[, "Petal.Length"]
##                     0.3999710
```

```r
result <- lm_boot_fun(56876)
result
```

```text
##                            R2                   (Intercept)
##                     0.7393922                     4.3426829
## iris_sample[, "Petal.Length"]
##                     0.3939433
```

<p>Passing a vector still returns just one result, because “results” is overwritten on every iteration.</p>

```r
result <- lm_boot_fun(1:10)
result
```

```text
##                            R2                   (Intercept)
##                     0.7732318                     4.2822007
## iris_sample[, "Petal.Length"]
##                     0.4256894
```

</div>
<div id="usando-la-funcion-lapply" class="section level2">
<h2>Using lapply</h2>
<p>To keep all the results, we can use lapply.</p>
<p>lapply belongs to the apply family (apply, sapply, vapply, lapply and mapply), one of R’s most powerful tools—and one I wish I had learned earlier. This tutorial is not about the whole family, so we will focus on lapply.</p>
<p>lapply applies another function, such as the one we created, to a list or vector of arguments, and returns a list of the same length.</p>

```r
iter <- seq(1, 20000)
system.time({
  results <- lapply(iter, lm_boot_fun)
})
```

```text
##    user  system elapsed
##   15.05    0.00   15.07
```

<p>Processing time has already improved a little, but we want to make it much faster. One detail to handle is that lapply returns a list.</p>

```r
head(results, n = 3)
```

```text
## [[1]]
##                            R2                   (Intercept)
##                     0.7795166                     4.2839537
## iris_sample[, "Petal.Length"]
##                     0.4123361
##
## [[2]]
##                            R2                   (Intercept)
##                     0.7683068                     4.2132627
## iris_sample[, "Petal.Length"]
##                     0.4311986
##
## [[3]]
##                            R2                   (Intercept)
##                     0.7909086                     4.2600338
## iris_sample[, "Petal.Length"]
##                     0.4163103
```

<p>To convert this list into a data frame, use unlist to build a matrix and then convert it. Here we specify three columns.</p>

```r
results <- data.frame(matrix(unlist(results), ncol = 3, byrow = T))
head(results, n = 2)
```

```text
##          X1       X2        X3
## 1 0.7795166 4.283954 0.4123361
## 2 0.7683068 4.213263 0.4311986
```

<p>You can find more elegant solutions in <a href="https://stackoverflow.com/questions/4227223/r-list-to-data-frame">this Stack Overflow discussion</a>.</p>
</div>
<div id="el-paquete-parallel" class="section level2">
<h2>The parallel package</h2>
<p>The parallel package is included with R. It provides parallel versions of functions in the apply family. Before using them, we need to find out how many cores are available.</p>

```r
library(parallel)
numCores <- detectCores()
numCores
```

```text
## [1] 8
```

<p>We have eight logical cores! As a rule of thumb for this example, we will use half of them (four). On a Unix-like system, such as Linux or macOS, we could use mclapply. However, mclapply relies on <em>forking</em>, which creates a copy of the process and is available only on Unix-like systems.</p>

```r
iter <- seq(1, 20000)
system.time({
  results <- mclapply(iter, lm_boot_fun, mc.cores = 7)
})
```

```text
## Error in mclapply(iter, lm_boot_fun, mc.cores = 7): 'mc.cores' > 1 is not supported on Windows
```

```text
## Timing stopped at: 0 0 0
```

<p>On Windows, we will create a cluster manually using makeCluster. The resulting object becomes an argument to parLapply. In this case, we will use four cores.</p>

```r
cl <- makeCluster(4) # Create the cluster
system.time(
  results <- parLapply(cl, iter, lm_boot_fun)
)
```

```text
##    user  system elapsed
##    0.03    0.00    4.76
```

```r
stopCluster(cl) # Close the cluster; do not forget this step
```

<p><strong>Wow!</strong> We have substantially reduced the bootstrap processing time. We can enjoy a cup of mate—after shutting down the cluster with stopCluster.</p>
<p><strong>Great!</strong> <img src="https://media.giphy.com/media/4xpB3eE00FfBm/giphy.gif" /></p>
<p>We could stop here, but this is a very simple example. In practice, we often use datasets stored on our computers and five to ten packages.</p>
<div id="complejizando-la-funcion" class="section level3">
<h3>Making the function more complex</h3>
<p>Let us pretend iris is a dataset stored on our computer. We will also add two arguments to the function: the dataset and the sample size.</p>

```r
# Write the iris dataset to disk
write.csv(iris, file = "iris.csv")

# Read the dataset created above
datos_pc <- read.csv("iris.csv")

lm_boot_fun2 <- function(iter, data, n_sample) {
  # data and n_sample are now function arguments

  ind <- sample(1:nrow(data), size = n_sample)
  data_sample <- data[ind, ]
  model1 <- lm(data_sample[, "Sepal.Length"] ~ data_sample[, "Petal.Length"])
  R2 <- summary(model1)$r.squared
  coef <- coefficients(model1)
  results <- c("R2" = R2, coef)
  return(results)
}
```

<p>Now we can repeat the operation using the additional arguments of parLapply.</p>

```r
cl <- makeCluster(4) # Create the cluster
system.time(
  results <- parLapply(cl, iter, lm_boot_fun2, data = datos_pc, n_sample = 100)
)
```

```text
##    user  system elapsed
##    0.01    0.00    4.52
```

```r
stopCluster(cl) # Close the cluster; do not forget this step
```

<p>Suppose your manager walks in and says the client wants a Random Forest—perhaps because it sounds impressive. Let us adapt the function using the randomForest package and save the pseudo-R<sup>2</sup> and MSE.</p>

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

<p>Now let us use <em>parLapply</em>.</p>

```r
library(randomForest)
cl <- makeCluster(4) # Create the cluster
system.time(
  results <- parLapply(cl, iter, rf_boot_fun, data = datos_pc, n_sample = 100)
)
```

```text
## Error in checkForRemoteErrors(val): 4 nodes produced errors; first error: could not find function "randomForest"
```

```text
## Timing stopped at: 0 0 0
```

```r
stopCluster(cl) # Close the cluster; do not forget this step
```

<p><strong>What happened?</strong> I already called <em>library(randomForest)</em>!</p>
<div class="figure">
<img src="https://media.giphy.com/media/DVkZv0SltX1h6/giphy.gif" />

</div>
<p>The <em>randomForest</em> package is loaded in our current session. However, <em>makeCluster</em> opens <em>n</em> new R sessions, each starting from scratch. We must load the packages in every session. In some cases, we must also export datasets and functions.</p>
<p>To load <em>randomForest</em> on the cluster nodes, use <em>clusterCall</em>. It runs a function on every node; here, we use it to load the package on all of them.</p>

```r
cl <- makeCluster(4) # Create the cluster
clusterCall(cl, function() library(randomForest))
```

```r
system.time(
  results <- parLapply(cl, iter, rf_boot_fun, data = datos_pc, n_sample = 100)
)
```

```text
##    user  system elapsed
##    0.02    0.00  137.75
```

```r
stopCluster(cl) # Close the cluster; do not forget this step
```

</div>
</div>
<div id="un-ejemplo-mas-realista-usando-machine-learning" class="section level2">
<h2>A more realistic example: machine learning</h2>
<p>Now for a more realistic example: model <em>tuning</em>. This usually means choosing the best value of one or more parameters according to a performance statistic, such as <em>R<sup>2</sup></em> or <em>RMSE</em>. Tuning uses the training or calibration dataset, while the model is evaluated on validation data.</p>
<p>We will use iris as our training dataset and assume we have only sepal measurements, to make the task a little harder.</p>
<p>We will use a <em>Support Vector Machine</em> (SVM) to predict species from flower measurements. This model works well for classification, but can depend heavily on the cost and gamma parameters when using a radial kernel. We will try to optimise both.</p>
<p>The <strong>e1071</strong> package includes a <em>tune</em> function that uses <em>cross-validation</em>. Here we will use <em>10-fold</em> cross-validation with three repetitions. This example comes from a real project with a large data matrix, where each model run took about an hour and a half. Without parallelisation, tuning would have taken days.</p>
<p>Enough talking—let us look at the model!</p>

```r
library(e1071)
svm_model <- svm(Species ~ Sepal.Length + Sepal.Width, data = iris)
summary(svm_model)
```

```text
##
## Call:
## svm(formula = Species ~ Sepal.Length + Sepal.Width, data = iris)
##
##
## Parameters:
##    SVM-Type:  C-classification
##  SVM-Kernel:  radial
##        cost:  1
##       gamma:  0.5
##
## Number of Support Vectors:  86
##
##  ( 10 40 36 )
##
##
## Number of Classes:  3
##
## Levels:
##  setosa versicolor virginica
```

<p>The default cost is 1 and gamma is 0.5. Let us examine the <em>performance</em>.</p>

```r
library(caret)
confusionMatrix(iris$Species, predict(svm_model))
```

```text
## Confusion Matrix and Statistics
##
##             Reference
## Prediction   setosa versicolor virginica
##   setosa         49          1         0
##   versicolor      0         36        14
##   virginica       0         12        38
##
## Overall Statistics
##
##                Accuracy : 0.82
##                  95% CI : (0.749, 0.8779)
##     No Information Rate : 0.3467
##     P-Value [Acc > NIR] : < 2.2e-16
##
##                   Kappa : 0.73
##  Mcnemar's Test P-Value : NA
##
## Statistics by Class:
##
##                      Class: setosa Class: versicolor Class: virginica
## Sensitivity                 1.0000            0.7347           0.7308
## Specificity                 0.9901            0.8614           0.8776
## Pos Pred Value              0.9800            0.7200           0.7600
## Neg Pred Value              1.0000            0.8700           0.8600
## Prevalence                  0.3267            0.3267           0.3467
## Detection Rate              0.3267            0.2400           0.2533
## Detection Prevalence        0.3333            0.3333           0.3333
## Balanced Accuracy           0.9950            0.7980           0.8042
```

<p>Accuracy is 0.82. In many cases that is not enough, so let us try to improve it by tuning the parameters.</p>
<p>We create a function that returns model performance for a given cost and gamma. Notice that I call <em>tune</em> with only one parameter combination at a time. It could accept a list of parameters, but that would be harder to parallelise.</p>

```r
tune_svm_par <- function(costo, gamma) {
  control <- tune.control(
    nrepeat = 3, repeat.aggregate = mean,
    sampling = "cross", sampling.aggregate = mean,
    sampling.dispersion = sd,
    cross = 10
  )

  svm_cv <- tune("svm",
    train.x = iris[, c("Sepal.Length", "Sepal.Width")],
    train.y = iris$Species,
    kernel = "radial",
    scale = TRUE,
    type = "C-classification",
    tunecontrol = control,
    ranges = list(cost = costo, gamma = gamma)
  )

  return(svm_cv$performances)
}
```

<p>For parallelisation, we will use <em>clusterMap</em>, which accepts more than one varying argument. It is the equivalent of <em>mapply</em> in the apply family.</p>

```r
costos.test <- seq(0.2, 4, by = 0.1)
gammas.test <- seq(0.2, 4, by = 0.1)

grilla <- expand.grid("costos" = costos.test, "gammas" = gammas.test)
nrow(grilla)
```

```text
## [1] 1521
```

<p>There are 1,521 combinations. This <em>should</em> take a while.</p>

```r
t1 <- Sys.time()

cl <- makeCluster(4) # Create the cluster
clusterCall(cl, function() library(e1071))

list.errores <- clusterMap(
  cl = cl, fun = tune_svm_par,
  costo = grilla$costos,
  gamma = grilla$gammas,
  SIMPLIFY = FALSE, RECYCLE = FALSE
)

library(dplyr)
errores.bind <- bind_rows(list.errores)

stopCluster(cl)

t2 <- Sys.time()
```

```r
print(t2 - t1)
```

```text
## Time difference of 52.99884 secs
```

<p>That hardly took any time! Now let us find the cost and gamma combination with the lowest error.</p>

```r
knitr::kable(subset(errores.bind, errores.bind$error == min(errores.bind$error)))
```

<table>
<thead>
<tr class="header">
<th></th>
<th align="right">cost</th>
<th align="right">gamma</th>
<th align="right">error</th>
<th align="right">dispersion</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>885</td>
<td align="right">2.8</td>
<td align="right">2.4</td>
<td align="right">0.18</td>
<td align="right">0.1044681</td>
</tr>
</tbody>
</table>
<p>Let us test the SVM with those parameters.</p>

```r
library(e1071)
svm_model <- svm(Species ~ Sepal.Length + Sepal.Width, data = iris, cost = 2.6, gamma = 2)
library(caret)
confusionMatrix(iris$Species, predict(svm_model))
```

```text
## Confusion Matrix and Statistics
##
##             Reference
## Prediction   setosa versicolor virginica
##   setosa         50          0         0
##   versicolor      0         36        14
##   virginica       0         10        40
##
## Overall Statistics
##
##                Accuracy : 0.84
##                  95% CI : (0.7714, 0.8947)
##     No Information Rate : 0.36
##     P-Value [Acc > NIR] : < 2.2e-16
##
##                   Kappa : 0.76
##  Mcnemar's Test P-Value : NA
##
## Statistics by Class:
##
##                      Class: setosa Class: versicolor Class: virginica
## Sensitivity                 1.0000            0.7826           0.7407
## Specificity                 1.0000            0.8654           0.8958
## Pos Pred Value              1.0000            0.7200           0.8000
## Neg Pred Value              1.0000            0.9000           0.8600
## Prevalence                  0.3333            0.3067           0.3600
## Detection Rate              0.3333            0.2400           0.2667
## Detection Prevalence        0.3333            0.3333           0.3333
## Balanced Accuracy           1.0000            0.8240           0.8183
```

<p>Training accuracy increased from 0.82 to 0.84. It may not look like much, but a two-percentage-point improvement from a procedure that took less than a minute—thanks to parallelisation—is a good result.</p>
<p><strong>Thank you for reading to the end of this tutorial!</strong> <strong>I welcome your comments and questions.</strong></p>
</div>
