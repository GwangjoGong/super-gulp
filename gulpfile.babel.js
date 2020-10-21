import gulp from 'gulp'
import pugPlugin from 'gulp-pug'
import imagePlugin from 'gulp-image'
import sassPlugin from 'gulp-sass'
import autoPrefixer from 'gulp-autoprefixer'
import minify from 'gulp-csso'
import del from 'del'
import ws from 'gulp-webserver'

const routes = {
  pug: {
    watch: 'src/**/*.pug',
    src: 'src/*.pug',
    dest: 'build'
  },
  images: {
    src: 'src/img/*',
    dest: 'build/img'
  },
  scss: {
    watch: 'src/scss/*.scss',
    src: 'src/scss/style.scss',
    dest: 'build/css'
  }
}

const clean = () => del(['build'])

const pug = () =>
  gulp.src(routes.pug.src).pipe(pugPlugin()).pipe(gulp.dest(routes.pug.dest))

const img = () =>
  gulp
    .src(routes.images.src)
    .pipe(imagePlugin())
    .pipe(gulp.dest(routes.images.dest))

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sassPlugin().on('error', sassPlugin.logError))
    .pipe(autoPrefixer())
    .pipe(minify())
    .pipe(gulp.dest(routes.scss.dest))

const webserver = () =>
  gulp.src('build').pipe(ws({ livereload: true, open: true }))

const watch = () => {
  gulp.watch(routes.pug.watch, pug)
  gulp.watch(routes.images.src, img)
  gulp.watch(routes.scss.watch, styles)
}

export const prepare = gulp.series([clean])

export const assets = gulp.series([pug, img, styles])

export const postDev = gulp.parallel([webserver, watch])

export const dev = gulp.series([prepare, assets, postDev])
