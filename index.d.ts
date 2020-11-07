declare class Nicepay {
  constructor(options: {
    MID: string;
    MerchantKey: string;
    CharSet?: string;
    EdiType?: string;
  });
  generateSignData(params: string[]): string;
  billing: Billing;
  checkout: Checkout;
}

declare class Billing {
  constructor(nicepay: Nicepay);
  createBID(params: {
    CardNo: string;
    CardPw: string;
    ExpMonth: string;
    ExpYear: string;
    IDNo: string;
    Moid: string;
    BuyerEmail?: string;
    BuyerName?: string;
    BuyerTel?: string;
    CharSet?: string;
    EdiDate?: string;
    EdiType?: string;
  }):
    | Promise<{
        AuthDate: string;
        BID: string;
        CardCode: string;
        CardName: string;
        ResultCode: string;
        ResultMsg: string;
        TID: string;
      }>
    | undefined;

  removeBID(params: {
    BID: string;
    Moid: string;
    CharSet?: string;
    EdiDate?: string;
    EdiType?: string;
  }):
    | Promise<{
        AuthDate: string;
        BID: string;
        ResultCode: string;
        ResultMsg: string;
        TID: string;
      }>
    | undefined;

  charge(params: {
    Amt: string;
    BID: string;
    CardInterest: string;
    CardQuota: string;
    Moid: string;
    GoodsName: string;
    BuyerEmail?: string;
    BuyerName?: string;
    BuyerTel?: string;
    CardPoint?: string;
    CharSet?: string;
    EdiDate?: string;
    EdiType?: string;
    GoodsVat?: string;
    ServiceAmt?: string;
    SupplyAmt?: string;
    TaxFreeAmt?: string;
  }):
    | Promise<{
        AcquCardCode: string;
        AcquCardName: string;
        Amt: string;
        AuthCode: string;
        AuthDate: string;
        CardCl: string;
        CardCode: string;
        CardInterest: string;
        CardName: string;
        CardNo: string;
        CardQuota: string;
        Moid: string;
        ResultCode: string;
        ResultMsg: string;
        TID: string;
      }>
    | undefined;

  cancelCharge(params: {
    CancelAmt: string;
    CancelMsg: string;
    Moid: string;
    PartialCancelCode: string;
    CartType?: string;
    CharSet?: string;
    EdiDate?: string;
    EdiType?: string;
    GoodsVat?: string;
    ServiceAmt?: string;
    SupplyAmt?: string;
    TaxFreeAmt?: string;
  }):
    | Promise<{
        CancelAmt: string;
        CancelDate: string;
        CancelNum: string;
        CancelTime: string;
        ErrorCD: string;
        ErrorMsg: string;
        MID: string;
        Moid: string;
        PayMethod: string;
        RemainAmt: string;
        ResultCode: string;
        ResultMsg: string;
        TID: string;
      }>
    | undefined;
}

declare class Checkout {
  constructor(nicepay: Nicepay);
  charge(params: {
    Amt: string;
    AuthToken: string;
    NextAppURL: string;
    TID: string;
    CharSet?: string;
    EdiDate?: string;
    EdiType?: string;
  }): Promise<
    | {
        Amt: string;
        AuthDate: string;
        MID: string;
        Moid: string;
        PayMethod: string;
        ResultCode: string;
        ResultMsg: string;
        GoodsName: string;
        TID: string;
        AcquCardCode?: string;
        AcquCardName?: string;
        AuthCode?: string;
        BankCode?: string;
        BankName?: string;
        BuyerEmail?: string;
        BuyerName?: string;
        BuyerTel?: string;
        CardCl?: string;
        CardCode?: string;
        CardName?: string;
        CardNo?: string;
        CardQuota?: string;
        CardInterest?: string;
        CartData?: string;
        CcPartCl?: string;
        ClickpayCl?: string;
        CouponAmt?: string;
        CouponMinAmt?: string;
        MallReserved?: string;
        MultiCardAcquAmt?: string;
        MultiCl?: string;
        MultiCouponAmt?: string;
        MultiPointAmt?: string;
        PointAppAmt?: string;
        RcptAuthCode?: string;
        RcptTID?: string;
        RcptType?: string;
        Signature?: string;
        VbankBankCode?: string;
        VbankBankName?: string;
        VbankNum?: string;
        VbankExpDate?: string;
        VbankExpTime?: string;
      }
    | undefined
  >;

  cancelTimeoutCharge(params: {
    AuthToken: string;
    TID: string;
    Amt?: string;
    CharSet?: string;
    EdiDate?: string;
    EdiType?: string;
  }):
    | Promise<{
        CancelAmt: string;
        MID: string;
        Moid: string;
        ResultCode: string;
        ResultMsg: string;
        CancelDate?: string;
        CancelTime?: string;
        PayMethod?: string;
        RemainAmt?: string;
        TID?: string;
      }>
    | undefined;

  cancelCharge(params: {
    CancelAmt: string;
    CancelMsg: string;
    Moid: string;
    PartialCancelCode: string;
    TID: string;
    Amt?: string;
    CharSet?: string;
    EdiDate?: string;
    EdiType?: string;
    RefundAcctNo?: string;
    RefundBankCd?: string;
    RefundAcctNm?: string;
  }):
    | Promise<{
        CancelAmt: string;
        MID: string;
        Moid: string;
        ResultCode: string;
        ResultMsg: string;
        CancelDate?: string;
        CancelTime?: string;
        PayMethod?: string;
        RemainAmt?: string;
        TID?: string;
      }>
    | undefined;
}

export = Nicepay;
