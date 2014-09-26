// Gruntfile.js
module.exports = function(grunt) {

  grunt.initConfig({

    // JS TASKS ================================================================
    // check all js files for errors
    jshint: {
      all: ['views/private/js/**/*.js'] 
    },

    // take all the js files and minify them into app.min.js
    uglify: {
      options: {
        mangle: false
      },
      build: {
        files: {
          'views/public/js/app.min.js': ['views/private/js/**/*.js']
        }
      }
    },

    // CSS TASKS ===============================================================
    // process the less file to style.css
    // less: {
    //   build: {
    //     files: {
    //       'public/dist/css/style.css': 'public/src/css/style.less'
    //     }
    //   }
    // },

    // take the processed style.css file and minify
    // cssmin: {
    //   build: {
    //     files: {
    //       'public/dist/css/style.min.css': 'public/dist/css/style.css'
    //     }
    //   }
    // },

    // COOL TASKS ==============================================================
    // watch css and js files and process the above tasks
    watch: {
      // css: {
      //   files: ['public/src/css/**/*.less'],
      //   tasks: ['less', 'cssmin']
      // },
      js: {
        files: ['views/private/js/**/*.js', 'views/private/js/*.js'],
        tasks: ['jshint', 'uglify']
      }
    },

    // watch our node server for changes
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

  // run watch and nodemon at the same time
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['nodemon', 'watch']
    },

    wiredep: {

      target: {

        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
          'views/private/**/*.html',   // .html support...
          'views/private/**/*.ejs'
        ],

        // Optional:
        // ---------
        options: {
          cwd: '',
          dependencies: true,
          devDependencies: false,
          exclude: [],
          fileTypes: {},
          ignorePath: '',
          overrides: {}
        }
      }
    }   

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.registerTask('default', ['wiredep', 'jshint', 'uglify', 'concurrent']);

};