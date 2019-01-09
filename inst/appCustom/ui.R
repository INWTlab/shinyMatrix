library(shinyMatrix)

m <- matrix(sample(letters, 16, replace = TRUE), 4, 4)
colnames(m) <- c("Var1-A", "Var1-B", "Var2-A", "Var2-B")

tagList(
  fluidPage(
    tags$script(src = "custom.js"),
    titlePanel("Custom Header"),
    tags$h3("Input"),
    matrixInput(
      inputId = "matrix",
      value = m,
      class = "character",
      cols = list(
        names = TRUE,
        createHeader = "myapp.createColHeader",
        updateHeader = "myapp.updateColHeader",
        getHeader = "myapp.getColHeader",
        extend = TRUE,
        delta = 2,
        editableNames = TRUE
      ),
      rows = list(
        names = FALSE
      )
    )),
  tags$h3("Output"),
  fluidRow(
    column(6, tableOutput("table"))
  )
)
