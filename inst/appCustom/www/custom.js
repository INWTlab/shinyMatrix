var myapp = {
    createColHeader: function createColHeader(tableEl, value){
        var colHeader1 = $("<tr>");
        var colHeader2 = $("<tr>");

        colHeader1.addClass("matrix-input-col-header-1");
        colHeader2.addClass("matrix-input-col-header-2");
        for (var i = 0; i < value.data[0].length; i ++){
            var text = (isEmpty(value.colnames) ? "-" : value.colnames[i]);
            var split = (text !== undefined ? text.split("-") : ["", ""]);

            if (i % 2 == 0){
                var th1 = $("<th>");
                th1.addClass("matrix-input-col-header-cell");
                th1.attr("colspan", 2);
                th1.text(split[0]);
                colHeader1.append(th1);
            }

            var th2 = $("<th>");
            th2.addClass("matrix-input-col-header-cell");
            th2.text(split[1]);

            colHeader2.append(th2);
        }

        tableEl.prepend(colHeader2);
        tableEl.prepend(colHeader1);
    },
    updateColHeader: function updateColHeader(tableEl, value){
        var colHeader1 = $(".matrix-input-col-header-1", tableEl);
        var colHeader2 = $(".matrix-input-col-header-2", tableEl);

        var addHeader1 = false;
        var addHeader2 = false;

        if (colHeader1.length == 0){
            colHeader1 = $("<tr>");
            addHeader1 = true;
        }
        if (colHeader2.length == 0){
            colHeader2 = $("<tr>");
            addHeader2 = true;
        }

        colHeader1.addClass("matrix-input-col-header-1");
        colHeader2.addClass("matrix-input-col-header-2");

        for (var i = 0; i < value.data[0].length; i ++){
            var text = (isEmpty(value.colnames) ? "-" : value.colnames[i]);
            var split = (text !== undefined ? text.split("-") : ["", ""]);
            if (i % 2 == 1){
                var addCell = false;
                var th1 = $(".matrix-input-col-header-cell", colHeader1).eq(Math.floor(i / 2));

                if (th1.length == 0){
                    th1 = $("<th>");
                    addCell = true;
                }

                th1.addClass("matrix-input-col-header-cell");
                th1.attr("colspan", 2);
                th1.text(split[0]);

                if (addCell){
                    colHeader1.append(th1);
                }
            }

            var addCelll = false;

            var th2 = $(".matrix-input-col-header-cell", colHeader2).eq(i);

            if (th2.length == 0){
                var th2 = $("<th>");
                addCell = true;
            }

            th2.addClass("matrix-input-col-header-cell");
            th2.text(split[1]);

            if (addCell){
                colHeader2.append(th2);
            }
        }
        for (var i = colHeader1.children().length - 1; i >= Math.floor(value.data[0].length / 2); i --){
            $(".matrix-input-col-header-cell", colHeader1).eq(i).remove();
        }
        for (var i = colHeader2.children().length - 1; i >= value.data[0].length; i --){
            $(".matrix-input-col-header-cell", colHeader2).eq(i).remove();
        }

        if (addHeader2) tableEl.prepend(colHeader2);
        if (addHeader1) tableEl.prepend(colHeader1);
    },
    getColHeader: function getColHeader(tableEl){
        var colHeaderArray = [];

        var colHeader1 = $(".matrix-input-col-header-1");
        var colHeader2 = $(".matrix-input-col-header-2");

        for (var i = 0; i < $(".matrix-input-col-header-cell", colHeader2).length; i ++){
            var part1 = $(".matrix-input-col-header-cell", colHeader1).eq(Math.floor(i / 2)).text();
            var part2 = $(".matrix-input-col-header-cell", colHeader2).eq(i).text();

            if (part1.trim() != "" || part2.trim() != ""){
                colHeaderArray.push(part1 + "-" + part2);
            } else {
                colHeaderArray.push("");
            }

        }
        return colHeaderArray;
    }
};
