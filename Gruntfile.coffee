module.exports = (grunt) ->
  grunt.initConfig
    sass:
      dist:
        options:
          style: 'compressed'
          update: true
        files:
          'styles.css': 'styles.sass'
    browserify:
      options:
        transform: ['babelify']
      dist:
        files:
          'dist/app.js': ['lib/chrome-storage.js', 'src/popup.jsx', 'src/bundle.js', 'src/bundle-store.js']
          'dist/specs.js': ['spec/*.js']
    watch:
      styles:
        files: 'styles.sass'
        tasks: 'sass'
      jsx:
        files: 'src/popup.jsx'
        tasks: 'browserify'
      js:
        files: ['src/*.js']
        tasks: 'browserify'

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.registerTask 'default', ['sass', 'browserify', 'watch']
