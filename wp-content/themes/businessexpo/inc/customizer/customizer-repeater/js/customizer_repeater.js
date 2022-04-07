/* global jQuery */
/* global wp */
function businessexpo_media_upload(button_class) {
	'use strict';
	jQuery( 'body' ).on(
		'click',
		button_class,
		function () {
			var button_id     = '#' + jQuery( this ).attr( 'id' );
			var display_field = jQuery( this ).parent().children( 'input:text' );
			var _custom_media = true;

			wp.media.editor.send.attachment = function (props, attachment) {

				if (_custom_media) {
					if (typeof display_field !== 'undefined') {
						switch (props.size) {
							case 'full':
								display_field.val( attachment.sizes.full.url );
								display_field.trigger( 'change' );
								break;
							case 'medium':
								display_field.val( attachment.sizes.medium.url );
								display_field.trigger( 'change' );
								break;
							case 'thumbnail':
								display_field.val( attachment.sizes.thumbnail.url );
								display_field.trigger( 'change' );
								break;
							default:
								display_field.val( attachment.url );
								display_field.trigger( 'change' );
						}
					}
					_custom_media = false;
				} else {
					return wp.media.editor.send.attachment( button_id, [props, attachment] );
				}
			};
			wp.media.editor.open( button_class );
			window.send_to_editor = function (html) {

			};
			return false;
		}
	);
}

/********************************************
 * ** Generate unique id ***
 *********************************************/
function businessexpo_customizer_repeater_uniqid(prefix, more_entropy) {
	'use strict';
	if (typeof prefix === 'undefined') {
		prefix = '';
	}

	var retId;
	var php_js;
	var formatSeed = function (seed, reqWidth) {
		seed = parseInt( seed, 10 )
			.toString( 16 ); // to hex str
		if (reqWidth < seed.length) { // so long we split
			return seed.slice( seed.length - reqWidth );
		}
		if (reqWidth > seed.length) { // so short we pad
			return new Array( 1 + (reqWidth - seed.length) )
					.join( '0' ) + seed;
		}
		return seed;
	};

	// BEGIN REDUNDANT
	if ( ! php_js) {
		php_js = {};
	}
	// END REDUNDANT
	if ( ! php_js.uniqidSeed) { // init seed with big random int
		php_js.uniqidSeed = Math.floor( Math.random() * 0x75bcd15 );
	}
	php_js.uniqidSeed++;

	retId  = prefix; // start with prefix, add current milliseconds hex string
	retId += formatSeed(
		parseInt(
			new Date()
			.getTime() / 1000,
			10
		),
		8
	);
	retId += formatSeed( php_js.uniqidSeed, 5 ); // add seed hex string
	if (more_entropy) {
		// for more entropy we add a float lower to 10
		retId += (Math.random() * 10)
			.toFixed( 8 )
			.toString();
	}

	return retId;
}


/********************************************
 * ** General Repeater ***
 *********************************************/
function businessexpo_customizer_repeater_refresh_social_icons(th) {
	'use strict';
	var icons_repeater_values = [];
	th.find( '.customizer-repeater-social-repeater-container' ).each(
		function () {
			var icon = jQuery( this ).find( '.icp' ).val();
			var link = jQuery( this ).find( '.customizer-repeater-social-repeater-link' ).val();
			var id   = jQuery( this ).find( '.customizer-repeater-social-repeater-id' ).val();

			if ( ! id) {
				id = 'customizer-repeater-social-repeater-' + businessexpo_customizer_repeater_uniqid();
				jQuery( this ).find( '.customizer-repeater-social-repeater-id' ).val( id );
			}

			if (icon !== '' && link !== '') {
				icons_repeater_values.push(
					{
						'icon': icon,
						'link': link,
						'id': id
					}
				);
			}
		}
	);

	th.find( '.social-repeater-socials-repeater-colector' ).val( JSON.stringify( icons_repeater_values ) );
	businessexpo_customizer_repeater_refresh_general_control_values();
}


