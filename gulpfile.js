'use strict';

var path = require('path');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var cssSlam = require('css-slam').gulp;
var htmlMinifier = require('gulp-html-minifier');
var mergeStream = require('merge-stream');

global.config = {
    polymerJsonPath: path.join(process.cwd(), 'polymer.json'),
    build: {
        rootDirectory: 'build'
    },
    serviceWorkerPath: 'service-worker.js',
    swPrecacheConfig: {
        navigateFallback: '/index.html'
    }
};

var clean = require('./gulp-tasks/clean.js');
const images = require('./gulp-tasks/images.js');
var project = require('./gulp-tasks/project.js');

function source() {
    return project.splitSource()
        .pipe(gulpif(/\.js$/, uglify()))
        .pipe(gulpif(/\.css$/, cssSlam()))
        .pipe(gulpif(/\.html$/, htmlMinifier()))
        .pipe(gulpif('**/*.{png,gif,jpg,svg}', images.minify()))
        .pipe(project.rejoin());
}

function dependencies() {
    return project.splitDependencies()
        .pipe(gulpif(/\.js$/, uglify()))
        .pipe(gulpif(/\.css$/, cssSlam()))
        .pipe(gulpif(/\.html$/, htmlMinifier()))
        .pipe(project.rejoin());
}

gulp.task('default', gulp.series([
    clean.build,
    project.merge(source, dependencies),
    project.serviceWorker
]));
