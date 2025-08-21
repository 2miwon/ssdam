<template>
  <div class="ssdam-editor self-stretch min-h-[80vh] relative overflow-hidden rounded-[14px] bg-white"
    :class="{ 'min-h-0': this.showPrintModal }"
    ref="editorComponent"
    :style="{ 'pointer-events': this.readOnly ? 'none' : 'auto' }">
    <div v-if="draftRecommendation" class="flex flex-col items-center justify-center">
      <img src="../../../../public/assets/progress.gif" alt="Loading..." class="w-auto h-auto">
      <p class="w-[79px] text-sm font-semibold text-center text-[#474747]">
        초안 작성 중
      </p>
      <p class="w-[120px] text-sm font-semibold text-center text-[#474747]">
        예상 소요시간: 10초
      </p>
    </div>
    <h1 :id="page_id" v-if="this.showPrintModal" class="ml-20">
      {{ (index != 0 ? index + '. ' : '') + (title.length > 0 ? title : '제목없음') }}
    </h1>
    <div class="mt-10 ml-20 mr-20 mb-[300px]"
      ref='editorjs'>
    </div>
    <div v-if="!this.showPrintModal" class="absolute bottom-8 right-16 flex justify-end items-center gap-1 no-print">
      <p class="flex-grow-0 flex-shrink-0 text-sm font-bold text-left text-[#a8a8a8]">총 글자수</p>
      <p class="flex-grow-0 flex-shrink-0 text-sm text-left text-[#a8a8a8]">{{ this.pageCharNum + '자'}}</p>
    </div>
    <EditorErrorModal v-if="showErrorMessage" class="top-[62px] fixed bg-white p-4 shadow-lg z-50" 
      :class="{ 'w-full left-0':isMobile, 'left-[44%]':!isMobile }" :message="this.errorMessage">
    </EditorErrorModal>
    <!-- <div v-if="this.showSynonymOnBoarding"
      class="fixed">
      <OnBoardingMessage :pointerPosition="2" :message="'텍스트를 드래그한 뒤 우측 끝의 <유사 단어 추천> 버튼을 눌러, 더 좋은 어휘로 바꿔보세요!'" @close="handleCloseSynonymOnboarding"/>
    </div>
    <div v-if="this.showIllustrationOnBoarding"
      class="absolute top-[-270px] left-[20px]">
      <OnBoardingMessage :pointerPosition="2" :message="'+ 옆에 있는 버튼을 누른 뒤 <AI 이미지 생성> 버튼을 눌러, 문단에 맞는 이미지를 생성해보세요!'" @close="handleCloseIllustrationOnboarding"/>
    </div> -->
  </div>
</template>

<script>
import EditorJS from '@editorjs/editorjs'
import DragDrop from 'editorjs-drag-drop'
import EditorErrorModal from '@/components/Editor/Center/EditorErrorModal'
import { RevisionStatus }  from '@/store/constants/revisionStatus'
// import OnBoardingMessage from '@/components/OnBoardingMessage.vue'

import Text from './custom/blockTool/text'
import Header from './custom/blockTool/header'
// import Table from './custom/blockTool/table'
// import Page from './custom/blockTool/page'
import Image from './custom/blockTool/image'
import List from './custom/blockTool/list'
import Quote from './custom/blockTool/quote'
import Delimiter from './custom/blockTool/delimiter'

import Marker from './custom/inlineTool/marker'
import Bold from './custom/inlineTool/bold'
import Italic from './custom/inlineTool/italic'
import UnderLine from './custom/inlineTool/underLine'
import StrikeThrough from './custom/inlineTool/strikeThrough'
import Synonym from './custom/inlineTool/synonym'
// import InlineComment from './custom/inlineTool/inlineComment'

import MoveUp from './custom/blockTunes/moveUp'
import MoveDown from './custom/blockTunes/moveDown'

// import Comment from './custom/blockTunes/comment'
import ImageGenerator from './custom/blockTunes/imageGenerator'
import BlockRevision from './custom/blockTunes/blockRevision'
import Convert from './custom/blockTunes/convert'
import Delete from './custom/blockTunes/delete'

import cloneDeep from 'lodash/cloneDeep'

