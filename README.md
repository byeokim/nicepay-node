# nicepay-node

nicepay-node는 [나이스페이먼츠](https://www.nicepay.co.kr)라는 [PG사](https://www.iamport.kr/pg)의 [신용카드 전자결제서비스](https://www.nicepay.co.kr/intro/pay/card.do) API인 NICEPAY API 1.0 및 NICEPAY BILLING API 1.0.6 버전을 Node.js에서 사용할 수 있게 해주는 모듈입니다.

*\* nicepay-node는 나이스페이먼츠와 무관합니다.*

## 요구사항

- `MID`, `MerchantKey`: 나이스페이먼츠의 신용카드 전자결제서비스 신청 후 발급
- Node.js 8, 10+

## 설치

```bash
npm install nicepay-node
# 또는
yarn add nicepay-node
```

## 사용법


### 인증결제

구매자의 웹브라우저 또는 모바일 앱에 나이스페이먼츠의 결제창을 띄워 구매자가 원하는 카드사를 고를 수 있도록 합니다. 구매자가 카드사를 고르면 그 카드사의 결제창이 추가로 뜨고 구매자는 카드정보를 입력합니다. 그 정보는 나이스페이먼츠 및 판매자(aka 상점 또는 가맹점)의 서버를 통하지 않고 카드사로 직접 전송되고, 카드사에서 그 정보를 인증하면 그 인증정보가 콜백 호출 형식으로 판매자의 백엔드로 전송됩니다. 판매자는 이 정보를 이용해 나이스페이먼츠에 결제요청을 할 수 있습니다.

```js
const express = require('express');
const Nicepay = require('nicepay-node');

const app = express();
const nicepay = new Nicepay({
  MID: '',
  MerchantKey: '',
  CharSet: 'utf-8',
});

app.post('/payment', express.json(), async (req, res) => {
  const {
    AuthToken,
    Amt,
    NextAppURL,
    TxTid: TID
  } = req.body;

  try {
    const result = await nicepay.checkout.charge({
      Amt,
      AuthToken,
      NextAppURL,
      TID,
    });

    console.log(result);
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});
```

### 빌링결제 (정기결제)

구매자가 판매자(aka 상점 또는 가맹점)의 상품을 정기적으로 구매하기로 동의한 경우, 구매자로부터 카드정보를 받아 나이스페이먼츠에 빌키를 신청하고, 이후에는 그 빌키만을 이용해 정기적으로 결제요청을 할 수 있습니다. 정기결제에 대한 개념은 [아임포트의 매뉴얼](https://github.com/iamport/iamport-manual/blob/master/%EC%9D%B8%EC%A6%9D%EA%B2%B0%EC%A0%9C/background.md)에 잘 나와있습니다.

```js
const Nicepay = require('nicepay-node');

const nicepay = new Nicepay({
  MID: '',
  MerchantKey: '',
  CharSet: 'utf-8',
});

nicepay
  .billing.createBID({
    CardNo: '',
    CardPw: '',
    ExpMonth: '',
    ExpYear: '',
    IDNo: '',
    Moid: '',
  })
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
```

## API

### 초기화

```js
const Nicepay = require('nicepay-node');

const nicepay = new Nicepay(options);
```

###### options `object`

```js
const options = {
  MID: '',
  MerchantKey: '',
  ...
};
```

옵션|타입|필수|예시|설명
--|--|--|--|--
MID|string|필수|abcdefghm|상점(가맹점) ID
MerchantKey|string|필수|Y2RlZmdoaWprbG0==|상점(가맹점) 키
CharSet|string||euc-kr 또는 utf-8|Response의 문자인코딩 (미입력시: euc-kr)
EdiType|string||JSON 또는 KV|Response의 데이터 타입. KV는 Key=Value 형식. (미입력시: JSON)

### 인증결제 (checkout)

##### 결제승인 요청

```js
nicepay.checkout.charge(params)
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
```

###### params `object`

```js
const params = {
  Amt: '',
  AuthToken: '',
  NextAppURL: '',
  TID: '',
  ...
};
```

파라메터|타입|필수|예시|설명
--|--|--|--|--
Amt|string|필수|1000|결제금액 (원 단위)
AuthToken|string|필수||인증토큰 (PC/모바일 결제창에서 구매자가 카드정보 입력 후 반환되는 값)
NextAppURL|string|필수||본 결제승인 요청 API URL (PC/모바일 결제창에서 구매자가 카드정보 입력 후 반환되는 값)
TID|string|필수||거래 ID (PC/모바일 결제창에서 구매자가 카드정보 입력 후 반환되는 값)
CharSet|string||euc-kr 또는 utf-8|Response의 문자인코딩 (미입력시: 초기화 때 설정한 값 또는 euc-kr)
EdiDate|string||20201107120000|요청시간 (전문생성일시). 형식은 YYYYMMDDhhmmss. (미입력시: 현재시각으로 자동 설정)
EdiType|string||JSON 또는 KV|Response의 데이터 타입. KV는 Key=Value 형식. (미입력시: 초기화 때 설정한 값 또는 JSON)

###### Response `object` | `undefined`

NICEPAY API 1.0 문서를 참고하시기 바랍니다.

##### 결제승인 요청에 대한 망취소

다음의 두 경우 기 요청한 결제승인에 대한 거래대사 불일치 방지를 위해 결제요청 취소요청을 진행하는데 이를 망취소라고 합니다.

1. 결제승인 요청 시 connection timeout이 발생한 경우
2. 결제승인 요청 후 read timeout이 발생한 경우

```js
nicepay.checkout.cancelTimeoutCharge(params)
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
```

###### params `object`

```js
const params = {
  AuthToken: '',
  NetCancelURL: '',
  TID: '',
  ...
};
```

파라메터|타입|필수|예시|설명
--|--|--|--|--
AuthToken|string|필수||인증토큰 (PC/모바일 결제창에서 구매자가 카드정보 입력 후 반환되는 값)
NetCancelURL|string|필수||본 결제승인 요청에 대한 망취소 API URL (PC/모바일 결제창에서 구매자가 카드정보 입력 후 반환되는 값)
TID|string|필수||거래 ID (PC/모바일 결제창에서 구매자가 카드정보 입력 후 반환되는 값)
Amt|string||1000|결제금액 (원 단위)
CharSet|string||euc-kr 또는 utf-8|Response의 문자인코딩 (미입력시: 초기화 때 설정한 값 또는 euc-kr)
EdiDate|string||20201107120000|요청시간 (전문생성일시). 형식은 YYYYMMDDhhmmss. (미입력시: 현재시각으로 자동 설정)
EdiType|string||JSON 또는 KV|Response의 데이터 타입. KV는 Key=Value 형식. (미입력시: 초기화 때 설정한 값 또는 JSON)

###### Response `object` | `undefined`

NICEPAY API 1.0 문서를 참고하시기 바랍니다.

##### 결제취소 요청

```js
nicepay.checkout.cancelCharge(params)
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
```

###### params `object`

```js
const params = {
  CancelAmt: '',
  CancelMsg: '',
  Moid: '',
  PartialCancelCode: '',
  TID: '',
  ...
};
```

파라메터|타입|필수|예시|설명
--|--|--|--|--
CancelAmt|string|필수|1000|결제취소 금액 (원 단위)
CancelMsg|string|필수|고객요청|결제취소 사유
Moid|string|필수|1234-5678-9012-3456|상점(가맹점) 주문번호
PartialCancelCode|string|필수|0 또는 1|부분취소 여부. 0은 전체취소, 1은 부분취소.
TID|string|필수||거래 ID (PC/모바일 결제창에서 구매자가 카드정보 입력 후 반환되는 값)
CharSet|string||euc-kr 또는 utf-8|Response의 문자인코딩 (미입력시: 초기화 때 설정한 값 또는 euc-kr)
EdiDate|string||20201107120000|요청시간 (전문생성일시). 형식은 YYYYMMDDhhmmss. (미입력시: 현재시각으로 자동 설정)
EdiType|string||JSON 또는 KV|Response의 데이터 타입. KV는 Key=Value 형식. (미입력시: 초기화 때 설정한 값 또는 JSON)

###### Response `object` | `undefined`

NICEPAY API 1.0 문서를 참고하시기 바랍니다.

### 빌링결제 (billing)

##### 빌키 발급 요청

```js
nicepay.billing.createBID(params)
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
```

###### params `object`

```js
const params = {
  CardNo: '',
  CardPw: '',
  ExpMonth: '',
  ExpYear: '',
  IDNo: '',
  Moid: '',
  ...
};
```

파라메터|타입|필수|예시|설명
--|--|--|--|--
CardNo|string|필수|1234123412341234|구매자의 카드번호
CardPw|string|필수|12|구매자의 카드 비밀번호 앞 2자리
ExpMonth|string|필수|12|구매자의 카드 유효기간 중 월 2자리
ExpYear|string|필수|20|구매자의 카드 유효기간 중 년 2자리
IDNo|string|필수|200101|구매자의 생년월일 6자리 또는 사업자등록번호 10자리
Moid|string|필수|1234-5678-9012-3456|상점(가맹점) 주문번호
BuyerEmail|string||example@example.com|구매자의 이메일 주소
BuyerName|string||홍길동|구매자의 이름
BuyerTel|string||01012345678|구매자의 전화번호
CharSet|string||euc-kr 또는 utf-8|Response의 문자인코딩 (미입력시: 초기화 때 설정한 값 또는 euc-kr)
EdiDate|string||20201107120000|요청시간 (전문생성일시). 형식은 YYYYMMDDhhmmss. (미입력시: 현재시각으로 자동 설정)
EdiType|string||JSON 또는 KV|Response의 데이터 타입. KV는 Key=Value 형식. (미입력시: 초기화 때 설정한 값 또는 JSON)

###### Response `object` | `undefined`

NICEPAY BILLING API 1.0.6 문서를 참고하시기 바랍니다.

##### 빌키 삭제 요청

```js
nicepay.billing.removeBID(params)
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
```

###### params `object`

```js
const params = {
  BID: '',
  Moid: '',
  ...
};
```

파라메터|타입|필수|예시|설명
--|--|--|--|--
BID|string|필수|BIKYabcdefghm1234567890123456|빌키
Moid|string|필수|1234-5678-9012-3456|상점(가맹점) 주문번호
CharSet|string||euc-kr 또는 utf-8|Response의 문자인코딩 (미입력시: 초기화 때 설정한 값 또는 euc-kr)
EdiDate|string||20201107120000|요청시간 (전문생성일시). 형식은 YYYYMMDDhhmmss. (미입력시: 현재시각으로 자동 설정)
EdiType|string||JSON 또는 KV|Response의 데이터 타입. KV는 Key=Value 형식. (미입력시: 초기화 때 설정한 값 또는 JSON)

###### Response `object` | `undefined`

NICEPAY BILLING API 1.0.6 문서를 참고하시기 바랍니다.

##### 빌링 결제 승인 요청

```js
nicepay.billing.charge(params)
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
```

###### params `object`

```js
const params = {
  Amt: '',
  BID: '',
  CardInterest: '',
  CardQuota: '',
  Moid: '',
  GoodsName: '',
  ...
};
```

파라메터|타입|필수|예시|설명
--|--|--|--|--
Amt|string|필수|1000|결제금액 (원 단위)
BID|string|필수|BIKYabcdefghm1234567890123456|빌키
CardInterest|string|필수|0 또는 1|상점(가맹점)이 분담하는 무이자 할부의 사용여부. 0은 사용안함, 1은 사용함.
CardQuota|string|필수|00 또는 01 또는 02 ...|할부개월 2자리. 00은 일시불.
Moid|string|필수|1234-5678-9012-3456|상점(가맹점) 주문번호
GoodsName|string|필수|새우깡|상품명
BuyerEmail|string||example@example.com|구매자의 이메일 주소
BuyerName|string||홍길동|구매자의 이름
BuyerTel|string||01012345678|구매자의 전화번호
CardPoint|string||0 또는 1|카드사 포인트 사용여부 0은 미사용, 1은 사용. (미입력시: 0)
CharSet|string||euc-kr 또는 utf-8|Response의 문자인코딩 (미입력시: 초기화 때 설정한 값 또는 euc-kr)
EdiDate|string||20201107120000|요청시간 (전문생성일시). 형식은 YYYYMMDDhhmmss. (미입력시: 현재시각으로 자동 설정)
EdiType|string||JSON 또는 KV|Response의 데이터 타입. KV는 Key=Value 형식. (미입력시: 초기화 때 설정한 값 또는 JSON)
GoodsVat|string|||별도 부가세 설정시 사용
ServiceAmt|string|||별도 봉사료 설정시 사용
SupplyAmt|string|||별도 공급가액 설정시 사용
TaxFreeAmt|string|||별도 면세금액 설정시 사용

###### Response `object` | `undefined`

NICEPAY BILLING API 1.0.6 문서를 참고하시기 바랍니다.

##### 빌링 결제 승인 취소 요청

```js
nicepay.billing.cancelCharge(params)
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
```

###### params `object`

```js
const params = {
  CancelAmt: '',
  CancelMsg: '',
  Moid: '',
  PartialCancelCode: '',
  ...
};
```

파라메터|타입|필수|예시|설명
--|--|--|--|--
CancelAmt|string|필수|1000|결제취소 금액 (원 단위)
CancelMsg|string|필수|고객요청|결제취소 사유
Moid|string|필수|1234-5678-9012-3456|상점(가맹점) 주문번호
PartialCancelCode|string|필수|0 또는 1|부분취소 여부. 0은 전체취소, 1은 부분취소.
CartType|string||0 또는 1|장바구니 결제유형. 장바구니 결제는 1, 그 외는 0.
CharSet|string||euc-kr 또는 utf-8|Response의 문자인코딩 (미입력시: 초기화 때 설정한 값 또는 euc-kr)
EdiDate|string||20201107120000|요청시간 (전문생성일시). 형식은 YYYYMMDDhhmmss. (미입력시: 현재시각으로 자동 설정)
EdiType|string||JSON 또는 KV|Response의 데이터 타입. KV는 Key=Value 형식. (미입력시: 초기화 때 설정한 값 또는 JSON)
GoodsVat|string|||별도 부가세 설정시 사용
ServiceAmt|string|||별도 봉사료 설정시 사용
SupplyAmt|string|||별도 공급가액 설정시 사용
TaxFreeAmt|string|||별도 면세금액 설정시 사용

###### Response `object` | `undefined`

NICEPAY BILLING API 1.0.6 문서를 참고하시기 바랍니다.

## 라이센스

[MIT](LICENSE)
