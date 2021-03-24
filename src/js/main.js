$(function () {
	//------------------- functions for burger-------------------------
	$menu_button = $('.header__menu__button');
	$menu = $('.header__menu');

	$menu_button.click(function () {
		$menu.toggleClass('open');
		$menu_button.toggleClass('open');
	});

	$our_works_link = $('.our-works__item__link');
	$our_works_block_wrapper=$('.our-works__right-block-wrapper');
	$our_works_block = $('.our-works__right-block');
	$our_works_img = $('.our-works__img');

	$url = $($our_works_link).data('url');
	$($our_works_img).attr('src', $url);

	var slideWidth;

	setTimeout(function(){
		var rightBlockWidth = $our_works_block.width();
		var slideCount = $our_works_link.length;
		slideWidth = $our_works_img.width();
		var slideHeight = $our_works_img.height();
		var sliderWidth = slideCount * slideWidth;

		$our_works_img.each(function(){
			$(this).css({ width: slideWidth, height: slideHeight });
		})

		$our_works_block_wrapper.css({ maxWidth: slideWidth, height: slideHeight, marginRight: rightBlockWidth - slideWidth});
		$our_works_block.css({ width: sliderWidth, height: slideHeight, marginLeft: - slideWidth});

		$('.our-works__img:last-child').prependTo('.our-works__right-block');
	}, 1000)

	$our_works_link.click(function (e) {
		e.preventDefault();

		if ($(this).hasClass('active')) return; 

		$our_works_link.removeClass('active');
		$(this).addClass('active');
		url = $(this).data('url');
		$('.our-works__img.next').attr('src', url);

		setTimeout(function(){
			$our_works_block.animate({
	            left: slideWidth
	        }, 500, function () {
	            $('.our-works__img:last-child').prependTo('.our-works__right-block');
	            $('.our-works__img:last-child').removeClass('next');
	            $('.our-works__img:first-child').addClass('next');
	            $our_works_block.css('left', 0);
	        });
		}, 500)
	});

	$(".footer__menu__copyright").find('span').text((new Date).getFullYear())

	//-------------------testimonials slider-------------------------
	$('.top__section__slider').slick({
		slidesToScroll: 1,
		slidesToShow: 4,
		infinite: true,
		arrows: false,
		dots: false,
		variableWidth: true,
		autoplay: true,
		autoplaySpeed: 0,
		speed: 9000,
		cssEase: 'linear',

		responsive: [
			{
				breakpoint: 1400,
				settings: {
					slidesToShow: 3
				}
			},
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	});

	$('.clients__slider').slick({
		slidesToScroll: 1,
		slidesToShow: 6,
		infinite: true,
		arrows: false,
		dots: false,
		centerMode: true,
		centerPadding: '190px',
		autoplay: false,
		cssEase: "linear",

		responsive: [
			{
				breakpoint: 1400,
				settings: {
					slidesToShow: 4
				}
			},
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					centerPadding: '100px',
				}
			}
		]
	});

	$('.single__video__slider').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		infinite: true,
		sNavFor: '.single__video__slider-nav',
		cssEase: "linear"
	});
	$('.single__video__slider-nav').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		infinite: true,
		asNavFor: '.single__video__slider',
		focusOnSelect: true,
		cssEase: "linear",

		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					centerMode: true,
					centerPadding: '95px'
				}
			}
		]
	});

	$('.our-works__slider').slick({
		slidesToScroll: 1,
		slidesToShow: 4,
		infinite: true,
		arrows: false,
		dots: false,
		autoplay: false,
		cssEase: "linear",

		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 2
				}
			}
		]
	});

	$('.our-team__slider').slick({
		slidesToScroll: 1,
		slidesToShow: 3,
		infinite: true,
		arrows: true,
		dots: false,
		autoplay: false,
		cssEase: "linear",

		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					arrows: false
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					arrows: false
				}
			}
		]
	});

	var show = true;
    if (!$('.statistics__wrapper').length) return false;

    var countbox = '.statistics__wrapper';
    $(window).on('scroll load resize', function () {
        if (!show) return false;
        var delta = ($('.home').length) ? 600 : 800;
        var w_top = $(window).scrollTop();
        var e_top = $(countbox).offset().top;
        var w_height = $(window).height();
        var d_height = $(document).height();
        var e_height = $(countbox).outerHeight();
        if (w_top + delta >= e_top || w_height + w_top == d_height || e_height + e_top < w_height) {
            $('.statistics__number p').css('opacity', '1');
            $('.statistics__number p').spincrement({
                thousandSeparator: "",
                duration: 1200
            });
             
            show = false;
        }
    });
});