export default {
  props: {
    page_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    printMode: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
  },

  components: {
    EditorErrorModal,
    // OnBoardingMessage,
  },

  data() {
    return {
      content: null,
      editor: null,
      saveTimeout: null,
      pageCharNum: 0,
      showErrorMessage: false,
      blockFirstOnChange: true,
      // showSynonymOnBoarding: false,
      // showIllustrationOnBoarding: false,
    }
  },

  computed: {
    errorMessage() {
      return this.$store.getters.errorMessage
    },
    showErrorModal() {
      return this.$store.getters.showErrorModal
    },
    readOnly() {
      return this.printMode || this.$route.name == 'revision'
    },
    revisionState() {
      return this.$store.getters.revisionState
    },
    undoPassed() {
      return this.$store.getters.passUndo
    },
    redoPassed() {
      return this.$store.getters.passRedo
    },
    showPrintModal() {
      return this.$store.getters.showPrintModal
    },
    saveForPrint() {
      return this.$store.getters.saveForPrint
    },
    draftRecommendation() {
      return this.$store.getters.draftRecommendation
    },
    isMobile() {
      return window.innerWidth < 660
    }
  },
  watch: {
    showErrorModal(value) {
      if(value) {
        this.showErrorMessage = true
        setTimeout(() => {
          this.showErrorMessage = false
          this.$store.commit('SET_SHOW_ERROR_MODAL', false)
        }, 2000)
      }
    },

    async draftRecommendation(value) {
      if(!value) return
      if(!this.editor || !this.editor.save) return console.error('editor not ready')

      let requestData = null
      await this.editor.save().then( async (outputData) => {
        requestData = outputData
      }).catch((error) => {
        console.error('Fetching page data failed: ', error)
      })
      // 입력이 있을 때는 초안작성 요청 시 반환 처리
      const inputExist = requestData.blocks.some(block => {
        return (block.data.text && block.data.text != '')
      })
      
      if (inputExist) {
        this.$store.commit('SET_ERROR_MESSAGE', '해당 목차에 글이 있다면 초안 작성이 불가능합니다.')
        this.$store.commit('SET_SHOW_ERROR_MODAL', true)
        this.$store.commit('SET_DRAFT_RECOMMENDATION', false)
        return
      }

      if (this.title == '') {
        this.$store.commit('SET_ERROR_MESSAGE', '해당 목차의 제목을 입력해주세요.')
        this.$store.commit('SET_SHOW_ERROR_MODAL', true)
        this.$store.commit('SET_DRAFT_RECOMMENDATION', false)
        return
      }

      const draft = await this.$store.dispatch('draftGenerator', { title: this.title})

      if (!this.editor.blocks) {
        this.$store.commit('SET_ERROR_MESSAGE', '초안 작성 도중 다른 화면으로 이동했습니다. 다시 시도해주세요.')
        this.$store.commit('SET_SHOW_ERROR_MODAL', true)
        this.$store.commit('SET_DRAFT_RECOMMENDATION', false)
        return
      }

      draft.forEach((block, index) => {
        this.editor.blocks.insert(
          "paragraph",
          {
            text: block,
          },
          undefined,
          index,
          undefined,
          false
        )
      })
      this.$store.commit('SET_DRAFT_RECOMMENDATION', false)
    },
    async saveForPrint(value) {
      if(value) {
        if(!this.editor || !this.editor.save) return console.error('editor not ready')
        await this.editor.save().then( async (outputData) => {
          await this.$store.dispatch('updatePage', {
            page_id: this.page_id,
            title: this.title,
            content: JSON.stringify(outputData),
          })
        }).catch((error) => {
          console.error('Saving before print request failed: ', error)
        })
        this.$store.commit('SET_SAVE_FOR_PRINT', false)
        this.$store.commit('SET_SHOW_PRINT_MODAL', true)
      }
    },
    undoPassed(value) {
      if(value) {
        this.customUndoFunction()
        this.$store.commit('SET_PASS_UNDO', false)
      }
    },
    redoPassed(value) {
      if(value) {
        this.customRedoFunction()
        this.$store.commit('SET_PASS_REDO', false)
      }
    },
    async revisionState(message) {
      if (message == RevisionStatus.BLOCK_LLM_REQUESTED && this.$route.name == 'editor') {
        if(this.isMobile) {
          this.$store.commit('SET_REVISION_STATE', RevisionStatus.MOBILE_NOT_SUPPORTED)
          return
        }
        if(!this.editor || !this.editor.save) return console.error('editor not ready')
        let requestData = null
        await this.editor.save().then( async (outputData) => {
          await this.$store.dispatch('updatePage', {
            page_id: this.page_id,
            title: this.title,
            content: JSON.stringify(outputData),
          })
          requestData = outputData
        }).catch((error) => {
          console.error('Saving before revision request failed: ', error)
        })
        // 입력이 없을 때 퇴고 요청 시 반환 처리
        // 헤딩 추가시 처리되어야함
        const text = this.$store.getters.blockRevisionText
        if (text.length == 0) {
          this.$store.commit('SET_REVISION_STATE', RevisionStatus.EMPTY_INPUT)
          return
        }
        if (text.length > 1000) {
          this.$store.commit('SET_REVISION_STATE', RevisionStatus.TEXT_OVER_LIMIT_SINGLE_BLOCK)
          return
        }
        this.$store.dispatch('revisionBlock', {
          requestData: requestData, 
          blockText: text,
          blockIndex: this.$store.getters.blockRevisionIndex
        })
        this.$router.push({ name: 'revision' })
        return
      }
      if (message == RevisionStatus.LLM_REQUESTED && this.$route.name == 'editor') {
        if(!this.editor || !this.editor.save) return console.error('editor not ready')
        let requestData = null
        await this.editor.save().then( async (outputData) => {
          await this.$store.dispatch('updatePage', {
            page_id: this.page_id,
            title: this.title,
            content: JSON.stringify(outputData),
          })
          requestData = outputData
        }).catch((error) => {
          console.error('Saving before revision request failed: ', error)
        })
        // 입력이 없을 때 퇴고 요청 시 반환 처리
        // 헤딩 추가시 처리되어야함
        const noInput = requestData.blocks.every(block => {
          return (!block.data.text || block.data.text == '')
        })
        if (noInput) {
          this.$store.commit('SET_REVISION_STATE', RevisionStatus.EMPTY_INPUT)
          return
        }

        const textOverLimitInSingleBlock = requestData.blocks.some(block => {
          return (block.data.text && block.data.text.length > 1000)
        })
        if (textOverLimitInSingleBlock) {
          this.$store.commit('SET_REVISION_STATE', RevisionStatus.TEXT_OVER_LIMIT_SINGLE_BLOCK)
          return
        }

        this.$store.dispatch('revisionPage', requestData)
        this.$router.push({ name: 'revision' })
        return
      }
      if (message == RevisionStatus.LLM_DONE && this.$route.name == 'revision') {
        if(!this.editor) return console.error('editor not ready')
        this.editor.render(this.$store.getters.taggedBlocks)
        return
      }
      if (message == RevisionStatus.EMPTY_REVISION && this.$route.name == 'revision') {
        this.$router.push({ name: 'editor' })
        return
      }
      if (message == RevisionStatus.LLM_FAIL && this.$route.name == 'revision') {
        this.$router.push({ name: 'editor' })
        return
      }
      if (message == RevisionStatus.INK_COIN_LIMIT_EXCEEDED){
        this.$router.push({ name: 'editor' })
        return
      }
      if (message == RevisionStatus.TOO_MANY_CONCURRENT_REVISION){
        this.$router.push({ name: 'editor' })
        return
      }
      if(message == RevisionStatus.USER_CHECK_DONE && this.$route.name == 'revision') {
        if(!this.editor || !this.editor.save) return console.error('editor not ready')
        await this.editor.save().then( async (outputData) => {
          await this.$store.dispatch('updatePage', {
            page_id: this.page_id,
            title: this.title,
            content: JSON.stringify(outputData),
          })
        }).catch((error) => {
          console.error('Saving after user revision failed: ', error)
        })
        this.$router.push({ name: 'editor' })
        return
      }
    },
  },

  async mounted() {
    if(this.$route.name == 'editor') {
      this.$store.commit('SET_REVISION_STATE', RevisionStatus.NONE)
      this.$store.commit('SET_DRAFT_RECOMMENDATION', false)

      // const stringContent = await this.$store.dispatch('fetchPage', {
      //   page_id: this.page_id
      // })

      let stringContent = "";
      try {
        stringContent = await this.$store.dispatch('fetchPage', {
          page_id: this.page_id
        })
      } catch (error) {
        console.log(error)
        try {
          stringContent = await this.$store.dispatch('fetchPage', {
            page_id: this.page_id
          })
        } catch (error) {
          console.log(error)
          try {
            stringContent = await this.$store.dispatch('fetchPage', {
              page_id: this.page_id
            })
          } catch (error) {
            console.log(error)
          }
        }
      }

      if (stringContent === '') {
        this.content = {
          data: []
        }
      }
      else {
        this.content = JSON.parse(stringContent)
        // 기존 이미지 블럭들이 s3 주소로 되어있어서 cloudfront 주소로 변경
        for (let i = 0; i < this.content.blocks.length; i++) {
          this.content.blocks[i].data.src = this.content.blocks[i].type == 'image'? this.content.blocks[i].data.src.replace("https://prod-image-files-secure.s3.ap-northeast-2.amazonaws.com/", "https://d2t55cwcw1wtgw.cloudfront.net/") : this.content.blocks[i].data.src
        }
      }
    }
    else {
      // llm 요청을 받고 나서 reload 하는 경우
      if(this.revisionState == RevisionStatus.LLM_DONE && this.$store.getters.taggedBlocks) {
        this.content = this.$store.getters.taggedBlocks
      }
      else {
        const stringContent = await this.$store.dispatch('fetchPage', {
          page_id: this.page_id
        })
        if (stringContent === '') {
          this.content = {
            data: []
          }
        }
        else {
          this.content = JSON.parse(stringContent)
        }
      }
    }
    
    this.$store.dispatch('saveCurrentBookState', {
      bookContent: cloneDeep(this.$store.getters.currentBook.book_schema),
      pageContent: this.content,
      currentBlockIndex: null,
      currentBlockOffset: null,
    })
    if(!this.$refs.editorjs) return
    await this.initEditor()

    setTimeout(() => {
      this.updateCharNum()
    }, 200)
    

    // 퇴고와 책 미리보기 화면에서는 되돌리기 기능 막기
    // 추후에 퇴고 되돌리기 구현 예정
    if(this.readOnly) return

    // 목차를 눌렀을 때 화면에 정렬해주기 위한 코드
    const container = this.$el.closest('.overflow-y-auto')
    if (!container) return

    const element = this.$refs['editorComponent']
    if (!element) return

    const elementRect = element.getBoundingClientRect()
    container.scrollTo({
      top: elementRect.top + container.scrollTop - 150, // 150은 magic number이다
      behavior: 'smooth'
    })

    // 모바일 화면 에디터에서 메뉴 버튼 없애기
    setTimeout(() => {
      this.toggleButtonVisibility()
    }, 100)
    

    window.addEventListener('resize', this.toggleButtonVisibility);

    // ctrl + z, ctrl + y, cmd + z, cmd + y 키보드 이벤트
    document.addEventListener( 'keyup', this.handleKeyUp )
    document.addEventListener( 'keydown', this.handleKeyDown, true )
    // 리스트를 위해 클릭 이벤트도 추가
    document.addEventListener( 'click', this.handleClick )
    // 복붙 덮어쓰기
    document.addEventListener('paste', this.handlePaste )
  },

  beforeUnmount() {
    // ctrl + z, ctrl + y, cmd + z, cmd + y 키보드 이벤트
    document.removeEventListener( 'keyup', this.handleKeyUp )
    document.removeEventListener( 'keydown', this.handleKeyDown, true )
    // 리스트를 위해 클릭 이벤트도 추가
    document.removeEventListener( 'click', this.handleClick )
    // 복붙 덮어쓰기
    document.removeEventListener('paste', this.handlePaste )

    // revision일 경우 editor save 하지 않음
    if(!this.readOnly) {
      clearTimeout(this.saveTimeout)
      this.saveContent()
    }
    if (!this.editor) return
    this.editor.destroy()
  },

  methods: {
    async initEditor() {
      this.editor = new EditorJS({
        holder: this.$refs.editorjs,
        // readOnly: this.readOnly, // 이걸 true로 하면 읽기 모드 => readOnly이면 화면에서 수정은 되지만 save가 안됨
        // logLevel: 'ERROR', // 에러 단계에서만 콘솔에 로그를 남김
        placeholder: "Type '/' for commands",
        autofocus: !this.readOnly, // 첫 글을 작성하는 경우 키보드 커서를 자동으로 올려주는 기능 => 노션 참조 => 첫줄에만 해주는데?
        defaultBlock: 'paragraph',

        tools: {
          paragraph: {
            class: Text,
            config: {
              placeholder: "Type '/' for commands",
              placeholderNoText: "Check draft recommend on the menu bar for startings!"
            },
            inlineToolbar: ['marker', 'bold', 'italic', 'underline', 'strikethrough', 'synonym'],
            tunes: ['imageGenerator', 'blockRevision', 'convert', 'delete'],
          },
          header: {
            class: Header,
            config: {
              placeholder: "Header",
            },
            inlineToolbar: ['marker', 'bold', 'italic', 'underline', 'strikethrough', 'synonym'],
            tunes: ['imageGenerator', 'convert', 'delete'],
          },
          image: {
            class: Image,
            config: {
              uploadPlaceholder: "Upload an image",
              captionPlaceholder: "Caption",
            },
            inlineToolbar: ['marker', 'bold', 'italic', 'underline', 'strikethrough', 'synonym'],
            tunes: ['delete'],
          },
          list: {
            class: List,
            inlineToolbar: ['marker', 'bold', 'italic', 'underline', 'strikethrough', 'synonym'],
            tunes: ['imageGenerator', 'convert', 'delete'],
          },
          // table: Table,
          // page: Page,
          quote: {
            class: Quote,
            config: {
              placeholder: 'Quote',
            },
            inlineToolbar: ['marker', 'bold', 'italic', 'underline', 'strikethrough', 'synonym'],
            tunes: ['imageGenerator', 'convert', 'delete'],
          },
          delimiter: {
            class: Delimiter,
            tunes: ['delete'],
          },

          marker: Marker,
          bold: Bold,
          italic: Italic,
          underline: UnderLine,
          strikethrough: StrikeThrough, // 취소선
          synonym: Synonym,
          // inlinecomment: InlineComment,

          // comment: Comment,
          imageGenerator: ImageGenerator,
          blockRevision: BlockRevision,
          convert: Convert,
          delete: Delete,
          // default move up, down 덮어쓰기용
          moveUp: MoveUp,
          moveDown: MoveDown,
        },
        i18n: {
          messages: {
            ui: {
              // Translations of internal UI components of the editor.js core
              "blockTunes": {
                "toggler": {
                  "Click to tune": "문단 기능",
                  "or drag to move": "드래그하여 이동" // where?
                }
              },
              "inlineToolbar": {
                "converter": {
                  "Convert to": "전환"
                }
              },
              "toolbar": {
                "toolbox": {
                  "Add": "추가",
                  "Filter": "검색",
                  "Nothing found": "결과 없음"
                }
              },
              "popover": {
                "Filter": "검색",
                "Nothing found": "결과 없음"
              },
              "placeholder": "명령어를 사용하려면 ' / ' 키를 입력하세요.",
            },
            toolNames: {
              // Section for translation Tool Names: both block and inline tools
              "Filter": "필터",
              "Text": "텍스트",
              "Header1": "헤딩 1",
              "Header2": "헤딩 2",
              "Header3": "헤딩 3",
              "Table": "테이블",
              "Page": "페이지",
              "Image": "이미지",
              "List": "리스트",
              "NumberedList": "번호 리스트",
              "Quote": "인용문",
              "Delimiter": "구분선",

              "Marker": "하이라이트",
              "Bold": "굵게",
              "Italic": "이태릭체",
              "Underline": "밑줄",
              "Strikethrough": "취소선",
              "Synonym": "유사 단어 추천",
              // "Inlinecomment": "댓글",
              "Convert to": "전환",
            },
            tools: {
              // Section for passing translations to the external tools classes
              // The first-level keys of this object should be equal of keys ot the 'tools' property of EditorConfig
              "paragraph": {
                "Text": "텍스트",
                "Type '/' for commands": "명령어를 사용하려면 ' / ' 키를 입력하세요.",
                "Check draft recommend on the menu bar for startings!" : "시작이 어렵다면, 좌측 목차의 메뉴바에서 초안 작성을 눌러보세요."
              },
              "header": {
                "Header1": "헤딩1",
                "Header2": "헤딩2",
                "Header3": "헤딩3"
              },
              "image": {
                "Upload an image": "파일 업로드",
                "Caption": "캡션",
              },
              "list": {
                "List": "리스트"
              },
              "quote": {
                "Quote": "인용문"
              },
              // 블럭 랜더링 오류 메시지
              "stub": {
                'The block can not be displayed correctly.': '블록이 올바르게 표시되지 않습니다.'
              }
            },
            blockTunes: {
              // Section allows to translate Block Tunes
              // "comment": {
                // "Add comment": "댓글"
              // },
              "imageGenerator": {
                "Generate image": "AI 이미지 생성하기"
              },
              "blockRevision": {
                "Block revision": "이 문단 퇴고하기"
              },
              "convert": {
                "Convert to": "다른 스타일로 변경",
                "Text": "텍스트",
                "Header1": "헤딩 1",
                "Header2": "헤딩 2",
                "Header3": "헤딩 3",
                "Quote": "인용문",
                "List": "리스트",
                "NumberedList": "번호 리스트",
              },
              "delete": {
                "Delete": "삭제하기"
              },
            },
          }
        },

        // 기존의 데이터를 불러와서 화면에 올리고 싶을 때 사용
        data: {
          blocks: (this.content && this.content.blocks) ? this.content.blocks : []
        },

        // 에디터의 데이터 변경시 store에 저장, 2초 동안 변경 사항 없을 시, 서버에 저장
        onChange: () => {
          // console.log(a,b)
          if (this.readOnly) return
          if (this.blockFirstOnChange) {
            this.blockFirstOnChange = false
            return
          }

          // // 여러 작업 공간에서 작업할 경우, 마지막 타임스탬프와의 간격이 10분 이상이면 reload(DB에서 다시 불러오기)
          // // 10분 = 600초 = 600000ms
          const previousUpdateTime = this.$store.getters.previousTimeStamp
          const currentTime = new Date().getTime()
          // 업데이트 치기
          this.$store.commit('SET_PREVIOUS_TIME_STAMP', new Date().getTime())
          if (!previousUpdateTime || currentTime - previousUpdateTime > 600000) {
            window.location.reload()
          }

          if(!this.editor || !this.editor.save) return
          this.editor.save().then((outputData) => {
            outputData.blocks = outputData.blocks.map((block) => {
              const urlPattern = /https?:\/\/\S+\.(png|jpe?g)/i;
              if (block.type === 'image' && !urlPattern.test(block.data.src)) {
                block.data.src = ""
              }
              return block
            })

            this.$store.dispatch('saveCurrentBookState', {
              bookContent: null,
              pageContent: outputData,
              currentBlockIndex: this.editor.blocks.getCurrentBlockIndex(),
              currentBlockOffset: window.getSelection().anchorOffset
            })
          }).catch((error) => {
            console.error('Saving on Stack failed: ', error)
          })
          clearTimeout(this.saveTimeout)
          this.saveTimeout = setTimeout(this.saveContent, 2000)
        },

        onReady: () => {
          // console.log('Editor is ready', this.editor)
          // 5번 시도 외부로 함수 빼서
            setTimeout(() => {
              // if (this.editor.holder.querySelector(".ce-toolbar__settings-btn")){
                // console.log('drag drop plugged in')
                new DragDrop(this.editor)
              // }
            }, 100)
          // if()
          // setTimeout()
          // new DragDrop(this.editor)
          // .ce-toolbar__settings-btn
        },

        render(content) {
          this.data = {
            blocks: (content && content.blocks) ? content.blocks : []
          }
        },
      })
    },

    saveContent() {
      if(!this.editor || !this.editor.save) return
      this.editor.save().then((outputData) => {
        outputData.blocks = outputData.blocks.map((block) => {
          const urlPattern = /https?:\/\/\S+\.(png|jpe?g)/i;
          if (block.type === 'image') {
            if (!urlPattern.test(block.data.src)) {
              block.data.src = ""
            }
            else if(block.data.src.startsWith("https://prod-image-files-secure.s3.ap-northeast-2.amazonaws.com/") || block.data.src.startsWith("https://d2t55cwcw1wtgw.cloudfront.net/")) {
              block.data.src = ""
            }
          }
          return block
        })

        this.$store.dispatch('updatePage', {
          page_id: this.page_id,
          title: this.title,
          content: JSON.stringify(outputData),
        })
      }).catch((error) => {
        console.error('Saving on DB failed: ', error)
      })
    },

    updateCharNum() {
      if(!this.editor || !this.editor.save) return
      this.editor.save().then((outputData) => {
        const charNum = outputData.blocks.reduce((acc, block) => {
          if (block.type === 'paragraph' || block.type === 'header' ||
            block.type === 'quote' || block.type === 'list') {
              // count the number of occurence of '&nbsp;' in text
              const nbspCount = (block.data.text ? (block.data.text.match(/&nbsp;/g) || []) : []).length
              return acc + block.data.text.length - nbspCount * 5
            }
          return acc
        }, 0)
        /* Modal */
        // if (!this.$store.getters.checkSynonymWatched && charNum > 500) {
        //   this.showSynonymOnBoarding = true
        // }
        // else if (!this.$store.getters.checkIllustrationWatched && charNum > 1000) {
        //   this.showIllustrationOnBoarding = true
        // }
        this.pageCharNum = charNum
      }).catch((error) => {
        console.error('Counting characters failed: ', error)
      })
    },

    handleKeyUp() {
      this.updateCharNum();
    },

    handleKeyDown(event) {
      if(navigator.userAgent.indexOf('Mac OS X') != -1) {
        // if mac
        if (event.metaKey && event.shiftKey && event.key === 'z') {
          event.preventDefault();
          this.customRedoFunction();
        }
        else if (event.metaKey && event.key === 'z') {
          event.preventDefault();
          this.customUndoFunction();
        }
        else if (event.metaKey && event.key === 'y') {
          event.preventDefault();
          this.customRedoFunction();
        }
        else if (event.metaKey && event.key === 's') {
          event.preventDefault();
          this.saveContent();
        }
        else {
          this.doOrUndo = false
        }
      }
      else {
        // if windows
        if (event.ctrlKey && event.shiftKey && event.key === 'z') {
          event.preventDefault();
          this.customRedoFunction();
        }
        else if (event.ctrlKey && event.key === 'z') {
          event.preventDefault();
          this.customUndoFunction();
        }
        else if (event.ctrlKey && event.key === 'y') {
          event.preventDefault();
          this.customRedoFunction();
        } 
        else if (event.ctrlKey && event.key === 's') {
          event.preventDefault();
          this.saveContent();
        }
        else {
          this.doOrUndo = false
        }
      }
      if (event.key == 'Enter' || event.key == 'Backspace' || event.key == 'Delete' || event.key == ' ') {
        setTimeout(() => {
          let index = 1
          let previousListBlock = false
          document.querySelectorAll('.ce-block').forEach((block) => {
            const listBlock = block.querySelector('.ssdam-list')
            if (listBlock) {
              const prefix = listBlock.querySelector('.prefix')
              if (!prefix || prefix.innerHTML == '•') return
              if (previousListBlock) {
                prefix.innerHTML = (++index) + '.'
              } else {
                previousListBlock = true
                index = prefix.innerHTML.split('.')[0]
              }
            } else {
              previousListBlock = false
            }
          })
        }, 10)
      }

    },

    handleClick() {
      let index = 1
      let previousListBlock = false
      document.querySelectorAll('.ce-block').forEach((block) => {
        const listBlock = block.querySelector('.ssdam-list')
        if (listBlock) {
          const prefix = listBlock.querySelector('.prefix')
          if (!prefix || prefix.innerHTML == '•') return
          if (previousListBlock) {
            prefix.innerHTML = (++index) + '.'
          } else {
            previousListBlock = true
            index = prefix.innerHTML.split('.')[0]
          }
        } else {
          previousListBlock = false
        }
      })
      this.updateCharNum();
    },

    handlePaste(event) {
      const clipboardData = event.clipboardData || window.ClipboardEvent.clipboardData;

      // 이 아이템은 복사 붙여넣기로 주는 아이템의 종류 수를 뜻함 (라인 수 x)
      const items = clipboardData.items;

      let imageExist = false

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        // console.log(i, item)
        if (item.type.startsWith('image/')) {
          imageExist = true
          break
        }
      }

      const textList = clipboardData.getData('text/plain').split('\r\n')
      // console.log(textList)
      // console.log(clipboardData.getData('text/html'))

      // 한컴 & 워드 복사 붙여넣기에서 이미지 복사 형식 포함 시
      if (imageExist && (textList.length != 1 || textList[0] != '')) {

        // 커스텀 블럭 넣기 이벤트
        if (!this.editor) return
        for (let i = 0; i< textList.length; i++) {
          this.editor.blocks.insert(
            "paragraph",
            {
              text: textList[i],
            },
            undefined,
            undefined,
            undefined,
            false
          )
        }
        
        // attempt 1. 이벤트 전파막기 - 안됨
        event.preventDefault();
        // event.stopPropagation();
        event.stopImmediatePropagation();

        // attempt 2. store 값 저장 후 image.js에서 돌려 막기
        this.$store.commit('SET_NO_IMAGE_PASTE', true)
        this.$store.commit('SET_INDEX_DIFF', textList.length)

        return
      } else {
        return
      }
    },

    async customUndoFunction() {
      const history = await this.$store.dispatch('undoBookModification')
      if(!history || !history.pageContent) return
      if (!this.editor) return
      await this.editor.render(history.pageContent)

      this.blockFirstOnChange = true

      if (history.currentBlockIndex != null && history.currentBlockIndex >= 0) {
        const block = document.querySelectorAll('.ce-block')[history.currentBlockIndex]
        if (block) {
          const content = block.querySelector('.outline-none')
          
          if (content) {
            const range = document.createRange()
            const sel = window.getSelection()
            const textNode = content.firstChild
          
            if(textNode && textNode.nodeType === Node.TEXT_NODE) {
              
              const offset = Math.min(history.currentBlockOffset, textNode.length)

              range.setStart(textNode, offset)
              range.collapse(true)

              sel.removeAllRanges()
              sel.addRange(range)
            } else {
              content.focus();
            }
          }
        }
      } else {
        this.editor.caret.focus()
      }
      
      clearTimeout(this.saveTimeout)
      this.saveTimeout = setTimeout(this.saveContent, 3000)
    },

    async customRedoFunction() {
      const history = await this.$store.dispatch('redoBookModification')
      if(!history || !history.pageContent) return
      if (!this.editor) return
      await this.editor.render(history.pageContent)

      this.blockFirstOnChange = true

      if (history.currentBlockIndex != null && history.currentBlockIndex >= 0) {
        const block = document.querySelectorAll('.ce-block')[history.currentBlockIndex]
        if (block) {
          const content = block.querySelector('.outline-none')
          
          if (content) {
            const range = document.createRange()
            const sel = window.getSelection()
            const textNode = content.firstChild
          
            if(textNode && textNode.nodeType === Node.TEXT_NODE) {
              
              const offset = Math.min(history.currentBlockOffset, textNode.length)

              range.setStart(textNode, offset)
              range.collapse(true)

              sel.removeAllRanges()
              sel.addRange(range)
            } else {
              content.focus();
            }
          }
        }
      } else {
        this.editor.caret.focus()
      }

      clearTimeout(this.saveTimeout)
      this.saveTimeout = setTimeout(this.saveContent, 3000)
    },

    toggleButtonVisibility() {
      const button = document.querySelector('.ce-toolbar__actions')
      if(!button) return
      if (window.innerWidth < 660) {
        button.style.marginTop = '-38px';
        button.style.left = '-70px';
      } else {
        button.style.left = '-60px';
      } 
    },

    /* Modal */
    // handleCloseSynonymOnboarding() {
    //   this.showSynonymOnBoarding = false
    //   this.$store.dispatch('updateUser', 3)
    // },

    // handleCloseIllustrationOnboarding() {
    //   this.showIllustrationOnBoarding = false
    //   this.$store.dispatch('updateUser', 4)
    // },
  },
}
</script>

