export const INTERNAL_ERROR_CODE = {
  // USER: 1 ~ 10
  USER_ALREADY_CREATED: 1, // 이미 생성된 유저
  USER_NOT_FOUND: 2, // 유저 찾을 수 없음
  USER_PASSWORD_INVALID: 3, // 유저 비밀번호 유효하지 않음

  // PRODUCT: 11 ~ 20
  PRODUCT_ALREADY_CREATED: 11, // 이미 등록된 제품
  PRODUCT_NOT_FOUND: 12, // 제품을 찾을 수 없음
  PRODUCT_STOCK_INSUFFICIENT: 13, // 제품 수량 부족

  // INVENTORY: 21 ~ 30

  // DATABASE
  DB_UPDATE_FAILED: 9999, // db 업데이트 실패
} as const;

export type InternalErrorCode =
  (typeof INTERNAL_ERROR_CODE)[keyof typeof INTERNAL_ERROR_CODE];
