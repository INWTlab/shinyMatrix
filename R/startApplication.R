#' Start Application
#'
#' @param port port of web application
#'
#' @export
startApplication <- function(port = 4242) {
  runApp(
    system.file("app", package = "shinyMatrix"),
    port = port,
    host = "0.0.0.0"
  )
}
