library(shinyMatrix)

function(input, output, session) {
  output$table <- renderTable({
    req(colnames(input$matrix))
    input$matrix
  }, rownames = TRUE)

  observeEvent(input$button, {
    nrow <- sample(0:10, 1)
    ncol <- sample(0:10, 1)

    m <- matrix(round(rnorm(nrow * ncol), 2), nrow, ncol)

    colnames(m) <- sample(letters, ncol)
    rownames(m) <- paste(sample(LETTERS, nrow), seq_len(nrow))

    output$colnames <- renderText(paste(colnames(m), collapse = ", "))
    output$rownames <- renderText(paste(rownames(m), collapse = ", "))

    updateMatrixInput(session, "matrix", m)
  })
}
