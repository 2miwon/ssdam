<template>
  <div class="fixed h-[100%] w-[100%] inset-0 bg-black flex items-center justify-center bg-white z-50 overflow-y-auto"
    tabindex="0">
    <div ref="printDoc" class="mt-10 h-[90%] w-[80%]">
      <EditorComponent :title="this.mainChapter.title" :page_id="this.mainChapter.page_id" :printMode="true"/>
      <div v-for="subChapter in visibleSubChapters" :key="subChapter.page_id">
        <div v-if="!subChapter.is_deleted">
          <EditorComponent :title="subChapter.title" :page_id="subChapter.page_id" :printMode="true" :index="subChapter.visibleIndex"/>
          <div v-for="section in subChapter.section_list" :key="section.page_id">
            <div v-if="!section.is_deleted">
              <EditorComponent :title="section.title" :page_id="section.page_id" :printMode="true"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <WaitForRenderModal v-if="showWaitForRenderModal" @closeModal="showWaitForRenderModal = false"/>
  </div>
</template>

<script>
import EditorComponent from '@/components/Editor/Center/EditorComponent.vue';
import WaitForRenderModal from '@/components/Editor/WaitForRenderModal.vue';
import { saveAs } from 'file-saver'
import {
  Document,
  Packer,
  Paragraph,
  AlignmentType,
  TableOfContents,
  Footer,
  PageNumber,
  TextRun,
  ImageRun,
} from 'docx';
import { styles } from "@/components/Editor/printDocxStyles";

