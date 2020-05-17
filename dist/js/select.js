"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

window.$lastOpenedSelect = null;

var CustomSelect = /*#__PURE__*/function () {
  function CustomSelect($select, selectOptions, defaultVal, cb) {
    _classCallCheck(this, CustomSelect);

    this.$select = $select;
    this.$selectBody = $select.find('.custom-select__body');
    this.$selectHaeder = $select.find('.custom-select__header');
    this.selectOptions = selectOptions;
    this.defaultVal = defaultVal;
    this.cb = cb;
    this.init();
  }

  _createClass(CustomSelect, [{
    key: "init",
    value: function init() {
      var _this = this;

      $(document).mouseup(function (e) {
        if (window.$lastOpenedSelect == null) {
          return;
        } else {
          if (!window.$lastOpenedSelect.is(e.target) && window.$lastOpenedSelect.has(e.target).length === 0) {
            window.$lastOpenedSelect.removeClass('custom-select_opened');
            window.$lastOpenedSelect = null;
          }
        }
      });

      if (this.defaultVal) {
        this.$selectHaeder.find('button div').text(this.defaultVal);
      }

      var $bodyFragment = $(document.createDocumentFragment());
      this.selectOptions.forEach(function (item) {
        var $item = $("<span>".concat(item, "</span>"));
        $item.on('click', function () {
          var value = $item.text();

          _this.$selectHaeder.find('button div').text(value);

          _this.$select.removeClass('custom-select_opened');

          window.$lastOpenedSelect = null;

          if (_this.cb) {
            _this.cb(value);
          }
        });
        $bodyFragment.append($item);
      });
      this.$selectBody.append($bodyFragment);
      this.$selectHaeder.on('click', function () {
        if (_this.$select.hasClass('custom-select_opened')) {
          _this.$select.removeClass('custom-select_opened');

          window.$lastOpenedSelect = null;
        } else {
          _this.$select.addClass('custom-select_opened');

          window.$lastOpenedSelect = _this.$select;
        }
      });
    }
  }]);

  return CustomSelect;
}();