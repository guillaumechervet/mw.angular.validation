module.exports = function (grunt) {
    // load Grunt plugins from NPM
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");
    // configure plugins
    grunt.initConfig({
        ts: {
            default: {
                src: ["app/**/*.ts", "!node_modules/**/*.ts"],
                tsconfig: true
            }
        },
        tslint: {
            options: {
                // can be a configuration object or a filepath to tslint.json
                configuration: "tslint.json"
            },
            files: {
                src: ["**/*.ts", "!node_modules/**/*.ts"]
            }
        },
        watch: {
            appFolderTs: {
                files: ['app/**/*.ts'],
                tasks: ['ts', 'tslint']
            },
            appFolderJs: {
                files: ['app/**/*.js'],
                tasks: ['uglify', 'jshint']
            },
            appFolderCss: {
                files: ['app/**/*.css'],
                tasks: ['cssmin']
            },
            appFolderHtml: {
                files: ['app/**/*.html'],
                tasks: ['ngtemplates']
            }
        },
        uglify: {
            my_target: {
                options: {
                    mangle: false
                },
                files: {
                    'wwwroot/app.js': [
                        'wwwroot/js/xdomain.js',
                        'wwwroot/js/jquery.js',
                        'wwwroot/js/leaflet.js',
                        'wwwroot/js/toastr.js',
                        'wwwroot/js/ace/ace.js',
                        'wwwroot/js/angular.js',
                        'wwwroot/js/angular-locale_fr.js',
                        'wwwroot/js/angular-route.js',
                        'wwwroot/js/angular-sanitize.js',
                        'wwwroot/js/angular-animate.js',
                        'wwwroot/js/angular-cookies.js',
                        'wwwroot/js/angular-touch.js',
                        'wwwroot/js/ui-ace.js',
                        'wwwroot/js/videogular.js',
                        'wwwroot/js/vg-controls.js',
                        'wwwroot/js/vg-overlay-play.js',
                        'wwwroot/js/vg-poster.js',
                        'wwwroot/js/vg-buffering.js',
                        'wwwroot/js/load-image.js',
                        'wwwroot/js/load-image-ios.js',
                        'wwwroot/js/load-image-orientation.js',
                        'wwwroot/js/load-image-meta.js',
                        'wwwroot/js/load-image-exif.js',
                        'wwwroot/js/load-image-exif-map.js',
                        'wwwroot/js/canvas-to-blob.js',
                        'wwwroot/js/jquery.ui.widget.js',
                        'wwwroot/js/jquery.iframe-transport.js',
                        'wwwroot/js/jquery.fileupload.js',
                        'wwwroot/js/jquery.fileupload-process.js',
                        'wwwroot/js/jquery.fileupload-image.js',
                        'wwwroot/js/jquery.fileupload-audio.js',
                        'wwwroot/js/jquery.fileupload-video.js',
                        'wwwroot/js/jquery.fileupload-validate.js',
                        'wwwroot/js/jquery.fileupload-angular.js',
                        'wwwroot/js/jquery.postmessage-transport.js',
                        'wwwroot/js/jquery.xdr-transport.js',
                        'wwwroot/js/ui-bootstrap-tpls.js',
                        'wwwroot/js/ng-google-chart.js',
                        'wwwroot/js/bootstrap-colorpicker-module.js',
                        'wwwroot/js/angular-simple-logger.js',
                        'wwwroot/js/angular-leaflet-directive.js',
                        'wwwroot/js/rangy-core.js',
                        'wwwroot/js/rangy-selectionsaverestore.js',
                        'wwwroot/js/textAngular-sanitize.js',
                        'wwwroot/js/textAngular.js',
                        'wwwroot/js/textAngularSetup.js',
                        'Scripts/globalize/globalize.js',
                        'Scripts/globalize/cultures/globalize.culture.fr.js',
                        'Scripts/Validation/App_Output/mw.debug.js',
                        'wwwroot/js/angular-social-links.js',
                        'App/app.js',
                           'App/shared/providers/**/*.js',
                          "App/shared/interceptors/**/*.js",
                          'wwwroot/templates.js',
                          "App/run.js",
                          "App/config.js",
                          "App/shared/controllers/**/*.js", 
                          "App/shared/directives/**/*.js",
                          "App/shared/services/**/*.js", 
                          "App/shared/dialog/**/*.js", 
                          "App/shared/controllers/**/*.js",
                           "App/shared/socials/**/*.js",
                          "App/shared/menu/**/*.js",
                          "App/default/**/*.js",
                           "App/comment/**/*.js",
                          "App/user/**/*.js", 
                          "App/free/**/*.js",
                          "App/news/**/*.js", 
						"App/admin/**/*.js",
						"App/addSite/**/*.js", 
                          "App/contact/**/*.js"
                    ]
                }
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/lib",
                    layout: "byType",
                    cleanTargetDir: false
                }
            }
        },
        ngtemplates: {
            app: {
                src: 'App/**/*.html',
                dest: 'wwwroot/templates.js'
            },
            options: {
                htmlmin: { collapseWhitespace: true, collapseBooleanAttributes: true },
                prefix: '/',
                bootstrap: function (module, script) {
                    return "(function () {'use strict';angular.module('mw').factory('preLoaderTemplate', ['$templateCache',  function ($templateCache) {" + script + ' return {}; }]);}());';
                }
            }
        },
        cssmin: {
            dist: {
                files: {
                    'wwwroot/css/site.min.css': [
                        "wwwroot/css/bootstrap.css",
    "wwwroot/css/jquery.fileupload-ui.css",
    "wwwroot/css/jquery.fileupload.css",
    "wwwroot/css/toastr.css",
    "App/site.css",
    "App/loader.css",
    "App/admin/administration.css",
    "App/admin/addModule/addModule.css",
    "App/animate.css",
    "App/shared/menu/menu.css",
    "App/shared/menu/menuTop.css",
    "App/shared/menu/menuRight.css",
    "App/news/news.css",    
    "App/comment/comment.css",    
    "App/free/free.css",
    "App/free/video.css",
    "App/free/add/addElement.css",
    "App/contact/contact.css",
    "App/user/user.css",
    "wwwroot/css/colorpicker.css",
    "wwwroot/css/angular-socialshare.css",
    "wwwroot/css/bootstrap-social.css", 
    "wwwroot/css/leaflet.css",
    "wwwroot/css/font-awesome.css"]
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within paths
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.css'], dest: 'wwwroot/css' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.js'], dest: 'wwwroot/js' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/ace-builds/src-min-noconflict/*.js'], dest: 'wwwroot/js/ace' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.png'], dest: 'wwwroot/css/images' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.jpg'], dest: 'wwwroot/css/images' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.jpeg'], dest: 'wwwroot/css/images' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.jpeg'], dest: 'wwwroot/css/images' },
                    { expand: true, flatten: true, src: ['bower_components/blueimp-file-upload/img/*.gif'], dest: 'wwwroot/img' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.eot'], dest: 'wwwroot/fonts' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.svg'], dest: 'wwwroot/fonts' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.ttf'], dest: 'wwwroot/fonts' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.woff'], dest: 'wwwroot/fonts' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.woff2'], dest: 'wwwroot/fonts' },
                    { expand: true, flatten: true, src: ['wwwroot/lib/*/*.otf'], dest: 'wwwroot/fonts' },
                    { expand: true, flatten: true, src: ['wwwroot/fonts/*'], dest: 'wwwroot/css/fonts' }
                ]
            }
        },
        jshint: {
            all: ['App/**/*.js']
            
        }
    });

    // define tasks
    grunt.registerTask("default", ["bower:install", 'copy', 'ngtemplates', 'ts', 'uglify', 'cssmin', 'watch']);
    grunt.registerTask("production", ["bower:install", 'copy', 'ngtemplates', 'ts', 'uglify', 'cssmin']);
    
};