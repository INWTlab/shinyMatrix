library(shinyMatrix)

m <- diag(5)

shiny::tagList(
  shiny::fluidPage(
    shiny::titlePanel("Demonstration Matrix Input Field"),
    matrixInput(
      inputId = "matrix",
      value = m,
      class = "numeric",
      cols = list(
        names = TRUE
      ),
      rows = list(
        names = TRUE
      ),
      copy = TRUE,
      paste = TRUE
    ),
    textAreaInput("text", "Textarea", width = 400, height = 200)
  )
)
