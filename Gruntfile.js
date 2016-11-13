module.exports = function(grunt) {
	var es2015 = require('babel-preset-es2015');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'tmp/index.css': 'src/sass/index.sass',
								'tmp/calendar.css': 'src/sass/calendar.sass'
            }
        }
    },
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					'tmp/index.min.css': 'tmp/index.css',
					'tmp/calendar.min.css': 'tmp/calendar.css'
				}
			}
		},
		uglify: {
			options: {
				mangle: false,
				compress: false
			},
			build: {
				src: [
					'tmp/index_es5.js'
				],
				dest: 'public/app.js'
			}
		},
		babel: {
			options: {
				sourceMap: false,
				"presets": es2015
			},
			dist: {
				files: {
					"tmp/index_es5_require.js": "src/client/index.js",
          "tmp/calendar/event-chain.js": "src/client/calendar/event-chain.js",
          "tmp/helpers/minutes-to-time.js": "src/client/helpers/minutes-to-time.js",
          "tmp/helpers/random-int.js": "src/client/helpers/random-int.js",
				}
			}
		},
		concat: {
			js: {
				src: [
					'src/vendor/jquery-2.1.4.min.js',
					'src/vendor/semantic.min.js',
				],
				dest: 'public/vendor.bundle.min.js'
			},
			css: {
				options: {
					separator: ''
				},
				src: [
					'src/vendor/semantic.min.css',
					'tmp/index.min.css',
					'tmp/calendar.min.css'
				],
				dest: 'public/bundle.min.css'
			}
		},
    browserify: {
      dist: {
        files: {
          "tmp/index_es5.js": "tmp/index_es5_require.js"
        },
        options: {
        }
      }
    }
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-browserify');

	require('load-grunt-tasks')(grunt);

	//grunt.registerTask('default', ['sass', 'babel', 'browserify', 'uglify', 'cssmin', 'concat']);
  grunt.registerTask('default', ['sass', 'babel', 'browserify', 'uglify', 'cssmin', 'concat']);
};
