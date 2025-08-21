<template>
  <div class="h-full min-h-screen flex justify-center items-start pt-4 bg-[#FAFBFC]">
    <div :class="[ isMobile ? 'w-full' : 'w-[83%]' ]">
      <div class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
        <PageTitle v-if="this.$route.name != 'revision' || mainChapter.page_id==currentPageID" 
          class="mt-4" v-bind:title="mainChapter.title" :heading="''" 
          @toggleClick="handleToggleClick(mainChapter.page_id, mainChapter.title)" v-bind:toggleOn="mainChapter.page_id==currentPageID"
          @changeTitle="(newTitle) => handleChangeTitle(-1,-1,newTitle)"/>
        <EditorComponent v-if="mainChapter.page_id==currentPageID" class="mt-2"
          v-bind:title="mainChapter.title" :page_id="mainChapter.page_id"/>
      </div>
      <div v-for="(subChapter, index1) in visibleSubChapters" :key="subChapter.page_id">
        <div v-if="!subChapter.is_deleted">
          <div class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
            <PageTitle v-if="this.$route.name != 'revision' || subChapter.page_id==currentPageID"
              class="mt-4" v-bind:title="subChapter.title" :heading="`${subChapter.visibleIndex}. `" 
              @toggleClick="handleToggleClick(subChapter.page_id, subChapter.title)" v-bind:toggleOn="subChapter.page_id==currentPageID"
              @changeTitle="(newTitle) => handleChangeTitle(index1,-1,newTitle)"/>
            <EditorComponent v-if="subChapter.page_id==currentPageID" class="mt-2"
              v-bind:title="subChapter.title" :page_id="subChapter.page_id"/>
          </div>
          <div v-for="(section, index2) in subChapter.section_list" :key="section.page_id">
            <div v-if="!section.is_deleted">
              <div class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
                <PageTitle v-if="this.$route.name != 'revision' || section.page_id==currentPageID"
                  class="mt-4" v-bind:title="section.title" :heading="''"
                  @toggleClick="handleToggleClick(section.page_id, section.title)" v-bind:toggleOn="section.page_id==currentPageID"
                  @changeTitle="(newTitle) => handleChangeTitle(index1,index2,newTitle)"/>
                <EditorComponent v-if="section.page_id==currentPageID" class="mt-2"
                  v-bind:title="section.title" :page_id="section.page_id"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 이건 아래 여백을 위한 것 삭제하지 말 것 -->
      <div class="w-full h-[165px]"></div>
      <RevisionState v-if="this.$route.name=='editor' && localRevisionState !== 'none'" class="fixed top-[62px] left-1/2 transform -translate-x-1/2 bg-white p-4 shadow-lg z-50"
        :revisionState="localRevisionState"/>
      <RecommendState v-if="this.$route.name=='editor' && localRecommendState == 4" class="fixed top-[62px] left-1/2 transform -translate-x-1/2 bg-white p-4 shadow-lg z-50"
        :recommendState="localRecommendState" />
    </div>
    <CustomSettings />
  </div>
</template>

