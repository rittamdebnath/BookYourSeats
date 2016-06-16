var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass');

gulp.task('sass', function() {
    return gulp.src('css/*.sass')
        .pipe(sass())
        .pipe(gulp.dest('css/'))
        .pipe(connect.reload());
});


gulp.task('watch', function() {
    gulp.watch('css/*.sass', ['sass']);
    gulp.watch('**/*.js');
    gulp.watch('**/*.html');
});

gulp.task('connect', function() {
    connect.server({
        root: '',
        livereload: true
    });
});



gulp.task('default', ['sass', 'connect', 'watch']);
