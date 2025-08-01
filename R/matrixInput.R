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
#' Similarly, the parameter `cells` takes a list of arguments:
#' 
#' \describe{
#'   \item{editableCells}{logical, should cells be editable (default `TRUE`)}
#' }
#'
#' @param inputId The input slot that will be used to access the value
#' @param label label for input field
#' @param inputClass class of the matrix input html element
#' @param value Initial value. Should be a matrix
#' @param class Matrix will be coerced to a matrix of this class. `character` and `numeric`
#' are supported
#' @param rows list of options to configure rows 
#' @param cols list of options to configure cols
#' @param cells list of options to configure cells
#' @param paste old argument
#' @param copy old argument
#' @param copyDoubleClick old argument
#' @param pagination Use pagination to display matrix
#' @param lazy lazy updating of server values. The new values are only sent to the server when no input field is visible
#' @param formatCell format to be used for formatting cell values, i.e. ".2f" . This uses d3-format (https://d3js.org/d3-format)
#' 
#' @examples
#' matrixInput(
#'   "myMatrix",
#'   value = diag(3),
#'   rows = list(names = FALSE),
#'   cols = list(names = FALSE),
#'   cells = list(editableCells = FALSE)
#' )
#'
#' @export
matrixInput <- function(inputId,
                        label = NULL,
                        value = matrix("", 1, 1),
                        inputClass = "",
                        rows = list(),
                        cols = list(),
                        cells = list(),
                        class = "character",
                        paste = FALSE,
                        copy = FALSE,
                        copyDoubleClick = FALSE,
                        pagination = FALSE,
                        lazy = FALSE,
                        formatCell = NULL){
  stopifnot(is.matrix(value))

  if (copy || paste || copyDoubleClick) {
    warning("Copy paste functionality has been removed from the current version. Please use version 0.4.0 if needed.")
  }

  if (is.null(rownames(value))) rownames(value) <- rep('', nrow(value))
  if (is.null(colnames(value))) colnames(value) <- rep('', ncol(value))

  rows <- default(rows, list(names = TRUE, editableNames = FALSE, extend = FALSE, delta = 1))
  cols <- default(cols, list(names = TRUE, editableNames = FALSE, extend = FALSE, delta = 1))
  cells <- default(cells, list(editableCells = TRUE))

  inputField <- tags$div(
    id = inputId,
    class = paste("vue-input", inputClass),
    "data-values" = jsonlite::toJSON(value),
    "data-rownames" = jsonlite::toJSON(rownames(value)),
    "data-colnames" = jsonlite::toJSON(colnames(value)),
    "data-rows" = jsonlite::toJSON(rows, auto_unbox = TRUE),
    "data-cols" = jsonlite::toJSON(cols, auto_unbox = TRUE),
    "data-cells" = jsonlite::toJSON(cells, auto_unbox = TRUE),
    "data-class" = jsonlite::toJSON(class, auto_unbox = FALSE),
    "data-pagination" = jsonlite::toJSON(pagination, auto_unbox = TRUE),
    "data-lazy" = jsonlite::toJSON(lazy, auto_unbox = TRUE),
    "data-format-cell" = formatCell,
    tags$div(class = "vue-element")
  )

  tagList(
    singleton(tags$head(tags$script(src="shinyMatrix/lodash.min.js"))),
    singleton(tags$head(tags$script(src="shinyMatrix/d3-format.min.js"))),
    singleton(tags$head(tags$script(src="shinyMatrix/vue.js"))),
    singleton(tags$head(tags$script(src = "shinyMatrix/matrix-input.js"))),
    singleton(tags$head(tags$link(rel = "stylesheet", type = "text/css", href = "shinyMatrix/matrix-input.css"))),
    tags$div(
      class = "form-group shiny-matrix-input-container shiny-input-container-inline shiny-input-container",
      tags$label(class = c("control-label", if (is.null(label)) "shiny-label-null"), `for` = inputId, label),
      inputField
    )
  )
}

default <- function(x, o) {
  if (is.list(o)) {
    if (!is.list(x)) {
      x <- o
    } else {
      for (i in names(o)) {
        if (is.null(x[[i]])) {
          x[[i]] <- o[[i]]
        }
      }
    }
  } else {
    if (is.null(x)) x <- o
  }
  x
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
