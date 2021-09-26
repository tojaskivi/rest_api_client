const { src, dest, watch, parallel, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const server = require("gulp-server-livereload");
const terser = require("gulp-terser");
const cssnano = require("gulp-cssnano");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");

const files = {
  htmlPath: "src/html/*.html",
  sassPath: "src/css/*.scss",
  jsPath: "src/js/*.js",
  assetsPath: "src/assets/*.*"
};

function jsTask() {
    return src(files.jsPath).pipe(dest("pub/js"));
}

function htmlTask() {
  return src(files.htmlPath).pipe(dest("pub/"));
}

function sassTask() {
  return src(files.sassPath)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(dest("pub/css"))
};

function assetsTask(){
    return src(files.assetsPath).pipe(dest("pub/assets"));
}

function watchTask() {
  watch([files.htmlPath], htmlTask);
  watch([files.sassPath], sassTask);
  watch([files.jsPath], jsTask);
  watch([files.assetsPath], assetsTask);
}

// Liveserver with reload
function liveServer() {
  // rotmappen för servern är pub
  return (
    src("pub/")
      // starta live server
      .pipe(
        server({
          livereload: true,
          open: true,
          port: 3001,
        })
      )
  );
}

exports.default = series(liveServer, watchTask);
