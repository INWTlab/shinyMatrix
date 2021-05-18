library(shinyMatrix)

m <- diag(5)
# colnames(m) <- 1:5
# rownames(m) <- letters[1:5]

shiny::tagList(
  shiny::fluidPage(
    shiny::titlePanel("Demonstration Matrix Input Field"),
    shiny::fluidRow(
      column(6, matrixInput(
        inputId = "matrix",
        label = "Default matrix",
        value = m,
        class = "numeric",
        cols = list(
          names = TRUE,
          editableNames = TRUE
        ),
        rows = list(
          names = TRUE,
          editableNames = TRUE
        ),
        lazy = TRUE
      )),
      column(6, tableOutput("table"))
    )
  )
)
