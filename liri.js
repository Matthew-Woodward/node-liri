require("dotenv").config();
let fs = require('fs');
let Spotify = require('node-spotify-api');
let keys = require('./keys.js')
let request = require('request');
let selection = process.argv[2];
let query = process.argv.slice(3).join(' ')

function spotify(songName) {
    let spotify_client = new Spotify(keys.spotifyKeys)
    let searchQuery = { type: 'track', query: songName, limit: 10 }

    if (songName === 'The Sign') {
        spotify_client
            .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
            .then(function (data) {
                console.log('Track Name', data.name)
                console.log('Album Name: ' + data.album.name)
                console.log('Artist Name: ' + data.artists[0].name)
                console.log('Preview URL: ' + data.preview_url + '\n')
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    }

    else {
        spotify_client.search(searchQuery, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            data.tracks.items.forEach(function (item) {
                track = 'Track Name: ' + item.name
                album = 'Album Name: ' + item.album.name
                artist = 'Artist Name: ' + item.artists[0].name
                url = 'Preview URL: ' + item.preview_url + '\n'
                console.log(track + '\n' + album + '\n' + artist + '\n' + url)

            })

        })
    }
}

function movie(movieName) {
    request('http://www.omdbapi.com/?apikey=' + keys.omdbKeys.id + 'type=movie&t=' + movieName,
        function (error, response, body) {
            if (error) {
                return console.log(error);
            }
            let json = JSON.parse(body)
            title = '\nTitle: ' + json.Title
            year = 'Year: ' + json.Year
            imdbrating = json.imdbrating
            // rating1 = 'Rating from ' + json.Ratings[0].Source + ": " + json.Ratings[0].Value
            // rating2 = 'Rating from ' + json.Ratings[1].Source + ": " + json.Ratings[1].Value
            country = 'Country of Origin: ' + json.Country
            language = 'Language: ' + json.Language
            actors = 'Actors: ' + json.Actors
            plot = "Plot: " + json.Plot + "\n"
            console.log(title + '\n' + year + '\n' + country + '\n' + language + '\n' + actors + '\n' + plot)

        });
}

function doThis() {
    fs.readFile('./random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.error(err);
        }
        selection = data.split(',')[0];
        query = data.split(',')[1];
        return menu(selection, query);
    })
}

function menu(selection, query) {
    // fs.appendFile('log.txt', "\n" + selection + " " + query + "\n")
    switch (selection) {

        case "spotify-this-song":
            if (query === '' || query === null) {
                query = "The Sign"
            }
            spotify(query);
            break;

        case "movie-this":
            if (query === '' || query === null) {
                query = "Angels in the Outfield"
            }
            movie(query);
            break;

        case "do-what-it-says":
            doThis();
            break;
    }
}

menu(selection, query)


