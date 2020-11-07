'use strict';

const axios = require('axios');
const querystring = require('querystring');
const moment = require('moment-timezone');
const utils = require('../utils');

const DEFAULT_BASE_URL = 'https://webapi.nicepay.co.kr/webapi/';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

class Checkout {
  constructor(nicepay) {
    this._api = nicepay._api;
    this.generateSignData = nicepay.generateSignData;
  }

  async charge(params) {
    const props = utils.getProps(params, {
      required: ['Amt', 'AuthToken', 'NextAppURL', 'TID'],
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

    // AuthToken + MID + Amt + EdiDate + MerchantKey로 SHA-256 해시 생성
    props.SignData = this.generateSignData([
      props.AuthToken,
      props.MID,
      props.Amt,
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
      props.NextAppURL,
      querystring.stringify(props),
      {
        headers: {...DEFAULT_HEADERS},
      }
    );

    return response.data;
  }

  async cancelTimeoutCharge(params) {
    const props = utils.getProps(params, {
      required: ['AuthToken', 'NetCancelURL', 'TID'],
      optional: ['Amt', 'CharSet', 'EdiDate', 'EdiType'],
    });

    props.MID = this._api.MID;
    props.NetCancel = '1';

    if (!Object.prototype.hasOwnProperty.call(props, 'EdiDate')) {
      props.EdiDate = moment
        .tz('Asia/Seoul')
        .format()
        .replace(/[-T:]/g, '')
        .split('+')[0];
    }

    // AuthToken + MID + Amt + EdiDate + MerchantKey로 SHA-256 해시 생성
    props.SignData = this.generateSignData([
      props.AuthToken,
      props.MID,
      props.Amt,
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
      props.NetCancelURL,
      querystring.stringify(props),
      {
        headers: {...DEFAULT_HEADERS},
      }
    );

    return response.data;
  }

  async cancelCharge(params) {
    const props = utils.getProps(params, {
      required: ['CancelAmt', 'CancelMsg', 'Moid', 'PartialCancelCode', 'TID'],
      optional: [
        'Amt',
        'CharSet',
        'EdiDate',
        'EdiType',
        'RefundAcctNo',
        'RefundBankCd',
        'RefundAcctNm',
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

    // AuthToken + MID + Amt + EdiDate + MerchantKey로 SHA-256 해시 생성
    props.SignData = this.generateSignData([
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
      DEFAULT_BASE_URL + 'cancel_process.jsp',
      querystring.stringify(props),
      {
        headers: {...DEFAULT_HEADERS},
      }
    );

    return response.data;
  }
}

module.exports = Checkout;
