
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          paths: ['']
        },
        files: {
          'css/index.css': ['less/index.less']
        }
      }
    },
    watch: {
      options: {
        livereload: false
      },
      less: {
        files: 'less/*.less',
        tasks: 'less'
      }
    }

  });

  // 加载 任务插件。
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 默认被执行的任务列表。
  grunt.registerTask('local', ['less', 'watch']);

};