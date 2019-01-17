library(shinyMatrix)

function(input, output, session) {
  observe({
    cat(jsonlite::toJSON(input$matrix1))
  })

  observe({
    cat(jsonlite::toJSON(input$matrix2))
  })

  observe({
    cat(jsonlite::toJSON(input$matrix3))
  })
}
