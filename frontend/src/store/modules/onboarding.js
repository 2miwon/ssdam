// import axios from "axios";
// import api from "@/api";

export default {
  state: {
    editorOnboardingProcess: 0,
    revisionOnboardingProcess: 0,
  },

  // 모든 state는 직접 접근하지 않고 getters를 통해서만 접근
  getters: {
    editorOnboardingProcess: state => state.editorOnboardingProcess,
    revisionOnboardingProcess: state => state.revisionOnboardingProcess,
  },

  // state를 변경하는 로직은 mutations에서만 처리
  mutations: {
    SET_EDITOR_ONBOARDING_PROCESS: (state, editorOnboardingProcess) => state.editorOnboardingProcess = editorOnboardingProcess,
    SET_REVISION_ONBOARDING_PROCESS: (state, revisionOnboardingProcess) => state.revisionOnboardingProcess = revisionOnboardingProcess,
  },

  // API 호출 등의 async 작업은 actions에서 처리
  actions: {
    

  }
}