function businessexpo_customizer_repeater_refresh_general_control_values() {

	'use strict';
	jQuery( '.customizer-repeater-general-control-repeater' ).each(
		function () {
			var values = [];
			var th     = jQuery( this );
			th.find( '.customizer-repeater-general-control-repeater-container' ).each(
				function () {

					var icon_value   = jQuery( this ).find( '.icp' ).val();
					var text         = jQuery( this ).find( '.customizer-repeater-text-control' ).val();
					var button_text  = jQuery( this ).find( '.customizer-repeater-button-text-control' ).val();
					var link         = jQuery( this ).find( '.customizer-repeater-link-control' ).val();
					var color        = jQuery( this ).find( '.customizer-repeater-color-control' ).val();
					var designation  = jQuery( this ).find( '.customizer-repeater-designation-control' ).val();
					var open_new_tab = jQuery( this ).find( '.customizer-repeater-checkbox' ).val();
					var image_url    = jQuery( this ).find( '.custom-media-url' ).val();
					var choice       = jQuery( this ).find( '.customizer-repeater-image-choice' ).val();
					var title        = jQuery( this ).find( '.customizer-repeater-title-control' ).val();
					var subtitle     = jQuery( this ).find( '.customizer-repeater-subtitle-control' ).val();
					var slide_format = jQuery( this ).find( '.customizer-repeater-slide-format' ).val();
					var video_url    = jQuery( this ).find( '.customizer-repeater-video-url-control' ).val();
					var id           = jQuery( this ).find( '.social-repeater-box-id' ).val();
					if ( ! id) {
						id = 'social-repeater-' + businessexpo_customizer_repeater_uniqid();
						jQuery( this ).find( '.social-repeater-box-id' ).val( id );
					}
					var social_repeater = jQuery( this ).find( '.social-repeater-socials-repeater-colector' ).val();
					var shortcode       = jQuery( this ).find( '.customizer-repeater-shortcode-control' ).val();

					if (text !== '' || image_url !== '' || title !== '' || subtitle !== '' || icon_value !== '' || link !== '' || designation !== '' || open_new_tab !== '' || choice !== '' || social_repeater !== '' || shortcode !== '' || color !== '' || button_text !== '' || slide_format !== '' || video_url !== '') {
						values.push(
							{
								'icon_value': (choice === 'customizer_repeater_none' ? '' : icon_value),
								'color': color,
								'text': businessexpo_escapeHtml( text ),
								'link': link,
								'image_url': (choice === 'customizer_repeater_none' ? '' : image_url),
								'choice': choice,
								'title': businessexpo_escapeHtml( title ),
								'subtitle': businessexpo_escapeHtml( subtitle ),
								'social_repeater': businessexpo_escapeHtml( social_repeater ),
								'id': id,
								'shortcode': businessexpo_escapeHtml( shortcode ),
								'button_text' : button_text,
								'designation' : designation,
								'open_new_tab' : open_new_tab,
								'slide_format' : slide_format,
								'video_url' : video_url
							}
						);
					}

				}
			);
			th.find( '.customizer-repeater-colector' ).val( JSON.stringify( values ) );
			th.find( '.customizer-repeater-colector' ).trigger( 'change' );
		}
	);
}


