const CONFIG = require('config');
const models = require('../models/index');
const request = require('co-request');

let calDistance = async(fromCoord, toCoord) => {
  let distance = await models.sequelize.query(
    `SELECT ST_Distance(\
        ST_Transform(ST_GeomFromText(\'POINT(${fromCoord.lng} ${fromCoord.lat})\', 4326), 2163),\
        ST_Transform(ST_GeomFromText(\'POINT(${toCoord.lng} ${toCoord.lat})\', 4326), 2163)\
      ) AS "distance"`);
  // console.log(distance[0][0].distance);
  return Math.floor(distance[0][0].distance);
}

exports.randomJoke = async() => {
  while(true) {
    let joke = await models.Joke.find({
      attributes: ['context'],
      order: [
        [models.Sequelize.fn('RANDOM')]
      ]
    });
    return joke.dataValues.context;
  }
};

exports.nearbyRestaurant = async(coordinates) => {
  let lng = coordinates.long;
  let lat = coordinates.lat;
  let restaurantArray = await models.sequelize.query(
    `SELECT name, address,\
      ST_Distance(\
        ST_Transform("location", 2163),\
        ST_Transform(ST_GeomFromText(\'POINT(${lng} ${lat})\', 4326), 2163)\
      ) AS "distance"\
    FROM "Restaurants"\
    ORDER BY distance\
    LIMIT 5`, {model: models.Restaurant});

  let recRestaurantStr = "";
  for(let restaurant of restaurantArray) {
    let distance = Math.floor(restaurant.dataValues.distance);
    let tmpStr = `[${restaurant.name}]\n${restaurant.address}\n距離：${distance}公尺`;
    if((recRestaurantStr.length + tmpStr.length + 5) > 320) {
      continue;
    }

    if(recRestaurantStr === "") {
      recRestaurantStr = tmpStr;
    } else {
      recRestaurantStr = `${recRestaurantStr}\n---\n${tmpStr}`
    } }
  return recRestaurantStr;
};

exports.nearbyStore = async(coordinates, keyword) => {
  let lng = coordinates.long;
  let lat = coordinates.lat;
  let response = await request({
    uri: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
    qs: {
      location: `${lat},${lng}`,
      rankby: 'distance',
      keyword: keyword,
      language: 'zh-TW',
      key: CONFIG.GOOGLE_PLACE_KEY
    },
    json:true
  });

  let storeStr = "";
  let storeCount = 0;
  for(let result of response.body.results) {
    let fromCoord = {
      lng: lng,
      lat: lat
    };
    let toCoord = result.geometry.location;
    let distance = await calDistance(fromCoord, toCoord);
    let tmpStr = `[${result.name}]\n地址：${result.vicinity}\n距離：${distance}公尺`;
    if(storeStr === "") {
      storeStr = tmpStr;
    } else {
      storeStr = `${storeStr}\n---\n${tmpStr}`;
    }

    storeCount = storeCount + 1;
    if(storeCount === 3) {
      break;
    }
  }
  return storeStr;
}
