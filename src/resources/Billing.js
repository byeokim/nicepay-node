'use strict';

const axios = require('axios');
const querystring = require('querystring');
const moment = require('moment-timezone');
const utils = require('../utils');

const DEFAULT_BASE_URL = 'https://webapi.nicepay.co.kr/webapi/billing/';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=euc-kr',
};

class Billing {
  constructor(nicepay) {
    this._api = nicepay._api;
    this.generateSignData = nicepay.generateSignData;
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
    props.SignData = this.generateSignData([
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

    if (Object.prototype.hasOwnProperty.call(props, 'BuyerName')) {
      props.BuyerName = utils.escapeEucKrString(props.BuyerName);
    }

    delete props.CardNo;
    delete props.CardPw;
    delete props.ExpMonth;
    delete props.ExpYear;
    delete props.IDNo;

    const response = await axios.post(
      DEFAULT_BASE_URL + 'billing_regist.jsp',
      querystring.stringify(props, '&', '=', {
        encodeURIComponent: utils.escapeOnlyNotEscapedString,
      }),
      {
        headers: {...DEFAULT_HEADERS},
      }
    );

    // To report error to NICEPAY EdiDate is required
    if (response.data) {
      response.data.EdiDate = props.EdiDate;
    }

    return response.data;
  }

  async charge(params) {
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
    props.SignData = this.generateSignData([
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

    if (Object.prototype.hasOwnProperty.call(props, 'GoodsName')) {
      props.GoodsName = utils.escapeEucKrString(props.GoodsName);
    }

    if (Object.prototype.hasOwnProperty.call(props, 'BuyerName')) {
      props.BuyerName = utils.escapeEucKrString(props.BuyerName);
    }

    const response = await axios.post(
      DEFAULT_BASE_URL + 'billing_approve.jsp',
      querystring.stringify(props, '&', '=', {
        encodeURIComponent: utils.escapeOnlyNotEscapedString,
      }),
      {
        headers: {...DEFAULT_HEADERS},
      }
    );

    return response.data;
  }

  async deleteBID(params) {
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
    props.SignData = this.generateSignData([
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
      DEFAULT_BASE_URL + 'billkey_remove.jsp',
      querystring.stringify(props, '&', '=', {
        encodeURIComponent: utils.escapeOnlyNotEscapedString,
      }),
      {
        headers: {...DEFAULT_HEADERS},
      }
    );

    return response.data;
  }

  async cancelCharge(params) {
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

    if (Object.prototype.hasOwnProperty.call(props, 'CancelMsg')) {
      props.CancelMsg = utils.escapeEucKrString(props.CancelMsg);
    }

    const response = await axios.post(
      DEFAULT_BASE_URL + 'cancel_process.jsp',
      querystring.stringify(props, '&', '=', {
        encodeURIComponent: utils.escapeOnlyNotEscapedString,
      }),
      {
        headers: {...DEFAULT_HEADERS},
      }
    );

    return response.data;
  }
}

module.exports = Billing;
