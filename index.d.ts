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

  deleteBID(params: {
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
    Amt: number;
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
    ServiceAmt?: number;
    SupplyAmt?: number;
    TaxFreeAmt?: number;
  }):
    | Promise<{
        AcquCardCode: string;
        AcquCardName: string;
        Amt: number;
        AuthCode: string;
        AuthDate: string;
        BuyerName?: string;
        CardCl: string;
        CardCode: string;
        CardInterest: string;
        CardName: string;
        CardNo: string;
        CardQuota: string;
        GoodsName?: string;
        MID?: string;
        Moid: string;
        ResultCode: string;
        ResultMsg: string;
        TID: string;
      }>
    | undefined;

  cancelCharge(params: {
    CancelAmt: number;
    CancelMsg: string;
    Moid: string;
    PartialCancelCode: string;
    CartType?: string;
    CharSet?: string;
    EdiDate?: string;
    EdiType?: string;
    GoodsVat?: string;
    ServiceAmt?: number;
    SupplyAmt?: number;
    TaxFreeAmt?: number;
  }):
    | Promise<{
        CancelAmt: number;
        CancelDate: string;
        CancelNum: string;
        CancelTime: string;
        ErrorCD: string;
        ErrorMsg: string;
        MID: string;
        Moid: string;
        PayMethod: string;
        RemainAmt: number;
        ResultCode: string;
        ResultMsg: string;
        TID: string;
      }>
    | undefined;
}

declare class Checkout {
  constructor(nicepay: Nicepay);
  charge(params: {
    Amt: number;
    AuthToken: string;
    NextAppURL: string;
    TID: string;
    CharSet?: string;
    EdiDate?: string;
    EdiType?: string;
  }): Promise<
    | {
        Amt: number;
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
        CouponAmt?: number;
        CouponMinAmt?: number;
        MallReserved?: string;
        MultiCardAcquAmt?: number;
        MultiCl?: string;
        MultiCouponAmt?: number;
        MultiPointAmt?: number;
        PointAppAmt?: number;
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
    NetCancelURL: string;
    TID: string;
    Amt?: number;
    CharSet?: string;
    EdiDate?: string;
    EdiType?: string;
  }):
    | Promise<{
        CancelAmt: number;
        MID: string;
        Moid: string;
        ResultCode: string;
        ResultMsg: string;
        CancelDate?: string;
        CancelTime?: string;
        PayMethod?: string;
        RemainAmt?: number;
        TID?: string;
      }>
    | undefined;

  cancelCharge(params: {
    CancelAmt: number;
    CancelMsg: string;
    Moid: string;
    PartialCancelCode: string;
    TID: string;
    CharSet?: string;
    EdiDate?: string;
    EdiType?: string;
    RefundAcctNo?: string;
    RefundBankCd?: string;
    RefundAcctNm?: string;
  }):
    | Promise<{
        CancelAmt: number;
        MID: string;
        Moid: string;
        ResultCode: string;
        ResultMsg: string;
        CancelDate?: string;
        CancelTime?: string;
        PayMethod?: string;
        RemainAmt?: number;
        TID?: string;
      }>
    | undefined;
}

export = Nicepay;
