/* Vue */
Vue.component('matrix-input', {
    props: ["values", "rownames", "colnames", "rows", "cols", "cells", "pagination", "content_class", "multiheader"],
    data () {
      return {
        focus: {
          type: '', // cell, row, column
          i: null,
          j: null
        },
        current_page: 1,
        items_per_page: 10,
        i_need_to_move: false
      }
    },
    computed: {
      n_pages () {
        return Math.ceil(this.rownames.length / this.items_per_page)
      },
      first_index () {
        return this.pagination ? (this.current_page - 1) * this.items_per_page : 0;
      },
      last_index () {
        let i = this.pagination ? (this.current_page) * this.items_per_page : this.values.length;
        return i > this.values.length ? this.values.length : i;
      },
      indices () {
        let res = [];
        for (let i = this.first_index; i < this.last_index; i ++ ) {
          res.push(i)
        }

        return res;
      },
      col_header () {
        if (this.cols.multiheader) {
          let splitted = _.map(this.colnames, o => (o ? o.split("||") : [""]));
          return _.zip(...splitted);
        } else {
          return [this.colnames];
        }
      },
      pagination_indices () {
        let start = Math.max(1, this.current_page - 3);
        let end = Math.min(this.n_pages, start + 6);

        let res = [];
        for (let i = start; i <= end; i ++ ) {
          res.push(i)
        }

        return res;
      }
    },
    template: `
      <div>
        <table :class="{focused: focus.type !== ''}">
          <tr v-if="cols.names === true" v-for="(header, k) in col_header" :key="'header-' + k">
            <th v-if="rows.names === true"></th>
            <matrix-header-cell v-if="(!cols.multiheader | k > 0 | j % 2 == 0)" :span="(k == 0 && cols.multiheader ? 2 : 1)" v-for="(name, j) in header" :key="'colheader-' + k + '-' + j" :value="name" :i="j" :header="k" type="column" :focus="focus"
            :config="cols"/>
          </tr>
          <tr v-for="i in indices" :key="i">
            <matrix-header-cell :value="(rownames[i] || '')" :i="i" type="row" :focus="focus"
            :config="rows" header="0" v-if="rows.names === true"/>
            <matrix-cell v-for="(v, j) in values[i]" :key="j" :value="v" :i="i" :j="j" :focus="focus"
            :content_class="content_class" :config="cells"/>
          </tr>
        </table>
        <div class="pagination" v-if="pagination">
          <div class="pagination-item" @click="current_page = 1">
            First
          </div>
          <div v-if="pagination_indices[0] != 1" class="pagination-dots">
             ...
          </div>
          <div class="pagination-item" v-for="i in pagination_indices" :class="{active: (i == current_page)}" @click="current_page = i">
            {{ i }}
          </div>
          <div v-if="pagination_indices[pagination_indices.length - 1] != n_pages" class="pagination-dots">
             ...
          </div>
          <div class="pagination-item" @click="current_page = n_pages">
            Last
          </div>
        </div>
      </div>
    `,
    methods: {
      set_focus (value) {
        if (!value) {
          this.focus = {type: '', i: null, j: null}
          this.i_need_to_move = null
        }

        if (value.type == "row") {
          if (value.i < this.rownames.length && value.i >= 0 ) {
            this.focus = value;
            this.i_need_to_move = null
          }
          if (value.i >= this.rownames.length) {
            this.i_need_to_move = value;
          }
          return;
        }

        if (value.type == "column") {
          if (value.i < this.colnames.length && value.i >= 0 ) {
            this.focus = value;
            this.i_need_to_move = null
          }
          if (value.i >= this.colnames.length) {
            this.i_need_to_move = value;
          }
          return;
        }

        if (value.i < this.rownames.length &&
            value.j < this.colnames.length &&
            value.i >= 0 &&
            value.j >= 0) {
          this.focus = value;
          this.i_need_to_move = null
        }
        
        if (value.i >= this.rownames.length || value.j >= this.colnames.length) {
          this.i_need_to_move = value;
        }
      },
      clicked (e) {
        if(!this.$el.getElementsByTagName("table")[0].contains(e.target)) {
          this.focus = {type: '', i: null, j: null};
        }
      },
    },
    mounted () {
      document.addEventListener('click', this.clicked)
    },
    destroyed () {
      document.removeEventListener('click', this.clicked)
    },
    watch: {
      rownames() {
        if (this.i_need_to_move) {
          this.set_focus(this.i_need_to_move)
        }
      },
      colnames() {
        if (this.i_need_to_move) {
          this.set_focus(this.i_need_to_move)
        }
      }
    }
})

