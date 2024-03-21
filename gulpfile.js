const gulp = require("gulp");
const scss = require("gulp-dart-sass");

const buildTo = "docs";

gulp.task("move files", () => gulp.src([
	"src/**/*",
	"!src/react",
	"!src/react/**/*",
	"!src/scss",
	"!src/scss/**/*",
	"!src/utils",
	"!src/utils/**/*",
	"!src/index.scss",
	"!src/index.jsx"
]).pipe(gulp.dest(buildTo)));

gulp.task("scss", () => gulp.src("src/index.scss")
	.pipe(scss())
	.pipe(gulp.dest(buildTo)));

gulp.task("build", gulp.parallel(
	"move files",
	"scss"
));