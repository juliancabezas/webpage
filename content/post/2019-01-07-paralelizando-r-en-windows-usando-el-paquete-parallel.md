---
type: blog
authors: [me]
title: Paralelizando R en Windows (usando el paquete parallel)
author: Julian Cabezas
date: '2019-01-07'
slug: paralelizando-r-en-windows-usando-el-paquete-parallel
categories:
  - R
  - Tutoriales
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
  - tutoriales
summary: "Un pequeño tutorial de como acelerar tus procesos utilizando multiples nucleos en R"
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
<li><a href="#por-que-paralelizar">¿Por que Paralelizar?</a></li>
<li><a href="#convertir-tu-loop-en-una-funcion">Convertir tu loop en una función</a></li>
<li><a href="#usando-la-funcion-lapply">Usando la funcion lapply</a></li>
<li><a href="#el-paquete-parallel">El paquete parallel</a></li>
<li><a href="#un-ejemplo-mas-realista-usando-machine-learning">Un ejemplo más realista (usando Machine Learning)</a></li>
</ul>
</div>

<div id="por-que-paralelizar" class="section level2">
<h2>¿Por que Paralelizar?</h2>
<p>En tu trabajo te pidieron correr un código que se demora 20 horas en ejecutarse, consiste en ejecutar la misma función con distintos parámetros o datos muchas pero <strong>muchas</strong> veces.</p>
<p>A pesar de que puede que para ti esto puede no ser un problema, es común que te pidan las cosas <del>para ayer</del> sin 20 horas de anticipación. Si este es tu caso, y te estás preguntando por que tu PC o workstation viene con 4, 8 o 16 núcleos ¡este tutorial es para ti!</p>
<p>Paralelizar procesos en R puede ser difícil, pero si a eso le sumas <del>la mala suerte</del> el hecho de estar trabajando en Windows, se puede convertir en una tarea casi imposible</p>
<p>En este tutorial (<strong>¡el primero de esta pagina!</strong>), vamos a realizar una pequeña introducción a la paralelización de procesos en R bajo el SO Windows, partiendo por el uso de la familia de funciones <strong>apply</strong>, el uso del paquete parallel en R y una solución para crear un cluster en windows, terminando con un ejemplo de aplicación muy común en <em>machine learning</em></p>
<div id="nivel-de-este-tutorial" class="section level4">
<h4>Nivel de este tutorial:</h4>
<p>Al escribir este tutorial estoy asumiendo que eres un usuario intermedio o avanzado de R.</p>
</div>
</div>
<div id="convertir-tu-loop-en-una-funcion" class="section level2">
<h2>Convertir tu loop en una función</h2>
<p>En este ejemplo vamos a utilizar la base de datos <strong>iris</strong>, una de las más conocidas entre los usuarios de R, esta base de datos tiene mediciones del largo y ancho de pétalos y sépalos de 3 especies de flores</p>

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
<p>Supongamos que a alguien de tu equipo le interesa generar un modelo lineal entre los pétalos (Petal) y los sépalos (Sepal). Debido a que la muestra es pequeña (150 individuos) te mandan a hacer un bootstrap de 20000 iteraciones para ver como se comporta el R<sup>2</sup> y los coeficientes del modelo.</p>
<p>Para poder lograr esto hacemos un loop, que ejecuta lo siguiente: - Saca una muestra de 100 individuos (dos tercios del total) - Genera el modelo lineal - Guarda el R<sup>2</sup> y los coeficientes en una dataframe</p>

```r
# Hacemos una dataframe vacia para guardar los resultados
results <- data.frame()

system.time({
  for (i in 1:20000) {
    # Saco una muestra de 100 numeros entre 1 y 150
    ind <- sample(1:nrow(iris), size = 100)
    iris_sample <- iris[ind, ]
    # Hago un lm con el petalo y el sepalo
    model1 <- lm(iris_sample[, "Sepal.Length"] ~ iris_sample[, "Petal.Length"])

    # Extraigo el R2 y los coeficientes
    R2 <- summary(model1)$r.squared
    coef <- coefficients(model1)
    # lo junto todo en la data.frame de resultados
    results <- rbind(results, c(R2, coef))
  }
})
```

