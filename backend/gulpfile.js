const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const nodemon = require("gulp-nodemon");
const argv = require("yargs").argv;
const sourcemaps = require("gulp-sourcemaps");

const tsProject = ts.createProject("tsconfig.json");

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
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write(".", {includeContent: false, sourceRoot: '../src'}))
        .pipe(gulp.dest("dist"));
});

gulp.task("start", function () {
    nodemon({
        script: "dist/server.js",
        tasks: ["tslint"],
        ext: "js html",
        env: {"NODE_ENV": "development"},
        watch: ["dist"]
    });
});

gulp.task("production", function () {
    nodemon({
        script: "dist/server.js",
        ext: "js html",
        env: {"NODE_ENV": "production"},
        watch: ["dist"]
    });
});

gulp.task("debug", function () {
    nodemon({
        exec: "node --inspect",
        script: "dist/server.js",
        tasks: ["tslint"],
        ext: "js html",
        env: {"NODE_ENV": "development"},
        watch: ["dist"]
    });
});

gulp.task("watch", () => {
    gulp.watch("src/**/*.ts", gulp.series(["build"]));
});

if(argv.production) {
    gulp.task("default", gulp.series(["build", "production"]));
} else {
    if (argv.debug) {
        gulp.task("default", gulp.series(["build", gulp.parallel(["watch", "debug"])]));
    } else {
        gulp.task("default", gulp.series(["build", gulp.parallel(["watch", "start"])]));
    }
}
