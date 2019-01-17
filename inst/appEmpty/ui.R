library(shinyMatrix)

m <- diag(5)
# colnames(m) <- 1:3
# rownames(m) <- letters[1:3]

shiny::tagList(
  shiny::fluidPage(
    shiny::titlePanel("Demonstration Matrix Input Field"),
    shiny::fluidRow(
      matrixInput(
        inputId = "matrix1",
        value = matrix(NA, 0, 0),
        class = "numeric",
        cols = list(
          names = TRUE
        ),
        rows = list(
          names = TRUE
        )
      ),
      matrixInput(
        inputId = "matrix2",
        value = {
          m <- matrix(NA, 3, 0)
          rownames(m) <- LETTERS[1:3]
          m
        },
        class = "numeric",
        cols = list(
          names = TRUE,
          extend = TRUE
        ),
        rows = list(
          names = TRUE,
          extend = FALSE
        )
      ),
      matrixInput(
        inputId = "matrix3",
        value = matrix(NA, 0, 0),
        class = "numeric",
        cols = list(
          names = TRUE,
          extend = TRUE
        ),
        rows = list(
          names = TRUE,
          extend = TRUE
        )
      )
    )
  )
)