<style>
/* 자간 조정 */
.ce-block {
  padding-bottom: 8px;
}

/* 큰 화면에서 블럭 왼쪽 고정 */
.ce-block__content {
  max-width: none !important;
  width: 100% !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}

/* 툴바 위치 왼쪽 고정 */
.ce-toolbar__content {
  max-width: none !important;
  position: relative !important;
  left: none !important;
}

/* + ...... 버튼의 위치 -> 왼쪽 고정 */
.ce-toolbar__actions {
  width: 53px !important;
  /* left: -60px !important; */
}

/* + 메뉴의 스타일 -> 너비 고정, 높이 유동적 */
.ce-toolbox .ce-popover.ce-popover--opened .ce-popover__container {
  width: 196px !important;
  max-height: none !important;
}

/* + 메뉴의 메뉴 아이콘과 메뉴 이름 사이 간격 */
.ce-popover-item {
  gap: 16px !important;
  padding: 4px !important;
}

/* + 메뉴의 아이콘 크기 고정 */
.ce-popover-item__icon{
  width: 44px !important;
  height: 44px !important;
  margin-right: 0px !important;
  color: #727272 !important;
}
.ce-popover-item__icon path {
  stroke: none !important;
}
.ce-popover-item__icon .block-revision-icon-path {
  stroke: #727272 !important;
  stroke-width: 1.6 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}