Vue.component('matrix-cell', {
    props: ["value", "i", "j", "focus", "config", "content_class"],
    data () {
       return {
           input_value: this.value
       }
    },
    computed: {
      in_focus () {
        return this.focus.type == 'cell' &&
          this.focus.i == this.i && 
          this.focus.j == this.j;
      }
    },
    template: `
    <td @mousedown="select" :class="{active: in_focus, editable: config.editableCells}">
      <input ref="input" v-if="in_focus" v-model="input_value" @blur="update"
      v-on:keydown.enter.exact="next_row"
      v-on:keydown.shift.enter="previous_row"
      v-on:keydown.tab.exact="next_column"
      v-on:keydown.shift.tab="previous_column"
      v-focus
      />
      <span v-else>{{ value }}</span>
    </td>
  `,
  methods: {
      update (e) {
        if (this.content_class == "numeric") {
          if (this.input_value === undefined) return;
          
          if (this.input_value.toString().trim() != "" && isNaN(parseFloat(this.input_value))) {
            this.input_value = this.value;
            alert("Input must be numeric!")
            return;
          }
        }
        this.$root.$emit('update_cell', {value: this.input_value, i: this.i, j: this.j})
      },
      select (e) {
        if (!this.config.editableCells) return;
        if (!this.in_focus) {
          this.blur()
          this.$parent.set_focus({type: 'cell', i: this.i, j: this.j})
          e.preventDefault();
        }
      },
      next_column (e) {
        this.blur()
        this.$parent.set_focus({type: 'cell', i: this.i, j: this.j + 1});
        e.preventDefault()
      },
      previous_column (e) {
        this.blur()
        this.$parent.set_focus({type: 'cell', i: this.i, j: this.j - 1})
        e.preventDefault()
      },
      next_row () {
        this.blur()
        this.$parent.set_focus({type: 'cell', i: this.i + 1, j: this.j})
      },
      previous_row () {
        this.blur()
        this.$parent.set_focus({type: 'cell', i: this.i - 1, j: this.j})
      },
      blur () {
        let inputs = this.$root.$el.getElementsByTagName("input");
        if (inputs.length > 0) inputs[0].blur();
      }
  },
  watch: {
    value (val) {
      this.input_value = val;
    }
  }
})