jQuery( document ).ready(
	function () {
		'use strict';
		var theme_conrols = jQuery( '#customize-theme-controls' );
		theme_conrols.on(
			'click',
			'.customizer-repeater-customize-control-title',
			function () {
				jQuery( this ).next().slideToggle(
					'medium',
					function () {
						if (jQuery( this ).is( ':visible' )) {
							jQuery( this ).prev().addClass( 'repeater-expanded' );
							jQuery( this ).css( 'display', 'block' );
						} else {
							jQuery( this ).prev().removeClass( 'repeater-expanded' );
						}
					}
				);
			}
		);

		theme_conrols.on(
			'change',
			'.icp',
			function(){
				businessexpo_customizer_repeater_refresh_general_control_values();
				return false;
			}
		);

		theme_conrols.on(
			'change',
			'.customizer-repeater-slide-format',
			function(){
				if (jQuery( this ).val() === 'customizer_repeater_slide_forma_video') {
					jQuery( this ).parent().parent().find( '.customizer-repeater-video-url-control' ).show();
					jQuery( this ).parent().parent().find( '.Video' ).show();
				} else {
					jQuery( this ).parent().parent().find( '.customizer-repeater-video-url-control' ).hide();
					jQuery( this ).parent().parent().find( '.Video' ).hide();
				}
				businessexpo_customizer_repeater_refresh_general_control_values();
				return false;

			}
		);

		theme_conrols.on(
			'change',
			'.customizer-repeater-image-choice',
			function () {
				if (jQuery( this ).val() === 'customizer_repeater_image') {
					jQuery( this ).parent().parent().find( '.social-repeater-general-control-icon' ).hide();
					jQuery( this ).parent().parent().find( '.customizer-repeater-image-control' ).show();
				}
				if (jQuery( this ).val() === 'customizer_repeater_icon') {
					jQuery( this ).parent().parent().find( '.social-repeater-general-control-icon' ).show();
					jQuery( this ).parent().parent().find( '.customizer-repeater-image-control' ).hide();
				}
				if (jQuery( this ).val() === 'customizer_repeater_none') {
					jQuery( this ).parent().parent().find( '.social-repeater-general-control-icon' ).hide();
					jQuery( this ).parent().parent().find( '.customizer-repeater-image-control' ).hide();
				}

				businessexpo_customizer_repeater_refresh_general_control_values();
				return false;
			}
		);
		businessexpo_media_upload( '.customizer-repeater-custom-media-button' );
		jQuery( '.custom-media-url' ).on(
			'change',
			function () {
				businessexpo_customizer_repeater_refresh_general_control_values();
				return false;
			}
		);

		var color_options = {
			change: function(event, ui){
				businessexpo_customizer_repeater_refresh_general_control_values();
			}
		};

		/**
		 * This adds a new box to repeater
		 */
		theme_conrols.on(
			'click',
			'.customizer-repeater-new-field',
			function () {

				var parentid = jQuery( this ).parent().attr( "id" );

				if (parentid == 'customize-control-businessexpo_main_slider_content') {
					var numItems = jQuery( "#customize-control-businessexpo_main_slider_content .customizer-repeater-general-control-repeater-container" ).length
					if (numItems >= 2) {
						jQuery( "#customize-control-businessexpo_slider_upgrade .businessexpo-upgrade-pro-message" ).show();
						return false;
					}
				}
				if (parentid == 'customize-control-businessexpo_top_info_content') {
					var numItems = jQuery( "#customize-control-businessexpo_top_info_content .customizer-repeater-general-control-repeater-container" ).length
					if (numItems >= 3) {
						jQuery( "#customize-control-businessexpo_top_info_upgrade .businessexpo-upgrade-pro-message" ).show();
						return false;
					}
				}
				if (parentid == 'customize-control-businessexpo_service_content') {
					var numItems = jQuery( "#customize-control-businessexpo_service_content .customizer-repeater-general-control-repeater-container" ).length
					if (numItems >= 3) {
						jQuery( "#customize-control-businessexpo_service_upgrade .businessexpo-upgrade-pro-message" ).show();
						return false;
					}
				}
				if (parentid == 'customize-control-businessexpo_project_content') {
					var numItems = jQuery( "#customize-control-businessexpo_project_content .customizer-repeater-general-control-repeater-container" ).length
					if (numItems >= 4) {
						jQuery( "#customize-control-businessexpo_project_upgrade .businessexpo-upgrade-pro-message" ).show();
						return false;
					}
				}
				if (parentid == 'customize-control-businessexpo_testimonial_content') {
					var numItems = jQuery( "#customize-control-businessexpo_testimonial_content .customizer-repeater-general-control-repeater-container" ).length
					if (numItems >= 1) {
						jQuery( "#customize-control-businessexpo_testimonial_upgrade .businessexpo-upgrade-pro-message" ).show();
						return false;
					}
				}

				var th = jQuery( this ).parent();
				var id = 'customizer-repeater-' + businessexpo_customizer_repeater_uniqid();
				if (typeof th !== 'undefined') {
					/* Clone the first box*/
					var field = th.find( '.customizer-repeater-general-control-repeater-container:first' ).clone( true, true );

					if (typeof field !== 'undefined') {
						/*Set the default value for choice between image and icon to icon*/
						field.find( '.customizer-repeater-image-choice' ).val( 'customizer_repeater_icon' );

						/*Show icon selector*/
						field.find( '.social-repeater-general-control-icon' ).show();

						/*Hide image selector*/
						if (field.find( '.social-repeater-general-control-icon' ).length > 0) {
							field.find( '.customizer-repeater-image-control' ).hide();
						}

						/*Show delete box button because it's not the first box*/
						field.find( '.social-repeater-general-control-remove-field' ).show();

						/* Empty control for icon */
						field.find( '.input-group-addon' ).find( '.fa' ).attr( 'class', 'fa' );

						/*Remove all repeater fields except first one*/

						field.find( '.customizer-repeater-social-repeater' ).find( '.customizer-repeater-social-repeater-container' ).not( ':first' ).remove();
						field.find( '.customizer-repeater-social-repeater-link' ).val( '' );
						field.find( '.social-repeater-socials-repeater-colector' ).val( '' );

						/*Remove value from icon field*/
						field.find( '.icp' ).val( '' );

						/*Remove value from text field*/
						field.find( '.customizer-repeater-text-control' ).val( '' );

						 /*Remove value from button text field*/
						field.find( '.customizer-repeater-button-text-control' ).val( '' );

						field.find( '.customizer-repeater-video-url-control' ).val( '' );

						 /*Remove value from designation  text field*/
						field.find( '.customizer-repeater-designation-control' ).val( '' );

						/*Set the default value in slide format*/
						field.find( '.customizer-repeater-slide-format' ).val( 'left' );

						/*Remove value from link field*/
						field.find( '.customizer-repeater-link-control' ).val( '' );

						/*Set box id*/
						field.find( '.social-repeater-box-id' ).val( id );

						/*Remove value from media field*/
						field.find( '.custom-media-url' ).val( '' );

						/*Remove value from title field*/
						field.find( '.customizer-repeater-title-control' ).val( '' );

						/*Remove value from color field*/
						field.find( '.wp-picker-container' ).replaceWith( '<input type="text" class="customizer-repeater-color-control ' + id + '">' );
						field.find( '.customize-control-notifications-container' ).remove();
						field.find( '.customizer-repeater-color-control' ).wpColorPicker( color_options );

						/*Remove value from subtitle field*/
						field.find( '.customizer-repeater-subtitle-control' ).val( '' );

						/*Remove value from shortcode field*/
						field.find( '.customizer-repeater-shortcode-control' ).val( '' );

						/*Set the default value in checkbox*/
						field.find( '.customizer-repeater-checkbox' ).val( '' );

						/*Append new box*/
						th.find( '.customizer-repeater-general-control-repeater-container:first' ).parent().append( field );

						/*Refresh values*/
						businessexpo_customizer_repeater_refresh_general_control_values();
					}

				}
				return false;
			}
		);

		theme_conrols.on(
			'click',
			'.social-repeater-general-control-remove-field',
			function () {
				if (typeof    jQuery( this ).parent() !== 'undefined') {
					jQuery( this ).parent().hide(
						500,
						function(){

							var main_slider_items = jQuery( "#customize-control-businessexpo_main_slider_content .customizer-repeater-general-control-repeater-container" ).length
							if (main_slider_items < 3) {
								jQuery( "#customize-control-businessexpo_slider_upgrade .businessexpo-upgrade-pro-message" ).hide();
							}
							var theme_info_items = jQuery( "#customize-control-businessexpo_top_info_content .customizer-repeater-general-control-repeater-container" ).length
							if (theme_info_items < 5) {
								jQuery( "#customize-control-businessexpo_top_info_upgrade .businessexpo-upgrade-pro-message" ).hide();
							}
							var theme_service_items = jQuery( "#customize-control-businessexpo_service_content .customizer-repeater-general-control-repeater-container" ).length
							if (theme_service_items < 4) {
								jQuery( "#customize-control-businessexpo_service_upgrade .businessexpo-upgrade-pro-message" ).hide();
							}
							var project_items = jQuery( "#customize-control-businessexpo_project_content .customizer-repeater-general-control-repeater-container" ).length
							if (project_items < 5) {
								jQuery( "#customize-control-businessexpo_project_upgrade .businessexpo-upgrade-pro-message" ).hide();
							}
							var testimonial_items = jQuery( "#customize-control-businessexpo_testimonial_content .customizer-repeater-general-control-repeater-container" ).length
							if (testimonial_items < 2) {
								jQuery( "#customize-control-businessexpo_testimonial_upgrade .businessexpo-upgrade-pro-message" ).hide();
							}

							jQuery( this ).parent().remove();
							businessexpo_customizer_repeater_refresh_general_control_values();

						}
					);
				}
				return false;
			}
		);

		theme_conrols.on(
			'keyup',
			'.customizer-repeater-title-control',
			function () {
				businessexpo_customizer_repeater_refresh_general_control_values();
			}
		);

		jQuery( '.customizer-repeater-color-control' ).wpColorPicker( color_options );

		theme_conrols.on(
			'keyup',
			'.customizer-repeater-subtitle-control',
			function () {
				businessexpo_customizer_repeater_refresh_general_control_values();
			}
		);

		theme_conrols.on(
			'keyup',
			'.customizer-repeater-shortcode-control',
			function () {
				businessexpo_customizer_repeater_refresh_general_control_values();
			}
		);

		theme_conrols.on(
			'keyup',
			'.customizer-repeater-video-url-control',
			function () {
				businessexpo_customizer_repeater_refresh_general_control_values();
			}
		);

		theme_conrols.on(
			'keyup',
			'.customizer-repeater-text-control',
			function () {
				businessexpo_customizer_repeater_refresh_general_control_values();
			}
		);

		theme_conrols.on(
			'keyup',
			'.customizer-repeater-button-text-control',
			function(){

				businessexpo_customizer_repeater_refresh_general_control_values();
			}
		)

		theme_conrols.on(
			'keyup',
			'.customizer-repeater-link-control',
			function () {
				businessexpo_customizer_repeater_refresh_general_control_values();
			}
		);

		theme_conrols.on(
			'keyup',
			'.customizer-repeater-designation-control',
			function(){

				businessexpo_customizer_repeater_refresh_general_control_values();
			}
		);

		theme_conrols.on(
			'change',
			'.customizer-repeater-checkbox',
			function(){

				businessexpo_customizer_repeater_refresh_general_control_values();
			}
		);

		/*Drag and drop to change icons order*/

		jQuery( '.customizer-repeater-general-control-droppable' ).sortable(
			{
				axis: 'y',
				update: function () {
					businessexpo_customizer_repeater_refresh_general_control_values();
				}
			}
		);

		/*----------------- Socials Repeater ---------------------*/
		theme_conrols.on(
			'click',
			'.social-repeater-add-social-item',
			function (event) {
				event.preventDefault();
				var th = jQuery( this ).parent();
				var id = 'customizer-repeater-social-repeater-' + businessexpo_customizer_repeater_uniqid();
				if (typeof th !== 'undefined') {
					var field = th.find( '.customizer-repeater-social-repeater-container:first' ).clone( true, true );
					if (typeof field !== 'undefined') {
						field.find( '.icp' ).val( '' );
						field.find( '.input-group-addon' ).find( '.fa' ).attr( 'class','fa' );
						field.find( '.social-repeater-remove-social-item' ).show();
						field.find( '.customizer-repeater-social-repeater-link' ).val( '' );
						field.find( '.customizer-repeater-social-repeater-id' ).val( id );
						th.find( '.customizer-repeater-social-repeater-container:first' ).parent().append( field );
					}
				}
				return false;
			}
		);

		theme_conrols.on(
			'click',
			'.social-repeater-remove-social-item',
			function (event) {
				event.preventDefault();
				var th       = jQuery( this ).parent();
				var repeater = jQuery( this ).parent().parent();
				th.remove();
				businessexpo_customizer_repeater_refresh_social_icons( repeater );
				return false;
			}
		);

		theme_conrols.on(
			'keyup',
			'.customizer-repeater-social-repeater-link',
			function (event) {
				event.preventDefault();
				var repeater = jQuery( this ).parent().parent();
				businessexpo_customizer_repeater_refresh_social_icons( repeater );
				return false;
			}
		);

		theme_conrols.on(
			'change',
			'.customizer-repeater-social-repeater-container .icp',
			function (event) {
				event.preventDefault();
				var repeater = jQuery( this ).parent().parent().parent();
				businessexpo_customizer_repeater_refresh_social_icons( repeater );
				return false;
			}
		);

	}
);

var entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&#39;',
	'/': '&#x2F;'
};

function businessexpo_escapeHtml(string) {
	'use strict';
	// noinspection JSUnresolvedFunction
	string = String( string ).replace( new RegExp( '\r?\n', 'g' ), '<br />' );
	string = String( string ).replace( /\\/g, '&#92;' );
	return String( string ).replace(
		/[&<>"'\/]/g,
		function (s) {
			return entityMap[s];
		}
	);

}
