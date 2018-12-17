library(shinyMatrix)

m <- diag(5)

shiny::tagList(
  shiny::fluidPage(
    shiny::titlePanel("Demonstration Matrix Input Field"),
    shiny::fluidRow(
      column(6, matrixInput(
        inputId = "matrix",
        value = m,
        class = "numeric",
        cols = list(
          names = TRUE,
          editableNames = TRUE
        ),
        rows = list(
          names = TRUE,
          editableNames = TRUE
        )
      )),
      column(6, tableOutput("table"))
    )
  )
)
