library(shinyMatrix)

function(input, output, session) {
  output$table <- renderTable(input$matrix, rownames = TRUE)

  observeEvent(input$button, {
    nrow <- sample(1:10, 1)
    ncol <- sample(1:10, 1)

    m <- matrix(round(rnorm(nrow * ncol), 2), nrow, ncol)

    colnames(m) <- sample(letters, ncol)
    rownames(m) <- sample(LETTERS, nrow)

    updateMatrixInput(session, "matrix", m)
  })
}
