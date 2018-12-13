.onLoad <- function(libname, pkgname){
  shiny::addResourcePath(
    'shinyMatrix', system.file('js', package='shinyMatrix')
  )

  shiny::registerInputHandler("shinyMatrix.matrixNumeric", function(x, shinysession, name){
    do.call("rbind", lapply(x, function(row) suppressWarnings(as.numeric(unlist(row)))))
  })

  shiny::registerInputHandler("shinyMatrix.matrixCharacter", function(x, shinysession, name){
    do.call("rbind", lapply(x, function(row) as.character(unlist(row))))
  })

}

.onUnload <- function(libpath){
  shiny::removeInputHandler("shinyMatrix.matrixNumeric")
  shiny::removeInputHandler("shinyMatrix.matrixCharacter")
}
