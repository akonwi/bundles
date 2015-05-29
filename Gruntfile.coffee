module.exports = (grunt) ->
  grunt.initConfig
    sass:
      dist:
        options:
          style: 'compressed'
          update: true
        files:
          'styles.css': 'styles.sass'
    babel:
      options:
        sourceMap: true
      dist:
        files:
          'popup.js': 'src/popup.jsx'
    watch:
      styles:
        files: 'styles.sass'
        tasks: 'sass'
      jsx:
        files: 'src/popup.jsx'
        tasks: 'babel'

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-babel'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.registerTask 'default', ['sass', 'babel', 'watch']
