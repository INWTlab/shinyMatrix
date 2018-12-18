#' Start Application
#'
#' @param app name of the folder in `inst`
#' @param port port of web application
#'
#' @export
startApplication <- function(app = "app", port = 4242) {
  runApp(
    system.file(app, package = "shinyMatrix"),
    port = port,
    host = "0.0.0.0"
  )
}
