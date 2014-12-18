/**
 * Created by Matt on 13/12/2014.
 */

'use strict';

var Gulp =          require('gulp');
var GulpUtil =      require('gulp-util')
var Forever =       require('forever-monitor');
var Plugins =       require('gulp-load-plugins')();
var SourceMaps =    require('gulp-sourcemaps');
var Browserify =    require('browserify');
var Transform =     require('vinyl-transform');
var Reactify =      require('reactify');
var del =           require('del');

var sources = {
    javascript:             './src/javascript/**/*.{js,jsx}',
    clientMain:             './src/javascript/main.js',
    lessStyleSheets:        './src/style-sheets/main.less',
    images:                 './src/images/**/*',
    bins:                   './src/bin/*',
    server:                 './src/server/**/*',
    routes:                 './src/javascript/routes.js'
}

var onError = GulpUtil.log;
process.on('uncaughtException', onError);

/*-----------------------------------------------------------------------------------------------*\
  Site build tasks
\*-----------------------------------------------------------------------------------------------*/

var jshintTasks = ['jshint', 'jshint-strict'];
jshintTasks.forEach(function(taskName)
{
    Gulp.task(taskName, function() {
        return Gulp.src(sources.javascript)
            .pipe(Plugins.react())
            .pipe(Plugins.jshint('./src/.jshintrc'))
            .pipe(Plugins.jshint.reporter('jshint-stylish'))
            .pipe(Plugins.if(taskName === 'jshint-strict',
                Plugins.jshint.reporter('fail'))
            );
    });
});

var builds = ['prod', 'dev'];
builds.forEach(function (build) {
    var distPath = './dist/' + build;
    var clientPath = distPath + '/client';
    var serverPath = distPath + '/server';
    var jsHintTask = (build === 'dev') ? 'jshint' : 'jshint-strict';

    var ifDev =  function(pipe) { return Plugins.if(build === 'dev', pipe); }
    var ifProd = function(pipe) { return Plugins.if(build === 'prod', pipe); }

    Gulp.task('javascript-' + build, [jsHintTask], function() {

        var browserify = Transform(function(filename) {
            return Browserify(filename, {
                    debug: build === 'dev', // Create source maps
                    basedir: './'
                })
                .transform(Reactify)
                .bundle();
        });

        return Gulp.src(sources.clientMain)
            .pipe(Plugins.plumber({errorHandler: onError}))
            .pipe(browserify)
            .pipe(Plugins.concat('main.js'))
            .pipe(Plugins.replace('!!BUILD!!', build))
            .pipe(ifProd(Plugins.uglify()))
            .pipe(Gulp.dest(clientPath))
    });

    Gulp.task('stylesheets-' + build, function() {
        return Gulp.src(sources.lessStyleSheets)
            .pipe(ifDev(SourceMaps.init()))
                .pipe(Plugins.less())
                .pipe(ifProd(Plugins.crass({pretty: false})))
            .pipe(ifDev(SourceMaps.write()))
            .pipe(Gulp.dest(clientPath))
    });

    Gulp.task('images-' + build, function() {
        return Gulp.src(sources.images)
            .pipe(Plugins.cache(Plugins.imagemin({optimizationLevel: 3, progressive: true})))
            .pipe(Gulp.dest(clientPath + '/images'));
    });

    Gulp.task('bin-' + build, function() {
        return Gulp.src(sources.bins)
            .pipe(Plugins.replace('!!BUILD!!', build))
            .pipe(Gulp.dest(distPath + '/bin'));
    });

    Gulp.task('server-' + build, function() {
        var jsxFilter = Plugins.filter('**/*.jsx');

        return Gulp.src([sources.server, sources.routes, sources.javascript])
            .pipe(Plugins.plumber({errorHandler: onError}))
            .pipe(Plugins.replace("require('../javascript/","require('./"))
            .pipe(Plugins.react())
            .pipe(Plugins.rename({extname: '.js'}))
            .pipe(Gulp.dest(serverPath));
    });

    //// Per build aggregate build tasks ////
    var tasks = ['stylesheets', 'javascript', 'images', 'bin', 'server'].map(function (task) {
        return task + '-' + build;
    });

    Gulp.task(build, tasks, function (done) {
        console.log("Completed " + build + " build.");
        done();
    });


    Gulp.task('clean-' + build, function(done) {
        del([destPath], done);
    });
});

/*-----------------------------------------------------------------------------------------------*\
 Aggregate build tasks
\*-----------------------------------------------------------------------------------------------*/

Gulp.task('run-dev-server', ['watch'], function() {
    var child = new (Forever.Monitor)('./dist/dev/bin/start');

    Plugins.livereload.listen();

    process.on('SIGINT', function () {
        console.log("Halting web server...")
        child.kill();
        process.exit();
    });

    child.start();

    var batching = false;
    var reloadBrowser = function () {
        if (!batching) {
            Plugins.livereload.changed();
        }
    };
    var restartServer = function () {
        batching = false;
        console.log("Restarting web server...");
        child.restart();
        setTimeout(reloadBrowser, 200);
    };

    Gulp.watch(['dist/dev/**']).on('change', function()
    {
        if (!batching)
        {
            batching = true;
            setTimeout(restartServer, 600);
        }
    });
});

Gulp.task('run-prod-server', ['prod'], function() {
    var child = new (Forever.Monitor)('./dist/prod/bin/start');


    process.on('SIGINT', function () {
        console.log("Halting web server...")
        child.kill();
        process.exit();
    });

    child.start();
});

Gulp.task('default', function () {
    return Gulp.start('dev');
})

Gulp.task('watch', ['dev'], function() {
    Gulp.watch(sources.lessStyleSheets, ['stylesheets-dev']);
    Gulp.watch(sources.javascript, ['javascript-dev', 'server-dev']);
    Gulp.watch(sources.server, ['server-dev']);
    Gulp.watch(sources.images, ['images-dev']);
});

Gulp.task('clean', function(done) {
    del(['dist/*'], done)
});


