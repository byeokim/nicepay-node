# nicepay-node

nicepay-node는 비공식 노드 모듈입니다.

*nicepay-node는 나이스페이먼츠와 무관합니다*

## API 매뉴얼 버전

nicepay-node는 NICEPAY_BILLING_API 버전 1.0.6에 기반합니다.

## 요구사항

노드 버전 8, 10 이상

## 설치

```bash
npm install nicepay-node
# 또는
yarn add nicepay-node
```

## 사용법

### 인증 결제

```js
const express = require('express');
const Nicepay = require('nicepay-node');

const app = express();

const nicepay = new Nicepay({
  MID: '',
  MerchantKey: '',
  // 응답의 문자인코딩: 'euc-kr' (기본값), 'utf-8'
  CharSet: 'utf-8',
  // 응답의 데이터 형식: 'JSON' (기본값), 'KV'
  EdiType: 'JSON',
});

app.post(
  '/payment',
  express.json(),
  (req, res) => {
    const {
      AuthToken,
      Amt,
      NextAppURL,
      TxTid: TID
    } = req.body;

    nicepay
      .checkout.charge({
        Amt,
        AuthToken,
        NextAppURL,
        TID,
      })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
);

app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});
```

### 빌링 결제

```js
import Nicepay from 'nicepay-node';

const nicepay = new Nicepay({
  MID: '',
  MerchantKey: '',
  // 응답의 문자인코딩: 'euc-kr' (기본값), 'utf-8'
  CharSet: 'utf-8',
  // 응답의 데이터 형식: 'JSON' (기본값), 'KV'
  EdiType: 'JSON',
});

nicepay
  .billing.createBID({
    Moid: '',
    CardNo: '',
    ExpMonth: '',
    ExpYear: '',
    IDNo: '',
    CardPw: '',
    BuyerName: '',
    BuyerEmail: '',
    BuyerTel: '',
  })
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
```

## 라이센스

[MIT](LICENSE)
