(function ( $ ) {
    function createTable(rows, cols) {
        var table = $("<table>");
        table.addClass("table table-bordered");

        for (var i = 0; i < rows; i++){
            var tr = $("<tr>");
            for (var j = 0; j < cols; j ++){
                var td = $("<td>");
                tr.append(td);
            }
            table.append(tr);
        }
        return table;
    };

    function createInput(value){
        var inputEl = $("<input>");

        inputEl.val(value);

        return inputEl;
    };


    function parseTSV(content){
        return content.split("\n").map(function(row){
            return row.split("\t");
        });
    };

    function addPasteBinding(tableEl){
        $(tableEl).on("paste", function(e){
            var clipboardData = e.clipboardData ||
                window.clipboardData ||
                e.originalEvent.clipboardData;

            var content = clipboardData.getData("text/plain");

            var data = parseTSV(content);

            setValue(tableEl, data);
        });
    };

    var shift = false;

    function addInputBindings(inputEl) {
        inputEl.on("blur", function(){
            $(this).closest(".matrix-input").trigger("change");
            $(this).parent().html($(this).val());
            console.log("blur");
        });

        inputEl.on("keyup", function(e){
            if (e.keyCode == 16){
                shift = false;
            }
        });

        inputEl.on("keydown", function(e){
            if (e.keyCode == 16){
                shift = true;
            }

            if (e.keyCode != 13 && e.keyCode != 9) {
                return;
            }

            if (shift == true){
                e.keyCode = - e.keyCode;
            }

            var tableEl = $(this).closest("table");
            var currentRow = $(this).closest("tr").index();
            var currentCol = $(this).closest("td").index();

            if (e.keyCode == 13){
                var nextRow = $("tr", tableEl).eq(currentRow + 1);
                var nextCell = $("td", nextRow).eq(currentCol);
            }

            if (e.keyCode == 9){
                var nextRow = $("tr", tableEl).eq(currentRow);
                var nextCell = $("td", nextRow).eq(currentCol + 1);
            }

            if (e.keyCode == -13){
                if (currentRow > 0){
                    var nextRow = $("tr", tableEl).eq(currentRow - 1);
                    var nextCell = $("td", nextRow).eq(currentCol);
                } else {
                    var nextCell = [];

                }
            }

            if (e.keyCode == -9){
                var nextRow = $("tr", tableEl).eq(currentRow);

                if (currentCol > 0){
                    var nextCell = $("td", nextRow).eq(currentCol - 1);
                } else {
                    var nextCell = [];
                }
            }

            if (nextCell.length > 0){
                $(nextCell).click();
                $(this).blur();
            }
            e.preventDefault();
        });
    };

    function addBindings(tableEl) {
        $("td", tableEl).click(function(e){
            var inputEl = createInput($(this).text());
            addInputBindings(inputEl);

            $(this).html("");
            $(this).append(inputEl);

            inputEl.focus();
        });
    };

    function getValue(tableEl) {
        var tableArray = [];

        $("tr", tableEl).each(function(){
            var cells = $("td", $(this));

            if (cells.length == 0) return null;

            var rowArray = [];

            cells.each(function(){
                rowArray.push($(this).html());
            });

            tableArray.push(rowArray);
        });

        return tableArray;
    };

    function setValue(tableEl, value) {
        $("input", tableEl).blur();

        for (var i = 0; i < value.length; i ++){
            var row = value[i];
            var rowEl = $("tr", tableEl).eq(i);

            for (var j = 0; j < row.length; j ++){
                $("td", rowEl).eq(j).html(row[j]);
            }
        }
    };

    $.fn.matrix = function(options){
        this.html("");
        this.append(createTable(options.rows, options.cols));
        addBindings(this);

        options.paste = true;

        if (options.paste){
            addPasteBinding(this);
        }
        return this;
    };

    $.fn.matrixVal = function(value){
        if (value === undefined){
            return getValue(this);
        }

        setValue(this, value);

        return this;
    };
}(jQuery));

/* bindings for shiny */
var matrixInputBinding = new Shiny.InputBinding();
$.extend(matrixInputBinding, {
    find: function(scope) {
        return $(scope).find(".matrix-input");
    },
    initialize: function(el){
        var rows = $(el).data("rows");
        var cols = $(el).data("cols");
        $(el).matrix({
            cols: cols,
            rows: rows
        });
    },
    getId: function(el) {
        return $(el).attr("id");
    },
    getValue: function(el) {
        console.log($(el).matrixVal());
        return $(el).matrixVal();
    },
    setValue: function(el, value) {
        $(el).matrixVal(value);
    },
    subscribe: function(el, callback) {
        $(el).on('change.matrixInputBinding', function(event) {
            console.log("change");
            setTimeout(function(){
                if ($("input", el).length == 0) {
                    callback(true);
                }
            }, 100);
        });
    },
    unsubscribe: function(el) {
        $(el).off('.matrixInputBinding');
    },
    getType: function(el) {
        if ($(el).data("type") == "numeric")
            return "shinyMatrix.matrixNumeric";
        else
            return "shinyMatrix.matrixCharacter";

    }
    // receiveMessage: function(el, data) {
    //   if (data.hasOwnProperty('value'))
    //     this.setValue(el, data.value);

    //   if (data.hasOwnProperty('label'))
    //     $(el).parent().find('label[for="' + $escape(el.id) + '"]').matrix(data.label);

    //   if (data.hasOwnProperty('placeholder'))
    //     el.placeholder = data.placeholder;

    //   $(el).trigger('change');
    // },
    // getState: function(el) {
    //   return {
    //     label: $(el).parent().find('label[for="' + $escape(el.id) + '"]').matrix(),
    //     value: el.value,
    //     placeholder: el.placeholder
    //   };
    // },
    // getRatePolicy: function() {
    //   return {
    //     policy: 'debounce',
    //     delay: 250
    //   };
    // }
});
Shiny.inputBindings.register(matrixInputBinding, 'shiny.matrixInput');

