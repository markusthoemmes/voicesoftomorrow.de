const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const template = require('gulp-template');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');

const fs = require('fs');
const markdown = require('markdown-it')({html: true});

const sassPaths = [
  'node_modules/foundation-sites/scss'
];

gulp.task('sass', () => {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths,
      outputStyle: 'compressed' // if css compressed **file size**
    })
    .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('pages', () => {
  const dataFolder = './data/'
  const data = require(dataFolder + 'content.json');
  const characters = '280';

  const years = data.map(site => site.year);
  const indexYear = years[0];

  const generateFilename = year => year === indexYear ? 'index.html' : `${year}.html`

  return data.map(site => {
    if(site.info.text_file) {
      site.info.text = markdown.render(fs.readFileSync(dataFolder + site.info.text_file, 'utf8'));
    }

    // Load markdown files and parse them accordingly
    site.lineup.map(band => {
      const text = fs.readFileSync(dataFolder + band.text_file,'utf8');

      if(text.length > characters) {
        const shortenedText = text.substr(0, characters);
        band.full_text = markdown.render(text + ' <span class="more">Weniger lesen</span>');
        band.short_text = markdown.render(shortenedText + '&hellip; <span class="more">Mehr lesen</span>');
      }
      else {
        band.full_text = markdown.render(text);
        band.short_text = markdown.render(text);
      }
      return band;
    });

    // Generate history links
    site.history_links = years.filter(year => year !== site.year).map(year => ({
      year: year,
      link: generateFilename(year)
    }));

    return gulp.src('html/template.html')
      .pipe(template(site))
      .pipe(rename(generateFilename(site.year)))
      .pipe(gulp.dest('dist'))
  });
});

gulp.task('impressum', () => {
  return gulp.src('html/impressum.html')
    .pipe(gulp.dest('dist'))
});

gulp.task('images', () => {
  return gulp.src('images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
});

gulp.task('build', ['sass', 'pages', 'impressum', 'images']);

gulp.task('default', ['build'], () => {
  gulp.watch(['scss/**/*.scss', 'data/**/*', 'html/**/*'], ['build']);
});