<script>
import EditorComponent from '@/components/Editor/Center/EditorComponent.vue'
import PageTitle from '@/components/Editor/Center/PageTitle.vue'
import cloneDeep from 'lodash/cloneDeep'
import RevisionState from "@/components/Editor/Center/RevisionState.vue";
import { RevisionStatus } from '@/store/constants/revisionStatus';
import RecommendState from "@/components/Recommend/RecommendState.vue";
import CustomSettings from "@/components/Editor/Center/CustomSettings.vue";

  export default {
    data() {
      return {
        localRevisionState: RevisionStatus.NONE,
        localRecommendState: 1
      }
    },
    computed: {
      mainChapter() {
        return this.$store.getters.currentBook.book_schema.main_chapter
      },
      visibleSubChapters() {
        var counter = 1
        return this.mainChapter.sub_chapter_list
        .map((subChapter) => ({ ...subChapter, visibleIndex: subChapter.is_deleted ? counter : counter++ }))
      },
      currentPageID() {
        return this.$store.getters.currentPageID
      },
      revisionState(){
        return this.$store.getters.revisionState
      },
      recommendState(){
        return this.$store.getters.recommendProcess
      },
      isMobile() {
        return window.innerWidth < 660
      },
    },
    beforeMount() {
      if(this.$route.name == 'editor' && this.revisionState && this.revisionState != RevisionStatus.NONE 
        && this.revisionState != RevisionStatus.LLM_REQUESTED && this.revisionState != RevisionStatus.LLM_DONE){
        this.localRevisionState = this.revisionState
        setTimeout(() => {
          this.localRevisionState = RevisionStatus.NONE
        }, 2000)
      }

      let match = false
      if (this.mainChapter.page_id == this.currentPageID) {
        match = true
        this.$store.commit('SET_CURRENT_PAGE_TITLE', this.mainChapter.title)
      }
      
      this.mainChapter.sub_chapter_list.forEach(subChapter => {
        if (subChapter.page_id == this.currentPageID) {
          match = true
          this.$store.commit('SET_CURRENT_PAGE_TITLE', subChapter.title)
        }
        subChapter.section_list.forEach(section => {
          if (section.page_id == this.currentPageID) {
            match = true
            this.$store.commit('SET_CURRENT_PAGE_TITLE', section.title)
          }
        })
      })

      if (!match) {
        this.$store.dispatch('focusChange', {
          pageID: this.mainChapter.page_id,
          title: this.mainChapter.title
        })
      }
    },
    mounted() {
      if(this.recommendState !== 1){
        this.localRecommendState = this.recommendState
        setTimeout(() => {
          this.localRecommendState = 1
          this.$store.commit('RESET_RECOMMEND_PROCESS')
        }, 2000)
      }
    },
    watch: {
      revisionState(message) {
        if(message == RevisionStatus.EMPTY_INPUT) {
          this.localRevisionState = RevisionStatus.EMPTY_INPUT
          this.$store.commit('SET_REVISION_STATE', RevisionStatus.NONE)
          setTimeout(() => {
            this.localRevisionState = RevisionStatus.NONE
          }, 2000)
        }
        else if(message == RevisionStatus.TEXT_OVER_LIMIT_SINGLE_BLOCK) {
          this.localRevisionState = RevisionStatus.TEXT_OVER_LIMIT_SINGLE_BLOCK
          this.$store.commit('SET_REVISION_STATE', RevisionStatus.NONE)
          setTimeout(() => {
            this.localRevisionState = RevisionStatus.NONE
          }, 2000)
        }
        else if(message == RevisionStatus.NO_PAGE_SELECTED) {
          this.localRevisionState = RevisionStatus.NO_PAGE_SELECTED
          this.$store.commit('SET_REVISION_STATE', RevisionStatus.NONE)
          setTimeout(() => {
            this.localRevisionState = RevisionStatus.NONE
          }, 2000)
        }
        else if(message == RevisionStatus.MOBILE_NOT_SUPPORTED) {
          this.localRevisionState = RevisionStatus.MOBILE_NOT_SUPPORTED
          this.$store.commit('SET_REVISION_STATE', RevisionStatus.NONE)
          setTimeout(() => {
            this.localRevisionState = RevisionStatus.NONE
          }, 2000)
        }
      }
    },
    components: {
      RecommendState,
      RevisionState,
      EditorComponent,
      PageTitle,
      CustomSettings,
    },
    methods: {
      // index1은 subChapter의 index, index2는 section의 index
      // [0][0] => main page title, [index1+1][0] => subChapter title, [index1+1][index2+1] => section title
      handleToggleClick(pageID, title) {
        this.$store.dispatch('focusChange', {
          pageID: pageID,
          title: title
        })
      },
      handleChangeTitle(index1, index2, newTitle) {
        this.$store.dispatch('editTitleInBookSchema', {
          index1: index1,
          index2: index2,
          title: newTitle.length>50 ? newTitle.slice(0,50) : newTitle
        })
        this.$store.dispatch('saveCurrentBookState', {
          bookContent: cloneDeep(this.$store.getters.currentBook.book_schema),
          pageContent: null,
          currentBlockIndex: null,
          currentBlockOffset: null,
        })
        this.$store.dispatch('updateBook')
        this.$store.commit('SET_CURRENT_PAGE_TITLE', newTitle)
      },
    },
  }
</script>