import api from "@/api";
import { createApi } from "unsplash-js";
import axiosInstance from "@/api/axiosInstance";
import { BookLeftBarStatus } from "@/store/constants/bookLeftBarStatus";
import { toRaw } from "vue";

const UNSPLASH_ACCESS_KEY = process.env.VUE_APP_UNSPLASH_ACCESS_KEY;
const unsplash = createApi({
  accessKey: UNSPLASH_ACCESS_KEY,
});

export default {
  state: {
    bookList: [],
    currentBook: null,
    bookLeftBarStatus: BookLeftBarStatus.BOOKSHELF,
    bookLeftBarFolded: false,
    mobileBlockingMessageChecked: false,
    bookCategory: '',
    bookTopic: '',
    bookPurpose: '',
    bookTarget: '',
    bookTargetDescription: '',
    bookStyle: '',
  },

  // 모든 state는 직접 접근하지 않고 getters를 통해서만 접근
  getters: {
    bookList: state => state.bookList,
    currentBook: state => state.currentBook,
    bookLeftBarStatus: state => state.bookLeftBarStatus,
    bookLeftBarFolded: state => state.bookLeftBarFolded,
    mobileBlockingMessageChecked: state => state.mobileBlockingMessageChecked,

    bookCategory: state => state.bookCategory,
    bookTopic: state => state.bookTopic,
    bookPurpose: state => state.bookPurpose,
    bookTarget: state => state.bookTarget,
    bookTargetDescription: state => state.bookTargetDescription,
    bookStyle: state => state.bookStyle
  },

  // state를 변경하는 로직은 mutations에서만 처리
  mutations: {
    SET_BOOK_LIST: (state, books) => state.bookList = books,
    SET_CURRENT_BOOK: (state, book) => state.currentBook = book,
    SET_BOOK_SCHEMA: (state, tree) => state.currentBook.book_schema = tree,
    SET_BOOK_LEFT_BAR_STATUS: (state, status) => state.bookLeftBarStatus = status,
    SET_DELETED_TIME: (state, time) => state.currentBook.deleted_at = time,
    SET_BOOK_LEFT_BAR_FOLDED: (state, value) => state.bookLeftBarFolded = value,

    SET_BOOK_CATEGORY: (state, value) => state.bookCategory = value,
    SET_BOOK_TOPIC: (state, value) => state.bookTopic = value,
    SET_BOOK_PURPOSE: (state, value) => state.bookPurpose = value,
    SET_BOOK_TARGET: (state, value) => state.bookTarget = value,
    SET_BOOK_TARGET_DESCRIPTION: (state, value) => state.bookTargetDescription = value,
    SET_BOOK_STYLE: (state, value) => state.bookStyle = value,

    MODIFY_COVER_IMAGE: (state, coverImageUrl) => state.currentBook.cover_image_url = coverImageUrl,
    MODIFY_BOOK_FINISHED_STATE: (state, isFinished) => state.currentBook.is_finished = isFinished,
    MODIFY_BOOK_DELETED_STATE: (state, isDeleted) => state.currentBook.is_deleted = isDeleted,

    // DELETE_MAIN_CHAPTER: (state) => state.currentBook.book_schema.main_chapter = { title: '', sub_chapter_list: [] },
    DELETE_SUB_CHAPTER: (state, index) => {
      state.currentBook.book_schema.main_chapter.sub_chapter_list[index].is_deleted = true
      state.currentBook.book_schema.main_chapter.sub_chapter_list[index].deleted_at = new Date()
    },
    DELETE_SECTION: (state, { index1, index2 }) => {
      state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].section_list[index2].is_deleted = true
      state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].section_list[index2].deleted_at = new Date()
    },

    DELETE_SUB_CHAPTER_RECOMMEND: (state, index) => {
      state.currentBook.book_schema.main_chapter.sub_chapter_list.splice(index, 1)
    },
    DELETE_SECTION_RECOMMEND: (state, { index1, index2 }) => {
      state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].section_list.splice(index2, 1)
    },

    DELETE_BOOK: (state, index) => state.bookList.splice(index, 1),

    RESTORE_SUB_CHAPTER: (state, index) => {
      state.currentBook.book_schema.main_chapter.sub_chapter_list[index].is_deleted = false
      state.currentBook.book_schema.main_chapter.sub_chapter_list[index].deleted_at = null
    },
    RESTORE_SECTION: (state, { index1, index2 }) => {
      state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].section_list[index2].is_deleted = false
      state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].section_list[index2].deleted_at = null
    },

    PERMANENT_DELETE_MAIN_CHAPTER: (state) => state.currentBook.book_schema.main_chapter = { title: '', sub_chapter_list: [] },
    PERMANENT_DELETE_SUB_CHAPTER: (state, index) => state.currentBook.book_schema.main_chapter.sub_chapter_list.splice(index, 1),
    PERMANENT_DELETE_SECTION: (state, { index1, index2 }) => state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].section_list.splice(index2, 1),

    EDIT_MAIN_TITLE: (state, title) => state.currentBook.book_schema.main_chapter.title = title,
    EDIT_SUB_TITLE: (state, { index, title }) => state.currentBook.book_schema.main_chapter.sub_chapter_list[index].title = title,
    EDIT_SECTION_TITLE: (state, { index1, index2, title }) => state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].section_list[index2].title = title,

    ADD_SECTION: (state,{ index }) => {
      state.currentBook.book_schema.main_chapter.sub_chapter_list[index].section_list.push({
          title: ''
      })
    },
    SET_MOBILE_BLOCKING_MESSAGE_CHECKED: (state, value) => state.mobileBlockingMessageChecked = value
  },

  // API 호출 등의 async 작업은 actions에서 처리
  actions: {
    async fetchBookList({ commit }) {
      await axiosInstance({
        url: api.books.getBookList(),
        method: 'get',
      }).then(res => {
        commit('SET_BOOK_LIST', res.data.book_list)
      }).catch(err => {
        console.error(err)
      })
    },

    async fetchRandomCoverImage() {

      try {
        const result = await unsplash.photos.getRandom();
        return result.response.urls.regular;
      } catch (error) {
        return process.env.VUE_APP_DEFAULT_COVER_IMAGE
      }
    },

    // 새로운 책 생성
    async createNewBook({ commit, dispatch }) {
      const coverImageUrl = await dispatch('fetchRandomCoverImage')
      
      await axiosInstance({
        url: api.books.createBook(),
        method: 'post',
        data: {
          book_schema: {
            main_chapter: {
              title: '',
              page_id: null,
              sub_chapter_list: []
            }
          },
          cover_image_url: coverImageUrl
        }
      }).then(res => {
        commit('SET_CURRENT_BOOK', res.data)
      }).catch(err => {
        console.error(err)
      })
      const pageID = await dispatch('createPage', { title: '' })
      commit('SET_BOOK_SCHEMA', {
        main_chapter: {
          title: '',
          sub_chapter_list: [],
          page_id: pageID,      
        }
      })
      dispatch('updateBook')
    },

    // async createPageByBookSchema({ dispatch, getters, commit }) {
    //   const mainChapter = getters.currentBook.book_schema.main_chapter;
    //   try {
    //     dispatch('updatePage', {
    //       page_id: mainChapter.page_id,
    //       title: mainChapter.title,
    //       content: mainChapter.content
    //     })
    //     for(const subChapter of mainChapter.sub_chapter_list){
    //       subChapter.page_id = await dispatch('createPage', { title: subChapter.title })
    //       subChapter.is_deleted = false
    //       subChapter.deleted_at = null
    //       for(const section of subChapter.section_list){
    //         section.page_id = await dispatch('createPage', { title: section.title })
    //         section.is_deleted = false
    //         section.deleted_at = null
    //       }
    //     }
    //     commit('SET_BOOK_SCHEMA', {
    //       main_chapter: mainChapter
    //     })
    //     await dispatch('updateBook')
    //     dispatch('updateBookSettingByChapterData')
    //   }
    //   catch (err) {
    //     console.error(err)
    //   }
    // },

    async createPageByBookSchema({ dispatch, getters, commit }) {
      const mainChapter = getters.currentBook.book_schema.main_chapter;

      try {
        dispatch('updatePage', {
          page_id: mainChapter.page_id,
          title: mainChapter.title,
          content: mainChapter.content
        })

        const response = await dispatch('createBookStructure', {main_chapter: mainChapter})

        commit('SET_BOOK_SCHEMA', {
          main_chapter: response.data.main_chapter
        })
        dispatch('updateBookSettingByChapterData')
      }
      catch (err) {
        console.log(err)
        throw new Error(err)
      }
    },

    async createBookStructure( {getters}, {main_chapter} ){

      try {
        const mainChapterRequest = toRaw(main_chapter)
        const response = await axiosInstance({
          url: api.books.createBookStructure(getters.currentBook.book_id),
          method: 'post',
          data: {
            main_chapter: mainChapterRequest
          }
        })
        return response
      }
      catch (err){
        console.log(err)
        throw new Error(err)
      }
    },

    async updateBook({ getters }) {
      await axiosInstance({
        url: api.books.updateBook(getters.currentBook.book_id),
        method: 'put',
        data: {
          book_schema: getters.currentBook.book_schema,
          cover_image_url: getters.currentBook.cover_image_url,
          is_finished: getters.currentBook.is_finished ?? false,
          is_deleted: getters.currentBook.is_deleted ?? false,
          deleted_at: getters.currentBook.deleted_at ?? null
        }
      })
    },

    async uploadBookCoverImage({ dispatch, getters, commit }, payload ){
      try {
        commit('SET_CURRENT_BOOK', getters.bookList.at(payload.bookIdx))
        const response = await axiosInstance({
          url: api.books.uploadBookCoverImage(getters.currentBook.book_id),
          method: 'post',
          data: payload.formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data && response.data.image_url) {
          commit('MODIFY_COVER_IMAGE', response.data.image_url)
          await dispatch('updateBook')
        }
      } catch (error) {
        console.error('책 표지 이미지 업로드 중 오류 발생:', error);
        throw error;
      }

    },

    async updateBookMainTitle({ commit, getters, dispatch }, payload ) {
      commit('SET_CURRENT_BOOK', getters.bookList.at(payload.index))
      commit('EDIT_MAIN_TITLE', payload.editedTitle)
      await dispatch('updateBook')
    },

    async modifyCoverImage({commit, getters, dispatch}, payload){
      const coverImageUrl = await dispatch('fetchRandomCoverImage')
      commit('SET_CURRENT_BOOK', getters.bookList.at(payload.index))
      commit('MODIFY_COVER_IMAGE', coverImageUrl)
      await dispatch('updateBook')
    },

    async deleteBook({ commit }, payload) {
      await axiosInstance({
        url: api.books.deleteBook(payload.bookId),
        method: 'delete',
      }).then( () => {
        commit('DELETE_BOOK', payload.index);
      })
    },

    async updateBookDeletedState ({ commit, getters, dispatch }, { bookIdx, isDeleted, deletedAt } ) {
      commit('SET_CURRENT_BOOK', getters.bookList.at(bookIdx))
      commit('MODIFY_BOOK_DELETED_STATE', isDeleted )
      commit('SET_DELETED_TIME', deletedAt)
      await dispatch('updateBook')
    },

    // 북 스키마 sub-tree 삭제 후 디비에 반영안합니다. 묶어서 하고 싶겠지만,
    // 중간에 나갈 수 있으므로 updateBook을 호출하는 것은 비효율적
    // 에디터에서 이 함수와 updateBook을 순서로 호출
    deleteSubTreeInBookSchema({ commit }, { index1, index2 }) {
      if (index1 == -1) {
        // not used
        commit('DELETE_MAIN_CHAPTER')
      }
      else if (index2 == -1) {
        commit('DELETE_SUB_CHAPTER', index1)
      }
      else {
        commit('DELETE_SECTION', { index1: index1, index2: index2 })
      }
    },

    deleteSubTreeInBookSchemaOnRecommend({ commit }, { index1, index2 }) {
      if (index1 == -1) {
        // not used
        commit('DELETE_MAIN_CHAPTER')
      }
      else if (index2 == -1) {
        commit('DELETE_SUB_CHAPTER_RECOMMEND', index1)
      }
      else {
        commit('DELETE_SECTION_RECOMMEND', { index1: index1, index2: index2 })
      }
    },

    restoreSubTreeInBookSchema({ state, commit }, { index1, index2 }) {
      if (index1 == -1) {
        // not used
        commit('RESTORE_MAIN_CHAPTER')
      }
      else if (index2 == -1) {
        commit('RESTORE_SUB_CHAPTER', index1)
      }
      else {
        // 만약 복구한 섹션이 속한 서브챕터가 삭제되어 있다면 밖으로 이동
        commit('RESTORE_SECTION', { index1: index1, index2: index2 })
        if(state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].is_deleted){
          const section = state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].section_list[index2]
          state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].section_list.splice(index2, 1)
          state.currentBook.book_schema.main_chapter.sub_chapter_list.push({
            title: section.title,
            page_id: section.page_id,
            section_list: []
          })
        }
      }
    },

    async permanentDeleteSubTreeInBookSchema({ state, commit, dispatch }, { index1, index2 }) {
      let pageID = null
      if (index1 == -1) {
        // not used
        pageID = state.currentBook.book_schema.main_chapter.page_id
        commit('PERMANENT_DELETE_MAIN_CHAPTER')
      }
      else if (index2 == -1) {
        pageID = state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].page_id
        commit('PERMANENT_DELETE_SUB_CHAPTER', index1)
      }
      else {
        pageID = state.currentBook.book_schema.main_chapter.sub_chapter_list[index1].section_list[index2].page_id
        commit('PERMANENT_DELETE_SECTION', { index1: index1, index2: index2 })
      }
      await dispatch('deletePage', { page_id: pageID })
    },


    // 북 스키마에서 인덱스로 접근하여 타이틀 변경
    // 위와 같은 이유
    editTitleInBookSchema({ commit }, { index1, index2, title }) {
      if (index1 == -1) {
        commit('EDIT_MAIN_TITLE', title)
      }
      else if (index2 == -1) {
        commit('EDIT_SUB_TITLE', {index: index1, title: title})
      }
      else {
        commit('EDIT_SECTION_TITLE', {index1: index1, index2: index2, title: title})
      }
    },

    async addSubChapter({ commit, getters, dispatch }) {
      const page_id = await dispatch('createPage', { title: '' })
      commit('SET_BOOK_SCHEMA', {
        main_chapter: {
          title: getters.currentBook.book_schema.main_chapter.title,
          page_id: getters.currentBook.book_schema.main_chapter.page_id,
          sub_chapter_list: [
            ...getters.currentBook.book_schema.main_chapter.sub_chapter_list,
            {
              title: '',
              page_id: page_id,
              section_list: [],
              is_deleted: false,
              deleted_at: null
            }
          ]
        }
      })
      await dispatch('updateBook')
      dispatch('focusChange', {
        pageID: page_id,
        title: ''
      })
    },

    async addSection({ commit, getters, dispatch }, { subChapterIdx }) {
      const page_id = await dispatch('createPage', { title: '' })
      const mainChapter = getters.currentBook.book_schema.main_chapter
      console.log(subChapterIdx)
      mainChapter.sub_chapter_list[subChapterIdx].section_list.push({
        title: '',
        page_id: page_id,
        is_deleted: false,
        deleted_at: null
      })
      commit('SET_BOOK_SCHEMA', {
        main_chapter: mainChapter
      })

      await dispatch('updateBook')
      dispatch('focusChange', {
        pageID: page_id,
        title: ''
      })
    },

    async addSubChapterOnly({ commit, getters }){
      commit('SET_BOOK_SCHEMA', {
        main_chapter: {
          title: getters.currentBook.book_schema.main_chapter.title,
          page_id: getters.currentBook.book_schema.main_chapter.page_id,
          sub_chapter_list: [
            ...getters.currentBook.book_schema.main_chapter.sub_chapter_list,
            {
              title: '',
              section_list: []
            }
          ]
        }
      })
    },

    async addSectionOnly({ commit }, subChapterIdx){
      commit('ADD_SECTION', { index:subChapterIdx })
    },

    async updateBookFinishedState( { commit, getters, dispatch }, { bookIdx, isFinished } ){
      commit('SET_CURRENT_BOOK', getters.bookList.at(bookIdx))
      commit('MODIFY_BOOK_FINISHED_STATE', isFinished)
      await dispatch('updateBook')
    },

    async fetchCustomSetting({ commit, getters }) {
      try {
        const result = await axiosInstance({
          url: api.bookSetting.getBookSetting(getters.currentBook.book_id),
          method: 'get',
        });
        commit('SET_BOOK_CATEGORY', result.data.genre)
        commit('SET_BOOK_TOPIC', result.data.subject)
        commit('SET_BOOK_PURPOSE', result.data.purpose)
        commit('SET_BOOK_TARGET', result.data.target_readers)
        commit('SET_BOOK_TARGET_DESCRIPTION', result.data.target_readers_description)
        commit('SET_BOOK_STYLE', result.data.writing_style)
      } catch (error) {
        console.log(error)
      }
    },

    async updateBookSetting({ getters }) {
      try {
        await axiosInstance({
          url: api.bookSetting.updateBookSetting(getters.currentBook.book_id),
          method: 'put',
          data: {
            genre: getters.bookCategory ?? '',
            subject: getters.bookTopic ?? '',
            purpose: getters.bookPurpose ?? '',
            target_readers: getters.bookTarget ?? '',
            target_readers_description: getters.bookTargetDescription ?? '',
            writing_style: getters.bookStyle ?? ''
          }
        });
      } catch (error) {
        console.log(error)
      }
    },

    async updateBookSettingByChapterData({ getters }) {
      try {
        await axiosInstance({
          url: api.bookSetting.updateBookSettingByChapterData(getters.currentBook.book_id),
          method: 'put',
        });
      } catch (error) {
        console.log(error)
      }
    },
  }
}