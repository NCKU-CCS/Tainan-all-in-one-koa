module.exports = {
  food: {
    description: '附近美食',
    key: ['美食', '吃', '食物', 'food'],
    postback: 'food'
  },
  store: {
    description: '最近的店家',
    key: ['最近', '附近', '店家', '站點', '商家', 'store'],
    postback: 'store'
  },
  joke: {
    description: '笑話',
    key: ['笑話', '笑', '白痴', '智障', 'joke'],
    postback: 'joke'
  },
  initPostback: {
    description: '附近美食、笑話以及其他功能三個button',
    key: [],
    postback: 'initPostback',
    payload: {
      template_type: "button",
      text: '你好，我是小歐～\n我可以提供以下功能，希望能幫助到你：）',
      buttons: [
        {
          type: "postback",
          title: "附近美食",
          payload: "food"
        },
        {
          type: "postback",
          title: "給個好笑的笑話",
          payload: "joke"
        },
        {
          type: "postback",
          title: "其他功能",
          payload: "secondPostback"
        }
      ]
    }
  },
  secondPostback: {
    description: 'initPostback擠不下的其他功能',
    key: [],
    postback: 'secondPostback',
    payload: {
      template_type: "button",
      text: '還有以下功能歐歐歐～～',
      buttons: [
        {
          type: "postback",
          title: "最近的店家",
          payload: "store"
        },
        {
          type: "postback",
          title: "證件遺失",
          payload: "lostCard"
        }
      ]
    }
  },
  locationWithoutChoice: {
    description: '使用者只傳位置，卻沒選擇哪個功能',
    key: [],
    payload: {
      template_type: "button",
      text: '請先選擇要找「附近美食」還是「最近的店家」再傳送地址喔～',
      buttons: [
        {
          type: "postback",
          title: "附近美食",
          payload: "food"
        },
        {
          type: "postback",
          title: "最近的店家",
          payload: "store"
        }
      ]
    }
  },
  thank: {
    description: '使用者傳感謝語',
    key: ['謝謝', '謝啦', '感謝', 'thank'],
    text: '不客氣呦～'
  },
  lostCard: {
    description: '證件遺失',
    key: ['證件', '遺失', 'lost', 'card'],
    postback: 'lostCard',
    payload: {
      template_type: "generic",
      elements: [
        {
          title: "身分證",
          buttons: [
            {
              type: 'postback',
              title: '身分證遺失',
              payload: 'lostSocialIdCard'
            }
          ]
        },
        {
          title: "健保卡",
          buttons: [
            {
              type: 'postback',
              title: '健保卡遺失',
              payload: 'lostHealthIdCard'
            }
          ]
        },
        {
          title: "駕照",
          buttons: [
            {
              type: 'postback',
              title: '駕照遺失',
              payload: 'lostDriveCard'
            }
          ]
        },
        {
          title: "戶口名簿",
          buttons: [
            {
              type: 'postback',
              title: '戶口名簿遺失',
              payload: 'lostAccountList'
            }
          ]
        }
      ]
    }
  },
  lostSocialIdCard: {
    description: '身分證遺失',
    key: ['身分證'],
    postback: 'lostSocialIdCard',
    text: "電話申請掛失請直撥1996內政服務專線提出申請，或是親自前往戶政事務所。補領身分證須攜帶戶口名簿正本或其他有效證件，以及正面半身彩色相片一張，還有當事人印章或簽名。"
  },
  lostHealthIdCard: {
    description: '健保卡遺失',
    key: ['健保卡'],
    postback: 'lostHealthIdCard',
    text: '申請換補領健保IC卡時，請填寫「請領健保IC卡申請表」，背面應黏貼身分證或其他身分證明文件正反面影本，健保卡上如要印有照片+，請貼上合規格照片。接著請攜帶身分證明文件正本向各地郵局櫃檯、健保局各分局辦理，工本費200元。'
  },
  lostDriveCard: {
    description: '駕照遺失',
    key: ['駕照'],
    postback: 'lostDriveCard',
    text: '攜帶身分證或其他身分證明文件，以及6個月內正面半身1吋照片兩張，至監理所辦理，辦理規費200元。'
  },
  lostAccountList: {
    description: '戶口名簿遺失',
    key: ['戶口名簿', '戶籍謄本'],
    postback: 'lostAccountList',
    text: '攜帶身分證正本和印章，至任一戶政事務所辦理，可以申請全戶或個人部份戶籍謄本，每張15元。'
  },
}
