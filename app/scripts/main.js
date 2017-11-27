var seed = "building";

var gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + seed + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
var wordnikKey = "47dccf8be44d27e33e000095fc00800d910779b868e19b1dc";

var words = {};
var imgs = {};

var currentImgs = [];
var imgIndex = 0;
var currentImgElement;
var currentP;

var nextImgs = {};
var nextSynonym;
var nextHypo;
var nextHyper;

var helping = false;

function setup(){
  noCanvas();

  var help = select("#help");
  // help.hide();
  var helpButton = select("i");
  helpButton.mouseClicked(function(){
    if(!helping){
      help.show();
      helping = true;
    }else{
      help.hide();
      helping = false;
    }
  });

  if(window.location.hash.length > 1){
    seed = window.location.hash.slice(1);
    gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + seed + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
  }
  loadJSON(gifUrl, function(giphy){
    currentImgElement = createImg(giphy.data[0].images.downsized.url);
    currentP = createInput(seed);
    // console.log(currentP);
    currentP.changed(function(){
      currentP.elt.blur();
      seed = currentP.elt.value;
      console.log("seed:", seed);
      gifUrl = "http://api.giphy.com/v1/gifs/search?q=" + seed + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
      imgs["synonym"] = [];
      imgs["hyponym"] = [];
      imgs["hypernym"] = [];
      words["synonym"] = [];
      words["hyponym"] = [];
      words["hypernym"] = [];
      imgIndex = 0;
      loadJSON(gifUrl, function(giphy){
        if(giphy.data){
          currentImgElement.elt.src = giphy.data[0].images.downsized.url;
          words["synonym"].push(seed);
          words["hyponym"].push(seed);
          words["hypernym"].push(seed);
          imgs["synonym"].push(giphy.data);
          imgs["hyponym"].push(giphy.data);
          imgs["hypernym"].push(giphy.data);
          currentImgs = giphy.data;
          generateNextWords(seed);
        }else{
          console.log("we failed");
        }
      });
    });
    imgs["synonym"] = [];
    imgs["hyponym"] = [];
    imgs["hypernym"] = [];
    words["synonym"] = [];
    words["hyponym"] = [];
    words["hypernym"] = [];
    nextImgs["synonym"] = [];
    nextImgs["hyponym"] = [];
    nextImgs["hypernym"] = [];
    words["synonym"].push(seed);
    words["hyponym"].push(seed);
    words["hypernym"].push(seed);
    imgs["synonym"].push(giphy.data);
    imgs["hyponym"].push(giphy.data);
    imgs["hypernym"].push(giphy.data);
    currentImgs = giphy.data;
    generateNextWords(seed);
  });
}

function generateGiphyFunction(type){
  return function(giphy){
    if(giphy.data.length > 0){
      nextImgs[type] = giphy.data;
    }else{
      generateWord(words[type][words.length - 1], type);
    }
  }
}

function generateWordnikLink(word){
  return "http://api.wordnik.com:80/v4/word.json/" + word + "/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=" + wordnikKey;
}

function generateDataMuseLink(params){
  var queryLink = "http://api.datamuse.com/words?";
  for(var i = 0; i < params.length; i++){
    if(i > 0){
      queryLink += "&";
    }
    queryLink += params[i];
  }
  return queryLink;
}

function generateNextWords(word){
  generateSynonym(word);
  generateHyponym(word);
  generateHypernym(word);
}

function generateWord(word, type){
  if(type == "synonym"){
    generateSynonym(word);
  }else if(type == "hypernym"){
    generateHypernym(word);
  }else if(type == "hyponym"){
    generateHyponym(word);
  }
}

function generateSynonym(word){
  loadJSON(generateWordnikLink(word), function(data){
    if(data[0] && data[0].words && data[0].words.length > 0){
      nextSynonym = data[0].words[floor(random(data[0].words.length))];
    }else{
      nextSynonym = words["synonym"][words["synonym"].length - 1];
    }
    var nextUrl = "http://api.giphy.com/v1/gifs/search?q=" + nextSynonym + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
    loadJSON(nextUrl, generateGiphyFunction("synonym"));
  });
}

function generateHyponym(word){
  loadJSON(generateDataMuseLink(["rel_gen=" + word]), function(data){
    if(data.length > 0){
      nextHypo = data[floor(random(data.length))].word;
    }else{
      nextHypo = words["hyponym"][words["hyponym"].length - 1];
    }
    var nextUrl = "http://api.giphy.com/v1/gifs/search?q=" + nextHypo + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
    loadJSON(nextUrl, generateGiphyFunction("hyponym"));
  });
}

function generateHypernym(word){
  loadJSON(generateDataMuseLink(["rel_spc=" + word]), function(data){
    if(data.length > 0){
      nextHyper = data[floor(random(data.length))].word;
    }else{
      nextHyper = words["hypernym"][words["hypernym"].length - 1];
    }
    var nextUrl = "http://api.giphy.com/v1/gifs/search?q=" + nextHyper + "&api_key=8lARF0cgG0lY6ZMfZ6n2GEYcoHvXg4WX";
    loadJSON(nextUrl, generateGiphyFunction("hypernym"));
  });
}

function mouseReleased(){
  return false;
}

