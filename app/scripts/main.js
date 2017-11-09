var word = "desert";

var gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + word + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
var wordUrl = "http://words.bighugelabs.com/api/2/231b88a8bccc758fd2a4b00e60d1361d/" + word + "/json";

var wordnikKey = "47dccf8be44d27e33e000095fc00800d910779b868e19b1dc";
var wordnik = "http://api.wordnik.com:80/v4/word.json/" + word + "/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=" + wordnikKey;

var words = [];
var currentImgElement;
var currentP;
var nextImg;

function setup(){
  // createCanvas(window.innerWidth, window.innerHeight);
  // background(0, 255, 255);
  noCanvas();
  loadJSON(gifUrl, function(giphy){
    currentImgElement = createImg(giphy.data[0].images.original.url);
    currentP = createP(word);
    generateWord();
  });
  loadJSON(wordnik, function(data){
    console.log("wordnik", data[0]);
  });
}

function gotData(giphy){
  if(giphy.data.length > 0){
    nextImg = giphy.data[0].images.original.url;
  }else{
    generateWord();
  }
}

function generateWord(){
  loadJSON(wordnik, function(data){
    if(data[0] && data[0].words && data[0].words.length > 0){
      word = data[0].words[floor(random(data[0].words.length))];
    }else{
      word = words[floor(random(words.length))];
    }
    words.push(word);
    console.log(words);
    gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + word + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
    wordnik = "http://api.wordnik.com:80/v4/word.json/" + word + "/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=" + wordnikKey;
    loadJSON(gifUrl, gotData);
  });
}

function mousePressed(){
  currentImgElement.elt.src = nextImg;
  currentP.elt.innerText = word;
  generateWord();
}

// function generateWord(){
//   loadJSON(wordUrl, function(data){
//     var prop = Object.keys(data)[0];
//     if(data[prop].syn.length > 0){
//       word = data[prop].syn[floor(random(data[prop].syn.length))];
//     }else{
//       word = words[floor(random(words.length))];
//     }
//     words.push(word);
//     console.log(words);
//     gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + word + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
//     wordUrl = "http://words.bighugelabs.com/api/2/231b88a8bccc758fd2a4b00e60d1361d/" + word + "/json";
//     loadJSON(gifUrl, gotData);
//   });
// }
