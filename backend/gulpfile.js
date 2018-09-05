const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const nodemon = require("gulp-nodemon");
const argv = require("yargs").argv;

const tsProject = ts.createProject("tsconfig.json");

if(argv.debug) {
    gulp.task("default", ["build", "debug", "tslint", "watch"]);
} else {
    gulp.task("default", ["build", "start", "tslint", "watch"]);
}

gulp.task("watch", () => {
    gulp.watch("src/**/*.ts", ["tslint", "build"]);
});

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

gulp.task("start", function () {
    nodemon({
        script: "dist/server.js",
        ext: "js html",
        env: {"NODE_ENV": "development"}
    });
});

gulp.task("debug", function () {
    nodemon({
        exec: "node --inspect-brk",
        script: "dist/server.js",
        ext: "js html",
        env: {"NODE_ENV": "development"}
    });
});
