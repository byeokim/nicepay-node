'use strict';

const crypto = require('crypto');
const validator = require('validator');

const areOptionsValid = (options) => {
  for (const key in options) {
    switch (key) {
      case 'Amt': {
        if (!validator.isNumeric(options[key].toString())) {
          throw new Error(`${key}: ${options[key]} should be number`);
        }

        const MAX = 12;
        if (!validator.isLength(options[key].toString(), {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'AuthToken': {
        const MAX = 40;
        if (!validator.isLength(options[key], {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'BuyerEmail': {
        const MAX = 60;
        if (!validator.isEmail(options[key])) {
          throw new Error(`${key}: ${options[key]} is invalid email format`);
        }

        if (!validator.isLength(options[key], {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'BuyerName': {
        const MAX = 30;
        if (!validator.isLength(options[key], {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }

        break;
      }

      case 'BuyerTel': {
        const MAX = 40;
        if (!validator.isNumeric(options[key])) {
          throw new Error(`${key}: ${options[key]} should be number`);
        }

        if (!validator.isLength(options[key], {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'CancelAmt': {
        const MAX = 12;
        if (!validator.isNumeric(options[key].toString())) {
          throw new Error(`${key}: ${options[key]} should be number`);
        }

        if (!validator.isLength(options[key].toString(), {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'CancelMsg': {
        const MAX = 100;
        if (!validator.isLength(options[key], {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'CardInterest': {
        if (!(options[key] === '0' || options[key] !== '1')) {
          throw new Error(`${key}: ${options[key]} should be 0 or 1`);
        }
        break;
      }

      case 'CardNo': {
        const MAX = 16;
        if (!validator.isNumeric(options[key])) {
          throw new Error(`${key}: ${options[key]} should be number`);
        }

        if (!validator.isLength(options[key], {min: 16, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'CardPoint': {
        if (!validator.isNumeric(options[key])) {
          throw new Error(`${key}: ${options[key]} should be number`);
        }

        if (!(options[key] === '0' || options[key] !== '1')) {
          throw new Error(`${key}: ${options[key]} should be either 0 or 1`);
        }
        break;
      }

      case 'CardPw': {
        const MAX = 2;
        if (!validator.isNumeric(options[key])) {
          throw new Error(`${key} should be number`);
        }

        if (!validator.isLength(options[key], {min: MAX, max: MAX})) {
          throw new Error(`${key} must have exactly ${MAX} characters`);
        }
        break;
      }

      case 'CardQuota': {
        const MAX = 2;
        if (!validator.isNumeric(options[key])) {
          throw new Error(`${key}: ${options[key]} should be number`);
        }

        if (!validator.isLength(options[key], {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'CartType': {
        if (!(options[key] === '0' || options[key] !== '1')) {
          throw new Error(`${key}: ${options[key]} should be either 0 or 1`);
        }
        break;
      }

      case 'CharSet': {
        if (!(options[key] === 'utf-8' || options[key] === 'euc-kr')) {
          throw new Error(
            `${key}: ${options[key]} should be either utf-8 or euc-kr`
          );
        }
        break;
      }

      case 'EdiDate': {
        const MAX = 14;
        if (!validator.isNumeric(options[key])) {
          throw new Error(`${key}: ${options[key]} should be number`);
        }

        if (!validator.isLength(options[key], {min: MAX, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} must have exactly ${MAX} characters`
          );
        }
        break;
      }

      case 'EdiType': {
        if (!(options[key] === 'JSON' || options[key] === 'KV')) {
          throw new Error(
            `${key}: ${options[key]} should be either JSON or KV`
          );
        }
        break;
      }

      case 'MID': {
        const MAX = 10;
        if (!validator.isLength(options[key], {min: MAX, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} must have exactly ${MAX} characters`
          );
        }
        break;
      }

      case 'Moid': {
        const MAX = 64;
        if (!validator.isLength(options[key], {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'ExpMonth': {
        const MAX = 2;
        if (!validator.isNumeric(options[key])) {
          throw new Error(`${key}: ${options[key]} should be number`);
        }

        if (!validator.isLength(options[key], {min: MAX, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} must have exactly ${MAX} characters`
          );
        }
        break;
      }

      case 'ExpYear': {
        const MAX = 2;
        if (!validator.isNumeric(options[key])) {
          throw new Error(`${key}: ${options[key]} should be number`);
        }

        if (!validator.isLength(options[key], {min: MAX, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} must have exactly ${MAX} characters`
          );
        }
        break;
      }

      case 'GoodsName': {
        const MAX = 40;
        if (!validator.isLength(options[key], {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'IDNo': {
        if (!validator.isNumeric(options[key])) {
          throw new Error(`${key}: ${options[key]} should be number`);
        }

        // IDNo는 생년월일 6자리 또는 사업자등록번호 10자리
        if (
          !(
            validator.isLength(options[key], {min: 6, max: 6}) ||
            validator.isLength(options[key], {min: 10, max: 10})
          )
        ) {
          throw new Error(
            `${key}: ${options[key]} must have exactly 6 characters for date of birth in YYMMDD format, or 10 characters for Business Registration Number`
          );
        }
        break;
      }

      case 'PartialCancelCode': {
        if (!(options[key] === '0' || options[key] !== '1')) {
          throw new Error(`${key}: ${options[key]} should be either 0 or 1`);
        }
        break;
      }

      case 'RefundAcctNm': {
        const MAX = 10;
        if (!validator.isLength(options[key], {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'RefundAcctNo': {
        const MAX = 16;
        if (!validator.isLength(options[key], {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }

      case 'RefundBankCd': {
        const MAX = 3;
        if (!validator.isLength(options[key], {min: 0, max: MAX})) {
          throw new Error(
            `${key}: ${options[key]} should have less than or equal to ${MAX} characters`
          );
        }
        break;
      }
    }
  }
};

exports.getProps = (options, rules) => {
  if (!options) {
    throw new Error(`Options must have ${rules.required.join(', ')}`);
  }

  const isObject = options === Object(options) && !Array.isArray(options);

  if (!isObject) {
    throw new Error('Options must be an object');
  }

  const unexpectedOptionsValues = Object.keys(options).filter(
    (value) => !rules.required.concat(rules.optional || []).includes(value)
  );

  if (unexpectedOptionsValues.length > 0) {
    throw new Error(
      `Options may only contain the following: ${rules.required
        .concat(rules.optional || [])
        .join(', ')}`
    );
  }

  const omittedRequiredOptionsValues = rules.required.filter(
    (value) => !Object.keys(options).includes(value)
  );

  if (omittedRequiredOptionsValues.length > 0) {
    throw new Error(
      `Options must have the following: ${omittedRequiredOptionsValues.join(
        ', '
      )}`
    );
  }

  areOptionsValid(options);

  return options;
};

exports.generateTID = (MID, EdiDate) => {
  // 지불수단: 신용카드(01)
  const paymentMethod = '01';

  // 매체구분: 빌링(16)
  const paymentMedium = '16';

  // 시간정보(YYMMDDHHmmss)는 EdiDate(전문생성일시, YYYYMMDDHHmmss)에서 추출
  const timeInformation = EdiDate.slice(2);

  // 랜덤
  const randomNumber = Math.random().toString().slice(2, 6);

  return MID + paymentMethod + paymentMedium + timeInformation + randomNumber;
};

exports.generateEncData = (
  CardNo,
  ExpYear,
  ExpMonth,
  IDNo,
  CardPw,
  MerchantKey
) => {
  return new Promise((resolve, reject) => {
    const cipher = crypto.createCipheriv(
      'aes-128-ecb',
      MerchantKey.slice(0, 16),
      null
    );

    let EncData = '';
    cipher.setEncoding('hex');
    cipher.on('data', (chunk) => (EncData += chunk));
    cipher.on('error', (err) => reject(err.message));
    cipher.on('end', () => resolve(EncData));
    cipher.write(
      `CardNo=${CardNo}&ExpYear=${ExpYear}&ExpMonth=${ExpMonth}&IDNo=${IDNo}&CardPw=${CardPw}`
    );
    cipher.end();
  });
};