export default {
  data() {
    return{
      h1Found : false,
      showWaitForRenderModal: true,
    }
  },
  computed: {
    visibleSubChapters() {
      var counter = 1
      return this.mainChapter.sub_chapter_list
      .map((subChapter) => ({ ...subChapter, visibleIndex: subChapter.is_deleted ? counter : counter++ }))
    },
    mainChapter() {
      return this.$store.getters.currentBook.book_schema.main_chapter
    },
    subChapterPageIdList() {
      return [ ...this.$store.getters.currentBook.book_schema.main_chapter.map(sub => sub.page_id)]
    },
    pageIdDict() {
      // const booKSchema = this.$store.getters.currentBook.book_schema
      const mainChapterPageId = this.$store.getters.currentBook.book_schema.main_chapter.page_id
      const subChapterPageIdList = [];
      const sectionPageIdList = [];

      this.$store.getters.currentBook.book_schema.main_chapter.sub_chapter_list.forEach(sub => {
        if(!sub.is_deleted){
          subChapterPageIdList.push(sub.page_id)
          sub.section_list.forEach(sec => {
            if(!sec.is_deleted){
              sectionPageIdList.push(sec.page_id)
            }
          })
        }
      })

      return { mainChapterPageId: mainChapterPageId, subChapterPageIdList: subChapterPageIdList, sectionPageIdList: sectionPageIdList }
    },
    exportToDocx(){
      return this.$store.getters.exportToDocx
    }
  },
  watch:{
    exportToDocx(value){
      if(value == true){
        this.handleExportToDocx()
        this.$store.commit("EXPORT_TO_DOCX")
      }
    }
  },

  components: {
    EditorComponent,
    WaitForRenderModal
  },
  methods: {
    async handleExportToDocx() {
      await this.$nextTick();

      const printDoc = this.$refs.printDoc;
      const toolbars = printDoc.querySelectorAll('.ce-toolbar');
      toolbars.forEach(toolbar => toolbar.remove());

      // h5 => p 태그로 변환
      const h5Elements = printDoc.querySelectorAll('h5');
      h5Elements.forEach(h5 => {
        const p = document.createElement('p');       // 새로운 p 태그 생성
        p.innerHTML = h5.innerHTML;                  // h5 내용 복사
        h5.replaceWith(p);                           // h5를 p로 대체
      });

      // 사용자 정의 스타일 생성

      // HTML 요소들을 순회하며 docx 문서 구조로 변환
      const docxContent = await this.convertHtmlToDocxStructure(printDoc);

      const tableOfContent = new TableOfContents({
        headingStyleRange: "1-2", // h1-h2에 해당하는 목차 생성
        alias: "Table of Contents", // 목차 제목
        hyperlink: true, // 목차 항목을 클릭할 수 있도록 설정
        captionLabel: "Heading",
        entries: []
      });
      // docx 문서 생성
      const doc = new Document({
        styles: {
          paragraphStyles: [
              styles.title,
              styles.subTitle,
              styles.section,
              styles.heading1,
              styles.heading2,
              styles.heading3,
              styles.normal,
              styles.tableOfContent,
              styles.quote
          ],
        },
        sections: [
          {
            properties: {
              verticalAlign: "center"
            },
            children:  [ docxContent.at(0) ]
          },
          {
            properties: {
              // verticalAlign: "center"
            },
            children: [
              new Paragraph({
                text: '목차',
                style: "tableOfContent",
              }),
              new Paragraph({ // 공백
                text: '',
                style: "myNormalStyle",
              }),
              tableOfContent, // 목차를 문서의 첫 번째 섹션에 추가
            ],
          },
          {
            properties: {
              page: {
                margin: {
                  top: 1700,    // 3cm 위쪽 마진
                  right: 1440,  // 2.54cm 오른쪽 마진
                  bottom: 1440, // 2.54cm 아래쪽 마진
                  left: 1440   // 2.54cm 왼쪽 마진
                },
              },
            },
            children: [
                ...this.createPreface(),
                ...docxContent.slice(1)
            ],
            footers: {
              default: new Footer({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        children: ["- ", PageNumber.CURRENT, " -"],
                      }),
                    ],
                    alignment: AlignmentType.CENTER, // 중앙 정렬
                  }),
                ],
              }),
            },
          }
        ]
      });

      // docx 파일 생성 및 다운로드
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, this.mainChapter.title + '.docx');
      });
    },

    async convertHtmlToDocxStructure(element) {
      const content = [];
      const textRunList = [];

      for (const node of element.childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {

          //인용문
          if (node.classList && node.classList.contains('ssdam-quote')) {
            content.push(new Paragraph({
              style: "myNormalStyle",
              text: ''
            }));
            content.push(new Paragraph({
              style: "myQuoteStyle",
              children: [
                new TextRun({
                  text: node.textContent,
                  italics : true
                })
              ]
            }));
            content.push(new Paragraph({
              style: "myNormalStyle",
              text: ''
            }));
            return content;
          }

          //리스트
          if (node.className == 'ssdam-list') {
            content.push(new Paragraph({
              style: "myNormalStyle",
              children: [
                new TextRun({ text: node.childNodes.item(0).textContent }),
                new TextRun({ text: ' '}),
                new TextRun({ text: node.childNodes.item(1).textContent }),
              ],
            }))
            return content;
          }

          //구분선
          if (node.className == 'ssdam-delimiter'){
            content.push(new Paragraph({
              border: {
              bottom: {
                color: "auto",
                space: 1,
                style: "single",
                size: 3,
                }
              }
              }))
            return content;
          }

          switch (node.tagName.toLowerCase()) {
            case 'h1':
              if(node.id == this.pageIdDict.mainChapterPageId){
                content.push(new Paragraph({
                      text: node.textContent,
                      style: "myTitleStyle",
                      // pageBreakBefore: true,
                }));
              }else if(this.pageIdDict.subChapterPageIdList.includes(node.id)) {
                this.addBlankBeforeTitle(content)
                content.push(new Paragraph({ // 중 제목
                  text: node.textContent,
                  style: "Heading1",
                }))
                this.addBlankAfterTitle(content)
              }else {
                this.addBlankBeforeTitle(content)
                content.push(new Paragraph({ // 소제목
                  text: node.textContent,
                  style: "Heading2",
                }))
                this.addBlankAfterTitle(content)
              }
              break;
            case 'h2':
              content.push(new Paragraph({
                text: node.textContent,
                style: "myHeading1Style",
              }));
              break;
            case 'h3':
              content.push(new Paragraph({
                text: node.textContent,
                style: "myHeading2Style",
              }));
              break;
            case 'h4':
              content.push(new Paragraph({
                text: node.textContent,
                style: "myHeading3Style",
              }));
              break;
            case 'p':
              for (const childNode of element.childNodes) {
                if (childNode.nodeType === Node.TEXT_NODE) {
                  // 일반 텍스트 노드
                  textRunList.push(new TextRun({
                    text: childNode.textContent,
                  }));
                } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                    const tagName = childNode.tagName.toLowerCase();
                    const runOptions = {
                      text: childNode.textContent,
                    };

                    switch (tagName) {
                      case 'b':
                        runOptions.bold = true;
                        break;
                      case 'strong':
                        runOptions.bold = true;
                        break;
                      case 'i':
                        runOptions.italics = true;
                        break;
                      case 'em':
                        runOptions.italics = true;
                        break;
                      case 'u':
                        runOptions.underline = {};
                        break;
                      case 'mark':
                        runOptions.highlight = 'yellow';
                        break;
                      case 'strike':
                        runOptions.strike = true;
                        break;
                      case 's':
                      case 'del':
                        runOptions.strike = true;
                        break;
                    }

                    if (childNode.classList && childNode.classList.contains('ssdam-bold')) {
                      runOptions.bold = true;
                    }

                    if (childNode.childNodes.length > 0){
                      this.processChildNode(runOptions, childNode)
                    }
                    textRunList.push(new TextRun(runOptions))
                }
              }
              content.push(new Paragraph({
                style: "myNormalStyle",
                children: textRunList,
                indent:{
                  firstLine: "11pt"
                }
              }));

              break;
            case 'img':
              try {
                let imageUrl = ''
                const response = await fetch(node.src, {
                  mode: 'cors',
                  // headers: {
                  //   'Cache-Control': 'no-cache'  // 헤더 직접 설정도 가능
                  // }
                  cache: 'no-cache'
                });

                const blob = await response.blob();

                const reader = new FileReader();

                reader.readAsArrayBuffer(blob);

                imageUrl = await new Promise((resolve, reject) => {
                  reader.onloadend = () => {
                    const arrayBuffer = reader.result; // ArrayBuffer 데이터
                    let binary = '';
                    const bytes = new Uint8Array(arrayBuffer);
                    const len = bytes.byteLength;

                    for (let i = 0; i < len; i++) {
                      binary += String.fromCharCode(bytes[i]);
                    }

                    const base64String = window.btoa(binary);
                    // Base64 이미지 URL 생성
                    resolve('data:image/jpeg;base64,' + base64String);
                  };

                  reader.onerror = reject; // 에러 발생 시 reject 호출
                });

                content.push(new Paragraph({
                      children: [
                        new ImageRun({
                          data: imageUrl, // Use the arrayBuffer from the image blob
                          transformation: {
                            width: node.width,
                            height: node.height,
                          }
                        })
                      ]
                    }));
              } catch (error) {
                console.error('Error fetching image:', error);
              }
              break;
            default:
              // 재귀적으로 하위 요소 처리
              content.push(...await this.convertHtmlToDocxStructure(node));
          }
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
          content.push(new Paragraph({
            text: node.textContent.trim(),
            style: "myNormalStyle",
          }));
        }
      }
      return content;
    },
    addBlankBeforeTitle(content){
      content.push(new Paragraph({ // 공백
        text: '',
        style: "myNormalStyle",
        pageBreakBefore: true,
      }))
      for (let i = 0; i < 3; i++) {
        content.push(new Paragraph({ // 공백
          text: '',
          style: "myNormalStyle",
        }));
      }
    },
    addBlankAfterTitle(content){
      for (let i = 0; i < 4; i++) {
        content.push(new Paragraph({ // 공백
          text: '',
          style: "myNormalStyle",
        }));
      }
    },
    createPreface(){
      const preface = []
      this.addBlankBeforeTitle(preface)
      preface.push(new Paragraph({
        text: "머리말",
        style: "Heading1",
      }))
      this.addBlankAfterTitle(preface)
      return preface
    },
    processChildNode(runOptions, node) {
      if (node.childNodes && node.childNodes.length > 0) {
        node.childNodes.forEach(childNode => {
          if (childNode.nodeType === Node.TEXT_NODE) {
            // textRunList.push(new TextRun({
            //   text: childNode.textContent,
            // }));
          } else if (childNode.nodeType === Node.ELEMENT_NODE) {
            const tagName = childNode.tagName.toLowerCase();

            switch (tagName) {
              case 'b':
                runOptions.bold = true;
                break;
              case 'strong':
                runOptions.bold = true;
                break;
              case 'i':
                runOptions.italics = true;
                break;
              case 'em':
                runOptions.italics = true;
                break;
              case 'u':
                runOptions.underline = {};
                break;
              case 'mark':
                runOptions.highlight = 'yellow';
                break;
              case 'strike':
                runOptions.strike = true;
                break;
              case 's':
              case 'del':
                runOptions.strike = true;
                break;
            }

            if (childNode.classList && childNode.classList.contains('ssdam-bold')) {
              runOptions.bold = true;
            }

            if (childNode.childNodes.length > 0) {
              this.processChildNode(runOptions, childNode)
            }
          }
        });

      }
    }
  }
}
</script>
