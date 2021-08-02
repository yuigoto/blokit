<?php
/**
 * Enqueues all block code.
 *
 * @since       0.0.1
 * @package     BloKit
 */
defined( 'ABSPATH' ) || exit;

function blokit_assets_loader()
{
    // phpcs:ignore
    $version = "0.0.1";

    wp_register_style(
        'blokit_theme_styles',
        plugins_url( 'blokit/build/style.css', dirname( __FILE__ ) ),
        is_admin() ? array( 'wp-editor' ) : null,
        $version
    );

    wp_register_style(
        'blokit_block_styles',
        plugins_url( 'blokit/build/editor.css', dirname( __FILE__ ) ),
        array( 'wp-edit-blocks' ),
        $version
    );

    wp_register_script(
        'blokit_block_scripts',
        plugins_url( 'blokit/build/index.js', dirname( __FILE__ ) ),
        array(
            'wp-blocks',
            'wp-i18n',
            'wp-element',
            'wp-editor',
            'wp-data'
        ),
        $version,
        true
    );

    /**
     * Handles block registration.
     *
     * Makes sure that scripts and styles will be loaded when the editor loads.
     *
     * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
     * @since 0.0.1
     */
    register_block_type(
        'blokit/blocks',
        array(
            'style' => 'blokit_theme_styles',
            'editor_style' =>  'blokit_block_styles',
            'editor_script' => 'blokit_block_scripts'
        )
    );
}
add_action( 'init', 'blokit_assets_loader' );
