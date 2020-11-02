# node-nicepay-billing

node-nicepay-billing은 비공식 노드 모듈입니다.

*node-nicepay-billing은 나이스페이먼츠와 무관합니다*

## 요구사항

노드 버전 8, 10 이상

## 설치

```bash
npm install node-nicepay-billing
# 또는
yarn add node-nicepay-billing
```

## 사용법

```js
import Nicepay from 'node-nicepay-billing';

const nicepay = new Nicepay({
  MID: '',
  MerchantKey: '',
  // 응답의 문자인코딩: 'euc-kr' (기본값), 'utf-8'
  CharSet: 'utf-8',
  // 응답의 데이터 형식: 'JSON' (기본값), 'KV'
  EdiType: 'JSON',
});

nicepay
  .createBID({
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
