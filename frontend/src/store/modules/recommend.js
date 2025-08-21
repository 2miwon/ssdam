import api from '@/api'
import axiosInstance from "@/api/axiosInstance";

export default {
  state: {
    topic: '',
    mainQuestionList: [],
    mainAnswer: '',
    subQuestionList: [],
    sectionList: [],
    recommendProcess: 1,
    sectionInProgressCount: 0,
    showRecommendCloseModal: 0,
    totalSectionCount: 0,
    deletedSectionCount: 0,
  },

  // 모든 state는 직접 접근하지 않고 getters를 통해서만 접근
  getters: {
    topic: state => state.topic,
    mainQuestionList: state => state.mainQuestionList,
    mainAnswer: state => state.mainAnswer,
    subQuestionList: state => state.subQuestionList,
    sectionList: state => state.sectionList,
    recommendProcess: state => state.recommendProcess,
    sectionInProgressCount: state => state.sectionInProgressCount,
    showRecommendCloseModal: state => state.showRecommendCloseModal,
    totalSectionCount: state => state.totalSectionCount,
    deletedSectionCount: state => state.modifiedSectionCount,
  },

  // state를 변경하는 로직은 mutations에서만 처리
  mutations: {
    SET_TOPIC: (state, topic) => state.topic = topic,
    SET_MAIN_QUESTION_LIST: (state, questions) => state.mainQuestionList = questions,
    SET_MAIN_ANSWER: (state, answer) => state.mainAnswer = answer,
    SET_SUB_QUESTION_LIST: (state, questions) => state.subQuestionList = questions,
    SET_SECTION_LIST: (state, sections) => state.sectionList = sections,
    ADD_TO_SECTION_LIST: (state, sections) => state.sectionList = state.sectionList.concat(sections),
    NEXT_RECOMMEND_PROCESS: (state) => state.recommendProcess = state.recommendProcess+1,
    RESET_RECOMMEND_PROCESS: (state) => {
      state.recommendProcess = 1
      state.topic = ''
      state.mainQuestionList = []
      state.subQuestionList = []
      state.sectionList = []
      state.sectionInProgressCount = 0
      state.totalSectionCount = 0
      state.modifiedSectionCount = 0
    },
    INCREASE_SECTION_IN_PROGRESS_COUNT: (state) => state.sectionInProgressCount++,
    DECREASE_SECTION_IN_PROGRESS_COUNT: (state) => state.sectionInProgressCount--,
    SET_SHOW_RECOMMEND_CLOSE_MODAL: (state, show) => state.showRecommendCloseModal = show,
    SET_TOTAL_SECTION_COUNT: (state, count) => state.totalSectionCount = count,
    ADD_DELETED_SECTION_COUNT: (state) => state.deletedSectionCount++,
  },

  // API 호출 등의 async 작업은 actions에서 처리
  actions: {
    async setMainQuestionList({ commit }, answer) {
      commit('SET_TOPIC', answer)
      await axiosInstance({
        url: api.chapter_recommendation.createMainQuestion(),
        method: 'post',
        data: {
          topic: answer
        }
      }).then(res => {
        commit('SET_MAIN_QUESTION_LIST', res.data.main_question_list)
      }).catch(err => {
        console.error(err)
      })
    },

    async setSubQuestionList({ commit, getters }, { answer, index }) {
      commit('SET_MAIN_ANSWER', answer)
      await axiosInstance({
        url: api.chapter_recommendation.createSubQuestion(),
        method: 'post',
        data: {
          topic: getters.topic,
          main_question: (getters.mainQuestionList)[index],
          main_answer: answer
        }
      }).then(res => {
        commit('SET_SUB_QUESTION_LIST', res.data.sub_question_list)
      }).catch(err => {
        console.error(err)
        throw new Error(err)
      })
    },

    async addToSectionList({ commit, getters }, { question, answer }) {
      // 질문을 여러개 제출할 수 있는 recommend3만 await 사용하지 않았습니다
      commit("INCREASE_SECTION_IN_PROGRESS_COUNT")
      await axiosInstance({
        url: api.chapter_recommendation.createSection(),
        method: 'post',
        data: {
          topic: getters.topic,
          main_answer: getters.mainAnswer,
          sub_question: question,
          sub_answer: answer
        }
      }).then(res => {
        commit('ADD_TO_SECTION_LIST', res.data.section_list)
      }).catch(err => {
        console.error(err)
        throw new Error(err)
      })
      commit("DECREASE_SECTION_IN_PROGRESS_COUNT")

    },

    async finalRecommendation({ getters, commit }) {
      const mainChapterPageId = getters.currentBook.book_schema.main_chapter.page_id
      await axiosInstance({
        url: api.chapter_recommendation.clusterSection(),
        method: 'post',
        data: {
          main_answer: getters.mainAnswer,
          section_list: getters.sectionList
        }
      }).then(res => {
        const bookSchema = res.data
        bookSchema.main_chapter.page_id = mainChapterPageId

        // 추천 시점에 section 개수를 저장
        var count = 1
        for (const subChapter of bookSchema.main_chapter.sub_chapter_list) {
          count++
          count += subChapter.section_list.length
        }
        commit('SET_TOTAL_SECTION_COUNT', count)
        
        commit('SET_BOOK_SCHEMA', bookSchema)
      }).catch(err => {
        console.error(err)
        throw new Error(err)
      })
    },

    async storeRecommendationData({ getters }, { question, answer } ) {
      const bookId = getters.currentBook.book_id
      axiosInstance({
        url: api.data.storeRecommendationData(bookId),
        method: 'post',
        data: {
          question: question,
          answer: answer
        }
      })
    }
  }
}