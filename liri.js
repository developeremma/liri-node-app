//Grab data from keys.js
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var client = new Twitter(keys.twitterKeys);
var fs = require('fs');
var spotify = new Spotify(keys.spotifyKeys);

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var x = "";
//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

//switch case
switch(command){
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
    if(x){
      spotifySong(x);
    } else{
      spotifySong("Fluorescent Adolescent");
    }
  break;

  case "movie-this":
    if(x){
      omdbData(x)
    } else{
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function showTweets(){
  //Display last 20 Tweets
  var screenName = {screen_name: 'this_is_a_demo'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@this_is_a_demo: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");


        //adds text to log.txt file
        fs.appendFile('log.txt', "@this_is_a_demo: " + tweets[i].text + " Created At: " + date.substring(0, 19),(err) => {
            if (err) throw err;});
        fs.appendFile('log.txt', "-----------------------",(err) => {
            if (err) throw err;});
      }
    }else{
      console.log('Error happend during tweet command', error);
    }
  });
}

function spotifySong(song){
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");


        //adds text to log.txt
        fs.appendFile('log.txt', songData.artists[0].name, (err) => {
            if (err) throw err;});
        fs.appendFile('log.txt', songData.name,(err) => {
            if (err) throw err;});
        fs.appendFile('log.txt', songData.preview_url,(err) => {
            if (err) throw err;});
        fs.appendFile('log.txt', songData.album.name,(err) => {
                if (err) throw err;});
        fs.appendFile('log.txt', "-----------------------", (err) => {
            if (err) throw err;});
      }
    } else{
      console.log('Error happend during spotify command');
    }
  });
}

function omdbData(movie){
  var omdbURL = 'http://www.omdbapi.com/?apikey=40e9cece&t=' + movie + '&plot=short&tomatoes=true';
  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);

      //adds text to log.txt
      fs.appendFile('log.txt', "Title: " + body.Title,(err) => {
          if (err) throw err;});
      fs.appendFile('log.txt', "Release Year: " + body.Year,(err) => {
          if (err) throw err;});
      fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating,(err) => {
          if (err) throw err;});
      fs.appendFile('log.txt', "Country: " + body.Country,(err) => {
          if (err) throw err;});
      fs.appendFile('log.txt', "Language: " + body.Language,(err) => {
          if (err) throw err;});
      fs.appendFile('log.txt', "Plot: " + body.Plot,(err) => {
          if (err) throw err;});
      fs.appendFile('log.txt', "Actors: " + body.Actors,(err) => {
          if (err) throw err;});
      fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating,(err) => {
          if (err) throw err;});
      fs.appendFile('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL,(err) => {
          if (err) throw err;});

    } else{
      console.log('Error happened during movie lookup')
    }
    if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");


      //adds text to log.txt
      fs.appendFile('log.txt', "-----------------------");
      fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      fs.appendFile('log.txt', "It's on Netflix!");
    }
  });

}

function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}
