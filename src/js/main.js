$(function() {

  const callendarMonth = {
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
  }

  let allNews;
  let newsToShow;

  $('.js-append').empty();
  //init main slider
  const $sliderCur = $('.slider-footer__indicator span').eq(0);
  const $sliderAll = $('.slider-footer__indicator span').eq(1);
  const $sliderText = $('.slider-footer__text-wrapper p');
  const $slider = $('.slider')
    .on('init', (e, slick) => {
      $sliderAll.html(slick.$slides.length)
      let $sliderDots = $('.slider-footer__dots');
      let $fragment = $(document.createDocumentFragment());

      slick.$slides.each((idx, el) => {
        let $dot;

        if (idx === 0) {
          $dot = $(`<div class="slider-footer__dot slider-footer__dot_active"></div>`);
        } else {
          $dot = $(`<div class="slider-footer__dot"></div>`);
        }
        
        $fragment.append($dot);
      });

      $sliderDots.append($fragment);
    })
    .slick({
      prevArrow: $('.slider-prev'),
      nextArrow: $('.slider-next'),
    })
    .on('beforeChange', (e, slick, currentSlide, nextSlide) => {
      $sliderCur.html(nextSlide + 1);
      let $sliderDots = $('.slider-footer__dot');
      $sliderDots.removeClass('slider-footer__dot_active');
      $sliderDots.eq(nextSlide).addClass('slider-footer__dot_active');

      $sliderText.removeClass('visible');
      setTimeout(() => {
        $sliderText.eq(nextSlide).addClass('visible')
      }, 150)
    });

  const $togglePart = $('.toggle-appartaments__part')
    .on('click', function(e) {
      if($(e.target).hasClass('toggle-appartaments__content-cross')) {
        return;
      }

      const that = this;
      $togglePart
        .removeClass('toggle-appartaments__part_short')
        .removeClass('toggle-appartaments__part_long');
      $togglePart.each(function(idx, el) {
        if (el == that) {
          $(el).addClass('toggle-appartaments__part_long');
          $(el)
            .find('.toggle-appartaments__left')
            .removeClass('visible');
          $(el)
            .find('.toggle-appartaments__bottom')
            .removeClass('visible');
          $(el)
            .find('.toggle-appartaments__content')
            .addClass('visible');
        } else {
          $(el).addClass('toggle-appartaments__part_short');
          $(el)
            .find('.toggle-appartaments__left')
            .addClass('visible');
          $(el)
            .find('.toggle-appartaments__bottom')
            .removeClass('visible');
          $(el)
            .find('.toggle-appartaments__content')
            .removeClass('visible');
        }
      })
    })

  const $closeTogglePart = $('.toggle-appartaments__content-cross')
    .on('click', function() {
      $togglePart
        .removeClass('toggle-appartaments__part_short')
        .removeClass('toggle-appartaments__part_long');
      $('.toggle-appartaments__bottom').addClass('visible');
      $('.toggle-appartaments__content').removeClass('visible');
      $('.toggle-appartaments__left').removeClass('visible');
    });

  let lastYOffset = 0;

  if (window.innerWidth < 768) {
    $togglePart.off();
    $closeTogglePart.off();

    $('.toggle-appartaments').slick({
      arrows: false,
      dots: true
    })
  }

  $(window).on('scroll', function(e) {
    
    if (window.pageYOffset > lastYOffset && window.pageYOffset > 50) {
      $('.header').addClass('header_hidden');
    } else {
      $('.header').removeClass('header_hidden');
    }

    lastYOffset = window.pageYOffset;
  });

  let elems = document.querySelector('.news__title');
  elems.addEventListener('click', function(e) {
    elems.dispatchEvent(new CustomEvent('changeSelect'));
  })

  elems.addEventListener('changeSelect', function(e) {
    console.log(e.target);
  })

  // Api news 
  
  function genrateNews() {
    const _url = 'http://newsapi.org/v2/top-headlines?country=ru&apiKey=11af82f0856f49be8ee20b70edf51808';
    return fetch(_url)
      .then(res => res.json())
      .then(res => {
        return res.articles.map(item => {
          const newDate = new Date( 
            2013 + Math.floor(Math.random()*4),
            Math.floor(Math.random()*12)
          )

          return {
            title: item.title,
            description: item.description,
            img: item.urlToImage,
            date: newDate
          }
        })
      })
  }

  genrateNews().then(data => {
    let years = [];
    let month = [];

    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    data.map(item => {
      if (years.includes(item.date.getFullYear())) {
        return;
      } else {
        years.push(item.date.getFullYear());
      }

      if ( month.includes( callendarMonth[item.date.getMonth()] ) ) {
        return;
      } else {
        let monthNum = item.date.getMonth();
        month.push(callendarMonth[monthNum]);
      }
    });

    new CustomSelect($('.select-years'), years, years[0], (val) => filterNewsByYear(val));
    new CustomSelect($('.select-month'), month, null, (val) => filterNewsByMonth(val));

    allNews = data;
    newsToShow = [...allNews];
  }).then(() => {
    pasteNews(newsToShow);
  });

  function createNewsCard(data) {
    const dateNews = data.date;
    const title = data.title;
    const desc = data.description;
    const img = data.img;

    return $(`
      <div class="col-md-4 col-sm-6 news__card">
      <div class="card">
          <div class="card__img">
            <img src=${img}>
          </div>
          <h3 class="card__title">${title}</h3>
          <p class="card__text">${desc}</p>
          <p class="card__date">${dateNews.toLocaleString('ru')}</p>
        </div>
      </div>
    `)
  }

  function pasteNews(arr) {
    $('.news__show-more').css('display', 'flex');
    if(arr.length === 0) {
      return;
    }
    let $newsFragment = $(document.createDocumentFragment());
    let i = 0;

    for(i; i < 9; i++) {
      if(arr.length === 0) {
        $('.news__show-more').css('display', 'none');
        break;
      }
      let $news = createNewsCard(arr.shift(i));
      $newsFragment.append($news);
    }
    $('.js-append').append($newsFragment);
  }

  $('.news__show-more').on('click', () => {
    pasteNews(newsToShow);
  });

  function filterNewsByYear(year) {
    $('.js-append').empty();
    newsToShow = allNews.filter(item => item.date.getFullYear() == year);

    pasteNews(newsToShow);
  }

  function filterNewsByMonth(findMonth) {
    let numMonth;
    for(let key in callendarMonth) {
      if(callendarMonth[key] === findMonth) {
        numMonth = key;
        break;
      }
    }
    
    $('.js-append').empty();
    newsToShow = allNews.filter(item => item.date.getMonth() == numMonth);

    pasteNews(newsToShow);
  }
 
  $('.js-to-info').on('click', () => {
    $('html, body').animate({
      scrollTop: $(".about__slider").offset().top
    }, 1000);
  })

  $('.js-to-news').on('click', () => {
    $('html, body').animate({
      scrollTop: $(".news").offset().top
    }, 1000);
  })
});