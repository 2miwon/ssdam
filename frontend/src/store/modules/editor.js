import { BookMemento, BookCaretaker } from '@/util/bookHistory';
import api from "@/api";
import axiosInstance from "@/api/axiosInstance";

export default {
  state: {
    bookHistory: new BookCaretaker(),
    undoAvailable: false,
    redoAvailable: false,
    currentPageID: null,
    currentPageTitle: '',
    passUndo: false,
    passRedo: false,
    showPrintModal: false,
    saveForPrint: false,
    showErrorModal: false,
    errorMessage: '',
    editorLeftFolded: false,
    imageKeyValues: {},
    sspilotOn: true,
    sspilotTime: 3,
    showSettings: true,
    draftRecommendation: false,
    exportToDocx: false
  },

  // 모든 state는 직접 접근하지 않고 getters를 통해서만 접근
  getters: {
    bookHistory: state => state.bookHistory,
    undoAvailable: state => state.undoAvailable,
    redoAvailable: state => state.redoAvailable,
    currentPageID: state => state.currentPageID,
    currentPageTitle: state => state.currentPageTitle,
    pageContentHistory: state => (state.bookHistory.undoStack.length > 0 && state.bookHistory instanceof BookCaretaker) ? state.bookHistory.getPageContent() : [],
    passUndo: state => state.passUndo,
    passRedo: state => state.passRedo,
    showPrintModal: state => state.showPrintModal,
    saveForPrint: state => state.saveForPrint,
    showErrorModal: state => state.showErrorModal,
    errorMessage: state => state.errorMessage,
    editorLeftFolded: state => state.editorLeftFolded,
    getImageByKey: (state) => (key) => {
      return state.imageKeyValues[key]
    },
    sspilotOn: state => state.sspilotOn,
    sspilotTime: state => state.sspilotTime,
    showSettings: state => state.showSettings,
    draftRecommendation: state => state.draftRecommendation,
    exportToDocx: state => state.exportToDocx
  },

  // state를 변경하는 로직은 mutations에서만 처리
  mutations: {
    SAVE_CURRENT_BOOK_STATE: (state, value) => state.bookHistory.saveMemento(value),
    SET_UNDO_AVAILABLE: (state, value) => state.undoAvailable = value,
    SET_REDO_AVAILABLE: (state, value) => state.redoAvailable = value,
    RESET_BOOK_HISTORY: (state) => state.bookHistory = new BookCaretaker(),
    SET_CURRENT_PAGE_ID: (state, value) => state.currentPageID = value,
    SET_CURRENT_PAGE_TITLE: (state, value) => state.currentPageTitle = value,
    SET_PASS_UNDO: (state, value) => state.passUndo = value,
    SET_PASS_REDO: (state, value) => state.passRedo = value,
    SET_SHOW_PRINT_MODAL: (state, value) => state.showPrintModal = value,
    SET_SAVE_FOR_PRINT: (state, value) => state.saveForPrint = value,
    SET_SHOW_ERROR_MODAL: (state, value) => state.showErrorModal = value,
    SET_ERROR_MESSAGE: (state, value) => state.errorMessage = value,
    SET_EDITOR_LEFT_FOLDED: (state, value) => state.editorLeftFolded = value,
    SET_IMAGE_KEY_VALUE: (state, { key, value }) => {
      state.imageKeyValues[key] = value
    },
    CLEAR_IMAGE_KEY_VALUE: (state) => {
      state.imageKeyValues = {}
    },
    TOGGLE_SSPILOT_STATE: (state) => state.sspilotOn = !state.sspilotOn,
    SET_SSPILOT_TIME: (state, value) => state.sspilotTime = value,
    SET_SHOW_SETTINGS: (state, value) => state.showSettings = value,
    SET_DRAFT_RECOMMENDATION: (state, value) => state.draftRecommendation = value,
    EXPORT_TO_DOCX: (state) => state.exportToDocx = !state.exportToDocx
  },

  // API 호출 등의 async 작업은 actions에서 처리
  actions: {
    focusChange({ commit }, { pageID, title }) {
      if (pageID === null) return;
      if (pageID === this.getters.currentPageID) {
        // editor center page fold
        commit('SET_CURRENT_PAGE_ID', null);
        commit('SET_CURRENT_PAGE_TITLE', '');
      }
      else {
        commit('SET_CURRENT_PAGE_ID', pageID);
        commit('SET_CURRENT_PAGE_TITLE', title);
      }
      commit('RESET_BOOK_HISTORY');
    },

    saveCurrentBookState({ commit, getters }, { bookContent, pageContent, currentBlockIndex, currentBlockOffset }) {
      if(!(getters.bookHistory instanceof BookCaretaker)){
        commit('RESET_BOOK_HISTORY');
      }
      commit('SAVE_CURRENT_BOOK_STATE', new BookMemento({
        bookContent: bookContent,
        pageContent: pageContent,
        currentBlockIndex: currentBlockIndex,
        currentBlockOffset: currentBlockOffset
      }));
      commit('SET_UNDO_AVAILABLE', getters.bookHistory.undoPossible());
      commit('SET_REDO_AVAILABLE', false);
    },

    undoBookModification({ getters, commit, dispatch }) {
      const memento = getters.bookHistory.getUndoObject();
      if (!memento || !(memento instanceof BookMemento)) {
        commit('SET_UNDO_AVAILABLE', false);
        return;
      }
      commit('SET_UNDO_AVAILABLE', getters.bookHistory.undoPossible());
      commit('SET_REDO_AVAILABLE', true);

      commit('SET_BOOK_SCHEMA', memento.getBookContent());
      dispatch('updateBook');
      return {
        pageContent: memento.getPageContent(), 
        currentBlockIndex: memento.getCurrentBlockIndex(), 
        currentBlockOffset: memento.getCurrentBlockOffset()
      };
    },

    redoBookModification({ getters, commit, dispatch }) {
      const memento = getters.bookHistory.getRedoObject();
      if (!memento || !(memento instanceof BookMemento)) {
        commit('SET_REDO_AVAILABLE', false);
        return;
      }

      commit('SET_UNDO_AVAILABLE', true);
      commit('SET_REDO_AVAILABLE', getters.bookHistory.redoPossible());

      commit('SET_BOOK_SCHEMA', memento.getBookContent());
      dispatch('updateBook');
      return {
        pageContent: memento.getPageContent(), 
        currentBlockIndex: memento.getCurrentBlockIndex(), 
        currentBlockOffset: memento.getCurrentBlockOffset()
      };
    },

    async sentencePredictor({ getters }, { text }) {
      try {
        const response = await axiosInstance({
          url: api.sentence_predictor.sentencePredictor(getters.currentBook.book_id),
          method: 'post',
          data: {
            prev_sentence: text,
            title: getters.currentPageTitle
          }
        })
        return response.data.next_sentence
      } catch (err) {
        throw new Error(err)
      }
    },

    async draftGenerator({ getters, commit }, { title }) {
      try {
        const response = await axiosInstance({
          url: api.draft_generator.draftGenerator(getters.currentBook.book_id, getters.currentPageID),
          method: 'post',
          data: {
            title: title,
          }
        })
        return response.data.draft
      } catch (err) {
        commit('SET_ERROR_MESSAGE', '초안 작성 중 오류가 발생했습니다.')
        commit('SET_SHOW_ERROR_MODAL', true)
        commit('SET_DRAFT_RECOMMENDATION', false)
        throw new Error(err)
      }
    },

    async synonymGenerator(_, { contextText, targetText }) {
      try {
        const response = await axiosInstance({
          url: api.synonym_generator.synonymGenerator(),
          method: 'post',
          data: {
            context_text: contextText,
            target_text: targetText
          }
        })
        return response.data.synonyms
      } catch (err) {
        throw new Error(err)
      }
    },

    async storeSentenceData({ getters }, { previousSentence, nextSentence }) {
      axiosInstance({
        url: api.data.storeSentenceData(getters.currentPageID),
        method: 'post',
        data: {
          prev_sentence: previousSentence,
          next_sentence: nextSentence
        }
      })
    },

    async generateIllustration({ getters, commit }, { userPrompt, excerpt }) {
      try {
        const response = await axiosInstance({
          url: api.illustration_generator.illustrationGenerator(getters.currentBook.book_id, getters.currentPageID),
          method: 'post',
          data: {
            user_prompt: userPrompt,
            excerpt: excerpt, // 발췌문
            title: getters.currentPageTitle,
            genre: getters.bookStyle,
          }
        })
        return response.data.s3_image_key
      }
      catch (err) {
        commit('SET_ERROR_MESSAGE', '이미지 생성 중 오류가 발생했습니다.')
        commit('SET_SHOW_ERROR_MODAL', true)
        commit('SET_DRAFT_RECOMMENDATION', false)
        throw new Error(err)
      }
    },
  },
}