.onLoad <- function(libname, pkgname){
  shiny::addResourcePath(
    'shinyMatrix', system.file('www', package='shinyMatrix')
  )

  shiny::registerInputHandler("shinyMatrix.matrixNumeric", function(x, shinysession, name){
    m <- do.call("rbind", lapply(x$data, function(row) suppressWarnings(as.numeric(unlist(row)))))

    if (!is.null(x$colnames)) colnames(m) <- x$colnames
    if (!is.null(x$rownames)) rownames(m) <- x$rownames

    m
  })

  shiny::registerInputHandler("shinyMatrix.matrixCharacter", function(x, shinysession, name){
    m <- do.call("rbind", lapply(x$data, function(row) as.character(unlist(row))))

    if (!is.null(x$colnames)) colnames(m) <- x$colnames
    if (!is.null(x$rownames)) rownames(m) <- x$rownames

    m
  })

}

.onUnload <- function(libpath){
  shiny::removeInputHandler("shinyMatrix.matrixNumeric")
  shiny::removeInputHandler("shinyMatrix.matrixCharacter")
}