```text
##    user  system elapsed 
##   20.90    0.03   20.95
```

<p>El algoritmo se demora un poco más de 20 segundos en funcionar, tal vez esto no signifique un problema, pero ¿que pasa si el día de mañana te piden hacer lo mismo con una base de datos de medio millón de observaciones?.</p>
<p>El problema es que el loop ocupa solo un núcleo de tu procesador para ejecutar la operación una iteración tras otra, lo que no es muy eficiente</p>
<p>El primer paso para aprovechar los beneficios de la paralelización en convertir tu loop en una función, este caso el único argumento de nuestra función será un vector “iter”, que es el que nos dará la opción de realizar más iteraciones</p>

```r
lm_boot_fun <- function(iter) {
  ind <- sample(1:nrow(iris), size = 100)
  iris_sample <- iris[ind, ]
  model1 <- lm(iris_sample[, "Sepal.Length"] ~ iris_sample[, "Petal.Length"])
  R2 <- summary(model1)$r.squared
  coef <- coefficients(model1)
  # Creo un vector con los resultados
  results <- c("R2" = R2, coef)
  # El output de mi función
  return(results)
}
```

<p>!Ahora probemos nuestra función!. Como podemos ver en el siguiente código, la función da resultados independiente del argumento que le pongamos</p>

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

<p>Si le pusiéramos un vector nos daría solo un valor, por que “results” se sobrescribe en cada iteración</p>

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
<h2>Usando la funcion lapply</h2>
<p>Para que nos guarde todos los resultados podemos recurrir a la Recurriendo a la función lapply</p>
<p>La función lapply pertenece a la familia de funciones apply (apply, sapply, vapply, lapply y mapply), una de las herramientas más potentes de R (y que me habría gustado aprender mucho antes), este tutorial no se trata sobre ellas, por lo que solo ocuparemos lapply por ahora</p>
<p>La funcion lapply aplica otra función (como la que construimos), sobre una lista o vector de argumentos, y retorna una lista del mismo tamaño que los argumentos</p>

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

<p>Bueno, como podemos ver, ya bajamos un poco los tiempos de procesamiento, pero queremos hacerlo mucho más rápido aún. El único problema es que la función lapply te da como resultado una lista</p>

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

<p>Para convertir esta lista en una dataframe, utilizamos la función unlist para generar una matriz que se convierte en una dataframe. especificamos que queremos 3 columnas</p>

```r
results <- data.frame(matrix(unlist(results), ncol = 3, byrow = T))
head(results, n = 2)
```

```text
##          X1       X2        X3
## 1 0.7795166 4.283954 0.4123361
## 2 0.7683068 4.213263 0.4311986
```

<p>Otras soluciones más elegantes para este problema pueden ser encontradas en <a href="https://stackoverflow.com/questions/4227223/r-list-to-data-frame">este post de stackoverflow</a></p>
</div>
<div id="el-paquete-parallel" class="section level2">
<h2>El paquete parallel</h2>
<p>El paquete parallel, desde hace algunas versiones viene incluido con R. Este increíble paquete contiene versiones en paralelo para todas las funciones de la familia apply, para utilizar este tipo de función necesitamos saber primero con cuantos núcleos contamos</p>

```r
library(parallel)
numCores <- detectCores()
numCores
```

```text
## [1] 8
```

<p>¡Tenemos 8 núcleos lógicos!. En este caso, como regla general, vamos a a ocupar la mitad (4 nucleos). Si tuviéramos un sistema tipo Unix (linux o mac, por ejemplo), podríamos utilizar la función mclapply. Sin embargo, mclapply utiliza <em>forking</em>, una útil función que simplemente crea una copia del sistema y realiza la operación, solo disponible en sistemas tipo Unix</p>

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

<p>En nuestro caso, lo que haremos es crear un cluster manualmente, para eso, utilizamos la función makeCluster, lo que creara un objeto que utilizaremos como argumento en la función parlapply, en este caso vamos a ocupar 4 nucleos</p>

```r
cl <- makeCluster(4) # Hacemos el cluster
system.time(
  results <- parLapply(cl, iter, lm_boot_fun)
)
```

```text
##    user  system elapsed 
##    0.03    0.00    4.76
```