/* 인라인 툴바 조정 */
.ce-inline-toolbar .ce-popover.ce-popover--inline.ce-popover--opened .ce-popover__container {
  width: 330px; 
  height: 57px;
  justify-content: center;
  align-items: center;
  border-width: 1px; 
  border-color: #f2f2f2; 
  box-shadow: 0px 0px 12.100000381469727px 0 rgba(107,107,107,0.25);
  border-radius: 8px; 
  background: #fff; 
}
.ce-inline-toolbar .ce-popover.ce-popover--inline.ce-popover--opened .ce-popover__container .ce-popover__items {
  display: flex; 
  justify-content: center; 
  align-items: center; 
  position: relative; 
  gap: 20px; 
  padding-top: 10px; 
  padding-bottom: 10px; 
  border-radius: 8px; 
  background: #fff;
}

/* 어거지로 인라인 전환 없애기 */
.ce-inline-toolbar .ce-popover.ce-popover--inline.ce-popover--opened .ce-popover__container .ce-popover__items > :first-child {
  display: none !important;
}
.ce-inline-toolbar .ce-popover.ce-popover--inline.ce-popover--opened .ce-popover__container .ce-popover__items .ce-popover-item-separator{
  display: none !important;
}

/* 인라인 툴 아이콘 */
.ce-inline-tool {
  width: 27px;
  height: 27px;
  padding: 3px 3px;
  color: #727272;
}
.ce-inline-tool path{
  stroke: none !important;
}

