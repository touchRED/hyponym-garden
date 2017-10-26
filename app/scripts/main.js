var word = "dessert";

var gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + word + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
var wordUrl = "http://words.bighugelabs.com/api/2/231b88a8bccc758fd2a4b00e60d1361d/" + word + "/json";

var words = [];

function setup(){
  // createCanvas(window.innerWidth, window.innerHeight);
  noCanvas();
  // background(0, 255, 255);
  loadJSON(gifUrl, gotData);
  loadJSON(wordUrl, function(data){
    var prop = Object.keys(data)[0];
    console.log(data[prop].syn[0]);
    word = data[prop].syn[0];
    gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + word + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
    wordUrl = "http://words.bighugelabs.com/api/2/231b88a8bccc758fd2a4b00e60d1361d/" + word + "/json";
  });
}

function gotData(giphy){
  createImg(giphy.data[0].images.original.url);
  console.log(giphy.data[0].images.original.url);
}

function generateWord(){
  loadJSON(wordUrl, function(data){
    var prop = Object.keys(data)[0];
    if(data[prop].syn.length > 0){
      word = data[prop].syn[floor(random(data[prop].syn.length))];
    }else{
      word = words[floor(random(words.length))];
    }
    words.push(word);
    console.log(words);
    gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + word + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
    wordUrl = "http://words.bighugelabs.com/api/2/231b88a8bccc758fd2a4b00e60d1361d/" + word + "/json";
    loadJSON(gifUrl, gotData);
  });
}

function generateImg(){
  // loadJSON(gifUrl, gotData);
}

function mousePressed(){
  generateWord();
  console.log("he");
}
