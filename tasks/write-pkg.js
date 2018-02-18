const fs = require('fs');
const replace = require('gulp-replace');
const jeditor = require('gulp-json-editor');
const findPackages = require('./utils/findPackages');
const all = require('./utils/all');

const writePackage = () => {
  const pkg = require('../package.json');///

  fs.writeFileSync(`${__dirname}/../package.json`, JSON.stringify(pkg, null, 2), {});

  const newPgk = Object.keys(pkg)
    .filter(key => ['scripts', 'devDependencies'].indexOf(key) === -1)
    .reduce((acc, key) => {
      acc[key] = pkg[key];
      return acc;
    }, {});

  newPgk.main = 'lib/index.js';
  newPgk.typings = 'lib/index.d.ts';
  newPgk.dependencies['@tsed/core'] = pkg.version;
  newPgk.dependencies['@tsed/common'] = pkg.version;

  fs.writeFileSync(`${__dirname}/../dist/package.json`, JSON.stringify(newPgk, null, 2), {
    encode: 'utf8'
  });

  return newPgk;
};

module.exports = (gulp) => {
  const version = require('../package.json').version;
  const { repository, keywords, bugs, license, homepage, author } = writePackage();

  const streams = findPackages().map((pkg) =>
    gulp
      .src([
        'src/' + pkg + '/package.json'
      ], { base: './' + 'src/' + pkg })
      .pipe(replace('0.0.0-PLACEHOLDER', version))
      .pipe(jeditor({
        repository,
        keywords,
        bugs,
        homepage,
        author,
        license
      }))
      .pipe(gulp.dest('dist/packages/' + pkg))
  );

  return all(...streams);
};