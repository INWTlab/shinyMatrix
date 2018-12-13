#' Create a matrix input field
#'
#' @param inputId The input slot that will be used to access the value
#' @param rows Number of rows
#' @param cols Number of cols
#' @param type class of matrix
#'
#' @export
matrixInput <- function(inputId, rows = 4, cols = 4, type = "character") {
  tagList(
    singleton(tags$head(tags$script(src = "shinyMatrix/matrixInput.js"))),
    tags$div(id = inputId, class = "matrix-input",
             "data-rows" = rows,
             "data-cols" = cols,
             "data-type" = type)
  )
}
