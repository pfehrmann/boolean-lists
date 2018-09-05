var gulp = require("gulp");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");

var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", ["tslint", "build", "watch"]);

gulp.task("watch", () => {
  return gulp.watch("src/**/*", ["tslint", "build"]);
})

gulp.task("tslint", () => {
  gulp.src("src/**/*.ts")
        .pipe(tslint({
            formatter: "stylish"
        }))
        .pipe(tslint.report({
           emitError: false
        }))
});

gulp.task("build", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});
