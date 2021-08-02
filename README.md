![BloKit](./blokit.png)

# BloKit

> Build custom blocks for Gutenberg without the need to set up WordPress. :wink:

I really like [`@wordpress/scripts`](https://www.npmjs.com/package/@wordpress/scripts) and [`create-guten-block`](https://github.com/ahmadawais/create-guten-block). Both packages help you create blocks and extend Gutenberg's features easily.

But even if they make it easy to develop blocks, both need a WordPres installation somewhere, so you can load your custom blocks for testing, and you'll have to refresh your editor after every build.

I kinda grew a bit tired of this build/refresh/test loop, and wanted a few things that weren't implemented in `create-guten-block`, but were easy to implement in other React-based boilerplates (like `create-react-app` or the Next.JS base project). 

So, what to do? Build my own setup, _of course_!

-----

## What is this thing?

Basically, it's a block construction kit for WordPress' **Gutenberg** Blocks Editor, it's composed of three parts:

- A small application with a standalone Gutenberg editor which you can use to test your blocks and extensions without relying on a WordPress install;
- A bundler for blocks, that handles imports and also excludes anything not necessary in a final build, so your final code is as slim as possible;
- A WordPress plugin that loads the blocks' code and stylesheets;

It also borrows a bit from `create-guten-blocks` and `create-react-app` on how Webpack deals with code and files.

-----

## Features:

- Standalone Gutenberg editor to quickly test your blocks;
- Webpack-based configuration, which you can change according to your own needs;
- Work with JavaScript (`.js`/`.jsx`) and TypeScript (`.ts`/`.tsx`);
- SASS/SCSS and PostCSS support;
- Generates separated `editor.css` and `style.css` files from properly named imported stylesheets;
- Handles absolute import paths for JS/TS code (see notes);
- Also handles SASS/SCSS import resolution (see notes);
- Handles explicitly imported files (`import file from "example.jpg"`), in case you need to import static assets into your blocks or rendered output;
- Generates block templates so you can code ASAP;

> **Notes about path resolution**:
> - For files within the `src` directory, all imports are resolved with `src` as the root folder so an import coming from `components/test/Demo` will resolve to `src/components/test/Demo`;
> - For files within the `docs` directory, the rules are a bit different:
>   - All files imported from `docs` **SHOULD BE** aliased with the `@docs` prefix, so `@docs/components/Test` will actually point to `docs/components/Test`;
>   - All files imported from `src` **SHOULD BE** aliased with the `@blocks` prefix, so `@blocks/components/Test` will point to `src/components/Test`;
>   - The rule for the `@blocks` alias should **ONLY** be applied in files within the `docs` folder; 
> - Any SASS/SCSS file inside the `src/styles` folder can be imported globally, as if it comes from root. This rule applies to both `src` and `docs` folder, so you can place all your functions, mixins and helpers in the same place;

-----

## Requirements

You need at least [**Node.JS**](https://nodejs.org) `v12.x`, to run this project.

-----

## How To

You can clone/fork this repository or download a ZIP file, the easiest path, though, is to execute:

```
npx degit yuigoto/blokit your-local-name
```

Then just enter the project folder, run `npm install` and then:

- `npm run start` to start the application in the local development server;
- `npm run build` to generate minified files for the plugin to work;

There's also a `docker-compose` file if you really wish to test it on WordPress. It won't install WP and set up everything, so you'll have to do things manually for now (it already maps the plugin folder, but the rest it's still on my TODO list).

If you have the Docker daemon running, you can use these commands to execute:

- `npm run up` will run docker compose in detached mode, then just go to [http://localhost:8040](http://localhost:8040) to access it;
- `npm run down` will stop docker compose;

-----

## Block Template Generator

In this project we're using an opinionated block model. You can, of course, code the way you want and just import the blocks, but if you want to follow the model of this project, you can use the `generate` command like this:

```
npm run generate --name="Block Name" --path=path/to/block --prefix=prefix [--namespace=namespace]
```

It requires three arguments, and has a fourth, optional, which are:

- `prefix` is a required prefix for all blocks in the block editor;
- `name` is a human-readable name for the block, it will be slugified and prefix will be added before;
- `path` should be the path to the block folder relative to `src/blocks`;
- `namespace` is optional, and is used for the `__()` localization method;

The generated blocks have this structure:

```
path/to/block
    - index.tsx             // Main block file
    - info.json             // Contains block and attribute information
    - edit.tsx              // Component for the block editor interface
    - save.tsx              // Component rendered as the HTML output 
    - editor.scss           // CSS loaded in the editor only
    - style.scss            // CSS loaded in the editor AND theme
```

To compile this block, just import it on `src/index.tsx` and add it to the `blocksToRegister` array:

```
import * as TestBlock from "blocks/path/to/block";

const blocksToRegister = [
    // ...
    TestBlock,
];
```

Then it will become available in both test application and the plugin.

-----

## License

This project is licensed under the `GPLv3 License`. See `LICENSE.md` for details.

-----

## Authors

See `AUTHORS.md`.

-----

_&copy;2021 Fabio Y. Goto_