.ssdam-synonym-menu-item-icon{
  width: 44px !important;
  height: 44px !important;
  margin-right: 0px !important;
  color: #727272 !important;
}
.ssdam-synonym-menu-item-icon path {
  stroke: none !important;
}

/* 유사 단어 추천 아이콘  */
.ssdam-synonym-icon path {
  stroke: none !important;
}

/* 툴바 메뉴 이름 */
.ce-popover-item__title {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: #494949;
}

/* 블록 튜닝 전환하기 없애기 */
.ce-settings .ce-popover.ce-popover--opened .ce-popover__container .ce-popover__items > :first-child {
  display: none !important;
}
.ce-settings .ce-popover.ce-popover--opened .ce-popover__container .ce-popover__items > .ce-popover-item-separator{
  display: none !important;
}

/* 블록 튜닝 검색 창 없애기 */
.ce-settings .ce-popover.ce-popover--opened .ce-popover__container .cdx-search-field.ce-popover__search {
  display: none !important;
}
.ce-settings .ce-popover.ce-popover--opened .ce-popover__container .ce-popover__nothing-found-message {
  display: none !important;
}

/* 전환 nested 첫번쨰 블럭은 보이게 */
.ce-settings .ce-popover.ce-popover--opened.ce-popover--nested .ce-popover__container .ce-popover__items > :first-child {
  display: flex !important;
}

