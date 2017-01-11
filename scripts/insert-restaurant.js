const fs = require('graceful-fs');
const co = require('co');
const request = require('co-request');
const path = require('path');
const models = require('./../models/index');

co(function *() {
  if(process.argv[2] === undefined) {
    console.log("Please Input File Path");
    return;
  }

  let filePath = path.resolve(process.cwd(), process.argv[2]);
  let restaurantStr = fs.readFileSync(filePath, 'utf8');
  let restaurantArray = JSON.parse(restaurantStr);
  for(let i=0; i<restaurantArray.length; i++) {
    let addressEncode = encodeURIComponent(restaurantArray[i].address);
    let url = `http://maps.google.com/maps/api/geocode/json?address=${addressEncode}&sensor=false`;
    let respond = yield request({
      uri: url,
      method: 'GET',
      json: true
    });

    console.log(i, restaurantArray[i].name);
    if(respond.body.results[0] === undefined) {
      continue;
    }

    let lnglat = respond.body.results[0]['geometry']['location'];
    let restaurant = yield models.Restaurant.create({
      name: restaurantArray[i].name,
      address: restaurantArray[i].address,
      link: restaurantArray[i].link,
      category: restaurantArray[i].category,
      lng: lnglat.lng,
      lat: lnglat.lat,
      location: {
        type: 'Point',
        coordinates: [lnglat.lng, lnglat.lat],
        crs: {
          type: "name",
          properties: {
            name: "EPSG:4326"
          }
        }
      }
    });
  }
});