```r
stopCluster(cl) # Cerramos el cluster, NO OLVIDAR
```

<p><strong>Wow</strong>, bajamos MUCHO el tiempo de procesamiento de nuestro bootstrap, ya podemos ir a tomarnos un matecito con tranquilidad, no sin antes destruir el cluster con la función stopCluster.</p>
<p><strong>¡Bien!</strong> <img src="https://media.giphy.com/media/4xpB3eE00FfBm/giphy.gif" /></p>
<p>Podríamos dejar este tutorial aquí, pero este ejemplo es muy simple, en general utilizamos bases de datos que tenemos en nuestro computador, y 5-10 librerías.</p>
<div id="complejizando-la-funcion" class="section level3">
<h3>Complejizando la funcion</h3>
<p>Probemos simulando que iris es una base de datos que tenemos en nuestra computador, adicionalmente, a nuestra función le agregaremos dos argumentos referidos a la base de datos y al tamaño de la muestra</p>

```r
# Escribo la base de datos iris en mi computador
write.csv(iris, file = "iris.csv")

# Leo la base de datos que creé
datos_pc <- read.csv("iris.csv")

lm_boot_fun2 <- function(iter, data, n_sample) {
  # Ahora data y n_sample son argumentos de la función

  ind <- sample(1:nrow(data), size = n_sample)
  data_sample <- data[ind, ]
  model1 <- lm(data_sample[, "Sepal.Length"] ~ data_sample[, "Petal.Length"])
  R2 <- summary(model1)$r.squared
  coef <- coefficients(model1)
  results <- c("R2" = R2, coef)
  return(results)
}
```

<p>Ahora vamos a hacer lo mismo pero con los argumentos adicionales de parlapply</p>

```r
cl <- makeCluster(4) # Hacemos el cluster
system.time(
  results <- parLapply(cl, iter, lm_boot_fun2, data = datos_pc, n_sample = 100)
)
```

```text
##    user  system elapsed 
##    0.01    0.00    4.52
```

```r
stopCluster(cl) # Cerramos el cluster, NO OLVIDAR
```

<p>Ahora pensemos que entra nuestro jefe diciendo que el cliente quiere un Random Forest (probablemente por que suena bacán/chevere), adaptemos nuestra función complacer a todos, vamos a usar la librería randomForest, y a guardar el pseudo-R2 y el MSE</p>

```r
library(randomForest)

rf_boot_fun <- function(iter, data, n_sample) {
  ind <- sample(1:nrow(data), size = n_sample)
  data_sample <- data[ind, ]
  # Ejecuto el modelo Random Forest
  model1 <- randomForest(Sepal.Length ~ Petal.Length, data = data_sample)
  # Extraigo el pseudo-R2
  R2 <- model1$rsq[length(model1$rsq)]
  # Extraigo el MSE
  MSE <- model1$mse[length(model1$mse)]
  results <- c("R2" = R2, "MSE" = MSE)
  return(results)
}
```

<p>Ahora usemos <em>parLapply</em></p>

```r
library(randomForest)
cl <- makeCluster(4) # Hacemos el cluster
system.time(
  results <- parLapply(cl, iter, rf_boot_fun, data = datos_pc, n_sample = 100)
)
```

```text
## Error in checkForRemoteErrors(val): 4 nodes produced errors; first error: no se pudo encontrar la función "randomForest"
```

```text
## Timing stopped at: 0 0 0
```

```r
stopCluster(cl) # Cerramos el cluster, NO OLVIDAR
```

<p><strong>¿¿QUE PASÓ??</strong> ¡ya llamé a <em>library(randomForest)</em>!</p>
<div class="figure">
<img src="https://media.giphy.com/media/DVkZv0SltX1h6/giphy.gif" />

</div>
<p>Lo que pasó es lo siguiente: ya tenemos cargado el paquete <em>randomForest</em> en nuestra sesión, sin embargo, en el momento que ocupamos la función <em>makeCluster</em>, se abren <em>n</em> nuevas sesiones de R, cada una desde cero, por lo que lo que debemos hacer es cargar los paquetes en todas estas sesiones, en algunos casos, también es necesario exportar las bases de datos y funciones.</p>
<p>Para cargar el paquete <em>randomForest</em> en los nodos del cluster ocupamos la función <em>clusterCall</em>, que nos permite ejecutar una función en todos los clusters, en este caso la utilizamos para cargar la librería randomForest en todos los cluster</p>