/* 블록 튜닝 툴바 */
.ce-settings .ce-popover.ce-popover--opened .ce-popover__container {
  width: 196px !important;
  max-height: none !important;
}

/* nested 블록 튜닝 툴바 (전환) */
.ce-settings .ce-popover.ce-popover--opened.ce-popover--nested .ce-popover__container {
  width: 196px !important;
  max-height: none !important;
}

/* 검색 필드 없애버리기 */
/* .cdx-search-field {
  display: none;
} */

@media print {
  .ce-block__content {
    max-width: auto;
    width: auto;
    margin-left: auto;
    margin-right: auto;
  }
}

h1 {
  font-size: 36px;
  font-weight: 600;
  line-height: 46px;
}

h2 {
  font-size: 30px;
  font-weight: 600;
  line-height: 39px;
}

h2.placeholder::before {
  content: attr(placeholder);
  color: #888;
}

h3 {
  font-size: 24px;
  font-weight: 600;
  line-height: 31px;
}

h3.placeholder::before {
  content: attr(placeholder);
  color: #888;
}

h4 {
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
}

h4.placeholder::before {
  content: attr(placeholder);
  color: #888;
}

.ssdam-text {
  display: flex;
  flex-direction: column;
}

.ssdam-text h5 {
  display: inline;
  font-size: 16px;
  line-height: 24px;
}

