module.exports = function(grunt) {

    'use strict';

    // 자동으로 grunt 태스크를 로드합니다. grunt.loadNpmTasks 를 생략한다.
    require('load-grunt-tasks')(grunt);

    // 작업시간 표시
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' ======================================================================== \n' +
        ' * Project   : <%= pkg.name %>(<%= pkg.description %>) v<%= pkg.version %>\n' +
        ' * Publisher : <%= pkg.make.publisher %> (<%= pkg.make.email %>)\n' +
        ' * Build     : <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' ======================================================================== \n' +
        ' */\n',

        clean: {
            dev: {
                files: [{
                    dot: true,
                    src: [
                        'dev/**/*',
                        'app/css',
                        'dist/**/*'
                    ]
                }]
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'app/css',
                        'dist/**/*'
                    ]
                }]
            },
        },
       
// html task
        includes: {
            build: {
                cwd: 'app/docs/html/',
                src: ['**/*.html'],
                dest: 'dist/_service/kor/',
                options: {
                    flatten: true,
                    // debug: true,
                    includePath: 'app/docs/include/'
                }
            }
        },
        htmlhint: {
            options: {
                htmlhintrc: 'gruntConfig/.htmlhintrc'
            },
            dist: [
                'app/docs/html/**/*.html',
                'app/docs/include/**/*.html'
            ]
        },

// css task
        less: {
            dist: {
                options: {
                    banner: '<%= banner %>',
                    dumpLineNumbers : 'comments'
                },
                src: 'app/less/style.less',
                dest: 'app/css/style.css'
            },
        },

        csslint: {
            options: {
                csslintrc: 'gruntConfig/.csslintrc'
            },
            dist: {
                src: '<%= less.dist.dest %>'
            }
        },

        autoprefixer: {
             options: {
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24', // Firefox 24 is the latest ESR
                    'Explorer >= 8',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            dist: { // app -> dest 이동
                expand: true,
                cwd: 'app/css/',
                src: ['*.css',],
                dest: 'dist/_ui/css/'
            }
        },
        
        csscomb: {
            options: {
                config: 'gruntConfig/.csscomb.json'
            },
            files: {
                'dist/_ui/css/style.css': ['app/css/style.css'],
            }
        },

        cssmin: {
            options: {
                // compatibility: 'ie8',
                keepSpecialComments: 1,
                // default - '!'가 붙은 주석은 보존,
                // 1 - '!'가 붙은 주석 중 첫번째 주석만 보존
                // 0 - 모든 주석 제거
                // noAdvanced: true,
            },
            dist: {
                src: 'dist/_ui/css/style.css',
                dest: 'dist/_ui/css/style.min.css'
            }
        },
        
// javascript task
        jshint: {
            options: {
                jshintrc: 'gruntConfig/.jshintrc',
                force: true, // error 검출시 task를 fail 시키지 않고 계속 진단
                reporter: require('jshint-stylish') // output을 수정 할 수 있는 옵션
            },
            grunt: {
                src: ['Gruntfile.js']
            },
            dist: {
                expand: true,
                cwd: 'app/js/',
                src: ['*.js'],
                dest: 'app/js/'
            }
        },

        concat: {
            dist: {
                options: {
                    banner: '<%= banner %>'
                },
                src: 'app/js/*.js',
                dest: 'dist/_ui/js/common.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/_ui/js/common.min.js'
            }
        },


// others task
        imagemin: {
            options: {
                title: 'Build complete',  // optional
                message: '<%= pkg.name %> build finished successfully.' //required
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/images/',
                    src: '**/*.{png,jpeg,jpg,gif}',
                    dest: 'dist/_ui/images/'
                }]
            }
        },

        copy: {
            basic: {
                files: [ 
                    // fonts
                    {
                        expand: true,
                        cwd: 'app/fonts/',
                        src: '**',
                        dest: 'dist/_ui/fonts/'
                    },
                    // js
                    {
                        expand: true,
                        cwd: 'app/js/lib',
                        src: ['*.js'],
                        dest: 'dist/_ui/js/lib'
                    }
                ]
            },
            dev: { // 개발폴더를 위한 복사
                files: [
                    { // html folder
                        expand: true,
                        cwd: 'app/docs/html/',
                        src: '**',
                        dest: 'dev/_service/kor/'
                    },
                    { // include folder
                        expand: true,
                        cwd: 'app/docs/',
                        src: ['include/**/*'],
                        dest: 'dev/_service/kor/'
                    },
                    { // css
                        expand: true,
                        cwd: 'dist/css/',
                        src: '**',
                        dest: 'dev/_ui/css/'
                    },
                    { // js
                        expand: true,
                        cwd: 'dist/js/',
                        src: '**',
                        dest: 'dev/_ui/js/'
                    },
                    { // images
                        expand: true,
                        cwd: 'dist/_ui/images/',
                        src: '**',
                        dest: 'dev/_ui/images/'
                    },
                    { // fonts
                        expand: true,
                        cwd: 'dist/_ui/fonts/',
                        src: '**',
                        dest: 'dev/_ui/fonts/'
                    }
                ],
            }
        },

        // watch task
        watch: {
            options: {livereload: true},
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['newer:jshint:grunt']
            },
            js: {
                files: ['app/js/**/*.js'],
                tasks: ['newer:jshint:dist','concat','uglify']
            },
            less: {
                files: ['app/less/**/*.less'],
                tasks: ['less','csslint','autoprefixer','csscomb','concat']
            },
            img: {
                files: ['app/images/**/*.{gif,jpeg,jpg,png}'],
                tasks: ['newer:imagemin']
            },
            html: {
                files: ['app/docs/**/*.html'],
                tasks: ['htmlhint','includes']
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    livereload: 35729,
                    // keepalive: true,
                    base: 'dist',
                    open: 'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>/_service/kor/index.html'
                }
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dist: [
                'html',
                'css',
                'js',
                'newer:imagemin'
            ]
        },

        
    });

    
    // server
    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['connect', 'watch']);
        }

        grunt.task.run([
            'default', 
            'connect', 
            'watch'
        ]);
    });

    // html task
    grunt.registerTask('html', [
            'htmlhint',
            'includes'
        ]
    );
    // css task
    grunt.registerTask('css', [
            'less',
            'csslint',
            'autoprefixer',
            'csscomb',
            'cssmin'
        ]
    );

    // javascript task
    grunt.registerTask('js', [
            'newer:jshint',
            'concat',
            'uglify'
        ]
    );
    

    grunt.registerTask('build', [
            'clean:dev',
            'concurrent',
            'copy'
        ]
    );

    grunt.registerTask('default', [
            'clean:dist',
            'concurrent',
            'copy:basic'
        ]
    );

};
