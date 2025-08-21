import { createWebHistory, createRouter } from 'vue-router'
import store from '@/store'

const LoginPage = () => import('@/views/LoginPage.vue')
const BookPage = () => import('@/views/BookPage.vue')
const EditorPage = () => import('@/views/EditorPage.vue')
const RecommendPage = () => import('@/views/RecommendPage.vue')
const RevisionPage = () => import('@/views/RevisionPage.vue')
const NotFoundPage = () => import('@/views/NotFoundPage.vue')

const GoogleCallback = () => import('@/components/Login/GoogleCallback.vue')
const NaverCallback = () => import('@/components/Login/NaverCallback.vue')
const KakaoCallback = () => import('@/components/Login/KakaoCallback.vue')

const routes = [
  { 
    path: '/',
    name: 'login',
    component: LoginPage,
    meta: { 
      requiresAuth: false,
      title: '쓰담: 로그인',
    },

  },
  {
    path: '/login/google',
    name: 'googleCallback',
    component: GoogleCallback,
    meta: { requiresAuth: false},
  },
  {
    path: '/login/naver',
    name: 'naverCallback',
    component: NaverCallback,
    meta: { requiresAuth: false},
  },
  {
    path: '/login/kakao',
    name: 'kakaoCallback',
    component: KakaoCallback,
    meta: { requiresAuth: false},
  },
  {
    path: '/book', 
    name: 'book',
    component: BookPage,
    meta: { 
      requiresAuth: false,
      title: '쓰담: 내 서재',
    },
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: RecommendPage,
    meta: { 
      requiresAuth: true,
      title: '쓰담: 글감 추천',
    },
  },
  { 
    path: '/editor', 
    name: 'editor',
    component: EditorPage,
    meta: { 
      requiresAuth: true,
    },
  },
  {
    path: '/revision',
    name: 'revision',
    component: RevisionPage,
    meta: { 
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundPage,
    meta: { 
      requiresAuth: false,
      title: '오류: 페이지를 찾지 못했습니다.',
    },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "쓰담"
  // 어떤 화면으로 가도 프린트 모달 초기화
  store.commit('SET_SHOW_PRINT_MODAL', false)
  if (to.meta.requiresAuth && !store.getters.isLoggedIn) {
    next({ name: 'login'})
    return
  }
  if (to.name == 'editor') {
    if (store.getters.currentBook == null) {
      next({ name: 'book'})
      return
    }
  }
  if (to.name == 'recommend') {
    if (store.getters.currentBook == null) {
      next({ name: 'book'})
      return
    }
  }
  if (to.name == 'revision') {
    if (store.getters.currentPageID == null) {
      next({ name: 'editor'})
      return
    }
  }
  next()
})

export default router
