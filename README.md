# Voices of Tomorrow Website

To add content, edit `/data/content.json` accordingly. Multi-paragraph texts
should be extracted into markdown files and included via `text_file` to ease
handling and formatting of longer texts.

## Build the site

```
npm install
npm run build
```

Will download all dependencies and then compile SASS + templates and minify
images placed in the `/images` folder. The product of that process will be placed
in `/dist`. It's an entirely static version which can be shipped by any HTTP server.
