var seed = "building";

var gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + seed + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
var wordnikKey = "47dccf8be44d27e33e000095fc00800d910779b868e19b1dc";
// var wordnik = "http://api.wordnik.com:80/v4/word.json/" + seed + "/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=" + wordnikKey;

var words = [];
var imgs = [];
var imgIndex = 0;

var currentImgElement;
var currentP;

var nextImgs;
var nextWord;

function setup(){
  noCanvas();
  if(window.location.hash.length > 1){
    seed = window.location.hash.slice(1);
    gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + seed + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
  }
  loadJSON(gifUrl, function(giphy){
    currentImgElement = createImg(giphy.data[0].images.downsized.url);
    currentP = createInput(seed);
    console.log(currentP);
    currentP.changed(function(){
      currentP.elt.blur();
      seed = currentP.elt.value;
      console.log("seed:", seed);
      gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + seed + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
      imgs = [];
      words = [];
      imgIndex = 0;
      loadJSON(gifUrl, function(giphy){
        if(giphy.data){
          currentImgElement.elt.src = giphy.data[0].images.downsized.url;
          words.push(seed);
          imgs.push(giphy.data)
          generateWord(seed, "synonym");
        }else{
          console.log("we failed");
        }
      });
    });
    words.push(seed);
    imgs.push(giphy.data)
    generateWord(seed, "synonym");
  });
}

function generateGiphyFunction(type){
  return function(giphy){
    if(giphy.data.length > 0){
      nextImgs = giphy.data
    }else{
      generateWord(words[words.length - 1], type);
    }
  }
}


/*

  TODO:

  - static during loading


*/









function generateWordnikLink(word, type){
  return "http://api.wordnik.com:80/v4/word.json/" + word + "/relatedWords?useCanonical=false&relationshipTypes=" + type + "&limitPerRelationshipType=10&api_key=" + wordnikKey;
}

function generateWord(word, type){
  loadJSON(generateWordnikLink(word, type), function(data){
    if(data[0] && data[0].words && data[0].words.length > 0){
      nextWord = data[0].words[floor(random(data[0].words.length))];
    }else{
      nextWord = words[floor(random(words.length))];
    }
    gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + nextWord + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
    // wordnik = generateWordnikLink(nextWord, type);
    loadJSON(gifUrl, generateGiphyFunction(type));
  });
}

function mouseReleased(){
  return false;
}

function touchEnded(){
  if(winMouseX > 3 * window.innerWidth / 4){
    imgIndex = 0;
    currentImgElement.elt.src = nextImgs[0].images.downsized.url;
    // currentP.elt.innerText = nextWord;
    currentP.elt.value = nextWord;
    imgs.push(nextImgs);
    words.push(nextWord);
    console.log(words);
    generateWord(nextWord, "synonym");
  }else if(winMouseX < window.innerWidth / 4){
    if(words.length > 1){
      words.pop();
      imgs.pop();
      imgIndex = 0;
    }
    currentImgElement.elt.src = imgs[imgs.length - 1][imgIndex].images.downsized.url;
    // currentP.elt.innerText = words[words.length - 1];
    currentP.elt.value = words[words.length - 1];
    generateWord(words[words.length - 1], "synonym");
  }else{
    if(imgIndex < imgs[imgs.length - 1].length - 1){
      imgIndex++;
    }else{
      imgIndex = 0;
    }
    currentImgElement.elt.src = imgs[imgs.length - 1][imgIndex].images.downsized.url;
  }
  return false;
}



function keyPressed(){
  if(keyCode == RIGHT_ARROW){
    imgIndex = 0;
    currentImgElement.elt.src = nextImgs[0].images.downsized.url;
    // currentP.elt.innerText = nextWord;
    currentP.elt.value = nextWord;
    imgs.push(nextImgs);
    words.push(nextWord);
    console.log(words);
    generateWord(nextWord, "synonym");
  }else if(keyCode == LEFT_ARROW){
    if(words.length > 1){
      words.pop();
      imgs.pop();
      imgIndex = 0;
    }
    currentImgElement.elt.src = imgs[imgs.length - 1][imgIndex].images.downsized.url;
    // currentP.elt.innerText = words[words.length - 1];
    currentP.elt.value = words[words.length - 1];
    generateWord(words[words.length - 1], "synonym");
  }else if(keyCode == UP_ARROW){
    console.log("up");
  }else if(keyCode == DOWN_ARROW){
    console.log("down");
  }else if(keyCode == 32){
    if(imgIndex < imgs[imgs.length - 1].length - 1){
      imgIndex++;
    }else{
      imgIndex = 0;
    }
    currentImgElement.elt.src = imgs[imgs.length - 1][imgIndex].images.downsized.url;
  }else{
    console.log(keyCode);
  }
  // return false;
}

// function generateWord("synonym"){
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

// function gotData(giphy){
//   if(giphy.data.length > 0){
//     nextImg = giphy.data[0].images.downsized.url
//   }else{
//     generateWord(type);
//   }
// }
