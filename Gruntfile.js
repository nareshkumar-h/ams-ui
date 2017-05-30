// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {
 
    // Project configuration.
    grunt.initConfig({
    	// get the configuration info from package.json
        // this way we can use things like name and version (pkg.name)
        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),
 
     
 
        // Task configuration.
              
              
    concat: {
            options: {
                stripBanners: true
            },
            dist: {
                src: ['app/scripts/*.js' , 'assets/JS/*.js', 'theme/js/*.js'],
                dest: '.tmp/concat/app/scripts/optimized.js'
            },
         
        },
      
        
       uglify: {
            js: { //targets
                src: ['.tmp/concat/app/scripts/optimized.js'],
                dest: 'dist/app/scripts/optimized.js'
            }},
            
            cssmin: {
            	  options: {
            	    shorthandCompacting: false,
            	    roundingPrecision: -1
            	  },
            	  target: {
            	    files: {
            	      'dist/assets/css/optimized.css': ['assets/css/*.css', 'theme/css/*.css']
            	    }
            	  }
            	},
            	 htmlmin: {
               	  options: {
               	    shorthandCompacting: false,
               	    roundingPrecision: -1
               	  },
               	  target: {
               	    files: {
               	      'dist/app/views/optimized.html': ['app/views/*.html',]
               	    }
               	  }
               	},
            
           /* htmlmin: {                                     // Task 
                dist: {                                      // Target 
                  options: {                                 // Target options 
                    removeComments: true,
                    collapseWhitespace: true
                  },
                  files: {                                   // Dictionary of files 
                    'dist/index.html': 'AMS_UI/index.html',     // 'destination': 'source' 
                    
                  }
                }*/
            	/*dev: {                                       // Another target 
                    files: [{
                      expand: true,
                     // cwd: 'app',
                      src: ['app/views/*.html', '*.html'],
                      dest: 'dist'
                  }]
                }
            }*/
            
   
 
       
    });
     //LOAD GRUNT PLUGINS
    // These plugins provide necessary tasks.
    // we can only load these if they are in our package.json
    // make sure you have run npm install so our app can find these
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
 
 
    // Default task
    grunt.registerTask('default', ['concat','uglify','cssmin','htmlmin']);

 
};
