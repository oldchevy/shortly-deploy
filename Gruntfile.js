module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [
          'public/lib/jquery.js',
          'public/lib/underscore.js',
          'public/lib/backbone.js',
          'public/lib/handlebars.js',
          'public/client/*.js'
        ],
        dest: 'public/dist/<%= pkg.name %>.js'        
      }
    },

    concurrent: {
      dev: [
        'nodemon',
        'watch'
      ],
      options: {
        logConcurrentOutput: true
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: 'public/dist/<%= pkg.name %>.js',
        dest: 'public/dist/<%= pkg.name %>.min.js'
      }
    },

    eslint: {
      target: [
        'app/**/*.js',
        '*.js',
        'public/**/*.js',
        'test/**/*.js'
      ]
    },

    cssmin: {
      dist: {
        src: [
          'public/*.css'
        ],
        dest: 'public/dist/style.min.css'        
      }
    },

    watch: {
      scripts: {
        files: [
          'public/lib/**/*.js',
          'public/client/**/*.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push live4 master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run(['concurrent']);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////
  grunt.registerTask('test', function (target) {
    grunt.task.run([ 'mochaTest' ]);
  });

  grunt.registerTask('test', [
    // 'mochaTest',
    'eslint'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run([ 'shell:prodServer' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    //test,
    //lint,
    //uglify,
    //css minify, (only public assets)
    //concat public assets
    'test',
    'build',
    'upload'
  ]);


};
