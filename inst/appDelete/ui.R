library(shinyMatrix)

m <- diag(6)
colnames(m) <- paste0(letters[1:6], "||", 1:2)
# rownames(m) <- letters[1:3]

shiny::tagList(
  shiny::fluidPage(
    shiny::titlePanel("Demonstration Matrix Input Field"),
    shiny::fluidRow(
      matrixInput(
        inputId = "matrix1",
        value = m,
        class = "numeric",
        cols = list(
          names = TRUE,
          multiheader = TRUE,
          extend = TRUE,
          delta = 2,
          delete = TRUE
        ),
        rows = list(
          names = TRUE,
          editableNames = TRUE,
          delete = TRUE
        )
      ),
    )
  )
)
