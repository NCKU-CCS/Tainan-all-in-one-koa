const CONFIG = require('config');
const sequelize = require('sequelize');
const request = require('co-request');
const models = require('../models/index');
const features = require(CONFIG.Controllers('features'));
const scenario = require('../scenario.js');

let getSenderInfo = async(senderId) => {
  let response = await request({
    uri: `https://graph.facebook.com/v2.6/${senderId}`,
    qs: {
      fields: 'first_name,last_name,gender',
      access_token: CONFIG.FB_TOKEN
    },
    method: 'GET'
  });
  return response.body;
};

let determineStatus = async(event) => {
  let userStatus = await global.redis.get(`${event.sender.id}-status`);
  if(userStatus === 'store') {
    global.redis.set(`${event.sender.id}-status`, `store-${event.message.text}`);
    let responseStr = '請傳送你現在的位置';
    await sendTextMessage(event.sender.id, responseStr);
  } else if(userStatus.includes('store')) {
    let lnglat = locationStatus.split('-')[1].split(',');
    let coordinates = {long: lnglat[0], lat: lnglat[1]};
    let storeStr = await features.nearbyStore(coordinates, targetKeyword);
    await sendTextMessage(event.sender.id, storeStr);
    global.redis.set(`${event.sender.id}-status`, 'init');
  } else {
    let featureType = determineFeature('message', event.message.text);
    await responseFeature(featureType, event);
  }
  return;
};

let determineLocationStatus = async(event) => {
  let locationStatus = await global.redis.get(`${event.sender.id}-status`);
  let coordinates = event.message.attachments[0].payload.coordinates;
  if(locationStatus === 'food') {
    let recRestaurantStr = await features.nearbyRestaurant(coordinates);
    await sendTextMessage(event.sender.id, recRestaurantStr);
  } else if(locationStatus === 'store') {
    let responseStr = '請傳送你想去的地點';
    global.redis.set(
      `${event.sender.id}-status`, `store-${coordinates.long},${coordinates.lat}`);
    await sendTextMessage(event.sender.id, responseStr);
    return;
  } else if(locationStatus.includes('store')) {
    let targetKeyword = locationStatus.split('-')[1];
    let storeStr = await features.nearbyStore(coordinates, targetKeyword);
    await sendTextMessage(event.sender.id, storeStr);
  } else {
    await sendPostbackMessage(event.sender.id, scenario.locationWithoutChoice.payload);
  }

  global.redis.set(`${event.sender.id}-status`, 'init');
  return;
};

let determineFeature = (messageType, messageText) => {
  for(let featureType of Object.keys(scenario)) {
    if(messageType === 'message') {
      for(let keyword of scenario[featureType].key) {
        if(messageText.includes(keyword)) {
          return featureType;
        }
      }
    } else if(messageType === 'postback') {
      if(scenario[featureType].postback === messageText) {
        return featureType;
      }
    }
  }

  return 'initPostback';
};

let responseFeature = async(featureType, event) => {
  if(featureType === 'food') {
    global.redis.set(`${event.sender.id}-status`, 'food');
    let responseStr = '請傳送你現在的位置';
    await sendTextMessage(event.sender.id, responseStr);
  } else if(featureType === 'store') {
    global.redis.set(`${event.sender.id}-status`, 'store');
    let responseStr = '請傳送你想去的地點';
    await sendTextMessage(event.sender.id, responseStr);
  }else if(featureType === 'joke') {
    global.redis.set(`${event.sender.id}-status`, 'init');
    let joke = await features.randomJoke();
    await sendTextMessage(event.sender.id, joke);
  } else if(scenario[featureType].payload) {
    global.redis.set(`${event.sender.id}-status`, 'init');
    await sendPostbackMessage(event.sender.id, scenario[featureType].payload);
  } else if(scenario[featureType].text) {
    global.redis.set(`${event.sender.id}-status`, 'init');
    await sendTextMessage(event.sender.id, scenario[featureType].text);
  }

  return;
};

let sendTextMessage = async(recipientId, messageText) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  }

  await callSendAPI(messageData);
  return;
};

let sendPostbackMessage = async(recipientId, payload) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: payload
      }
    }
  }

  await callSendAPI(messageData);
  return;
};

let callSendAPI = async(messageData) => {
  let response = await request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: CONFIG.FB_TOKEN },
    method: 'POST',
    json: messageData
  });

  console.log(response.statusCode);
  return;
};

exports.verifyToken = async(ctx, next) => {
  if(ctx.query["hub.verify_token"] != CONFIG.VERIFY_TOKEN) {
    return ctx.status = 400;
  }
  return ctx.body = ctx.query["hub.challenge"];
};

exports.userPostMsg = async(ctx, next) => {
  let data = ctx.request.body;

  for(let entry of data.entry) {
    for(let event of entry.messaging) {
      console.log(event);

      if(event.message && event.message.attachments) {
        await determineLocationStatus(event);
      } else if(event.message && event.message.is_echo === undefined) {
        event.senderInfo = await getSenderInfo(event.sender.id);
        await determineStatus(event);
      } else if(event.postback) {
        let featureType = determineFeature('postback', event.postback.payload);
        await responseFeature(featureType, event);
      }
    }
  }
  return ctx.status = 200;
};