function touchEnded(){
  if(winMouseX > 3 * window.innerWidth / 4){
    imgIndex = 0;
    currentImgElement.elt.src = nextImgs[0].images.downsized.url;
    // currentP.elt.innerText = nextSynonym;
    currentP.elt.value = nextSynonym;
    imgs.push(nextImgs);
    words.push(nextSynonym);
    console.log(words);
    generateSynonym(nextSynonym);
  }else if(winMouseX < window.innerWidth / 4){
    if(words.length > 1){
      words.pop();
      imgs.pop();
      imgIndex = 0;
    }
    currentImgElement.elt.src = imgs[imgs.length - 1][imgIndex].images.downsized.url;
    // currentP.elt.innerText = words[words.length - 1];
    currentP.elt.value = words[words.length - 1];
    generateSynonym(words[words.length - 1]);
  }else{
    if(imgIndex < imgs[imgs.length - 1].length - 1){
      imgIndex++;
    }else{
      imgIndex = 0;
    }
    currentImgElement.elt.src = imgs[imgs.length - 1][imgIndex].images.downsized.url;
  }
  // return false;
}

function keyPressed(){
  if(keyCode == RIGHT_ARROW){
    imgIndex = 0;
    currentImgElement.elt.src = nextImgs["synonym"][0].images.downsized.url;
    currentP.elt.value = nextSynonym;
    currentImgs = nextImgs["synonym"];

    if(nextSynonym != words["synonym"][words["synonym"].length - 1]){
      imgs["synonym"].push(nextImgs["synonym"]);
      imgs["hyponym"] = [nextImgs["synonym"]];
      imgs["hypernym"] = [nextImgs["synonym"]];

      words["synonym"].push(nextSynonym);
      words["hyponym"] = [nextSynonym];
      words["hypernym"] = [nextSynonym];
    }

    console.log(words["synonym"]);
    generateNextWords(nextSynonym);
  }else if(keyCode == LEFT_ARROW){
    if(words["synonym"].length > 1){

      words["synonym"].pop();
      words["hyponym"] = [words["synonym"][words["synonym"].length - 1]];
      words["hypernym"] = [words["synonym"][words["synonym"].length - 1]];

      imgs["synonym"].pop();
      imgs["hyponym"] = [imgs["synonym"][imgs["synonym"].length - 1]];
      imgs["hypernym"] = [imgs["synonym"][imgs["synonym"].length - 1]];
      imgIndex = 0;
    }
    currentImgElement.elt.src = imgs["synonym"][imgs["synonym"].length - 1][imgIndex].images.downsized.url;
    currentImgs = imgs["synonym"][imgs["synonym"].length - 1];
    currentP.elt.value = words["synonym"][words["synonym"].length - 1];

    console.log(words["synonym"]);
    generateNextWords(words["synonym"][words["synonym"].length - 1]);
  }else if(keyCode == UP_ARROW){
    imgIndex = 0;
    if(imgs["hyponym"].length > 1){
      words["hyponym"].pop();
      words["synonym"] = [words["hyponym"][words["hyponym"].length - 1]];

      imgs["hyponym"].pop();
      imgs["synonym"] = [imgs["hyponym"][imgs["hyponym"].length - 1]];

      currentImgElement.elt.src = imgs["hyponym"][imgs["hyponym"].length - 1][imgIndex].images.downsized.url;
      currentImgs = imgs["hyponym"][imgs["hyponym"].length - 1];
      currentP.elt.value = words["hyponym"][words["hyponym"].length - 1];

      console.log(words["hyponym"]);
      generateNextWords(words["hyponym"][words["hyponym"].length - 1]);
    }else{
      currentImgElement.elt.src = nextImgs["hypernym"][0].images.downsized.url;
      currentP.elt.value = nextHyper;
      currentImgs = nextImgs["hypernym"];

      if(nextHyper != words["hypernym"][words["hypernym"].length - 1]){
        imgs["hypernym"].push(nextImgs["hypernym"]);
        imgs["synonym"] = [imgs["hypernym"][imgs["hypernym"].length - 1]];

        words["hypernym"].push(nextHyper);
        words["synonym"] = [words["hypernym"][words["hypernym"].length - 1]];
      }

      console.log(words["hypernym"]);
      generateNextWords(nextHyper);
    }
  }else if(keyCode == DOWN_ARROW){
    imgIndex = 0;
    if(imgs["hypernym"].length > 1){
      words["hypernym"].pop();
      words["synonym"] = [words["hypernym"][words["hypernym"].length - 1]];

      imgs["hypernym"].pop();
      imgs["synonym"] = [imgs["hypernym"][imgs["hypernym"].length - 1]];

      currentImgElement.elt.src = imgs["hypernym"][imgs["hypernym"].length - 1][imgIndex].images.downsized.url;
      currentImgs = imgs["hypernym"][imgs["hypernym"].length - 1];
      currentP.elt.value = words["hypernym"][words["hypernym"].length - 1];

      console.log(words["hypernym"]);
      generateNextWords(words["hypernym"][words["hypernym"].length - 1]);
    }else{
      currentImgElement.elt.src = nextImgs["hyponym"][0].images.downsized.url;
      currentP.elt.value = nextHypo;
      currentImgs = nextImgs["hyponym"];

      if(nextHypo != words["hyponym"][words["hyponym"].length - 1]){
        imgs["hyponym"].push(nextImgs["hyponym"]);
        imgs["synonym"] = [imgs["hyponym"][imgs["hyponym"].length - 1]];
        words["hyponym"].push(nextHypo);
        words["synonym"] = [words["hyponym"][words["hyponym"].length - 1]];
      }

      console.log(words["hyponym"]);
      generateNextWords(nextHypo);
    }
  }else if(keyCode == 32){
    if(imgIndex < currentImgs.length - 1){
      imgIndex++;
    }else{
      imgIndex = 0;
    }
    currentImgElement.elt.src = currentImgs[imgIndex].images.downsized.url;
  }else{
    console.log(keyCode);
  }
  // return false;
}
