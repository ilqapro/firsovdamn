$(function() {

  $('a[href="#"]').on('click', function(e) {
    e.preventDefault();
  })

  // generate random int
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  // preloader
  setTimeout(function() {
    $('#preloader').fadeOut(1000)
    $('body').removeClass('loading')
  }, 1700)
  
  // gift in random position
  setTimeout(function() {
    $('#gift').addClass('active').css({
      top: (25 + getRandomInt(50)) + 'vh',
      left: (25 + getRandomInt(50)) + 'vw',
    })
  }, 10000)

  var isMobile = $('body').width() <= 576;
  var headerHeight = $('#header').outerHeight();

  // trigger on brain item
  let brainItemClicked = false;
  let worksItemClicked = false;
  $(window).scroll(function() {
    if( $(this).scrollTop() > $('#brain').offset().top - headerHeight && ! brainItemClicked ) {
      $('.brain__skills-item').first().trigger('click')
      brainItemClicked = true;
    }

    if( isMobile ) {
      if( $(this).scrollTop() > $('#works').offset().top - headerHeight && ! worksItemClicked ) {
        $('.works__item').first().trigger('click')
        worksItemClicked = true;
      }
    }
  })

  // automatically adding the "active" class for the navigation system
  var currentSection;
  setInterval(function() {
    let scrollCenter = $(window).scrollTop() + ($(window).height() / 2);

    $('section').each(function(i, e) {
      let sectionOffsetTop = $(e).offset().top;
      let sectionOffsetBottom = sectionOffsetTop + $(e).outerHeight();

      if( scrollCenter > sectionOffsetTop && scrollCenter < sectionOffsetBottom ) {
        currentSection = $(e).attr('id');
      }
    })

    $('#nav li.active').removeClass('active')
    $('#nav').find('a[href="#'+ currentSection +'"]').closest('li').addClass('active')
  }, 500)

  // navigation init
  $('[data-nav_item]').each(function(i, e) {
    $('#nav ul').append('<li><a href="#'+ $(e).attr('id') +'">'+ $(e).data('nav_item') +'</a></li>');
  })

  // navigation click item
  $('#nav').on('click', 'li', function(e) {
    e.preventDefault();

    let thisHref = $(this).find('a').attr('href');

    $('html, body').stop().animate({
      scrollTop: $(thisHref).offset().top - headerHeight
    }, 300)
  })
  
  // open main popups
  $('[data-popup_open]').on('click', function() {
    $('body').addClass('overflowY-hidden')
    $('.popup#' + $(this).data('popup_open')).fadeIn(300)
  })

  // close popup
  $('.close').on('click', function() {
    $(this).closest('.popup').fadeOut(300)
    $('body').removeClass('overflowY-hidden')
  })

  // brain item
  $('.brain__skills-item').on('click', function() {
    $('.brain__popup .text').text($(this).data('popup_text'))
    $('.brain__skills-item.active').removeClass('active')
    $(this).addClass('active')

    $('.brain__popup, .brain__popup-content').removeClass('active')
    $('.brain__video video').addClass('loading')
    setTimeout(function() {
      $('.brain__video video').removeClass('loading')
      $('.brain__popup, .brain__popup-content').addClass('active')
    }, 500)

    if( isMobile ) {
      $('body, html').stop().animate({
        scrollTop: $('.brain__video').offset().top - headerHeight - 15
      })
    }
  })
  
  // select pick up
  function select_pick_up(item) {
    let itemBtn = $(item).closest('.select');
    let itemInputText = $(item).data('item');
    $(itemBtn).find('.item.active').removeClass('active')
    $(item).addClass('active')
    $(itemBtn).find('.choised-content').html($(item).html())

    if( $(itemBtn).hasClass('s-input') ) {
      $(item).closest('label').find('input[type="hidden"]').val(itemInputText)
      $($(itemBtn).data('select_input_result')).attr('placeholder', itemInputText)
    }
  }

  // select init
  $('.select').each(function() {
    let firstItem = $(this).find('.item').first();
    select_pick_up(firstItem);

    $(this).on('click', function() {
      $(this).toggleClass('active')
    })
  })

  // select click
  $('.select .item').on('click', function() {
    select_pick_up($(this))
  })

  // works category btns
  $('.works__side-item').on('click', function() {
    $('.works__side-item.active').removeClass('active')
    $(this).addClass('active')
  }).first().trigger('click')

  var workItemDisable = false;
  $('.works__item').on('mousemove touchmove', function(e) {
    let
      itemOffset = $(this).offset(),
      halfWidth = $(this).width() / 2,
      halfHeight = $(this).height() / 2,
      coefficient = 15,
      rotateY = Math.round( - ( halfWidth - Math.round(e.pageX - itemOffset.left) ) / coefficient ),
      rotateX = Math.round( ( halfHeight - Math.round(e.pageY - itemOffset.top) ) / coefficient ),
      cssTransformProperty = 'perspective(500px) rotateX('+ rotateX +'deg) rotateY('+ rotateY +'deg) scale(0.95)';
    $(this).find('.inner').css({
      'transform': cssTransformProperty,
      '-o-transform': cssTransformProperty,
      '-ms-transform': cssTransformProperty,
      '-moz-transform': cssTransformProperty,
      '-webkit-transform': cssTransformProperty
    })
  }).on('mouseleave touchend', function() {
    let $this = $(this);
    setTimeout(function() {
      $this.find('.inner').prop('style', false)
      workItemDisable = false;
    }, workItemDisable ? 1000 : 0)
  })

  // works item
  $('.works__item').on('click', function() {
    workItemDisable = true;

    $('body').addClass('overflowY-hidden')

    let
      $this = $(this),
      styleCss = $this.find('.inner').attr('style');
    
    $this.addClass('disabled')
    $this.removeClass('disabled')

    let work_single = $('<div class="work_single"><div class="inner"><video class="loader" src="./assets/video/logo.mp4" autoplay muted loop></video></div></div>').attr('style', styleCss).css({
      top: $this.offset().top - $(window).scrollTop(),
      left: $this.offset().left,
      width: $this.outerWidth(),
      height: $this.outerHeight(),
    }).prop('outerHTML')

    $('body').append(work_single);
    $('.work_single').addClass('fadeIn')
    setTimeout(function() {
      $('.work_single').addClass('wided')
    }, 300)

    // inner
    setTimeout(function() {
      $('.work_single .inner').html($('#work_single_content').prop('outerHTML'));

      $('.work_single').removeClass('fadeIn');
      setTimeout(function() {
        $('.work_single').addClass('fadeIn');
      }, 300)
    }, 1000)
  })

  $('body').on('click', '.work_single-close', function() {
    let work_single = $(this).closest('.work_single');
    work_single.addClass('disable')
    $('body').removeClass('overflowY-hidden')
    setTimeout(function() {
      work_single.remove()
    }, 1000)
  })
  
})
