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
        names = TRUE,
        extend = TRUE,
        editableNames = TRUE,
        delta = 2,
        delete = TRUE
      ),
      rows = list(
        names = TRUE,
        extend = TRUE,
        editableNames = TRUE,
        delta = 1,
        delete = TRUE
      )
    )
  )
)
