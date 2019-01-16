// helper function
function isEmpty(obj) {
    if (obj == null) return true;

    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};



(function (window, $) {
    // public functions
    window.shinyMatrix = {};

    function createTable(nrow, ncol, data) {
        var table = $("<table>");
        table.addClass("table table-bordered matrix-input-table");

        for (var i = 0; i < nrow; i++){
            var tr = $("<tr>");
            tr.addClass("matrix-input-row");

            for (var j = 0; j < ncol; j ++){
                var td = $("<td>");
                td.addClass("matrix-input-cell");
                td.text(data[i][j]);
                tr.append(td);
            }
            table.append(tr);
        }

        return table;
    };

    function updateTable(table, nrow, ncol, data) {
        for (var i = 0; i < nrow; i++){
            var tr = $(".matrix-input-row", table).eq(i);
            var addRow = false;

            if (tr.length == 0){
                tr = $("<tr>");
                addRow = true;
            }

            tr.addClass("matrix-input-row");

            for (var j = 0; j < ncol; j ++){
                var td = $(".matrix-input-cell", tr).eq(j);
                var addCol = false;

                if (td.length == 0){
                    td = $("<td>");
                    addCol = true;
                }

                td.addClass("matrix-input-cell");
                td.text(data[i][j]);

                if (addCol) tr.append(td);
            }

            // remove additional cols
            for (var j = $(".matrix-input-cell", tr).length - 1; j >= ncol; j --){
                $(".matrix-input-cell", tr).eq(j).remove();
            }

            if (addRow) table.append(tr);
        }

        // remove rows (incl. header)
        for (var i = $(".matrix-input-row", table).length - 1; i >= nrow; i --){
            $(".matrix-input-row", table).eq(i).remove();
        }
    };

    function newColName(n) {
        var i = n % 26;
        var letter = String.fromCharCode(65 + i);

        var r = Math.floor(n / 26);
        if (r > 0) {
            return newColName(r - 1) + letter;
        } else {
            return letter;
        }
    };

    window.shinyMatrix.createColHeader = function createColHeader(tableEl, value){
        var colHeader = $("<tr>");
        colHeader.addClass("matrix-input-col-header");

        for (var i = 0; i < value.data[0].length; i ++){
            var text = (isEmpty(value.colnames) ? newColName(i) : value.colnames[i]);
            var th = $("<th>");
            th.text(text);
            th.addClass("matrix-input-col-header-cell");

            colHeader.append(th);
        }

        tableEl.prepend(colHeader);
    };

    window.shinyMatrix.updateColHeader = function updateColHeader(tableEl, value){
        var colHeader = $(".matrix-input-col-header", tableEl);
        var addHeader = false;

        if (colHeader.length == 0){
            colHeader = $("<tr>");
            addHeader = true;
        }

        colHeader.addClass("matrix-input-col-header");

        for (var i = 0; i < value.data[0].length; i ++){
            var text = (isEmpty(value.colnames) ? newColName(i) : value.colnames[i]);
            var th = $(".matrix-input-col-header-cell", colHeader).eq(i);
            var addCell = false;

            if (th.length == 0){
                th = $("<th>");
                addCell = true;
            }

            th.text(text);
            th.addClass("matrix-input-col-header-cell");

            if (addCell) colHeader.append(th);
        }
        for (var i = colHeader.children().length - 1; i >= value.data[0].length; i --){
            $(".matrix-input-col-header-cell", colHeader).eq(i).remove();
        }

        if (addHeader) tableEl.prepend(colHeader);
    };

    window.shinyMatrix.getColHeader = function getColHeader(tableEl){
        var colHeaderArray = [];
        $(".matrix-input-col-header-cell", tableEl).each(function(){
            colHeaderArray.push($(this).html());
        });
        return colHeaderArray;
    };


    window.shinyMatrix.createRowHeader = function createRowHeader(tableEl, value){
        $("tr", tableEl).prepend($("<th>"));

        var contentRows = $("tr", tableEl).find("td.matrix-input-cell:first").parent();

        for (var i = 0; i < value.data.length; i ++) {
            var text = (isEmpty(value.rownames) ? (i + 1) : value.rownames[i]);

            var th = contentRows.eq(i).children().eq(0);
            th.text(text);
            th.addClass("matrix-input-row-header-cell");
        }
    };

    window.shinyMatrix.updateRowHeader = function updateRowHeader(tableEl, value){
        // $("tr", tableEl).prepend($("<th>"));

        var contentRows = $("tr", tableEl).find("td.matrix-input-cell:first").parent();

        for (var i = 0; i < value.data.length; i ++) {
            var text = (isEmpty(value.rownames) ? (i + 1) : value.rownames[i]);

            var row = contentRows.eq(i);

            var th = contentRows.eq(i).children().eq(0);
            if (!th.is("th")){
                th = $("<th>");
                row.prepend(th);
            }

            th.text(text);
            th.addClass("matrix-input-row-header-cell");
        }
    };

    window.shinyMatrix.getRowHeader = function getRowHeader(tableEl){
        var rowHeaderArray = [];
        $(".matrix-input-row-header-cell", tableEl).each(function(){
            rowHeaderArray.push($(this).html());
        });
        return rowHeaderArray;
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
            $("td", tableEl).removeClass("matrix-input-cell-selected");
            $("td", tableEl).each(function(){
                $(this).removeClass("matrix-input-cell-pasted");
                void this.offsetWidth;
            });
            $("input", tableEl).blur();

            var clipboardData = e.clipboardData ||
                window.clipboardData ||
                e.originalEvent.clipboardData;

            var content = clipboardData.getData("text/plain");

            var data = parseTSV(content);

            for (var i = 0; i < data.length; i++){
                var tr = $(".matrix-input-row", tableEl).eq(i);

                for (var j = 0; j < data[0].length; j ++){
                    var td = $(".matrix-input-cell", tr).eq(j);
                    td.text(data[i][j]);
                    td.addClass("matrix-input-cell-pasted");
                }
            }

            extendTable($(tableEl).closest(".matrix-input"));
        });
    };

    var shift = false;

    function addInputBindings(inputEl) {
        inputEl.on("blur", function(){
            var el = $(this).closest(".matrix-input");

            $(this).closest(".matrix-input").trigger("change");
            $(this).parent().html($(this).val());

            extendTable(el);
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

            var cell = $(this).closest("td");
            var tableEl = $(this).closest("table");

            var currentRow = $(this).closest("tr").index("tr.matrix-input-row");
            var currentCol = $("td.matrix-input-cell", cell.parent()).index(cell);

            if (e.keyCode == 13){
                var nextRow = $("tr.matrix-input-row", tableEl).eq(currentRow + 1);
                var nextCell = $("td.matrix-input-cell", nextRow).eq(currentCol);
            }

            if (e.keyCode == 9){
                var nextRow = $("tr.matrix-input-row", tableEl).eq(currentRow);
                var nextCell = $("td.matrix-input-cell", nextRow).eq(currentCol + 1);
            }

            if (e.keyCode == -13){
                if (currentRow > 0){
                    var nextRow = $("tr.matrix-input-row", tableEl).eq(currentRow - 1);
                    var nextCell = $("td.matrix-input-cell", nextRow).eq(currentCol);
                } else {
                    var nextCell = [];

                }
            }

            if (e.keyCode == -9){
                var nextRow = $("tr.matrix-input-row", tableEl).eq(currentRow);

                if (currentCol > 0){
                    var nextCell = $("td.matrix-input-cell", nextRow).eq(currentCol - 1);
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

    function addBindings(el) {
        var options = $(el).data("options");

        $("td.matrix-input-cell").off("click");

        $("td.matrix-input-cell", el).click(function(e){
            var inputEl = createInput($(this).text());
            inputEl.select();
            addInputBindings(inputEl);

            $(this).html("");
            $(this).append(inputEl);

            inputEl.focus();
        });

        if (options.copy){
            addCopyBinding(el);
        }

        if (options.paste){
            addPasteBinding(el);
        }

        if (options.rows.editableNames){
            addHeaderBinding(el, ".matrix-input-row-header-cell");
        }

        if (options.cols.editableNames){
            addHeaderBinding(el, ".matrix-input-col-header-cell");
        }
    };

    function addHeaderBinding(tableEl, selector) {
        $(selector).off("dblclick");

        $(selector, tableEl).dblclick(function(e){
            var inputEl = createInput($(this).text());
            inputEl.select();
            addHeaderInputBindings(inputEl);

            $(this).html("");
            $(this).append(inputEl);

            inputEl.focus();
        });
    };

    function addHeaderInputBindings(inputEl) {
        inputEl.on("blur", function(){
            var el = $(inputEl).closest(".matrix-input");

            $(this).closest(".matrix-input").trigger("change");
            $(this).parent().html($(this).val());

            extendTable(el);
        });

        inputEl.on("keydown", function(e){
            if (e.keyCode == 13){
                $(this).blur();
                e.preventDefault();
            }
        });
    };

    var selectStart = null;

    function addCopyBinding(el){
        $("td.matrix-input-cell", el).on("mousedown", function(e){
            var cell = $(this);
            var row = cell.parent();
            selectStart = {
                col: $(".matrix-input-cell", row).index(cell),
                row: $(".matrix-input-row", row.parent()).index(row)
            };

            $(".matrix-input-cell", el).removeClass("matrix-input-cell-selected");

            e.preventDefault();
        });

        $("td.matrix-input-cell", el).on("mousemove", function(){
            if (selectStart == null) return;

            var cell = $(this);
            var row = cell.parent();
            selectEnd = {
                col: $(".matrix-input-cell", row).index(cell),
                row: $(".matrix-input-row", row.parent()).index(row)
            };

            colmin = Math.min(selectStart.col, selectEnd.col);
            colmax = Math.max(selectStart.col, selectEnd.col);
            rowmin = Math.min(selectStart.row, selectEnd.row);
            rowmax = Math.max(selectStart.row, selectEnd.row);

            $(".matrix-input-cell", cell.closest("table")).each(function(){
                var cell = $(this);
                var row = cell.parent();
                var j = $(".matrix-input-cell", row).index(cell);
                var i = $(".matrix-input-row", row.parent()).index(row);

                if (rowmin <= i && i <= rowmax && colmin <= j && j <= colmax){
                    cell.addClass("matrix-input-cell-selected");
                } else {
                    cell.removeClass("matrix-input-cell-selected");
                }
            });
        });

        $(document).on("mouseup", function(){
            selectStart = null;
        });

        $(document).on("copy", function(e){
            if ($("td.matrix-input-cell-selected", el).length == 0) return;

            $("input", el).blur();

            var clipboardData = e.clipboardData ||
                window.clipboardData ||
                e.originalEvent.clipboardData;

            var tableArray = [];

            $("tr.matrix-input-row", el).each(function(){
                var cells = $("td.matrix-input-cell-selected", $(this));

                if (cells.length == 0) return null;

                var rowArray = [];

                cells.each(function(){rowArray.push($(this).html())});

                tableArray.push(rowArray.join("\t"));
            });

            var content = tableArray.join("\n");

            clipboardData.setData('text/plain', content);
            e.preventDefault();
        })

    }

    function getValue(el) {
        var options = $(el).data("options");

        var tableArray = [];

        $("tr", el).each(function(){
            var cells = $("td.matrix-input-cell", $(this));

            if (cells.length == 0) return null;

            var rowArray = [];

            cells.each(function(){
                var text = $("input", this).length > 0 ? $("input", this).val() : $(this).html();
                rowArray.push(text);
            });

            tableArray.push(rowArray);
        });

        var result = {data: tableArray};

        if(options.cols.names){
            result.colnames = executeFunctionByName(options.cols.getHeader, window, $(".matrix-input-table", el));
        }

        if(options.rows.names){
            result.rownames = executeFunctionByName(options.rows.getHeader, window, $(".matrix-input-table", el));
        }

        return result;
    };

    function setValue(el, value) {
        $("input", el).blur();

        var options = $(el).data("options");

        options.value.data = value.data;
        options.value.colnames = value.colnames;
        options.value.rownames = value.rownames;
        options.rows.n = value.data.length;
        options.cols.n = value.data[0].length;

        $(el).data("options", options);

        updateTable($(".matrix-input-table", el),
                    options.rows.n, options.cols.n, options.value.data);

        if (options.cols.names){
            executeFunctionByName(options.cols.updateHeader, window, $(".matrix-input-table", el), options.value);
        }
        if (options.rows.names){
            executeFunctionByName(options.rows.updateHeader, window, $(".matrix-input-table", el), options.value);
        }

        addBindings(el);
    };

    function emptyRows(data, rownames){
        var empty = [];

        for (var i = 0; i < data.length; i ++){
            if (data[i].join("").trim() == "" &&
                (rownames == undefined || rownames[i].trim() == "")){
                empty.push(true);
            } else {
                empty.push(false);
            }
        }

        return empty;
    }

    function emptyCols(data, colnames){
        var empty = [];

        for (var j = 0; j < data[0].length; j ++){
            var col = [];

            for (var i = 0; i < data.length; i ++){
                col.push(data[i][j]);
            }
            var last = col.join("").trim();

            if (last == "" &&
                (colnames == undefined || colnames[j].trim() == "")){
                empty.push(true);
            } else {
                empty.push(false);
            }
        }

        return empty;
    }

    function endTrue (vec, delta){
        var allTrue = true;

        var n = vec.length;
        var start = n - n % delta - 1 - delta; // look at 2 deltas at the end
        for (var i = start; i < n; i++){
            if (!vec[i]) allTrue = false;
        }

        return allTrue;
    }

    function popRows(value, delta){
        var newval = $.extend({}, value);
        var n = newval.data.length;
        var end = n - n % delta - delta;

        newval.data = newval.data.slice(0, end);
        newval.rownames = newval.rownames.slice(0, end);

        return newval;
    }

    function popCols(value, delta){
        var newval = $.extend({}, value);

        var n = newval.data[0].length;
        var end = n - n % delta - delta;

        for (var i = 0; i < newval.data.length; i++){
            newval.data[i] = newval.data[i].slice(0, end);
        }
        newval.colnames = newval.colnames.slice(0, end);

        return newval;
    }


    function extendTable(el){
        var options = $(el).data("options");
        var updated = false;

        var value = getValue(el);

        var nrow = value.data.length;
        var ncol = value.data[0].length;

        if (options.rows.extend){
            var delta = options.rows.delta;

            var empty = emptyRows(value.data, value.rownames);
            var emptyEnd = endTrue(empty, delta);

            while (emptyEnd){
                updated = true;
                value = popRows(value, delta);

                empty = emptyRows(value.data, value.rownames);
                emptyEnd = endTrue(empty, delta);
            }

            if (!empty[empty.length - 1]){
                updated = true;
                for (var i = nrow; i < nrow + delta - nrow % delta; i++){
                    value.data[i] = [];
                    for (var j = 0; j < ncol; j ++){
                        value.data[i][j] = "";
                    }
                }
            }
        }
        if (options.cols.extend){
            var delta = options.cols.delta;

            var empty = emptyCols(value.data, value.colnames);
            var emptyEnd = endTrue(empty, delta);

            while (emptyEnd){
                updated = true;
                value = popCols(value, delta);

                empty = emptyCols(value.data, value.colnames);
                emptyEnd = endTrue(empty, delta);
            }

            if (!empty[empty.length - 1]){
                updated = true;
                for (var j = ncol; j < ncol + delta - ncol % delta; j++){
                    for (var i = 0; i < nrow; i ++){
                        value.data[i][j] = "";
                    }
                };
            }
        }

        if (updated) setValue(el, value);
    }

    function setDefault(options, fallback){
        if (typeof fallback == "object"){
            for (var key in fallback){
                options[key] = setDefault(options[key], fallback[key]);
            }
            return options;
        }

        return (options === undefined) ? fallback : options;
    };

    function executeFunctionByName(functionName, context /*, args */) {
        var args = Array.prototype.slice.call(arguments, 2);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
    };

    $.fn.matrix = function(options){
        // set default options
        options.rows = setDefault(options.rows, {
            n: options.value.data.length,
            names: false,
            editableNames: false,
            extend: false,
            delta: 1,
            createHeader: "shinyMatrix.createRowHeader",
            updateHeader: "shinyMatrix.updateRowHeader",
            getHeader: "shinyMatrix.getRowHeader"
        });

        options.cols = setDefault(options.cols, {
            n: options.value.data[0].length,
            names: false,
            editableNames: false,
            extend: false,
            delta: 1,
            createHeader: "shinyMatrix.createColHeader",
            updateHeader: "shinyMatrix.updateColHeader",
            getHeader: "shinyMatrix.getColHeader"
        });

        options.copy = setDefault(options.copy, false);
        options.paste = setDefault(options.paste, false);

        this.data("options", options);

        this.html("");

        var table = createTable(options.rows.n, options.cols.n, options.value.data);

        if (options.cols.names){
            executeFunctionByName(options.cols.createHeader, window, table, options.value);
        }
        if (options.rows.names){
            executeFunctionByName(options.rows.createHeader, window, table, options.value);
        }


        this.append(table);

        extendTable(this);

        addBindings(this);

        return this;
    };

    $.fn.matrixVal = function(value){
        if (value === undefined){
            return getValue(this);
        }

        setValue(this, value);

        return this;
    };
}(window, jQuery));

/* bindings for shiny */
var matrixInputBinding = new Shiny.InputBinding();
$.extend(matrixInputBinding, {
    find: function(scope) {
        return $(scope).find(".matrix-input");
    },
    initialize: function(el){
        $(el).matrix({
            cols: $(el).data("cols"),
            rows: $(el).data("rows"),
            value: {
                data: $(el).data("data"),
                rownames: $(el).data("rownames"),
                colnames: $(el).data("colnames")
            },
            copy: $(el).data("copy"),
            paste: $(el).data("paste")
        });
    },
    getId: function(el) {
        return $(el).attr("id");
    },
    getValue: function(el) {
        return $(el).matrixVal();
    },
    setValue: function(el, value) {
        $(el).matrixVal(value);
    },
    subscribe: function(el, callback) {
        $(el).on('change.matrixInputBinding', function(event) {
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
        if ($(el).data("class") == "numeric")
            return "shinyMatrix.matrixNumeric";
        else
            return "shinyMatrix.matrixCharacter";

    },
    receiveMessage: function(el, data) {
       console.log(data);
       if (data.hasOwnProperty('value'))
         this.setValue(el, data.value);

       $(el).trigger('change');
    }
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

