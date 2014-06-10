/*
 * Generated on 2014-05-07
 * generator-assemble v0.4.11
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  var pretty = require('pretty');
  var yfm = require('yfm');
  var _ = require('lodash');

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('site.yml'),

    shuffle: {
     listings: { 
        dest: '<%= site.data %>/my-listings.json'
      }
    },  

    jshint: {
      options: {jshintrc: '.jshintrc'},
      all: [
        'Gruntfile.js',
        '<%= site.templates %>/helpers/*.js',
        'src/data/*.js'
      ]   
    },  

    watch: {
      assemble: {
        files: ['src/{content,data,templates,styles}/{,*/,**/}*.{md,hbs,yml}'],
        tasks: ['assemble']
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
        helpers: ['src/extensions/*.js', 'handlebars-helper-rel'],
        compose: {cwd: '<%= site.content %>'},
        marked: {
          process: true,
          heading: '<%= site.markedtemplates %>/heading.tmpl',
        },
        postprocess: pretty
      },
      listings: {
        options: {
          layout: 'default.hbs',
          permalinks: {
            structure: ':id/:slug/index:ext'
          }   
        },  
        files: {
          '<%= site.dest %>/addons/listing/': ['<%= site.pages %>/listing/*.hbs']
        }   
      },  
      addons: {
        files: {
          '<%= site.dest %>/addons/': ['<%= site.pages %>/*.hbs']
        }
      },
      showcases: {
        options: {
          site: '<%= site %>',
          layout: 'showcase.hbs',
          permalinks: {
            structure: ':session/:basename/index:ext'
          }   
        },  
        files: {
          '<%= site.dest %>/addons/showcase/': ['<%= site.pages %>/showcase/*.hbs']
        }   
      },  
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-prettify');

  grunt.registerMultiTask('mkdata', 'read listing yfm data', function() {
      grunt.log.writeln("utility task mkdata loads assemble data " + this.target + "[] from yfm content to allow definition of data once only within content");
//    grunt.log.writeln(this.target + ': ' + this.data);
//    grunt.log.writeln(this.name + ": " + this.data.srcdir);
    var addonlistings = [];
    var aoc = grunt.file.readJSON('src/data/listings.json');
    grunt.log.writeln("aoc length: " + aoc.listings[0].featured.length);

    var files = grunt.file.expand(this.data.srcdir);
    var len = files.length;
    for (var i = 0; i < len; i++) {
      var fmatter = yfm.read(files[i]).context;
      grunt.log.writeln("loading yfm from file: " + files[i]);
      addonlistings.push(fmatter);
    }
    // shuffle the array to randomise the order of listing on the front page
    var shuffled = _.shuffle(addonlistings);
    grunt.file.write(this.data.dest, JSON.stringify(shuffled) );

  });

  grunt.registerMultiTask('shuffle', 'shuffle listing data', function() {

      grunt.log.writeln("utility task shuffle loads assemble data " + this.target + "[]");
//    grunt.log.writeln(this.target + ': ' + this.data);
//    grunt.log.writeln(this.name + ": " + this.data.srcdir);
    var aoc = grunt.file.readJSON('src/data/listings.json');

    // shuffle the array to randomise the order of listing on the front page
    var shuffled = _.shuffle(aoc);
    grunt.file.write(this.data.dest, JSON.stringify(shuffled) );

  });

  grunt.registerTask('server', [
    'jshint',
    'clean',
    'shuffle',
    'assemble',
    'prettify',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'clean',
    'shuffle',
    'assemble',
    'prettify'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
