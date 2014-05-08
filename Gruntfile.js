/*
 * Generated on 2014-05-07
 * generator-assemble v0.4.11
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  var pretty = require('pretty');

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('site.yml'),

    jshint: {
      options: {jshintrc: '.jshintrc'},
      all: [
        'Gruntfile.js',
        '<%= site.templates %>/helpers/*.js'
      ]   
    },  

    watch: {
      assemble: {
        files: ['src/{content,data,templates,styles}/{,*/,**/}*.{md,hbs,yml,less}'],
        tasks: ['less','assemble']
      },  
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>',
        },  
        // seems to be an issue where <%= site.src %> variables can't be accessed here
        files: [
          '_site/addons/{,*/}*.html',
          '_site/addons/{,*/}*.css',
          '_site/addons/{,*/}*.js',
          '_site/addons/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]   
      }   
    },  

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: '_site'
        }
      }
    },

    // Compile Less to CSS
    less: {
      options: {
        paths: ['<%= site.styles %>', '<%= site.styles %>/bootstrap' ]
      },
      pages: {
        src: ['<%= site.styles %>/style.less'],
        dest: '<%= site.assets %>/css/style.css'
      }
    },

    assemble: {
      options: {
        // Metadata
        today: '<%= grunt.template.today() %>',
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        flatten: true,
        assets: '<%= site.assets %>',
        data: '<%= site.data %>/*.{json,yml}',
        // Extensions
        plugins: '<%= site.plugins %>',
        layoutdir: '<%= site.layouts %>',
        layout: 'default.hbs',
        partials: '<%= site.partials %>/*.hbs',
        compose: {cwd: '<%= site.content %>'},
        marked: {
          process: true,
          heading: '<%= site.markedtemplates %>/heading.tmpl',
        },
        toc: {
          modifier: 'nav sidenav',
          li: 'nav',
        },
        postprocess: pretty
      },
      addons: {
        files: {
          '<%= site.dest %>/addons/': ['<%= site.pages %>/*.hbs']
        }
      }
    },

    prettify: {
      pages: {
        files: [
          {expand: true, cwd: '<%= site.dest %>', src: '*.html', dest: '<%= site.dest %>', ext: '.html'}
        ]
      },
    },


    // Before generating any new files,
    // remove any previously-created files.
    clean: ['<%= site.dest %>/**/*.{html,xml}']

  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-prettify');

  grunt.registerTask('server', [
    'jshint',
    'clean',
    'less',
    'assemble',
    'prettify',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'clean',
    'less',
    'assemble',
    'prettify'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
