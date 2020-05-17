"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

$(function () {
  var callendarMonth = {
    0: "январь",
    1: "февраль",
    2: "март",
    3: "апрель",
    4: "май",
    5: "июнь",
    6: "июль",
    7: "август",
    8: "сентябрь",
    9: "ноябрь",
    10: "октябрь",
    11: "декабрь"
  };
  var allNews;
  var newsToShow;
  $('.js-append').empty(); //init main slider

  var $sliderCur = $('.slider-footer__indicator span').eq(0);
  var $sliderAll = $('.slider-footer__indicator span').eq(1);
  var $sliderText = $('.slider-footer__text-wrapper p');
  var $slider = $('.slider').on('init', function (e, slick) {
    $sliderAll.html(slick.$slides.length);
    var $sliderDots = $('.slider-footer__dots');
    var $fragment = $(document.createDocumentFragment());
    slick.$slides.each(function (idx, el) {
      var $dot;

      if (idx === 0) {
        $dot = $("<div class=\"slider-footer__dot slider-footer__dot_active\"></div>");
      } else {
        $dot = $("<div class=\"slider-footer__dot\"></div>");
      }

      $fragment.append($dot);
    });
    $sliderDots.append($fragment);
  }).slick({
    prevArrow: $('.slider-prev'),
    nextArrow: $('.slider-next')
  }).on('beforeChange', function (e, slick, currentSlide, nextSlide) {
    $sliderCur.html(nextSlide + 1);
    var $sliderDots = $('.slider-footer__dot');
    $sliderDots.removeClass('slider-footer__dot_active');
    $sliderDots.eq(nextSlide).addClass('slider-footer__dot_active');
    $sliderText.removeClass('visible');
    setTimeout(function () {
      $sliderText.eq(nextSlide).addClass('visible');
    }, 150);
  });
  var $togglePart = $('.toggle-appartaments__part').on('click', function (e) {
    if ($(e.target).hasClass('toggle-appartaments__content-cross')) {
      return;
    }

    var that = this;
    $togglePart.removeClass('toggle-appartaments__part_short').removeClass('toggle-appartaments__part_long');
    $togglePart.each(function (idx, el) {
      if (el == that) {
        $(el).addClass('toggle-appartaments__part_long');
        $(el).find('.toggle-appartaments__left').removeClass('visible');
        $(el).find('.toggle-appartaments__bottom').removeClass('visible');
        $(el).find('.toggle-appartaments__content').addClass('visible');
      } else {
        $(el).addClass('toggle-appartaments__part_short');
        $(el).find('.toggle-appartaments__left').addClass('visible');
        $(el).find('.toggle-appartaments__bottom').removeClass('visible');
        $(el).find('.toggle-appartaments__content').removeClass('visible');
      }
    });
  });
  var $closeTogglePart = $('.toggle-appartaments__content-cross').on('click', function () {
    $togglePart.removeClass('toggle-appartaments__part_short').removeClass('toggle-appartaments__part_long');
    $('.toggle-appartaments__bottom').addClass('visible');
    $('.toggle-appartaments__content').removeClass('visible');
    $('.toggle-appartaments__left').removeClass('visible');
  });
  var lastYOffset = 0;

  if (window.innerWidth < 768) {
    $togglePart.off();
    $closeTogglePart.off();
    $('.toggle-appartaments').slick({
      arrows: false,
      dots: true
    });
  }

  $(window).on('scroll', function (e) {
    if (window.pageYOffset > lastYOffset && window.pageYOffset > 50) {
      $('.header').addClass('header_hidden');
    } else {
      $('.header').removeClass('header_hidden');
    }

    lastYOffset = window.pageYOffset;
  });
  var elems = document.querySelector('.news__title');
  elems.addEventListener('click', function (e) {
    elems.dispatchEvent(new CustomEvent('changeSelect'));
  });
  elems.addEventListener('changeSelect', function (e) {
    console.log(e.target);
  }); // Api news 

  function genrateNews() {
    var _url = 'http://newsapi.org/v2/top-headlines?country=ru&apiKey=11af82f0856f49be8ee20b70edf51808';
    return fetch(_url).then(function (res) {
      return res.json();
    }).then(function (res) {
      return res.articles.map(function (item) {
        var newDate = new Date(2013 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12));
        return {
          title: item.title,
          description: item.description,
          img: item.urlToImage,
          date: newDate
        };
      });
    });
  }

  genrateNews().then(function (data) {
    var years = [];
    var month = [];
    data.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    data.map(function (item) {
      if (years.includes(item.date.getFullYear())) {
        return;
      } else {
        years.push(item.date.getFullYear());
      }

      if (month.includes(callendarMonth[item.date.getMonth()])) {
        return;
      } else {
        var monthNum = item.date.getMonth();
        month.push(callendarMonth[monthNum]);
      }
    });
    new CustomSelect($('.select-years'), years, years[0], function (val) {
      return filterNewsByYear(val);
    });
    new CustomSelect($('.select-month'), month, null, function (val) {
      return filterNewsByMonth(val);
    });
    allNews = data;
    newsToShow = _toConsumableArray(allNews);
  }).then(function () {
    pasteNews(newsToShow);
  });

  function createNewsCard(data) {
    var dateNews = data.date;
    var title = data.title;
    var desc = data.description;
    var img = data.img;
    return $("\n      <div class=\"col-md-4 col-sm-6 news__card\">\n      <div class=\"card\">\n          <div class=\"card__img\">\n            <img src=".concat(img, ">\n          </div>\n          <h3 class=\"card__title\">").concat(title, "</h3>\n          <p class=\"card__text\">").concat(desc, "</p>\n          <p class=\"card__date\">").concat(dateNews.toLocaleString('ru'), "</p>\n        </div>\n      </div>\n    "));
  }

  function pasteNews(arr) {
    $('.news__show-more').css('display', 'flex');

    if (arr.length === 0) {
      return;
    }

    var $newsFragment = $(document.createDocumentFragment());
    var i = 0;

    for (i; i < 9; i++) {
      if (arr.length === 0) {
        $('.news__show-more').css('display', 'none');
        break;
      }

      var $news = createNewsCard(arr.shift(i));
      $newsFragment.append($news);
    }

    $('.js-append').append($newsFragment);
  }

  $('.news__show-more').on('click', function () {
    pasteNews(newsToShow);
  });

  function filterNewsByYear(year) {
    $('.js-append').empty();
    newsToShow = allNews.filter(function (item) {
      return item.date.getFullYear() == year;
    });
    pasteNews(newsToShow);
  }

  function filterNewsByMonth(findMonth) {
    var numMonth;

    for (var key in callendarMonth) {
      if (callendarMonth[key] === findMonth) {
        numMonth = key;
        break;
      }
    }

    $('.js-append').empty();
    newsToShow = allNews.filter(function (item) {
      return item.date.getMonth() == numMonth;
    });
    pasteNews(newsToShow);
  }

  $('.js-to-info').on('click', function () {
    $('html, body').animate({
      scrollTop: $(".about__slider").offset().top
    }, 1000);
  });
  $('.js-to-news').on('click', function () {
    $('html, body').animate({
      scrollTop: $(".news").offset().top
    }, 1000);
  });
});