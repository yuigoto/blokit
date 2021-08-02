/**
 * Returns a string with dash separators converted to camelCase.
 *
 * @param {string} string
 *     String de input
 * @return {string}
 */
const camelCaseDash = string => string
  .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());

/**
 * Imports loaded from WordPress globals.
 */
const externals = [
  "components",
  "api-fetch",
  "edit-post",
  "element",
  "plugins",
  "editor",
  "block-editor",
  "blocks",
  "hooks",
  "utils",
  "date",
  "data",
  "i18n",
].reduce(
  (externals, name) => ({
    ...externals,
    [`@wordpress/${name}`]: `wp.${camelCaseDash(name)}`,
  }),
  {
    wp: "wp",
    ga: "ga", 
    gtag: "gtag", 
    react: "React", 
    jquery: "jQuery", 
    "react-dom": "ReactDOM", 
    lodash: "lodash", 
  }
);

module.exports = externals;
