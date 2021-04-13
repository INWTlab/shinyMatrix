/* Vue */
Vue.component('matrix-input', {
    props: ["values", "rownames", "colnames", "rows", "cols", "pagination", "content_class", "multiheader"],
    data () {
      return {
        focus: {
          type: '', // cell, row, column
          i: null,
          j: null
        },
        current_page: 1,
        items_per_page: 10
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
          let splitted = _.map(this.colnames, o => o.split("||"));
          console.log(_.zip(...splitted));
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
        <table>
          <tr v-for="(header, k) in col_header" :key="'header-' + k">
            <th></th>
            <matrix-header-cell v-if="(k > 0 | j % 2 == 1)" :span="(k == 0 ? 2 : 1)" v-for="(name, j) in header" :key="'colheader-' + k + '-' + j" :value="name" :i="j" :header="k" type="column" :focus="focus"
            :config="cols"/>
          </tr>
          <tr v-for="i in indices" :key="i">
            <matrix-header-cell :value="(rownames[i] || '')" :i="i" type="row" :focus="focus"
            :config="rows"/>
            <matrix-cell v-for="(v, j) in values[i]" :key="j" :value="v" :i="i" :j="j" :focus="focus"
            :content_class="content_class"/>
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
        }

        if (value.type == "row") {
          if (value.i < this.rownames.length && value.i >= 0 ) {
            this.focus = value;
          }
          return;
        }

        if (value.type == "column") {
          if (value.i < this.colnames.length && value.i >= 0 ) {
            this.focus = value;
          }
          return;
        }

        if (value.i < this.rownames.length &&
            value.j < this.colnames.length &&
            value.i >= 0 &&
            value.j >= 0) {
          this.focus = value;
        }
      },
      clicked (e) {
        if(!this.$el.contains(e.target)) {
          this.focus = {type: '', i: null, j: null};
        }
      }
    },
    mounted () {
      document.addEventListener('click', this.clicked)
    },
    destroyed () {
      document.removeEventListener('click', this.clicked)
    },
})

Vue.component('matrix-cell', {
    props: ["value", "i", "j", "focus", "content_class"],
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
    <td @mousedown="select" :class="{active: in_focus}">
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
          if (this.input_value.toString().trim() != "" && isNaN(parseFloat(this.input_value))) {
            this.input_value = this.value;
            alert("Input must be numeric!")
            return;
          }
        }
        this.$root.$emit('update_cell', {value: this.input_value, i: this.i, j: this.j})
      },
      select (e) {
        if (!this.in_focus) {
          this.$parent.set_focus({type: 'cell', i: this.i, j: this.j})
          e.preventDefault();
        }
      },
      next_column (e) {
        this.$parent.set_focus({type: 'cell', i: this.i, j: this.j + 1});
        e.preventDefault()
      },
      previous_column (e) {
        this.$parent.set_focus({type: 'cell', i: this.i, j: this.j - 1})
        e.preventDefault()
      },
      next_row () {
        this.$parent.set_focus({type: 'cell', i: this.i + 1, j: this.j})
      },
      previous_row () {
        this.$parent.set_focus({type: 'cell', i: this.i - 1, j: this.j})
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
      console.log(this.focus);
      console.log(this.header);
      return this.focus.type == this.type &&
        this.focus.i == this.i &&
        this.focus.header == this.header
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
    <span class="delete-button" v-if="config.delete && value != ''" @mousedown="delete_all">
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
          this.$parent.set_focus({type: this.type, i: this.i, header: this.header})
          e.preventDefault();
        }
      },
      delete_all (e) {
        this.$root.$emit('delete_all', {i: this.i, type: this.type})
        e.stopPropagation();
      },
      focus_element (e) {
        if (this.$refs.input) this.$refs.input.focus();
      },
      next_column (e) {
        if (this.type == "column") {
          this.$parent.set_focus({type: 'column', i: this.i + 1});
        }
        e.preventDefault()
      },
      previous_column (e) {
        if (this.type == "column") {
          this.$parent.set_focus({type: 'column', i: this.i - 1})
        }
        e.preventDefault()
      },
      next_row () {
        if (this.type == "row") {
          this.$parent.set_focus({type: 'row', i: this.i + 1})
        }
      },
      previous_row () {
        if (this.type == "row") {
          this.$parent.set_focus({type: 'row', i: this.i - 1,})
        }
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
  }
})

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
            }
        },
        watch: {
            values () {
                $(el).trigger("change");
            },
            n_rows: {
              immediate: true,
              handler () {
                if (this.rows.extend) {
                  while (this.rownames.length < this.n_rows + this.rows.delta + this.n_rows % this.rows.delta) {
                    this.rownames.push('');
                  }

                  while (this.values.length < this.n_rows + this.rows.delta + this.n_rows % this.rows.delta) {
                    this.values.push(_.times(this.colnames.length, _.constant('')));
                  }
                }
              }
            },
            n_cols: {
              immediate: true,
              handler () {
                if (this.cols.extend) {
                  while (this.colnames.length < this.n_cols + this.cols.delta + this.n_cols % this.cols.delta) {
                    this.colnames.push('');
                  }

                  for (let i = 0; i < this.values.length; i ++) {
                    let x = this.values[i];
                    while (x.length < this.n_cols + this.cols.delta + this.n_cols % this.cols.delta) {
                      x.push('');
                    }
                    Vue.set(this.values, i, x);
                  }
                }
              }
            }
        },
        template: `
          <matrix-input :values="values" :rownames="rownames" :colnames="colnames"
          :rows="rows" :cols="cols" :pagination="pagination" :content_class="content_class"
          />
        `
    })

    vms[el.id].$on("update_cell", function(o) {
      let row = this.values[o.i];
      row[o.j] = o.value;

      Vue.set(this.values, o.i, row);
    })


    vms[el.id].$on("update_name", function(o) {
      if (o.type == "row") {
        Vue.set(this.rownames, o.i, o.value);
      }

      if (o.type == "column") {
        let splitted = this.colnames[o.i].split('||');
        splitted[o.header] = o.value;
        Vue.set(this.colnames, o.i, splitted.join('||'));
      }
    })

    vms[el.id].$on("delete_all", function(o) {
      if (o.type == "row") {
        Vue.delete(this.rownames, o.i);
        Vue.delete(this.values, o.i);
      }

      if (o.type == "column") {
        Vue.delete(this.colnames, o.i);
        
        for (let i = 0; i < this.values.length; i ++) {
          let row = values[i];
          row.splice(o.i, 1);
          Vue.set(this.values, i, row);
        }
      }
    })
  },
  find: function(scope) {
    return $(scope).find(".vue-input");
  },
  getValue: function(el) {
    return {
      data: vms[el.id].$data.values,
      rownames: vms[el.id].$data.rownames,
      colnames: vms[el.id].$data.colnames
    }
  },
  getType: function(el) {
    if ($(el).data("class") == "numeric")
        return "shinyMatrix.matrixNumeric";
    else
        return "shinyMatrix.matrixCharacter";

  },
  subscribe: function(el, callback) {
    $(el).on("change", function(e) {
      callback(true);
    });
  },
  unsubscribe: function(el) {
    $(el).off(".vue-input");
  }
});

Shiny.inputBindings.register(matrixInput);