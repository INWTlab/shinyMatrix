[![Travis-CI Build Status](https://travis-ci.org/INWTlab/shiny-matrix.svg?branch=master)](https://travis-ci.org/INWTlab/shiny-matrix)
[![Coverage Status](https://img.shields.io/codecov/c/github/INWTlab/shiny-matrix/master.svg)](https://codecov.io/github/INWTlab/shiny-matrix?branch=master)
[![CRAN_Status_Badge](http://www.r-pkg.org/badges/version/shinyMatrix)](https://cran.r-project.org/package=shinyMatrix)

# Matrix Input for Shiny

This package provides an input field to enter matrix conveniently in a shiny application. It supports tabbing and jumping linewise in the matrix, copy-pasting from other spread sheets applications.

![Screenshot Simple Matrix](https://github.com/INWTlab/shiny-matrix/raw/master/screenshot1.png)

## Usage

### UI

The input field is generated by the function `matrixInput`

```r
matrixInput <- function(inputId,
                        value = matrix("", 1, 1),
                        inputClass = "",
                        rows = list(),
                        cols = list(),
                        class = "character",
                        paste = FALSE,
                        copy = FALSE){
  [...]
}
```
You can define parameters as follows:

| Parameter | Description |
|-|-|
| `inputId` | `id` of html element |
| `value` | matrix |
| `inputClass` | `class` of html element (Class `matrix-input` is added automatically) |
| `rows` | `list` of parameters (see below) |
| `cols` | `list` of parameters (see below) |
| `class` | class of resulting matrix (`numeric` and `character`) is supported |
| `paste` | add pasting functionality |
| `copy` | add copy functionality |

Parameter `rows` / `cols` take a list of arguments. The following is supported

| Parameter | Description |
|-|-|
|`n`| number of rows (is calculated from `value` per default) |
|`names`| show row/colnames (names are taken from `value`)|
|`editableNames`| should row/colnames be editable? |
| `extend`| should rows/cols be automatically be added if table is filled to the last row / column? |
| `delta` | how many blank rows/cols should be added 
| `createHeader` | name of javascript function to override default function to create table header. The function needs to have the table element and the data object as argument
| `updateHeader` | name of javascript function to override default function to update table header. The function needs to have the table element and the data object as argument
| `getHeader` | name of javascript function to override default function to get names from the html table. The function needs to have the table element as argument |

Call the matrixInput function in your UI generating, e.g. ui.R

```r
## numeric matrix
matrixInput("matrix1", class = "numeric")

## editable rownames
matrixInput("matrix2",
  rows = list(
    names = TRUE,
    editableNames = TRUE),
  data = matrix(letters[1:12], 3, 4)
)
```
### Get value

You can access the value from the matrix input using `input$inputId` in your server function. The result will always be a matrix of the class defined in `matrixInput`.


### Update Input Field

You can update the input field using `updateMatrixInput`

```r
updateMatrixInput(session, inputId, value = NULL)
```

`value` is the data object. In the future there should be also support to update the other parameters.

## Example Apps

You find the code for the example app in `inst/appXXX`.

```r
library(shinyMatrix)

## Basic Functionality
startApplication("app")

## Copy Pasting
startApplication("appCopy")

## Update Matrix Input from R
startApplication("appUpdate")

## Editable rownames
startApplication("appRownames")

## Extend Matrix Automatically
startApplication("appExtend")

## Custom Column Header 
startApplication("appCustom")
```
