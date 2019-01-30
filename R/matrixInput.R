#' Create a matrix input field
#'
#' Use this function to create a matrix input field. Typically this would be in the `ui.R` file
#' of your shiny application. You can access the input via the `input$inputId` in the server
#' function of the shiny application. The value will always be a matrix and contain values of
#' class `class`.
#'
#' The parameters `rows` and `cols` take a list of arguments. Currently, the following arguments
#' are supported:
#'
#' \describe{
#'   \item{n}{number of rows (is calculated from value as default)}
#'   \item{names}{should row/colnames be displayed? The names are taken from value}
#'   \item{editableNames}{should row/colnames be editable}
#'   \item{extend}{Should the matrix be extended if data is entered in the last row/column?}
#'   \item{delta}{how many blank rows/cols should be added?}
#'   \item{createHeader, updateHeader}{name of javascript function to override
#' default function to create/update table header. The function needs to
#' have the table element and the data object as argument}
#'   \item{getHeader}{same as createHeader but with table element as only argument}
#' }
#'
#' @param inputId The input slot that will be used to access the value
#' @param inputClass class of the matrix input html element
#' @param value Inital value. Should be a matrix
#' @param class Matrix will be coerced to a matrix of this class. `character` and `numeric`
#' are supported
#' @param rows list of options to configure rows
#' @param cols list of options to configure cols
#' @param paste enable paste functionality
#' @param copy enable copy functionality
#'
#' @examples
#' matrixInput(
#'   "myMatrix",
#'   value = diag(3),
#'   rows = list(names = FALSE),
#'   cols = list(names = FALSE),
#'   copy = TRUE,
#'   paste = TRUE
#' )
#'
#' @export
matrixInput <- function(inputId,
                        value = matrix("", 1, 1),
                        inputClass = "",
                        rows = list(),
                        cols = list(),
                        class = "character",
                        paste = FALSE,
                        copy = FALSE){
  stopifnot(is.matrix(value))
  tagList(
    singleton(tags$head(tags$script(src = "shinyMatrix/matrixInput.js"))),
    singleton(tags$head(tags$link(rel = "stylesheet", type = "text/css", href = "shinyMatrix/matrixInput.css"))),
    tags$div(
      id = inputId,
      class = paste("matrix-input", inputClass),
      "data-data" = jsonlite::toJSON(value),
      "data-rownames" = jsonlite::toJSON(rownames(value)),
      "data-colnames" = jsonlite::toJSON(colnames(value)),
      "data-rows" = jsonlite::toJSON(rows, auto_unbox = TRUE),
      "data-cols" = jsonlite::toJSON(cols, auto_unbox = TRUE),
      "data-class" = class,
      "data-copy" = jsonlite::toJSON(copy, auto_unbox = TRUE),
      "data-paste" = jsonlite::toJSON(paste, auto_unbox = TRUE)
    )
  )
}

#' Update matrix input
#'
#' This function updates the matrix input from R created with `matrixInput`.
#' It works like the other updateXXXInput functions in shiny.
#'
#' @param session shiny session
#' @param inputId id of matrix input
#' @param value new value for matrix
#'
#' @examples
#' \dontrun{
#' updateMatrixInput(session, "myMatrix", diag(4))
#' }
#'
#' @export
updateMatrixInput <- function(session, inputId, value) {
  stopifnot(is.matrix(value))

  message <- list(value = list(
    data = value,
    rownames = rownames(value),
    colnames = colnames(value)
  ))
  session$sendInputMessage(inputId, message)
}
