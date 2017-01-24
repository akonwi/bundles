spawn = require('child_process').spawnSync

module.exports = (grunt) ->
  grunt.initConfig
    browserify:
      options:
        transform: ['babelify']
      dist:
        files:
          'dist/app.js': ['src/index.js']
    watch:
      styles:
        files: 'styles.css'
        tasks: ['dist:dev']
      js:
        files: ['src/**/**.js', '__tests__/**/**.js']
        tasks: ['test', 'browserify', 'dist:dev']

  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.registerTask 'default', ['browserify', 'dist:dev', 'watch']
  grunt.registerTask 'test', () ->
    {status} = spawn 'npm', ['test'], stdio: 'inherit'
    status is 0
  grunt.registerTask 'dist:dev', () ->
    grunt.log.writeln 'Copying to live folder...'
    {status} = spawn 'npm', ['run', 'dist:dev'], stdio: 'inherit'
    status is 0