Vue.component('matrix-header-cell', {
  props: ["value", "i", "type", "focus", "config", "header", "span"],
  data () {
     return {
         input_value: this.value
     }
  },
  computed: {
    in_focus () {
      return this.focus.type == this.type &&
        this.focus.i == this.i
      }
  },
  template: `
  <th @mousedown="select" :class="{active: in_focus, editable: config.editableNames}"
  :colspan="span">
    <input ref="input" v-if="in_focus" v-model="input_value" @blur="update"
    v-on:keydown.enter.exact="next_row"
    v-on:keydown.shift.enter="previous_row"
    v-on:keydown.tab.exact="next_column"
    v-on:keydown.shift.tab="previous_column"
    v-focus
    />
    <span v-else>{{ value }}</span>
    <span class="delete-button" v-if="config.delete && header == 0" @mousedown="delete_all">
      [x]
    </span>
  </th>
  `,
  methods: {
      update () {
          this.$root.$emit('update_name', {value: this.input_value, i: this.i, type: this.type, header: this.header})
      },
      select (e) {
        if (!this.config.editableNames) return;
        if (this.header > 0) return;

        if (!this.in_focus) {
          this.blur()
          this.$parent.set_focus({type: this.type, i: this.i})
          e.preventDefault();
        }
      },
      delete_all (e) {
        if (this.config.multiheader && this.type == 'column') {
          let first = this.i - this.i % 2;
          let second = first + 1;

          this.$root.$emit('delete_all', {i: second, type: this.type, name: this.value});
          this.$root.$emit('delete_all', {i: first, type: this.type, name: this.value});

        } else {
          this.$root.$emit('delete_all', {i: this.i, type: this.type, name: this.value});
        }
        e.stopPropagation();
      },
      focus_element (e) {
        if (this.$refs.input) this.$refs.input.focus();
      },
      next_column (e) {
        if (this.type == "column") {
          this.blur()
          this.$parent.set_focus({type: 'column', i: this.i + 1});
        }
        e.preventDefault()
      },
      previous_column (e) {
        if (this.type == "column") {
          this.blur()
          this.$parent.set_focus({type: 'column', i: this.i - 1})
        }
        e.preventDefault()
      },
      next_row () {
        if (this.type == "row") {
          this.blur()
          this.$parent.set_focus({type: 'row', i: this.i + 1})
        }
      },
      previous_row () {
        if (this.type == "row") {
          this.blur()
          this.$parent.set_focus({type: 'row', i: this.i - 1,})
        }
      },
      blur () {
        let inputs = this.$root.$el.getElementsByTagName("input");
        if (inputs.length > 0) inputs[0].blur();
      }
  },
  watch: {
    value (val) {
      this.input_value = val;
    }
  }
})

Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  },
})

/* Helper */
function sanitizeValue(value){
  var nrow,
      ncols,
      ncol,
      i,
      j;

  if (value.rownames == null) value.rownames = [];
  if (value.colnames == null) value.colnames = [];

  if (typeof value.rownames === 'string') value.rownames = [value.rownames];
  if (typeof value.colnames === 'string') value.colnames = [value.colnames];

  nrow = Math.max(value.data.length, value.rownames.length);

  ncols = value.data.map(function(el){ return el !== undefined ? el.length : 0; });
  ncol = Math.max(Math.max.apply(null, ncols), value.colnames.length);

  if (ncol == 0 && nrow == 0) value.data = [];

  if (nrow == 0){
      value.rownames = [];

      value.data = [];
  }

  if (ncol == 0){
      value.colnames = [];

      for (i = 0; i < nrow; i ++){
          value.data[i] = [];
      }
  }

  for (i = 0; i < nrow; i ++){
      if (value.data[i] === undefined) value.data[i] = [];
      if (value.rownames[i] === undefined) value.rownames[i] = "";
      for (j = 0; j < ncol; j ++){
          if (value.data[i][j] === undefined) value.data[i][j] = "";
      }
  }

  for (j = 0; j < ncol; j ++){
      if (value.colnames[j] === undefined) value.colnames[j] = "";
  }
}

/* Shiny Bindings */

var matrixInput = new Shiny.InputBinding();
var vms = {};

