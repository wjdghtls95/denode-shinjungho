import { INTERNAL_ERROR_CODE as e } from './internal-error-code.constants';

export const INTERNAL_ERROR_CODE_DESC = {
  // USER
  [e.USER_ALREADY_CREATED]: '이미 생성된 유저',
  [e.USER_NOT_FOUND]: '유저 찾을 수 없음',
  [e.USER_PASSWORD_INVALID]: '유저 비밀번호 유효하지 않음',

  // PRODUCT
  [e.PRODUCT_ALREADY_CREATED]: '이미 등록된 제품',
  [e.PRODUCT_NOT_FOUND]: '제품을 찾을 수 없음',
  [e.PRODUCT_STOCK_INSUFFICIENT]: '제품 수량 부족',

  // DATABASE
  [e.DB_UPDATE_FAILED]: 'db 얻데이트 실패',
} as const;
