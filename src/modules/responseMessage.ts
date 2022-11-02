const message = {
  // 전체적으로 쓰이는 코드
  NULL_VALUE: '필요한 값이 없습니다.',
  TO_MUCH_VALUE: '필요 없는 값이 있습니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '존재하지 않는 자원입니다.',
  BAD_REQUEST: '잘못된 문법으로 인하여 서버가 요청을 이해할 수 없습니다.',
  INTERNAL_SERVER_ERROR: '서버 내부 오류입니다.',
  BAD_QUERY: '올바르지 않은 쿼리 형식입니다.',
  INVALID_PARAMETER: '잘못된 파라미터입니다.',
  NO_USER: '존재하지 않는 유저입니다.',

  // auth
  EXPIRED_TOKEN: '만료된 토큰입니다.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다.',
  NULL_VALUE_TOKEN: '토큰이 없습니다.',
  INVALID_USER: '카카오에 가입되어 있지 않은 유저입니다.',
  UNDEFINED_SOCIAL_TYPE: '잘못된 소셜 타입입니다.',
  KAKAO_TOKEN_ERROR: '카카오 토큰 에러입니다.',
  USER_LOGIN_SUCCESS: '로그인 성공',

  // user
  NICKNAME_UPDATE_SUCCESS: '닉네임 변경 성공',
  INVALID_NICKNAME_LENGTH: '닉네임 길이를 2~8 으로 해주세요.',

  // menu
  GET_ALL_MENU_SUCCESS: '메뉴 전체 조회 성공',

  // lunch template
  INVALID_TEMPLATE_NAME_LENGTH: '템플릿 제목의 길이를 2~10으로 해주세요.',
  POST_LUNCH_TEMPLATE_SUCCESS: '템플릿 생성 성공',
  NO_LUNCH_TEMPLATE_CONTENT: '제작한 템플릿이 없습니다.',
  GET_ALL_LUNCH_TEMPLATE_SUCCESS: '전체 템플릿 조회 성공',
  INVALID_LUNCH_TEMPLATE: '잘못된 템플릿입니다.',
  GET_LUNCH_TEMPLATE_SUCCESS: '템플릿 상세 조회 성공',
  UPDATE_LUNCH_TEMPLATE_SUCCESS: '템플릿 수정 성공',
  DELETE_LUNCH_TEMPLATE_SUCCESS: '템플릿 삭제 성공',

  // group
  INVALID_EMAIL: '는 없는 이메일입니다.',
};

export default message;
