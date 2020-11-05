'use strict';

const crypto = require('crypto');
const utils = require('./utils');
const resources = require('./resources');

class Nicepay {
  constructor(options = {}) {
    const props = utils.getProps(options, {
      required: ['MID', 'MerchantKey'],
      optional: ['CharSet', 'EdiType'],
    });

    if (!Object.prototype.hasOwnProperty.call(props, 'CharSet')) {
      props.CharSet = 'euc-kr';
    }

    if (!Object.prototype.hasOwnProperty.call(props, 'EdiType')) {
      props.EdiType = 'JSON';
    }

    this._api = {
      MID: props.MID,
      MerchantKey: props.MerchantKey,
      CharSet: props.CharSet,
      EdiType: props.EdiType,
    };

    for (const name in resources) {
      const camelCasedName = name[0].toLowerCase() + name.substring(1);
      this[camelCasedName] = new resources[name](this);
    }
  }

  generateSignData(params) {
    return crypto.createHash('sha256').update(params.join('')).digest('hex');
  }
}

module.exports = Nicepay;
