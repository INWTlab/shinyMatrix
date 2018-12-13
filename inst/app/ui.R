library(shinyMatrix)

shiny::tagList(
  shiny::fluidPage(
    shiny::titlePanel("Demonstration Matrix Input Field"),
    shiny::fluidRow(
      column(6, matrixInput("matrix", type = "numeric")),
      column(6, tableOutput("table"))
    )
  )
)
