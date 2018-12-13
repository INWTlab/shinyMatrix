library(shinyMatrix)

function(input, output, session) {
  output$table <- renderTable(input$matrix)
}
