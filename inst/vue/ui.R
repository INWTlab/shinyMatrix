library(shiny)

m <- matrix(rnorm(100000), 10000, 10)
colnames(m) <- letters[1:10]
rownames(m) <- 1:10000

vueInput <- function(inputId, value = m) {
  tagList(
    # singleton(tags$head(tags$script(src = "js/increment.js"))),
    tags$div(id = inputId,
                class = "vue-input",
                 "data-values" = jsonlite::toJSON(value),
                 "data-rownames" = jsonlite::toJSON(rownames(value)),
                 "data-colnames" = jsonlite::toJSON(colnames(value)),
                 HTML('<matrix-input :values="values" :rownames="rownames" :colnames="colnames"/>')
                 )
  )
}

fluidPage(
    tags$head(
        tags$script(src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"),
        tags$script(src="matrix-input.js"),
        tags$link(rel = "stylesheet", type = "text/css", href = "matrix-input.css")
    ),
    tags$h1("Test 2"),
    vueInput("element")
)