.ssdam-text h5.placeholder::before {
  content: attr(placeholder);
  color: #888;
}

.ssdam-text h5.sspilot::after {
  content: attr(sspilot);
  color: #888;
}

.ssdam-quote {
  display: flex;
  justify-content: center; 
  align-items: center; 
  position: relative; 
  gap: 48px;
}

.ssdam-quote div path {
  stroke: none !important;
}

.ssdam-quote h5 {
  font-size: 16px;
  line-height: 24px;
}

.ssdam-quote h5.placeholder::before {
  content: attr(placeholder);
  color: #888;
}

.ssdam-image .caption-wrapper p.placeholder::before {
  content: attr(placeholder);
  color: #888;
}

.ssdam-list {
  display: flex;
  flex-direction: row;
}

.ssdam-list h5 {
  font-size: 16px;
  line-height: 24px;
}

.ssdam-list h5.placeholder::before {
  content: attr(placeholder);
  color: #888;
}

.unfixed {
  display: inline !important;
  flex-grow: 1;
  border-top-width: 0px; 
  border-right-width: 0px; 
  border-left-width: 0px;
  border-bottom-width: 1.5px; 
  border-color: #ffb800; 
  border-style: dashed;
}

.focused {
  display: inline;
  flex-grow: 1; 
  background: rgba(255,221,34,0.2); 
  border-top-width: 0px; 
  border-right-width: 0px;
  border-left-width: 0px;
  border-bottom-width: 1.5px; 
  border-color: #fd2;
  border-style: solid !important;
}

.ssdam-marker{
  background-color: lemonchiffon !important;
}
</style>