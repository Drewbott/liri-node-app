require('dotenv').config()
var Spotify = require("node-spotify-api");
var request = require("request")
var keys = require("./keys.js")
var moment = require('moment');



var spotify = new Spotify(keys.spotify);

var functionPicker = process.argv[2]
// Take in the command line arguments
var nodeArgs = process.argv;

// Create an empty string for holding the address
var search = "Mr Nobody";
var songSearch = "The Sign";
var bandSearch = "Childish Gambino";
// Capture all the words in the address (again ignoring the first two Node arguments)
for (var i = 3; i < nodeArgs.length; i++) {

  // Build a string with the address.
  if (3 === i) {
    search = " ";
    songSearch = " ";
    bandSearch = "";
  }
  search = search + " " + nodeArgs[i];
  songSearch = songSearch + " " + nodeArgs[i];
  bandSearch = bandSearch + "" + nodeArgs[i];

}
switch (functionPicker) {
  case "concert-this":
    bands();
    break;
  
  case "spotify-this-song":
    songs(songSearch);
    break;
  
  case "movie-this":
    movies();
    break;
  
  case "do-what-it-says":
    random();
    break;
  }

  function bands() {
    request("https://rest.bandsintown.com/artists/" + bandSearch + "/events?app_id=codingbootcamp", function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var parseBody = JSON.parse(body)
        
        for (var i = 0; i < parseBody.length; i++) {
          // console.log(parseBody)
            // moment(parseBody[i].datetime)
      
          console.log('----------------********************----------------');
          console.log("Venue: " + parseBody[i].venue.name);
          console.log("Location: " + parseBody[i].venue.city + ", " + parseBody[i].venue.country);
          console.log("Date: " + moment(parseBody[i].datetime).format("MM-DD-YYYY"));
          console.log('----------------********************----------------');
        }
        
      }
         
    })
  }

  function movies() {
    request("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
      if (!error && response.statusCode === 200) {
var parseBody = JSON.parse(body)
// console.log(search);

// console.log(parseBody);

        console.log('----------------********************----------------')
        console.log("Title: " + parseBody.Title);
        console.log("Year: " + parseBody.Year);
        console.log("IMDb Rating: " + parseBody.imdbRating);
        console.log("Rotten Tomatoes Rating: " + parseBody.Ratings[1].Value );
        console.log("Production Country: " + parseBody.Country);
        console.log("Language: " + parseBody.Language);
        console.log("Plot: " + parseBody.Plot);
        console.log("Actors: " + parseBody.Actors);
        console.log('----------------********************----------------');
        
      }
});
  }
  function songs(songSearch) {
    spotify.search({ type: 'track', query: songSearch }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
    //  console.log(data)
    var result = data.tracks.items;
    
      result.forEach(res => {
        console.log('----------------********************----------------')
        console.log("Song: " + res.name)
        console.log("Artist: " + res.artists[0].name) 
        console.log("Album: " + res.album.name)
        console.log("Link: " + res.href)
        console.log('----------------********************----------------')
      })
    });
  }
  function random() {
    var fs = require("fs");

fs.readFile("random.txt", "utf8", function(error, data) {

  // If the code experiences any errors it will log the error to the console.
  if (error) {
    return console.log(error);
  }
  // We will then print the contents of data
  // console.log(data);

  // Then split it by commas (to make it more readable)
  var dataArr = data.split(",");
  // console.log(dataArr)
  songs(dataArr[1])
});

  }
  