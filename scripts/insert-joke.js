const fs = require('graceful-fs');
const co = require('co');
const path = require('path');
const models = require('./../models/index');

co(function *() {
  if(process.argv[2] === undefined) {
    console.log("Please Input File Path");
    return;
  }

  let filePath = path.resolve(process.cwd(), process.argv[2]);
  let jokeStr = fs.readFileSync(filePath, 'utf8');
  let jokeArray = JSON.parse(jokeStr);
  for(let i=0; i<jokeArray.length; i++) {
    let compressContext = "";
    let contextSplit = jokeArray[i].context.split('\n');
    for(let splitString of contextSplit) {
      if(splitString != '') {
        compressContext = `${compressContext}\n${splitString}`;
      }
    }

    if(compressContext.length > 320) {
      continue;
    }

    let joke = yield models.Joke.create({
      title: jokeArray[i].title,
      context: compressContext
    });
    console.log(joke.title);
  }
});
