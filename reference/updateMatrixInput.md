# Update matrix input

This function updates the matrix input from R created with
\`matrixInput\`. It works like the other updateXXXInput functions in
shiny.

## Usage

``` r
updateMatrixInput(session, inputId, value)
```

## Arguments

- session:

  shiny session

- inputId:

  id of matrix input

- value:

  new value for matrix

## Examples

``` r
if (FALSE) { # \dontrun{
updateMatrixInput(session, "myMatrix", diag(4))
} # }
```
