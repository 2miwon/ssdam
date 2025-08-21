<template>
  <div class="flex-grow">
    <div class="flex flex-col m-3">
      <SectionDisplay :depth="0" :title="mainChapter.title"
        @focus="handleFocus(mainChapter.page_id, mainChapter.title)" :currentFocus="currentPageID==mainChapter.page_id"
        @changeTitle="(newTitle) => handleChangeTitle(-1,-1,newTitle)" @draftRecommend="handleDraftRecommend(mainChapter.page_id, mainChapter.title)"
        :noDrag="true" :noDrop="true"/>
      <div v-for="(subChapter, index1) in visibleSubChapters" :key="subChapter.page_id">
        <div v-if="!subChapter.is_deleted">
          <DelimiterLine @drop="handleDrop(index1,-2)" :visibleLine="true"/>
          <div :class="{ 'bg-sky-100':dragOverList[index1]&&!this.noSubChapterDropInterface }">
            <SectionDisplay :depth="1" :title="subChapter.title" 
              @focus="handleFocus(subChapter.page_id, subChapter.title)" :currentFocus="currentPageID==subChapter.page_id"
              :index="subChapter.visibleIndex" :noDrop="this.noSubChapterDropInterface"
              @changeTitle="(newTitle) => handleChangeTitle(index1,-1,newTitle)" @delete="handleDelete(index1,-1, subChapter.page_id)"
              @addSection="handleAddSection(index1)" @draftRecommend="handleDraftRecommend(subChapter.page_id, subChapter.title)"
              @dragStart="handleDragStart(index1,-1)" @drop="handleDrop(index1,-1)"
              @dragenter="handleDragEnter(index1)" @dragover="handleDragOver(index1)"
              @dragleave="handleDragLeave(index1)" @dragexit="handleDragExit(index1)"/>
            <DelimiterLine @drop="handleDrop(index1,0)" :visibleLine="false"/>
            <div v-for="(section, index2) in subChapter.section_list" :key="section.page_id">  
              <div v-if="!section.is_deleted">
                <SectionDisplay @focus="handleFocus(section.page_id, section.title)" :currentFocus="currentPageID==section.page_id"
                  :depth="2" :title="section.title" :noDrop="true"
                  @changeTitle="(newTitle) => handleChangeTitle(index1,index2,newTitle)" @delete="handleDelete(index1,index2, section.page_id)"
                  @draftRecommend="handleDraftRecommend(section.page_id, section.title)"
                  @dragStart="handleDragStart(index1,index2)"/>
                <DelimiterLine @drop="handleDrop(index1,index2+1)" :visibleLine="false"/>
              </div>    
            </div>
          </div>
        </div>
      </div>
      <DelimiterLine @drop="handleDrop(mainChapter.sub_chapter_list.length+1,-2)" :visibleLine="true"/>
    </div>
  </div>
</template>

<script>
import SectionDisplay from '@/components/Editor/Left/SectionDisplay.vue'
import DelimiterLine from '@/components/Editor/Left/DelimiterLine.vue'

import cloneDeep from 'lodash/cloneDeep'