$.extend(matrixInput, {
  initialize: function(el) {
     let values = $(el).data("values");

     vms[el.id] = new Vue({
        el: $(".vue-element", $(el))[0],
        data: {
            values: values,
            rownames: $(el).data("rownames"),
            colnames: $(el).data("colnames"),
            rows: $(el).data("rows"),
            cols: $(el).data("cols"),
            cells: $(el).data("cells"),
            content_class: $(el).data("class")[0],
            pagination: $(el).data("pagination")
        },
        computed: {
            n_rows () {
              let last_rowname = _.findLastIndex(this.rownames, o => o && o != '') + 1;
              let last_row = _.findLastIndex(this.values, o => _.some(o, x => x && x != '')) + 1;
              return Math.max(last_rowname, last_row);
            },
            n_cols () {
              let last_colname = _.findLastIndex(this.colnames, o => o && o != '') + 1;
              let last_col = _.max(_.map(this.values, o => _.findLastIndex(o, x => x && x != ''))) + 1;
              return Math.max(last_colname, last_col);
            },
            extended_rownames () {
              let rownames = _.cloneDeep(this.rownames);

              if (this.rows.extend) {
                while (rownames.length < this.n_rows + this.rows.delta + this.n_rows % this.rows.delta) {
                  rownames.push('');
                }
              }

              return rownames;
            },
            extended_colnames () {
              let colnames = _.cloneDeep(this.colnames);

              if (this.cols.extend) {
                while (colnames.length < this.n_cols + this.cols.delta + this.n_cols % this.cols.delta) {
                  colnames.push('');
                }
              }

              return colnames;
            },
            extended_values () {
              let values = _.cloneDeep(this.values);

              if (this.rows.extend) {
                while (values.length < this.extended_rownames.length) {
                  values.push(_.times(this.extended_colnames.length, _.constant('')));
                }
              }

              if (this.cols.extend) {
                for (let i = 0; i < this.values.length; i ++) {
                  let x = values[i] || [];

                  while (x.length < this.extended_colnames.length) {
                    x.push('');
                  }
                  values[i] = x;
                }
              }

              return values;
            }
        },
        template: `
          <matrix-input :values="extended_values" :rownames="extended_rownames" :colnames="extended_colnames"
          :rows="rows" :cols="cols" :cells="cells" :pagination="pagination" :content_class="content_class"
          />
        `
    })

    function notifyChange() {
      let lazy = $(el).data("lazy");

      if (lazy) {
        setTimeout(function() { 
          if (!$("table", $(el)).hasClass("focused")) {
            $(el).trigger("matrix-change")
          }
        }, 100)
      } else {
        $(el).trigger("matrix-change")
      }
    }

    vms[el.id].$on("update_cell", function(o) {
      if (!this.values[o.i]) this.values[o.i] = _.times(this.n_cols, _.constant(''));

      let row = this.values[o.i];
      row[o.j] = o.value;

      Vue.set(this.values, o.i, row);

      notifyChange()
    })


    vms[el.id].$on("update_name", function(o) {
      if (o.type == "row") {
        Vue.set(this.rownames, o.i, o.value);
      }

      if (o.type == "column") {
        let splitted = this.colnames[o.i] ? this.colnames[o.i].split('||') : [];
        splitted[o.header] = o.value;
        Vue.set(this.colnames, o.i, splitted.join('||'));
      }

      notifyChange()
    })

    vms[el.id].$on("delete_all", function(o) {
      if (o.type == "row") {
        if (this.n_rows == 1 && o.i == 0) {
          alert("You cannot delete the last row!");
          return;
        }
        Vue.delete(this.rownames, o.i);
        Vue.delete(this.values, o.i);
      }

      if (o.type == "column") {
        if ((this.n_cols == 1 && o.i == 0) | (this.n_cols == 2 && o.i < 2 && this.cols.multiheader)) {
          alert("You cannot delete the last column!");
          return;
        }

        Vue.delete(this.colnames, o.i);
        
        for (let i = 0; i < this.values.length; i ++) {
          let row = this.values[i];
          row.splice(o.i, 1);
          Vue.set(this.values, i, row);
        }
      }

      Shiny.setInputValue(el.id + 'delete', o);

      notifyChange()
    })
  },
  find: function(scope) {
    return $(scope).find(".vue-input");
  },
  getValue: function(el) {
    let raw = {
      data: _.cloneDeep(vms[el.id].$data.values),
      rownames: _.cloneDeep(vms[el.id].$data.rownames),
      colnames: _.cloneDeep(vms[el.id].$data.colnames)
    }

    sanitizeValue(raw)

    return raw;
  },
  getType: function(el) {
    if ($(el).data("class") == "numeric")
        return "shinyMatrix.matrixNumeric";
    else
        return "shinyMatrix.matrixCharacter";

  },
  receiveMessage: function(el, data) {
    if (data.hasOwnProperty('value')) {
      sanitizeValue(data.value);
      vms[el.id].$data.values = data.value.data;
      vms[el.id].$data.rownames = data.value.rownames;
      vms[el.id].$data.colnames = data.value.colnames;

      $(el).trigger('matrix-change');
    }
  },
  subscribe: function(el, callback) {
    $(el).on("matrix-change", function(e) {
      callback(true);
    });
  },
  unsubscribe: function(el) {
    $(el).off(".vue-input");
  }
});

Shiny.inputBindings.register(matrixInput);