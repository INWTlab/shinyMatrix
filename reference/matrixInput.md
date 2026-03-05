# Create a matrix input field

Use this function to create a matrix input field. Typically this would
be in the \`ui.R\` file of your shiny application. You can access the
input via the \`input\$inputId\` in the server function of the shiny
application. The value will always be a matrix and contain values of
class \`class\`.

## Usage

``` r
matrixInput(
  inputId,
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
  formatCell = NULL
)
```

## Arguments

- inputId:

  The input slot that will be used to access the value

- label:

  label for input field

- value:

  Initial value. Should be a matrix

- inputClass:

  class of the matrix input html element

- rows:

  list of options to configure rows

- cols:

  list of options to configure cols

- cells:

  list of options to configure cells

- class:

  Matrix will be coerced to a matrix of this class. \`character\` and
  \`numeric\` are supported

- paste:

  old argument

- copy:

  old argument

- copyDoubleClick:

  old argument

- pagination:

  Use pagination to display matrix

- lazy:

  lazy updating of server values. The new values are only sent to the
  server when no input field is visible

- formatCell:

  format to be used for formatting cell values, i.e. ".2f" . This uses
  d3-format (https://d3js.org/d3-format)

## Details

The parameters \`rows\` and \`cols\` take a list of arguments.
Currently, the following arguments are supported:

- n:

  number of rows (is calculated from value as default)

- names:

  should row/colnames be displayed? The names are taken from value

- editableNames:

  should row/colnames be editable

- extend:

  Should the matrix be extended if data is entered in the last
  row/column?

- delta:

  how many blank rows/cols should be added?

- createHeader, updateHeader:

  name of javascript function to override default function to
  create/update table header. The function needs to have the table
  element and the data object as argument

- getHeader:

  same as createHeader but with table element as only argument

Similarly, the parameter \`cells\` takes a list of arguments:

- editableCells:

  logical, should cells be editable (default \`TRUE\`)

## Examples

``` r
matrixInput(
  "myMatrix",
  value = diag(3),
  rows = list(names = FALSE),
  cols = list(names = FALSE),
  cells = list(editableCells = FALSE)
)
#> <div class="form-group shiny-matrix-input-container shiny-input-container-inline shiny-input-container">
#>   <label class="control-label shiny-label-null" for="myMatrix"></label>
#>   <div id="myMatrix" class="vue-input " data-values="[[1,0,0],[0,1,0],[0,0,1]]" data-rownames="[&quot;&quot;,&quot;&quot;,&quot;&quot;]" data-colnames="[&quot;&quot;,&quot;&quot;,&quot;&quot;]" data-rows="{&quot;names&quot;:false,&quot;editableNames&quot;:false,&quot;extend&quot;:false,&quot;delta&quot;:1}" data-cols="{&quot;names&quot;:false,&quot;editableNames&quot;:false,&quot;extend&quot;:false,&quot;delta&quot;:1}" data-cells="{&quot;editableCells&quot;:false}" data-class="[&quot;character&quot;]" data-pagination="false" data-lazy="false">
#>     <div class="vue-element"></div>
#>   </div>
#> </div>
```
