var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mkdirPSync = require('./utils').mkdirPSync;

var OUTPUT_FILE_PATH = './out/digg.csv';

function digg() {
  /* Utility to make sure our output directory is created */
  mkdirPSync('./out');

  fs.writeFileSync(OUTPUT_FILE_PATH, '"Title","Description","Url","Image"\n');

  request('http://digg.com/', function (err, response, body) {
    if (err) {
      console.error(err);
    } else {
      var $ = cheerio.load(body);
      var storyCards = $('.digg-story-card');
      storyCards.each(function () {
        var card = $(this);

        var title = card.find('.digg-story__content').find('.digg-story__title-link').text();
        var description = card.find('.digg-story__content').find('.digg-story__description').text();
        var url = card.find('.digg-story__image--thumb').find('a').attr('href') || card.find('.digg-story__image--marquee').find('a').attr('href');
        var image = card.find('.digg-story__image--thumb').find('img').attr('src') || card.find('.digg-story__image--marquee').find('img').attr('src');

        if (process.argv[2] === '--logging') {
          console.log('Title: ' + title + '\n');
          console.log('Description: ' + description + '\n\n');
          console.log('Url: ' + url + '\n');
          console.log('Image: ' + image + '\n');
        }

        var strippedRows = [title, description, url, image].map(function (value) {
          value = value || '';
          /* This regular expression removes newline characters, replaces double quotes with single */
          value = value.replace(/\n|\r/g, '').replace(/"/g, '\'');
          /* Wraps each value in quote marks: csv requirement */
          return '"' + value + '"';
        });

        fs.appendFileSync(OUTPUT_FILE_PATH, strippedRows.join(',') + '\n');
      });
    }
  });
}

module.exports = digg;