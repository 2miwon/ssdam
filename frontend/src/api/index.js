const HOST = process.env.VUE_APP_API_HOST

const API = '/api'

const AUTH = '/auth'
const ACCOUNTS = '/accounts'
const BOOKS = '/books'
const PAGES = '/pages'
const CHAPTER_RECOMMENDATION = '/chapter-recommendation'
const revision = '/revision'
const DATA = '/data'
const BOOK_SETTING = '/book-setting'

export default {
  // account (로그인/회원가입/프로필) 경로
  auth: {
    // 구글 로그인 Authorize
    authorizeGoogle: () => HOST + API + AUTH + '/google/authorize',
    // 구글 로그인 callback
    callbackGoogle: () => HOST + API + AUTH + '/google/callback',
    // 네이버 로그인 Authorize
    authorizeNaver: () => HOST + API + AUTH + '/naver/authorize',
    // 네이버 로그인 callback
    callbackNaver: () => HOST + API + AUTH + '/naver/callback',
    // 카카오 로그인 Authorize
    authorizeKakao: () => HOST + API + AUTH + '/kakao/authorize',
    // 카카오 로그인 callback
    callbackkakao: () => HOST + API + AUTH + '/kakao/callback',

    // 토큰 갱신
    reissueToken: () => HOST + API + AUTH + '/token/reissue',
  },
  accounts: {
    // 로그아웃 POST
    logout: () => HOST + API + ACCOUNTS + '/logout',
    // 유저 업데에트 PUT
    update: () => HOST + API + ACCOUNTS,
    // 회원탈퇴 DELETE
    signout: () => HOST + API + ACCOUNTS,
    // 토큰 갱신 POST
    tokenUpdate: () => HOST + API + ACCOUNTS + '/token-update',
  },
  // 책 (생성/목록조회/단건조회/수정/삭제) 경로
  books: {
    // 책 생성 POST
    createBook: () => HOST + API + BOOKS,
    // 추천에 의한 책 생성 POST
    createBookByRecommend: () => HOST + API + BOOKS,
    // 책 목록조회 GET
    getBookList: () => HOST + API + BOOKS,
    // 책 단건조회 GET
    getBookSingle: (book_id) => HOST + API + BOOKS + `/${book_id}`,
    // 책 수정 PUT
    updateBook: (book_id) => HOST + API + BOOKS + `/${book_id}`,
    // 책 표자 커버 수정
    uploadBookCoverImage: (book_id) => HOST + API + BOOKS + `/${book_id}` + '/cover',
    // 책 삭제 DELETE
    deleteBook: (book_id) => HOST + API + BOOKS + `/${book_id}`,
    // 목차 구성
    createBookStructure: (book_id) => HOST + API + BOOKS + `/${book_id}` + '/structure'

  },
  // 페이지 (생성/목록조회/단건조회/수정/삭제) 경로
  pages: {
    // 페이지 생성 POST
    createPage: (book_id) => HOST + API + BOOKS + `/${book_id}` + PAGES,
    // 페이지 조회 GET
    getPage: (book_id, page_id) => HOST + API + BOOKS + `/${book_id}` + PAGES + `/${page_id}`,
    // 페이지 수정 PUT
    updatePage: (book_id, page_id) => HOST + API + BOOKS + `/${book_id}` + PAGES + `/${page_id}`,
    // 페이지 삭제 DELETE
    deletePage: (book_id, page_id) => HOST + API + BOOKS + `/${book_id}` + PAGES + `/${page_id}`,
    // 페이지 이미지 업로드
    uploadImageFile: (book_id, page_id) => HOST + API + BOOKS + `/${book_id}` + PAGES + `/${page_id}` + '/image',
    // 페이지 이미지 삭제
    getImageFile: (book_id, page_id) => HOST + API + BOOKS + `/${book_id}` + PAGES + `/${page_id}` + '/image',
  },
  // 챕터 추천 경로
  chapter_recommendation: {
    // 메인 질문 생성 POST
    createMainQuestion: () => HOST + API + CHAPTER_RECOMMENDATION + '/main-question',
    // 서브 질문 생성 POST
    createSubQuestion: () => HOST + API + CHAPTER_RECOMMENDATION + '/sub-question',
    // 소목차 생성 POST
    createSection: () => HOST + API + CHAPTER_RECOMMENDATION + '/section',
    // 소목차 클러스터링 POST
    clusterSection: () => HOST + API + CHAPTER_RECOMMENDATION + '/section-clustering',
  },
  // 퇴고 경로
  revision: {
    // 퇴고 생성 POST
    createRevision: () => HOST + API + revision,
  },
  sentence_predictor: {
    // 쓰파일럿
    sentencePredictor: (book_id) => HOST + API + '/sentence-predictor' + BOOKS + `/${book_id}`,
  },
  draft_generator: {
    // 제목 기반 초안 작성
    // draftGenerator: (page_id) => HOST + API + '/draft-generator' + PAGES + `/${page_id}`,
    // 북 세팅 초안 작성
    draftGenerator: (book_id, page_id) => HOST + API + '/draft-generator' + BOOKS + `/${book_id}` + PAGES + `/${page_id}`,
  },
  synonym_generator: {
    // 유의어 생성
    synonymGenerator: () => HOST + API + '/synonym-generator',
  },
  illustration_generator: {
    // 이미지 생성
    illustrationGenerator: (book_id, page_id) => HOST + API + '/illustration-generator' + BOOKS + `/${book_id}` + PAGES + `/${page_id}`,
  },
  // 데이터 경로
  data: {
    storeRecommendationData: (book_id) => HOST + API + DATA + BOOKS + `/${book_id}` + '/chapter',
    storeRevisionData: (page_id) => HOST + API + DATA + PAGES + `/${page_id}` + '/revision',
    storeSentenceData: (page_id) => HOST + API + DATA + PAGES + `/${page_id}` + '/sentence'
  },
  // 북 세팅
  bookSetting: {
    getBookSetting: (book_id) => HOST + API + BOOK_SETTING + BOOKS + `/${book_id}`,
    updateBookSetting: (book_id) => HOST +API + BOOK_SETTING + BOOKS +`/${book_id}`,
    updateBookSettingByChapterData: (book_id) => HOST + API + BOOK_SETTING + BOOKS +`/${book_id}` + '/book-info'
  }
}