import api from '@/api'
import axiosInstance from "@/api/axiosInstance";
import { RevisionStatus } from '@/store/constants/revisionStatus'

export default {
  state: {
    editorRightFolded: false,
    revisionState: '',
    revisionResult: [],
    taggedBlocks: [],
    userCheckLeft: 0,
    showRevisionCloseModal: 0,
    maxBlockTextLength: 0,
    blockRevisionText: '',
    blockRevisionIndex: 0,
  },

  // 모든 state는 직접 접근하지 않고 getters를 통해서만 접근
  getters: {
    editorRightFolded: state => state.editorRightFolded,
    revisionState: state => state.revisionState,
    revisionResult: state => state.revisionResult,
    taggedBlocks: state => state.taggedBlocks,
    userCheckLeft: state => state.userCheckLeft,
    showRevisionCloseModal: state => state.showRevisionCloseModal,
    revisionLimitExceeded: state => state.revisionLimitExceeded,
    maxBlockTextLength: state => state.maxBlockTextLength,
    blockRevisionText: state => state.blockRevisionText,
    blockRevisionIndex: state => state.blockRevisionIndex,
  },

  // state를 변경하는 로직은 mutations에서만 처리
  mutations: {
    TOGGLE_EDITOR_RIGHT_FOLDED: (state) => state.editorRightFolded = !state.editorRightFolded,
    SET_REVISION_STATE: (state, value) => state.revisionState = value,
    SET_REVISION_RESULT: (state, value) => state.revisionResult = value,
    SET_TAGGED_BLOCKS: (state, value) => state.taggedBlocks = value,
    SET_USER_CHECK_LEFT: (state, value) => state.userCheckLeft = value,
    SET_SHOW_REVISION_CLOSE_MODAL: (state, value) => state.showRevisionCloseModal = value,
    SET_MAX_BLOCK_TEXT_LENGTH: (state, value) => state.maxBlockTextLength = value,
    SET_BLOCK_REVISION_TEXT: (state, value) => state.blockRevisionText = value,
    SET_BLOCK_REVISION_INDEX: (state, value) => state.blockRevisionIndex = value,
  },

  // API 호출 등의 async 작업은 actions에서 처리
  actions: {
    async revisionPage({ commit }, requestData) {

      let maxTextLength = 0
      const parsedBlocks = requestData.blocks.map(block => {
        if (block.type === 'paragraph' || block.type === 'header' || block.type === 'quote' ||
            block.type === 'list') {
          maxTextLength = Math.max(maxTextLength, block.data.text.length)
          return {
            text: block.data.text.replace(/&nbsp;/g, ' '),
          }
        }
        else {
          return {
            text: ''
          }
        }
      })
      // const clusteredBlocks = []
      // let clusteredText = parsedBlocks[0].text
      // for (let i=1; i<parsedBlocks.length; i++) {
      //   if (clusteredText.length + parsedBlocks[i].text.length < 500) {
      //     clusteredText += '\n' + parsedBlocks[i].text
      //   } else {
      //     maxTextLength = Math.max(maxTextLength, clusteredText.length)
      //     clusteredBlocks.push({
      //       text: clusteredText
      //     })
      //     clusteredText = parsedBlocks[i].text
      //   }
      // }
      // maxTextLength = Math.max(maxTextLength, clusteredText.length)
      // clusteredBlocks.push({
      //   text: clusteredText
      // })

      commit('SET_MAX_BLOCK_TEXT_LENGTH', maxTextLength)
      await axiosInstance({
        url: api.revision.createRevision(),
        method: 'post',
        data: {
          // blocks: clusteredBlocks
          blocks: parsedBlocks
        }
      }).then(res => {
        const list = res.data.blocks_result

        // const clusteredResponseList = res.data.blocks_result
        // let list = []

        // for (let i=0; i<clusteredResponseList.length; i++) { // i == 500자 단위의 텍스트 클러스터들
        //   if (clusteredResponseList[i].revision_list.length === 0) { // 퇴고가 없는 클러스터
        //     let unclusteredTextList = clusteredBlocks[i].text.split('\n')
        //     for (let j=0; j<unclusteredTextList.length; j++) {
        //       list.push({
        //         tagged_text: unclusteredTextList[j],
        //         revision_list: []
        //       })
        //     }
        //     continue
        //   }
        //   let unclusteredTextList = clusteredResponseList[i].tagged_text.split('\n')
        //   // 퇴고가 있는 클러스터
        //   for (let j=0; j<unclusteredTextList.length; j++) { // j == 한 500자 단위 텍스트 클러스터에 속한 에디터 블럭 수
        //     // count the number of <fix> tags in unclusteredTextList[j]
        //     let count = (unclusteredTextList[j].match(/<fix>/g) || []).length
        //     let revisionList = []
        //     for (let k=0; k<count; k++) { // k == 현재 에디터 블럭에 속한 fixed tag 수
        //       revisionList.push(clusteredResponseList[i].revision_list.shift())
        //     }
        //     list.push({
        //       tagged_text: unclusteredTextList[j],
        //       revision_list: revisionList
        //     })
        //   }
        // }

        let num = 0
        const taggedBlocks = requestData.blocks
        const revisionList = []
        for (let i=0; i<list.length; i++) {
          taggedBlocks[i].data.text = list[i].tagged_text
          for (let j=0; j<list[i].revision_list.length; j++) {
            revisionList.push({
              revisedText: list[i].revision_list[j].revised_text,
              originalText: '',
              reason: list[i].revision_list[j].reason,
              index: num++,
              handled: false,
            })
          }
        }

        // let taggedBlockIndex = 0
        // let responseListIndex = 0
        // while (taggedBlockIndex < taggedBlocks.length && responseListIndex < list.length) {
        //   // .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim()
        //   // lt, gt, nbsp, amp 등은 response, 기존 블럭 모두 대체문자로 존재하기 때문에 replace x
        //   // nbsp는 api response에서 본문의 앞뒤를 LLM이 제거하는 경우가 존재해서 대체 후 trim으로 처리
        //   if (taggedBlocks[taggedBlockIndex].data.text && 
        //     taggedBlocks[taggedBlockIndex].data.text.replace(/&nbsp;/g, ' ').trim() 
        //     == list[responseListIndex].tagged_text.replace(/<fix>/g,'').replace(/<\/fix>/g,'').trim()) {
        //     taggedBlocks[taggedBlockIndex].data.text = list[responseListIndex].tagged_text;
        //     for (let j=0; j<list[responseListIndex].revision_list.length; j++) {
        //       revisionList.push({
        //         revisedText: list[responseListIndex].revision_list[j].revised_text,
        //         originalText: '',
        //         reason: list[responseListIndex].revision_list[j].reason,
        //         index: num++,
        //         handled: false,
        //       })
        //     }
        //     taggedBlockIndex++
        //     responseListIndex++
        //   } else {
        //     if (!taggedBlocks[taggedBlockIndex].data.text) {
        //       taggedBlockIndex++
        //       if (!list[responseListIndex].tagged_text) {
        //         responseListIndex++
        //       }
        //     }
        //     else{
        //       if (!list[responseListIndex].tagged_text) {
        //         responseListIndex++
        //       } else {
        //         // this part could make the while loop infinite -> break
        //         break;
        //       }
        //     }
        //   }
        // }
        
        // 퇴고 리스트가 없는 경우
        if (revisionList.length === 0) {
          commit('SET_REVISION_STATE', RevisionStatus.EMPTY_REVISION)
          return
        }

        let originalTexts = []

        for (let block of taggedBlocks) {
          if (!block.data.text) continue
          const fixTags = block.data.text.match(/<fix>.*?<\/fix>/g)
          if (!fixTags) continue
          originalTexts = [...originalTexts, ...fixTags.map(tag => tag.replace(/<\/?fix>/g, ''))]
        }

        // 1:1 매칭 확인
        if (originalTexts.length !== revisionList.length) {
          console.error('Revision list length does not match with the number of <fix> tags')
          commit('SET_REVISION_STATE', RevisionStatus.LLM_FAIL)
          return
        }

        for (let i =0; i<revisionList.length; i++) {
          revisionList[i].originalText = originalTexts[i].replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')

          revisionList[i].revisedText = revisionList[i].revisedText.replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
        }

        commit('SET_REVISION_RESULT', revisionList)
        commit('SET_USER_CHECK_LEFT', revisionList.length)
        
        let counter = 1

        for (let block of taggedBlocks) {
          if (!block.data.text) continue
          if (block.data.text.includes('<fix>')) {
            block.data.text = block.data.text.replace('<fix>', 
              `<fix class="inline-flex relative gap-1 justify-center items-center">
                <div class="flex justify-center items-center h-[18px] w-[18px] relative gap-2.5 p-2.5 rounded-full bg-[#e7edf2]">
                  <p class="flex-grow text-[10px] font-semibold text-center text-[#727272]">${counter++}</p>
                </div>
                <div class="unfixed focused">`)
            block.data.text = block.data.text.replace('</fix>', '</div></fix>')
            break
          }
        }
        taggedBlocks.forEach(block => {
          if (!block.data.text) return
          block.data.text = block.data.text.replace(/<fix>/g, () => {
            return  `<fix class="inline-flex relative gap-1 justify-center items-center">
                      <div class="flex justify-center items-center h-[18px] w-[18px] relative gap-2.5 p-2.5 rounded-full bg-[#e7edf2]">
                        <p class="flex-grow text-[10px] font-semibold text-center text-[#727272]">${counter++}</p>
                      </div>
                      <div class="unfixed">`})
          block.data.text = block.data.text.replace(/<\/fix>/g, '</div></fix>')
        })

        commit('SET_TAGGED_BLOCKS', {
          blocks: taggedBlocks
        })

        commit('SET_REVISION_STATE', RevisionStatus.LLM_DONE)
      }).catch(err => {
        if (err.response && err.response.data.detail == "Revision is not available" && err.response.status === 400) {
          console.error('400 Bad Request:', err.response.data.detail);
          commit('SET_REVISION_STATE', RevisionStatus.INK_COIN_LIMIT_EXCEEDED)
        }
        else if(err.response && err.response.status === 429) {
          console.error('429 Too Many Requests:', err.response.data.detail);
          commit('SET_REVISION_STATE', RevisionStatus.TOO_MANY_CONCURRENT_REVISION)
        }
        else {
          commit('SET_REVISION_STATE', RevisionStatus.LLM_FAIL)
          console.error(err)
        }
      })
    },

    async revisionBlock({ commit }, { requestData, blockText, blockIndex }) {
      
      let maxTextLength = blockText.length
      const parsedBlocks = requestData.blocks.map((block, index) => {
        if (index === blockIndex && (block.type === 'paragraph' || block.type === 'header' || block.type === 'quote' ||
          block.type === 'list')) {
          return {
            text: block.data.text.replace(/&nbsp;/g, ' '),
          }          
        }
        else {
          return {
            text: ''
          }
        }
      })

      commit('SET_MAX_BLOCK_TEXT_LENGTH', maxTextLength)
      await axiosInstance({
        url: api.revision.createRevision(),
        method: 'post',
        data: {
          blocks: parsedBlocks
        }
      }).then(res => {
        const list = res.data.blocks_result

        let num = 0
        const taggedBlocks = requestData.blocks
        const revisionList = []
        for (let i=0; i<list.length; i++) {
          taggedBlocks[i].data.text = list[i].tagged_text=='' ? taggedBlocks[i].data.text : list[i].tagged_text
          for (let j=0; j<list[i].revision_list.length; j++) {
            revisionList.push({
              revisedText: list[i].revision_list[j].revised_text,
              originalText: '',
              reason: list[i].revision_list[j].reason,
              index: num++,
              handled: false,
            })
          }
        }
        
        // 퇴고 리스트가 없는 경우
        if (revisionList.length === 0) {
          commit('SET_REVISION_STATE', RevisionStatus.EMPTY_REVISION)
          return
        }

        let originalTexts = []

        for (let block of taggedBlocks) {
          if (!block.data.text) continue
          const fixTags = block.data.text.match(/<fix>.*?<\/fix>/g)
          if (!fixTags) continue
          originalTexts = [...originalTexts, ...fixTags.map(tag => tag.replace(/<\/?fix>/g, ''))]
        }

        // 1:1 매칭 확인
        if (originalTexts.length !== revisionList.length) {
          console.error('Revision list length does not match with the number of <fix> tags')
          commit('SET_REVISION_STATE', RevisionStatus.LLM_FAIL)
          return
        }

        for (let i =0; i<revisionList.length; i++) {
          revisionList[i].originalText = originalTexts[i].replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')

          revisionList[i].revisedText = revisionList[i].revisedText.replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
        }

        commit('SET_REVISION_RESULT', revisionList)
        commit('SET_USER_CHECK_LEFT', revisionList.length)
        
        let counter = 1

        for (let block of taggedBlocks) {
          if (!block.data.text) continue
          if (block.data.text.includes('<fix>')) {
            block.data.text = block.data.text.replace('<fix>', 
              `<fix class="inline-flex relative gap-1 justify-center items-center">
                <div class="flex justify-center items-center h-[18px] w-[18px] relative gap-2.5 p-2.5 rounded-full bg-[#e7edf2]">
                  <p class="flex-grow text-[10px] font-semibold text-center text-[#727272]">${counter++}</p>
                </div>
                <div class="unfixed focused">`)
            block.data.text = block.data.text.replace('</fix>', '</div></fix>')
            break
          }
        }
        taggedBlocks.forEach(block => {
          if (!block.data.text) return
          block.data.text = block.data.text.replace(/<fix>/g, () => {
            return  `<fix class="inline-flex relative gap-1 justify-center items-center">
                      <div class="flex justify-center items-center h-[18px] w-[18px] relative gap-2.5 p-2.5 rounded-full bg-[#e7edf2]">
                        <p class="flex-grow text-[10px] font-semibold text-center text-[#727272]">${counter++}</p>
                      </div>
                      <div class="unfixed">`})
          block.data.text = block.data.text.replace(/<\/fix>/g, '</div></fix>')
        })

        commit('SET_TAGGED_BLOCKS', {
          blocks: taggedBlocks
        })

        commit('SET_REVISION_STATE', RevisionStatus.LLM_DONE)
      }).catch(err => {
        if (err.response && err.response.data.detail == "Revision is not available" && err.response.status === 400) {
          console.error('400 Bad Request:', err.response.data.detail);
          commit('SET_REVISION_STATE', RevisionStatus.INK_COIN_LIMIT_EXCEEDED)
        }
        else if(err.response && err.response.status === 429) {
          console.error('429 Too Many Requests:', err.response.data.detail);
          commit('SET_REVISION_STATE', RevisionStatus.TOO_MANY_CONCURRENT_REVISION)
        }
        else {
          commit('SET_REVISION_STATE', RevisionStatus.LLM_FAIL)
          console.error(err)
        }
      })
    },

    async storeRevisionData({ getters }, requestData ){
      axiosInstance({
        url: api.data.storeRevisionData(getters.currentPageID),
        method: 'post',
        data: {
          original: requestData.originalText,
          suggested: requestData.revisedText,
          accepted: requestData.isRevised
        }
      })
    }
  }
}