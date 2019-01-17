library(shinyMatrix)

m <- diag(5)
# colnames(m) <- 1:3
# rownames(m) <- letters[1:3]

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
          extend = TRUE
        ),
        rows = list(
          names = TRUE
        )
      )),
      column(
        6,
        actionButton("button", "Update Matrix"),
        tableOutput("table"))
    )
  )
)
