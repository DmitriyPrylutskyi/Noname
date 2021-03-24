/**
 * jquery.gallery.js
 * http://www.codrops.com
 *
 * Copyright 2011, Pedro Botelho / Codrops
 * Free to use under the MIT license.
 *
 * Date: Mon Jan 30 2012
 */

(function( $, undefined ) {
		/*
		 * Gallery object.
		 */
		$.Gallery 				= function( options, element ) {
		
			this.$el	= $( element );
			this.$wrapper		= this.$el.find('.dg-wrapper');

			widthContainer  = $('.container').width();
			slideWidth = this.$wrapper.find('div').width()*0.67;

			this.transformX = slideWidth/2 + widthContainer/2 - slideWidth; 

			this._init( options );

			var _self	= this;

			$(window).on('resize', function () {
				_self.$wrapper		= _self.$el.find('.dg-wrapper');

				widthContainer  = $('.container').width();
				slideWidth = _self.$wrapper.find('div').width()*0.67;

				_self.transformX = slideWidth/2 + widthContainer/2 - slideWidth; 

				_self._init( options );
			})
		};
		
		$.Gallery.defaults 		= {
			current		: 0,	// index of current item
			autoplay	: false,// slideshow on / off
			interval	: 2000  // time between transitions
	    };
		
		$.Gallery.prototype 	= {
			_init 				: function( options ) {
				
				this.options 		= $.extend( true, {}, $.Gallery.defaults, options );

				// support for 3d / 2d transforms and transitions
				this.support3d		= Modernizr.csstransforms3d;
				this.support2d		= Modernizr.csstransforms;
				this.supportTrans	= Modernizr.csstransitions;
				
				this.$wrapper		= this.$el.find('.dg-wrapper');
				this.$items			= this.$wrapper.children();
				this.itemsCount		= this.$items.length;
				
				this.$nav			= this.$el.find('.arrows');
				this.$navPrev		= this.$nav.find('.dg-prev');
				this.$navNext		= this.$nav.find('.dg-next');
				this.$dots			= this.$el.find('.dots');

				// minimum of 3 items
				if( this.itemsCount < 3 ) {
						
					this.$nav.remove();
					return false;
				
				}

				if (!this.$dots.find('li').length) {

					for (let index = 0; index < this.itemsCount; index++) {
						if (index === 0) { 
							this.$dots.append('<li class="active"><button>' + index + '</button></li>')
						} else {
							this.$dots.append('<li><button>' + index + '</button></li>')
						}
					}

				}

				this.$dot			= this.$dots.find('li');

				this.def            = 1;

				this.current		= this.options.current;
				
				this.isAnim			= false;
				
				this.$items.css({
					'opacity'	: 0,
					'visibility': 'hidden'
				});
				
				this._validate();
				
				this._layout();
				
				// load the events
				this._loadEvents();
				
				// slideshow
				if( this.options.autoplay ) {
				
					this._startSlideshow();
				
				}
				
			},
			_validate			: function() {
			
				if( this.options.current < 0 || this.options.current > this.itemsCount - 1 ) {
					
					this.current = 0;
				
				}	
			
			},
			_layout				: function() {
				
				// current, left and right items
				this._setItems();
				
				// current item is not changed
				// left and right one are rotated and translated
				var leftCSS, rightCSS, currentCSS;
				
				
					
				leftCSS 	= {
					'-webkit-transform'	: 'translate(-' + this.transformX + 'px) scale(0.67)',
					'-moz-transform'	: 'translate(-' + this.transformX + 'px) scale(0.67)',
					'-o-transform'		: 'translate(-' + this.transformX + 'px) scale(0.67)',
					'-ms-transform'		: 'translate(-' + this.transformX + 'px) scale(0.67)',
					'transform'			: 'translate(-' + this.transformX + 'px) scale(0.67)'
				};
				
				rightCSS	= {
					'-webkit-transform'	: 'translate(' + this.transformX + 'px) scale(0.67)',
					'-o-transform'		: 'translate(' + this.transformX + 'px) scale(0.67)',
					'-ms-transform'		: 'translate(' + this.transformX + 'px) scale(0.67)',
					'transform'			: 'translate(' + this.transformX + 'px) scale(0.67)'
				};
				
				currentCSS	= {
					'z-index'			: 999
				};
				
				leftCSS.opacity		= 1;
				leftCSS.visibility	= 'visible';
				rightCSS.opacity	= 1;
				rightCSS.visibility	= 'visible';
				

				
				this.$leftItm.css( leftCSS || {} );
				this.$rightItm.css( rightCSS || {} );
				
				this.$currentItm.css( currentCSS || {} ).css({
					'opacity'	: 1,
					'visibility': 'visible'
				}).addClass('dg-center');
				
			},
			_setItems			: function() {
				
				this.$items.removeClass('dg-center');
				
				this.$currentItm	= this.$items.eq( this.current );
				this.$leftItm		= ( this.current === 0 ) ? this.$items.eq( this.itemsCount - 1 ) : this.$items.eq( this.current - 1 );
				this.$rightItm		= ( this.current === this.itemsCount - 1 ) ? this.$items.eq( 0 ) : this.$items.eq( this.current + 1 );
				
				/*if( !this.support3d && this.support2d && this.supportTrans ) {*/
				
					this.$items.css( 'z-index', 1 );
					this.$currentItm.css( 'z-index', 999 );
				
				/*}*/
				
				// next & previous items
				if( this.itemsCount > 3 ) {
				
					// next item
					this.$nextItm		= ( this.$rightItm.index() === this.itemsCount - 1 ) ? this.$items.eq( 0 ) : this.$rightItm.next();
					this.$nextItm.css( this._getCoordinates('outright') );
					
					// previous item
					this.$prevItm		= ( this.$leftItm.index() === 0 ) ? this.$items.eq( this.itemsCount - 1 ) : this.$leftItm.prev();
					this.$prevItm.css( this._getCoordinates('outleft') );
				
				}
				
			},
			_loadEvents			: function() {

				var _self	= this;
				
				this.$navPrev.on( 'click.gallery', function( event ) {
					let curIndex = _self.$currentItm.index();
					if (curIndex == 0) curIndex = _self.itemsCount
					_self.$dot.removeClass('active');
					$(_self.$dot[curIndex - 1]).addClass('active');

					if( _self.options.autoplay ) {
					
						clearTimeout( _self.slideshow );
						_self.options.autoplay	= false;
					
					}
					
					_self._navigate('prev');
					return false;
					
				});
				
				this.$navNext.on( 'click.gallery', function( event ) {
					let curIndex = _self.$currentItm.index();
					if ((curIndex + 1) == _self.itemsCount) curIndex = -1
					_self.$dot.removeClass('active');
					$(_self.$dot[curIndex + 1]).addClass('active');	

					if( _self.options.autoplay ) {
					
						clearTimeout( _self.slideshow );
						_self.options.autoplay	= false;
					
					}
					
					_self._navigate('next');
					return false;
					
				});

				this.$dot.on( 'click.gallery', function( event ) {
					let indexDot = $(event.currentTarget).find('button').text();
					let curIndex = _self.$currentItm.index();

					if(indexDot == curIndex) return false;

					if( _self.options.autoplay ) {
					
						clearTimeout( _self.slideshow );
						_self.options.autoplay	= false;
					
					}
					
					let dot = event.currentTarget;
					_self.$dot.removeClass('active');
					$(dot).addClass('active');			

					_self.def = Math.abs(curIndex - indexDot);

					if ( indexDot > curIndex ) {
						_self._navigate('next');
					} else {
						_self._navigate('prev');
					}

					_self.def = 1;

					return false;
					
				});
				
				this.$wrapper.on( 'webkitTransitionEnd.gallery transitionend.gallery OTransitionEnd.gallery', function( event ) {
					
					_self.$currentItm.addClass('dg-center');
					_self.$items.removeClass('dg-transition');
					_self.isAnim	= false;
					
				});
				
			},
			_getCoordinates		: function( position ) {
			
				if( this.support2d && this.supportTrans ) {
				
					switch( position ) {
						case 'outleft':
							return {
								'-webkit-transform'	: 'translate(-' + this.transformX + 'px) scale(0.67)',
								'-moz-transform'	: 'translate(-' + this.transformX + 'px) scale(0.67)',
								'-o-transform'		: 'translate(-' + this.transformX + 'px) scale(0.67)',
								'-ms-transform'		: 'translate(-' + this.transformX + 'px) scale(0.67)',
								'transform'			: 'translate(-' + this.transformX + 'px) scale(0.67)',
								'opacity'			: 0,
								'visibility'		: 'hidden'
							};
							break;
						case 'outright':
							return {
								'-webkit-transform'	: 'translate(' + this.transformX + 'px) scale(0.67)',
								'-moz-transform'	: 'translate(' + this.transformX + 'px) scale(0.67)',
								'-o-transform'		: 'translate(' + this.transformX + 'px) scale(0.67)',
								'-ms-transform'		: 'translate(' + this.transformX + 'px) scale(0.67)',
								'transform'			: 'translate(' + this.transformX + 'px) scale(0.67)',
								'opacity'			: 0,
								'visibility'		: 'hidden'
							};
							break;
						case 'left':
							return {
								'-webkit-transform'	: 'translate(-' + this.transformX + 'px) scale(0.67)',
								'-moz-transform'	: 'translate(-' + this.transformX + 'px) scale(0.67)',
								'-o-transform'		: 'translate(-' + this.transformX + 'px) scale(0.67)',
								'-ms-transform'		: 'translate(-' + this.transformX + 'px) scale(0.67)',
								'transform'			: 'translate(-' + this.transformX + 'px) scale(0.67)',
								'opacity'			: 1,
								'visibility'		: 'visible'
							};
							break;
						case 'right':
							return {
								'-webkit-transform'	: 'translate(' + this.transformX + 'px) scale(0.67)',
								'-moz-transform'	: 'translate(' + this.transformX + 'px) scale(0.67)',
								'-o-transform'		: 'translate(' + this.transformX + 'px) scale(0.67)',
								'-ms-transform'		: 'translate(' + this.transformX + 'px) scale(0.67)',
								'transform'			: 'translate(' + this.transformX + 'px) scale(0.67)',
								'opacity'			: 1,
								'visibility'		: 'visible'
							};
							break;
						case 'center':
							return {
								'-webkit-transform'	: 'translate(0px) scale(1)',
								'-moz-transform'	: 'translate(0px) scale(1)',
								'-o-transform'		: 'translate(0px) scale(1)',
								'-ms-transform'		: 'translate(0px) scale(1)',
								'transform'			: 'translate(0px) scale(1)',
								'opacity'			: 1,
								'visibility'		: 'visible'
							};
							break;
					};
				
				}
				else {
				
					switch( position ) {
						case 'outleft'	: 
						case 'outright'	: 
						case 'left'		: 
						case 'right'	:
							return {
								'opacity'			: 0,
								'visibility'		: 'hidden'
							};
							break;
						case 'center'	:
							return {
								'opacity'			: 1,
								'visibility'		: 'visible'
							};
							break;
					};
				
				}
			
			},
			_navigate			: function( dir ) {
				
				if( this.supportTrans && this.isAnim )
					return false;
					
				this.isAnim	= true;
				
				switch( dir ) {
				
					case 'next' :

						for (let index = 0; index<this.def; index++ ) {
					
							this.current	= this.$rightItm.index();
							
							// current item moves left
							this.$currentItm.addClass('dg-transition').css( this._getCoordinates('left') );
							
							// right item moves to the center
							this.$rightItm.addClass('dg-transition').css( this._getCoordinates('center') );	
							
							// next item moves to the right
							if( this.$nextItm ) {
								
								// left item moves out
								this.$leftItm.addClass('dg-transition').css( this._getCoordinates('outleft') );
								
								this.$nextItm.addClass('dg-transition').css( this._getCoordinates('right') );
								
							}
							else {
							
								// left item moves right
								this.$leftItm.addClass('dg-transition').css( this._getCoordinates('right') );
							
							}

							this._setItems();
							
							if( !this.supportTrans )
								this.$currentItm.addClass('dg-center');
						}

						break;
						
					case 'prev' :

						for (let index = 0; index<this.def; index++ ) {
					
							this.current	= this.$leftItm.index();
							
							// current item moves right
							this.$currentItm.addClass('dg-transition').css( this._getCoordinates('right') );
							
							// left item moves to the center
							this.$leftItm.addClass('dg-transition').css( this._getCoordinates('center') );
							
							// prev item moves to the left
							if( this.$prevItm ) {
								
								// right item moves out
								this.$rightItm.addClass('dg-transition').css( this._getCoordinates('outright') );
							
								this.$prevItm.addClass('dg-transition').css( this._getCoordinates('left') );
								
							}
							else {
							
								// right item moves left
								this.$rightItm.addClass('dg-transition').css( this._getCoordinates('left') );
							

							}

							this._setItems();
							
							if( !this.supportTrans )
								this.$currentItm.addClass('dg-center');
						}

						break;
						
				};
				
			},
			_startSlideshow		: function() {
			
				var _self	= this;
				
				this.slideshow	= setTimeout( function() {
					
					_self._navigate( 'prev' );
					
					if( _self.options.autoplay ) {
					
						_self._startSlideshow();
					
					}
				
				}, this.options.interval );
			
			},
			destroy				: function() {
				
				this.$navPrev.off('.gallery');
				this.$navNext.off('.gallery');
				this.$wrapper.off('.gallery');
				
			}
		};
		
		var logError 			= function( message ) {
			if ( this.console ) {
				console.error( message );
			}
		};
		
		$.fn.gallery			= function( options ) {
		
			if ( typeof options === 'string' ) {
				
				var args = Array.prototype.slice.call( arguments, 1 );
				
				this.each(function() {
				
					var instance = $.data( this, 'gallery' );
					
					if ( !instance ) {
						logError( "cannot call methods on gallery prior to initialization; " +
						"attempted to call method '" + options + "'" );
						return;
					}
					
					if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
						logError( "no such method '" + options + "' for gallery instance" );
						return;
					}
					
					instance[ options ].apply( instance, args );
				
				});
			
			} 
			else {
			
				this.each(function() {
				
					var instance = $.data( this, 'gallery' );
					if ( !instance ) {
						$.data( this, 'gallery', new $.Gallery( options, this ) );
					}
				});
			
			}
			
			return this;
			
		};

})( jQuery );