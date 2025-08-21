import api from "@/api";
import axiosInstance from "@/api/axiosInstance";

export default {
  state: {
    noImagePaste: false,
    indexDiff: 0,
    previousTimeStamp: new Date().getTime(),
  },

  // 모든 state는 직접 접근하지 않고 getters를 통해서만 접근
  getters: {
    noImagePaste: state => state.noImagePaste,
    indexDiff: state => state.indexDiff,
    previousTimeStamp: state => state.previousTimeStamp,
  },

  // state를 변경하는 로직은 mutations에서만 처리
  mutations: {
    SET_NO_IMAGE_PASTE: (state, value) => state.noImagePaste = value,
    SET_INDEX_DIFF: (state, value) => state.indexDiff = value,
    SET_PREVIOUS_TIME_STAMP: (state, value) => state.previousTimeStamp = value,
  },

  // API 호출 등의 async 작업은 actions에서 처리
  actions: {
    // 이 함수를 부르는 함수는 항상 try-catch로 감싸야함 - createPageByBookSchema 참고
    // page_id를 반환함 -> 이를 book_schema에 넣을 것
    async createPage({ getters }, { title }) {
      try {
        const book_id = getters.currentBook.book_id
        const response = await axiosInstance({
          url: api.pages.createPage(book_id),
          method: 'post',
          book_id: book_id,
          data: {
            title: title
          }
        })
        return response.data.page_id
      } catch (err) {
        throw new Error(err)
      }
    },

    // 각 page가 mounted 될 때마다 EditorComponent에서 호출함
    async fetchPage({ getters }, { page_id }) {
      try {
        const book_id = getters.currentBook.book_id
        const response = await axiosInstance({
          url: api.pages.getPage(book_id, page_id),
          method: 'get',
          book_id: book_id,
          page_id: page_id
        })
        return response.data.content
      } catch (err) {
        throw new Error(err)
      }
    },

    async updatePage({ getters }, { page_id, title, content }) {
      const book_id = getters.currentBook.book_id
      await axiosInstance({
          url: api.pages.updatePage(book_id, page_id),
          method: 'put',
          headers: getters.authHeader,
          book_id: book_id,
          page_id: page_id,
          data: {
            title: title,
            content: content ? content : ''
          }
      }).catch(err => {
        console.log(err)
      })
    },

    async deletePage({ getters }, { page_id }) {
      const book_id = getters.currentBook.book_id
      await axiosInstance({
        url: api.pages.deletePage(book_id, page_id),
        method: 'delete',
        headers: getters.authHeader,
        book_id: book_id,
        page_id: page_id
      }).catch(err => {
        console.log(err)
      })
    },

    async uploadImageFile({ getters }, { file }) {
      try {
        const book_id = getters.currentBook.book_id
        const page_id = getters.currentPageID
        const response = await axiosInstance({
          url: api.pages.uploadImageFile(book_id, page_id),
          method: 'post',
          headers: getters.authHeader,
          book_id: book_id,
          page_id: page_id,
          data: file
        })
        return response.data.s3_image_key
      } catch (err) {
        throw new Error(err)
      }
    },

    async getImageFile({ getters }, { key }) {
      try {
        const book_id = getters.currentBook.book_id
        const page_id = getters.currentPageID
        const response = await axiosInstance({
          url: api.pages.getImageFile(book_id, page_id),
          method: 'get',
          headers: getters.authHeader,
          params: {
            s3_image_key: key
          },
          responseType: 'arraybuffer'
        })

        // 확장자 추출
        const splitedKey = key.split('.')
        const imageFormat = splitedKey[splitedKey.length - 1]

        // arraybuffer -> base64로 변환
        let binary = '';
        const bytes = new Uint8Array(response.data);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64String = window.btoa(binary);

        // 조립
        const imageUrl = 'data:image/' + imageFormat + ';base64,' + base64String;
        return imageUrl

        // return response.data
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}