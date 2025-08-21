<template>
  <div class="w-full h-full flex flex-col overflow-hidden overflow-y-auto" ref="scrollContainer">
      <div class="flex flex-col justify-start items-start relative gap-2 py-5">
        <p :class="['flex-grow-0 flex-shrink-0 w-full font-bold text-left text-[#1b1b1b]', isMobile ? 'text-base' : 'text-xl']">
          {{mainMessage}}
        </p>
        <p :class="['flex-grow-0 flex-shrink-0 w-full text-left text-[#a8a8a8]', isMobile ? 'text-sm' : 'text-base']">
          {{subMessage}}
        </p>
      </div>

      <MySectionDisplay :depth="0" :title="mainChapter.title" :noDelete="true"
                        @handleEdit="(title) => handleEdit(-1,-1,title)"
                        @handleCreateSubChapter="handleCreateSubchapter"/>
      <div v-for="(subChapter, index1) in mainChapter.sub_chapter_list" :key="subChapter.title" :ref="'subchapter' + index1">
        <RecommendDelimiterLine @drop="handleDrop(index1,-2)" :visibleLine="true"/>
        <div :class="{ 'bg-sky-100':dragOverList[index1]&&!this.noSubChapterDropInterface }">
          <MySectionDisplay :depth="1"
                            :title="subChapter.title"
                            :index="index1" :noDelete="false"
                            @handleDelete="handleDelete(index1,-1)"
                            @handleCreateSection="handleCreateSection(index1)"
                            @handleEdit="(title) => handleEdit(index1,-1,title)"
                            @dragStart="handleDragStart(index1,-1)" @drop="handleDrop(index1,-1)"
                            @dragenter="handleDragEnter(index1)" @dragover="handleDragOver(index1)"
                            @dragleave="handleDragLeave(index1)" @dragexit="handleDragExit(index1)"/>
          <RecommendDelimiterLine @drop="handleDrop(index1,0)" :visibleLine="false"/>
          <div v-for="(section, index2) in subChapter.section_list" :key="section.title" :ref="'section' + String(index1) + ',' + String(index2)">
            <MySectionDisplay :depth="2"
                              :title="section.title"
                              :noDelete="false"
                              @handleDelete="handleDelete(index1,index2)"
                              @handleEdit="(title) => handleEdit(index1,index2,title)"
                              @dragStart="handleDragStart(index1,index2)"/>
            <RecommendDelimiterLine @drop="handleDrop(index1,index2+1)" :visibleLine="false"/>
          </div>
        </div>
      </div>
      <RecommendDelimiterLine @drop="handleDrop(mainChapter.sub_chapter_list.length+1,-2)" :visibleLine="true"/>
    </div>
</template>

<script>
import MySectionDisplay from "@/components/Recommend/MySectionDisplay.vue";
import RecommendDelimiterLine from "@/components/Recommend/RecommendDelimiterLine.vue";

export default {
  data() {
    return {
      dragStartIndex1: -1,
      dragStartIndex2: -1,
      draggingIndex: -1,
      dragOverList: this.$store.getters.currentBook.book_schema.main_chapter.sub_chapter_list.map(()=>false),
      noSubChapterDropInterface: false,
    };
  },

  computed: {
    mainChapter(){
      return this.$store.getters.currentBook.book_schema.main_chapter
    },
    focusList() {
      return this.$store.getters.onFocusComponent
    },
    isMobile() {
      return window.innerWidth < 660
    },
    mainMessage() {
      if(this.isMobile ){
        return '집필하기 버튼을 눌러 에디터 화면에서 목차를 수정할 수 있어요.'
      }
      return "각 목차를 두 번 연속 클릭하면 자유롭게 수정할 수 있어요.";
    },
    subMessage() {
      if(this.isMobile ){
        return '목차 옆의 버튼을 이용하면 추가, 삭제도 가능해요!'
      }
      return "목차 옆의 버튼을 이용하면 추가, 삭제, 이동도 가능해요!";
    }
  },


  components: {
    MySectionDisplay,
    RecommendDelimiterLine
  },
  methods: {
    handleDelete(index1, index2) {
      this.$store.dispatch('deleteSubTreeInBookSchemaOnRecommend', {
        index1: index1,
        index2: index2,
      })
      this.$store.commit('ADD_DELETED_SECTION_COUNT')
    },
    handleEdit(index1, index2, title) {
      this.$store.dispatch('editTitleInBookSchema', {
        index1: index1,
        index2: index2,
        title: title
      })
    },
    async handleCreateSubchapter() {
      await this.$store.dispatch('addSubChapterOnly')
      await this.$nextTick();
      await this.scrollToNewSubChapter(this.mainChapter.sub_chapter_list.length -1)
    },

    async handleCreateSection(subChapterIdx) {
      await this.$store.dispatch('addSectionOnly', subChapterIdx)
      await this.$nextTick();
      await this.scrollToNewSection(subChapterIdx, this.mainChapter.sub_chapter_list.at(subChapterIdx).section_list.length -1)
    },

    async scrollToNewSubChapter(index1){
      const subChapterElement = this.$refs['subchapter' + index1];
      if (subChapterElement && subChapterElement[0]) {
        subChapterElement[0].scrollIntoView({behavior: 'smooth', block: 'start'});
      }
      this.highlightNewElement(`subchapter${index1}`);

    },
    async scrollToNewSection(index1, index2) {
      const sectionElement = this.$refs['section' + String(index1) + ',' + String(index2)];
      if(sectionElement && sectionElement[0] && !this.isElementInViewport(sectionElement[0])){
        sectionElement[0].scrollIntoView({behavior: 'smooth', block: 'start'})
      }
      this.highlightNewElement(`section${index1},${index2}`);

    },
    isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    highlightNewElement(ref) {
      const element = this.$refs[ref][0];
      if (element) {
        element.classList.add('animate-bounce');
        setTimeout(() => {
          element.classList.remove('animate-bounce');
        }, 1500);
      }
    },


    handleDrop(index1, index2) {
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
          if(newSection.section_list.length > 0) {
            this.$store.commit('SET_ERROR_MESSAGE', '해당 대목차에 소목차가 존재하여 이동할 수 없습니다.')
            this.$store.commit('SET_SHOW_ERROR_MODAL', true)
            return
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
      this.$store.commit('SET_BOOK_SCHEMA', {
        main_chapter: JSON.parse(JSON.stringify(newMainChapter))
      })
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
    handleDragStart(index1, index2) {
      this.dragStartIndex1 = index1
      this.dragStartIndex2 = index2
      this.noSubChapterDropInterface = (index2==-1&&this.mainChapter.sub_chapter_list[index1].section_list.length>0)
    },
  },
};
</script>

<style>
.highlight {
  border: 2px solid yellow;
  transition: border 0.5s ease-in-out;
}
</style>

