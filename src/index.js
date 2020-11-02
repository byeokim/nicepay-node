'use strict';

const axios = require('axios');
const querystring = require('querystring');
const moment = require('moment-timezone');
const utils = require('./utils');

axios.defaults.baseURL = 'https://webapi.nicepay.co.kr/webapi/billing/';
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

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
  }

  async createBID(params) {
    const props = utils.getProps(params, {
      required: ['CardNo', 'CardPw', 'ExpMonth', 'ExpYear', 'IDNo', 'Moid'],
      optional: [
        'BuyerEmail',
        'BuyerName',
        'BuyerTel',
        'CharSet',
        'EdiDate',
        'EdiType',
      ],
    });

    props.MID = this._api.MID;
    if (!Object.prototype.hasOwnProperty.call(props, 'EdiDate')) {
      props.EdiDate = moment
        .tz('Asia/Seoul')
        .format()
        .replace(/[-T:]/g, '')
        .split('+')[0];
    }

    // MID + EdiDate + Moid + MerchantKey로 SHA-256 해시 생성
    props.SignData = utils.generateSignData([
      props.MID,
      props.EdiDate,
      props.Moid,
      this._api.MerchantKey,
    ]);

    props.EncData = await utils.generateEncData(
      props.CardNo,
      props.ExpYear,
      props.ExpMonth,
      props.IDNo,
      props.CardPw,
      this._api.MerchantKey
    );

    if (!Object.prototype.hasOwnProperty.call(props, 'CharSet')) {
      props.CharSet = this._api.CharSet;
    }

    if (!Object.prototype.hasOwnProperty.call(props, 'EdiType')) {
      props.EdiType = this._api.EdiType;
    }

    delete props.CardNo;
    delete props.CardPw;
    delete props.ExpMonth;
    delete props.ExpYear;
    delete props.IDNo;

    const response = await axios.post(
      'billing_regist.jsp',
      querystring.stringify(props)
    );

    return response.data;
  }

  async checkout(params) {
    const props = utils.getProps(params, {
      required: [
        'Amt',
        'BID',
        'CardInterest',
        'CardQuota',
        'Moid',
        'GoodsName',
      ],
      optional: [
        'BuyerEmail',
        'BuyerName',
        'BuyerTel',
        'CardPoint',
        'CharSet',
        'EdiDate',
        'EdiType',
        'GoodsVat',
        'ServiceAmt',
        'SupplyAmt',
        'TaxFreeAmt',
      ],
    });

    props.MID = this._api.MID;
    if (!Object.prototype.hasOwnProperty.call(props, 'EdiDate')) {
      props.EdiDate = moment
        .tz('Asia/Seoul')
        .format()
        .replace(/[-T:]/g, '')
        .split('+')[0];
    }
    props.TID = utils.generateTID(props.MID, props.EdiDate);

    // MID + EdiDate + Moid + Amt + BID + MerchantKey로 SHA-256 해시 생성
    props.SignData = utils.generateSignData([
      props.MID,
      props.EdiDate,
      props.Moid,
      props.Amt,
      props.BID,
      this._api.MerchantKey,
    ]);

    if (!Object.prototype.hasOwnProperty.call(props, 'CharSet')) {
      props.CharSet = this._api.CharSet;
    }

    if (!Object.prototype.hasOwnProperty.call(props, 'EdiType')) {
      props.EdiType = this._api.EdiType;
    }

    const response = await axios.post(
      'billing_approve.jsp',
      querystring.stringify(props)
    );

    return response.data;
  }

  async removeBID(params) {
    const props = utils.getProps(params, {
      required: ['BID', 'Moid'],
      optional: ['CharSet', 'EdiDate', 'EdiType'],
    });

    props.MID = this._api.MID;
    if (!Object.prototype.hasOwnProperty.call(props, 'EdiDate')) {
      props.EdiDate = moment
        .tz('Asia/Seoul')
        .format()
        .replace(/[-T:]/g, '')
        .split('+')[0];
    }
    // MID + EdiDate + Moid + BID + MerchantKey로 SHA-256 해시 생성
    props.SignData = utils.generateSignData([
      props.MID,
      props.EdiDate,
      props.Moid,
      props.BID,
      this._api.MerchantKey,
    ]);

    if (!Object.prototype.hasOwnProperty.call(props, 'CharSet')) {
      props.CharSet = this._api.CharSet;
    }

    if (!Object.prototype.hasOwnProperty.call(props, 'EdiType')) {
      props.EdiType = this._api.EdiType;
    }

    const response = await axios.post(
      'billkey_remove.jsp',
      querystring.stringify(props)
    );

    return response.data;
  }

  async cancelCheckout(params) {
    const props = utils.getProps(params, {
      required: ['CancelAmt', 'CancelMsg', 'Moid', 'PartialCancelCode'],
      optional: [
        'CartType',
        'CharSet',
        'EdiDate',
        'EdiType',
        'GoodsVat',
        'ServiceAmt',
        'SupplyAmt',
        'TaxFreeAmt',
      ],
    });

    props.MID = this._api.MID;
    if (!Object.prototype.hasOwnProperty.call(props, 'EdiDate')) {
      props.EdiDate = moment
        .tz('Asia/Seoul')
        .format()
        .replace(/[-T:]/g, '')
        .split('+')[0];
    }
    props.TID = utils.generateTID(props.MID, props.EdiDate);
    // MID + CancelAmt + EdiDate + MerchantKey로 SHA-256 해시 생성
    props.SignData = utils.generateSignData([
      props.MID,
      props.CancelAmt,
      props.EdiDate,
      this._api.MerchantKey,
    ]);

    if (!Object.prototype.hasOwnProperty.call(props, 'CharSet')) {
      props.CharSet = this._api.CharSet;
    }

    if (!Object.prototype.hasOwnProperty.call(props, 'EdiType')) {
      props.EdiType = this._api.EdiType;
    }

    const response = await axios.post(
      'cancel_process.jsp',
      querystring.stringify(props)
    );

    return response.data;
  }
}

module.exports = Nicepay;
