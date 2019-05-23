library(shinyMatrix)

m <- diag(5)
# colnames(m) <- 1:3
# rownames(m) <- letters[1:3]

shiny::tagList(
  shiny::fluidPage(
    shiny::titlePanel("Demonstration Matrix Input Field"),
    matrixInput(
      inputId = "matrix",
      value = m,
      class = "numeric",
      cols = list(
        names = FALSE,
        extend = TRUE,
        delta = 1
      ),
      rows = list(
        names = FALSE,
        extend = TRUE,
        delta = 1
      )
    )
  )
)