```r
cl <- makeCluster(4) # Hacemos el cluster
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
stopCluster(cl) # Cerramos el cluster, NO OLVIDAR
```

</div>
</div>
<div id="un-ejemplo-mas-realista-usando-machine-learning" class="section level2">
<h2>Un ejemplo más realista (usando Machine Learning)</h2>
<p>Ok, mucho jugar y poca acción, vamos a presentar un ejemplo más realista, en este caso, el <em>tuning</em> de un modelo. “tunear” un modelo se refiere muchas veces a escoger el valor optimo de uno o más parámetros, de acuerdo a algún estadístico de rendimiento del modelo (como el <em>R<sup>2</sup>o</em> el <em>RMSE</em>), este tuneo se hace en la base de datos de entrenamiento o calibración, y el modelo se valida en los datos de validación.</p>
<p>Vamos a simular que la base de datos “iris” es nuestra base de datos de entrenamiento, vamos a suponer que solo tenemos información sobre los sépalos (para hacerlo un poco más difícil)</p>
<p>En este caso utilizaremos un <em>Support Vector Machine</em> (SVM) para intentar predecir la especie en base al largo y ancho de los pétalos y sépalos, este modelo es muy bueno y funciona genial para tareas de clasificación, sin embargo, a ratos es bastante dependiente del parámetro de costo y el parámetro de gamma (en el caso que utilicemos la función radial), vamos a intentar optimizar ambos parámetros</p>
<p>En este caso, el paquete <strong>e1071</strong> ya trae una función <em>tune</em>, que permite usar <em>cross validation</em> para tunear el parámetro. En este caso se utilizaremos <em>10-fold</em> con 3 repeticiones. Este ejemplo lo saqué de un caso real de un trabajo, en el que debíamos construir un modelo con una matriz de datos gigante, cada ejecución del modelo se tardaba aproximadamente 1 hora y media en ejecutarse, por lo que el tuneo iba a durar varios dias sin paralelizar</p>
<p>¡Basta de hablar, veamos el modelo!</p>

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

<p>Como podemos ver, por defecto el costo que se utiliza es 1 y el gamma 0.5, veamos algo de las <em>performances</em></p>

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

<p>Tenemos un <em>Accuracy</em> de 0.82, en muchos casos eso no es suficiente, tratemos de mejorarlo tuneando los parámetros</p>
<p>Creamos una función que con los argumentos costo y gamma me de el rendimiento del modelo, como se puede observar, solo utilizo la función <em>tune</em> con un parámetro a la vez, se podría utilizar con una lista de parámetros, pero sería más difícil de paralelizar</p>

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

<p>Y ahora, para paralelizarla, vamos a tener que utilizar la función <em>clusterMap</em>, que nos permite poner más de un argumento variable (es el equivalente a <em>mapply</em> en la familia *apply)</p>

```r
costos.test <- seq(0.2, 4, by = 0.1)
gammas.test <- seq(0.2, 4, by = 0.1)

grilla <- expand.grid("costos" = costos.test, "gammas" = gammas.test)
nrow(grilla)
```

```text
## [1] 1521
```

<p>1521 valores, esto <em>deberia</em> tardarse</p>

```r
t1 <- Sys.time()

cl <- makeCluster(4) # Hacemos el cluster
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

<p>¡Nos demoramos casi nada!. Ahora a buscar la combinación de costo y gamma que nos da un menor error</p>

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
<p>Ahora probemos nuestro svm con esos parámetros</p>

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

<p>Como podemos observar, en este caso logramos subir la accuracy en el entrenamiento de 0.82 a 0.84, esto no parece tanto, pero un 2% de incremento por un procedimiento que nos tardó menos de un minuto (¡gracias a la paralelización!) es bastante bueno</p>
<p><strong>¡Muchas gracias por llegar hasta el final de este tutorial!</strong> <strong>Espero sus comentariós y dudas</strong></p>
</div>