export default {
  data() {
    return {
      dragStartIndex1: -1,
      dragStartIndex2: -1,
      draggingIndex: -1,
      noSubChapterDropInterface: false,
    };
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
    dragOverList() {
      return this.mainChapter.sub_chapter_list.length==0 ? [] : this.mainChapter.sub_chapter_list.map(()=>false)
    },
    isMobile() {
      return window.innerWidth < 660
    }
  },
  components: {
    SectionDisplay,
    DelimiterLine,
  },
  mounted() {
    this.$store.commit('SET_DRAFT_RECOMMENDATION', false)
  },
  methods: {
    handleDraftRecommend(pageID, title) {
      this.handleFocus(pageID, title)
      this.$store.commit('SET_DRAFT_RECOMMENDATION', false)
      setTimeout(() => {
        this.$store.commit('SET_DRAFT_RECOMMENDATION', true)
      }, 500)
      this.$gtag.event('draft-recommendation', {})
    },
    handleAddSection(index1) {
      this.$store.dispatch('addSection', {
        subChapterIdx: index1
      })
    },
    handleFocus(pageID, title) {
      this.$store.commit('SET_EDITOR_LEFT_FOLDED', true)
      if (pageID == this.currentPageID) return
      this.$store.dispatch('focusChange', {
        pageID: pageID,
        title: title
      })
    },
    async handleChangeTitle(index1, index2, newTitle) {
      await this.$store.dispatch('editTitleInBookSchema', {
        index1: index1,
        index2: index2,
        title: newTitle.length>40 ? newTitle.slice(0,40) : newTitle,
      })
      await this.$store.dispatch('saveCurrentBookState', {
        bookContent: cloneDeep(this.$store.getters.currentBook.book_schema),
        pageContent: null,
        currentBlockIndex: null,
        currentBlockOffset: null,
      })
      await this.$store.dispatch('updateBook')
      this.$store.commit('SET_CURRENT_PAGE_TITLE', newTitle)
    },
    async handleDelete(index1, index2) {
      if(index1==-1) {
        return
      }
      if((index2==-1 && (this.mainChapter.sub_chapter_list[index1].page_id == this.currentPageID
        || this.mainChapter.sub_chapter_list[index1].section_list.some(section => section.page_id == this.currentPageID))) ||
        (index2!=-1 && this.mainChapter.sub_chapter_list[index1].section_list[index2].page_id == this.currentPageID)) {
        this.$store.dispatch('focusChange', {
          pageID: this.mainChapter.page_id,
          title: this.mainChapter.title
        })
      }
      await this.$store.dispatch('deleteSubTreeInBookSchema', {
        index1: index1,
        index2: index2,
      })
      await this.$store.dispatch('saveCurrentBookState', {
        bookContent: cloneDeep(this.$store.getters.currentBook.book_schema),
        pageContent: null,
        currentBlockIndex: null,
        currentBlockOffset: null,
      })

      this.$store.dispatch('updateBook')
    },
    handleDragStart(index1, index2) {
      this.dragStartIndex1 = index1
      this.dragStartIndex2 = index2
      // subchapter(section이 있는) -> subchapter로의 드래그 시 파란색 인터페이스 제거
      var allDeleted = true
      for (var i = 0; i < this.mainChapter.sub_chapter_list[index1].section_list.length; i++) {
        if(this.mainChapter.sub_chapter_list[index1].section_list[i]&&!this.mainChapter.sub_chapter_list[index1].section_list[i].is_deleted) {
          allDeleted = false
          break
        }
      }
      this.noSubChapterDropInterface = (index2==-1&&(this.mainChapter.sub_chapter_list[index1].section_list.length>0 && !allDeleted))
    },
    async handleDrop(index1, index2) {
      // this.dragStartIndex1, this.dragStartIndex2는 드래그 시작 위치의 인덱스
      // index1, index2는 드래그 드랍 위치의 인덱스
      // 0 <= index1 <= main_chapter.sub_chapter_list.length
      // -2 <= index2 <= main_chapter.sub_cahpter_list[index1].section_list.length + 1
      // [][] => [index1][-2] : index1번째 subChapter로 위치 이동
      // [][] => [index1][-1] : index1번째 subChapter 안의 마지막 section으로 push
      // [][] => [index1][index2] : index1번째 subChapterdml index2번째 section으로 위치 이동
      // 유의 사항:
      // 1. section이 담겨 있는 subChapter를 다른 subChapter안으로 드랍은 허용되지 않음
      // 2. 이동시에 이동하는 객체와 대상 객체가 같은 배열 안에 있을 경우 서로의 인덱스 순서에 따라 삽입 삭제 순서 조정
      if(index2 == -1) this.dragOverList[index1] = false
      // 같은 객체 위로 드래그 할 시 무시
      if(this.dragStartIndex1 == index1 && this.dragStartIndex2 == index2) return
      const newMainChapter = this.mainChapter
      if(index2 == -2) {
        if(this.dragStartIndex2==-1){
          // subChapter -> subChapter 위치 변경
          const newSubChapter = newMainChapter.sub_chapter_list[this.dragStartIndex1]
          if(index1 == this.dragStartIndex1) return
          else if(index1 > this.dragStartIndex1) {
            newMainChapter.sub_chapter_list.splice(index1, 0, newSubChapter)
            newMainChapter.sub_chapter_list.splice(this.dragStartIndex1, 1)
          }
          else {
            newMainChapter.sub_chapter_list.splice(this.dragStartIndex1, 1)
            newMainChapter.sub_chapter_list.splice(index1, 0, newSubChapter)
          }
        }
        else{
          // section -> subChapter 종류 변경, 위치변경
          const newSubChapter = newMainChapter.sub_chapter_list[this.dragStartIndex1].section_list[this.dragStartIndex2]
          newSubChapter.section_list = []
          newMainChapter.sub_chapter_list[this.dragStartIndex1].section_list.splice(this.dragStartIndex2, 1)
          newMainChapter.sub_chapter_list.splice(index1, 0, newSubChapter)
        }
      }
      else {
        if(this.dragStartIndex2 == -1) {
          // subChapter -> section 종류 변경, 위치 변경
          const newSection = newMainChapter.sub_chapter_list[this.dragStartIndex1]
          // subChapter 안의 section_list가 비어있어야 함
          // is_deleted 된 section만 존재할 경우 예외처리
          // section들을 모두 subChapter로 이동
          if(newSection.section_list.length > 0) {
            var allDeleted = true
            for (var i = 0; i < newSection.section_list.length; i++) {
              if(newSection.section_list[i]&&!newSection.section_list[i].is_deleted) {
                allDeleted = false
                break
              }
            }
            if(allDeleted) {
              for (i = 0; i < newSection.section_list.length; i++) {
                newMainChapter.sub_chapter_list.push({...newSection.section_list[i], section_list: []})
              }
            }
            else {
              // 모달 띄우기
              this.$store.commit('SET_ERROR_MESSAGE', '해당 대목차에 소목차가 존재하여 이동할 수 없습니다.')
              this.$store.commit('SET_SHOW_ERROR_MODAL', true)
              return
            }
          }
          delete newSection.section_list
          if(index2 == -1){
            newMainChapter.sub_chapter_list[index1].section_list.push(newSection)
          }
          else {
            newMainChapter.sub_chapter_list[index1].section_list.splice(index2, 0, newSection)
          }
          newMainChapter.sub_chapter_list.splice(this.dragStartIndex1, 1)
        }
        else {
          // section -> section 위치 변경
          if(index1 == this.dragStartIndex1) {
            // 같은 subChapter 내에서 위치 변경
            const newSection = newMainChapter.sub_chapter_list[index1].section_list[this.dragStartIndex2]
            if(index2 == -1) {
              newMainChapter.sub_chapter_list[index1].section_list.splice(this.dragStartIndex2, 1)
              newMainChapter.sub_chapter_list[index1].section_list.push(newSection)
            }
            else if(index2 > this.dragStartIndex2) {
              newMainChapter.sub_chapter_list[index1].section_list.splice(index2, 0, newSection)
              newMainChapter.sub_chapter_list[index1].section_list.splice(this.dragStartIndex2, 1)
            }
            else {
              newMainChapter.sub_chapter_list[index1].section_list.splice(this.dragStartIndex2, 1)
              newMainChapter.sub_chapter_list[index1].section_list.splice(index2, 0, newSection)
            }
          }
          else {
            // 서로 다른 subChapter 간 위치 변경
            const newSection = newMainChapter.sub_chapter_list[this.dragStartIndex1].section_list[this.dragStartIndex2]
            newMainChapter.sub_chapter_list[this.dragStartIndex1].section_list.splice(this.dragStartIndex2, 1)            
            if(index2 == -1) {
              newMainChapter.sub_chapter_list[index1].section_list.push(newSection)
            }
            else {
              newMainChapter.sub_chapter_list[index1].section_list.splice(index2, 0, newSection)
            }
          }
        }
      }
      await this.$store.commit('SET_BOOK_SCHEMA', {
        main_chapter: newMainChapter
      })
      await this.$store.dispatch('saveCurrentBookState', {
        bookContent: cloneDeep(this.$store.getters.currentBook.book_schema),
        pageContent: null,
        currentBlockIndex: null,
        currentBlockOffset: null,
      })
      await this.$store.dispatch('updateBook')
    },
    handleDragEnter(index1) {
      this.dragOverList[index1] = true
    },
    handleDragOver(index1) {
      this.dragOverList[index1] = true
    },
    handleDragLeave(index1) {
      this.dragOverList[index1] = false
    },
    handleDragExit(index1) {
      this.dragOverList[index1] = false
    },
  },
}
</script>

<style>
.cursor-pointer-important {
  cursor: pointer !important;
}
</style>
