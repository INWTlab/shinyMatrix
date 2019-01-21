.onLoad <- function(libname, pkgname){
  shiny::addResourcePath(
    'shinyMatrix', system.file('www', package='shinyMatrix')
  )

  shiny::registerInputHandler("shinyMatrix.matrixNumeric", function(x, shinysession, name){
    jsonToMatrix(x, as.numeric)
  })

  shiny::registerInputHandler("shinyMatrix.matrixCharacter", function(x, shinysession, name){
    jsonToMatrix(x, as.character)
  })

}

.onUnload <- function(libpath){
  shiny::removeInputHandler("shinyMatrix.matrixNumeric")
  shiny::removeInputHandler("shinyMatrix.matrixCharacter")
}
