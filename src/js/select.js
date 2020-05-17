window.$lastOpenedSelect = null;

class CustomSelect {
  constructor($select, selectOptions, defaultVal, cb) {
    this.$select = $select;
    this.$selectBody = $select.find('.custom-select__body');
    this.$selectHaeder = $select.find('.custom-select__header');
    this. selectOptions = selectOptions;
    this.defaultVal = defaultVal;
    this.cb = cb;

    this.init();
  }

  init() {
    $(document).mouseup((e) => {
      if (window.$lastOpenedSelect == null) {
        return;
      }
      else {
        if (
          !window.$lastOpenedSelect.is(e.target) &&
          window.$lastOpenedSelect.has(e.target).length === 0
        ) {
          window.$lastOpenedSelect.removeClass('custom-select_opened');
          window.$lastOpenedSelect = null;
        }

      } 
    });

    if (this.defaultVal) {
      this.$selectHaeder.find('button div').text(this.defaultVal);
    }

    let $bodyFragment = $(document.createDocumentFragment());

    this.selectOptions.forEach(item => {
      let $item = $(`<span>${item}</span>`);
      $item.on('click', () => {
        let value = $item.text();
        this.$selectHaeder.find('button div').text(value);
        this.$select.removeClass('custom-select_opened');
        window.$lastOpenedSelect = null;

        if(this.cb) {
          this.cb(value);
        }
      })
      $bodyFragment.append($item);
    });

    this.$selectBody.append($bodyFragment);

    this.$selectHaeder.on('click', () => {
      if (this.$select.hasClass('custom-select_opened')) {
        this.$select.removeClass('custom-select_opened');
        window.$lastOpenedSelect = null;
      } else {
        this.$select.addClass('custom-select_opened');
        window.$lastOpenedSelect = this.$select;
      }
    });

  }
}