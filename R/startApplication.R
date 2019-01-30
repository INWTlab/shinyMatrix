#' Start Application
#'
#' This function starts an example app from the folder `inst`.
#'
#' @param app name of the folder in `inst`
#' @param port port of web application
#'
#' @examples
#' \dontrun{
#' startApplication("appCopy")
#' }
#'
#' @export
startApplication <- function(app = "app", port = 4242) {
  runApp(
    system.file(app, package = "shinyMatrix"),
    port = port,
    host = "0.0.0.0"
  )
}
