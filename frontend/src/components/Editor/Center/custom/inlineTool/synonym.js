import store from '@/store/index.js';
import { gtag } from '@/main.js';

class Synonym{
  static get isInline() {
    return true;
  }

  constructor({api}) {
    this.api = api;
		this.button = null;
		this.tag = 'Synonym';
		this.class = 'ssdam-synonym';
		this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    }
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
		this.button.innerHTML = '<svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="" preserveAspectRatio="none"><mask id="path-1-inside-1_3892_6754" fill="white"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.8049 2.14172H15.8754C15.5063 0.903097 14.3586 0 13 0C11.6414 0 10.4937 0.903097 10.1246 2.14172H4.48023C3.82036 2.14172 3.28542 2.67666 3.28542 3.33653V9H3C1.34315 9 0 10.3431 0 12C0 13.6569 1.34315 15 3 15H3.28542V20.6612C3.28542 21.3211 3.82035 21.856 4.48023 21.856H10.1239C10.4923 23.0958 11.6406 24 13 24C14.3594 24 15.5077 23.0958 15.8761 21.856H21.8049C22.4648 21.856 22.9997 21.3211 22.9997 20.6612V14.3705C22.9017 14.3828 22.8018 14.3891 22.7004 14.3891C21.3807 14.3891 20.3108 13.3192 20.3108 11.9995C20.3108 10.6797 21.3807 9.60984 22.7004 9.60984C22.8018 9.60984 22.9017 9.61615 22.9997 9.6284V3.33653C22.9997 2.67666 22.4648 2.14172 21.8049 2.14172Z"></path></mask><path fill-rule="evenodd" clip-rule="evenodd" d="M21.8049 2.14172H15.8754C15.5063 0.903097 14.3586 0 13 0C11.6414 0 10.4937 0.903097 10.1246 2.14172H4.48023C3.82036 2.14172 3.28542 2.67666 3.28542 3.33653V9H3C1.34315 9 0 10.3431 0 12C0 13.6569 1.34315 15 3 15H3.28542V20.6612C3.28542 21.3211 3.82035 21.856 4.48023 21.856H10.1239C10.4923 23.0958 11.6406 24 13 24C14.3594 24 15.5077 23.0958 15.8761 21.856H21.8049C22.4648 21.856 22.9997 21.3211 22.9997 20.6612V14.3705C22.9017 14.3828 22.8018 14.3891 22.7004 14.3891C21.3807 14.3891 20.3108 13.3192 20.3108 11.9995C20.3108 10.6797 21.3807 9.60984 22.7004 9.60984C22.8018 9.60984 22.9017 9.61615 22.9997 9.6284V3.33653C22.9997 2.67666 22.4648 2.14172 21.8049 2.14172Z" fill="white"></path><path d="M15.8754 2.14172L13.9587 2.71298L14.3846 4.14172H15.8754V2.14172ZM10.1246 2.14172V4.14172H11.6154L12.0413 2.71298L10.1246 2.14172ZM3.28542 9V11H5.28542V9H3.28542ZM3.28542 15H5.28542V13H3.28542V15ZM10.1239 21.856L12.041 21.2863L11.616 19.856H10.1239V21.856ZM15.8761 21.856V19.856H14.384L13.959 21.2863L15.8761 21.856ZM22.9997 14.3705H24.9997V12.1051L22.7517 12.3859L22.9997 14.3705ZM22.9997 9.6284L22.7517 11.613L24.9997 11.8939V9.6284H22.9997ZM15.8754 4.14172H21.8049V0.141724H15.8754V4.14172ZM13 2C13.4499 2 13.8353 2.29868 13.9587 2.71298L17.7921 1.57046C17.1773 -0.492489 15.2673 -2 13 -2V2ZM12.0413 2.71298C12.1647 2.29868 12.5501 2 13 2V-2C10.7327 -2 8.82275 -0.492489 8.20789 1.57046L12.0413 2.71298ZM4.48023 4.14172H10.1246V0.141724H4.48023V4.14172ZM5.28542 3.33653C5.28542 3.78123 4.92492 4.14172 4.48023 4.14172V0.141724C2.71579 0.141724 1.28542 1.57208 1.28542 3.33653H5.28542ZM5.28542 9V3.33653H1.28542V9H5.28542ZM3 11H3.28542V7H3V11ZM2 12C2 11.4477 2.44772 11 3 11V7C0.238575 7 -2 9.23858 -2 12H2ZM3 13C2.44772 13 2 12.5523 2 12H-2C-2 14.7614 0.238577 17 3 17V13ZM3.28542 13H3V17H3.28542V13ZM5.28542 20.6612V15H1.28542V20.6612H5.28542ZM4.48023 19.856C4.92492 19.856 5.28542 20.2165 5.28542 20.6612H1.28542C1.28542 22.4256 2.71578 23.856 4.48023 23.856V19.856ZM10.1239 19.856H4.48023V23.856H10.1239V19.856ZM13 22C12.5498 22 12.1643 21.7009 12.041 21.2863L8.20676 22.4257C8.82042 24.4907 10.7313 26 13 26V22ZM13.959 21.2863C13.8357 21.7009 13.4502 22 13 22V26C15.2687 26 17.1796 24.4907 17.7932 22.4257L13.959 21.2863ZM21.8049 19.856H15.8761V23.856H21.8049V19.856ZM20.9997 20.6612C20.9997 20.2165 21.3602 19.856 21.8049 19.856V23.856C23.5693 23.856 24.9997 22.4257 24.9997 20.6612H20.9997ZM20.9997 14.3705V20.6612H24.9997V14.3705H20.9997ZM22.7517 12.3859C22.7358 12.3879 22.7187 12.3891 22.7004 12.3891V16.3891C22.8849 16.3891 23.0676 16.3776 23.2477 16.3551L22.7517 12.3859ZM22.7004 12.3891C22.4852 12.3891 22.3108 12.2146 22.3108 11.9995H18.3108C18.3108 14.4238 20.2761 16.3891 22.7004 16.3891V12.3891ZM22.3108 11.9995C22.3108 11.7843 22.4852 11.6098 22.7004 11.6098V7.60984C20.2761 7.60984 18.3108 9.57514 18.3108 11.9995H22.3108ZM22.7004 11.6098C22.7187 11.6098 22.7358 11.611 22.7517 11.613L23.2477 7.64383C23.0676 7.62133 22.8849 7.60984 22.7004 7.60984V11.6098ZM20.9997 3.33653V9.6284H24.9997V3.33653H20.9997ZM21.8049 4.14172C21.3602 4.14172 20.9997 3.78122 20.9997 3.33653H24.9997C24.9997 1.57209 23.5693 0.141724 21.8049 0.141724V4.14172Z" fill="#727272" mask="url(#path-1-inside-1_3892_6754)"></path></svg><p class="absolute text-[10px] font-bold text-center text-[#727272]">W</p>';
		this.button.classList.add(this.api.styles.inlineToolButton);
    return this.button;
  }

  async surround(range) {
    if (!range || range.startOffset === range.endOffset) {
      store.commit('SET_ERROR_MESSAGE', "어휘의 선택이 해제되었습니다. 다시 선택해주세요.")
      store.commit('SET_SHOW_ERROR_MODAL', true)
      return;
    }

    const draggedText = range.toString();
    // 드래그한 어휘가 너무 긴 경우
    if (draggedText.length > 20) {
      store.commit('SET_ERROR_MESSAGE', "선택한 어휘의 길이가 너무 깁니다. 20자 이내로 선택해주세요.")
      store.commit('SET_SHOW_ERROR_MODAL', true)
      return;
    }

    // 문장의 중간에 문장 종료 기호가 있는 경우
    let containsPunctuationOnMiddle = false;
    for (let i = 0; i < draggedText.length-1; i++) {
      if ((draggedText[i] === '?' || draggedText[i] === '!' || draggedText[i] === '.')) {
        containsPunctuationOnMiddle = true;
        break;
      }
    }
    if (containsPunctuationOnMiddle) {
      store.commit('SET_ERROR_MESSAGE', "하나의 문장 내에서만 유사어 추천이 가능합니다.")
      store.commit('SET_SHOW_ERROR_MODAL', true)
      return;
    }

    // api 요청에 필요한 문장 전체 파싱
    const fullText = range.startContainer.data;
    let leftIndex = 0;
    for (let i = range.startOffset; i >= 0; i--) {
      if (fullText[i] === '?' || fullText[i] === '!' || fullText[i] === '.') {
        leftIndex = i + 1;
        break;
      }
    }
    let rightIndex = fullText.length-1;
    for (let i = range.endOffset; i < fullText.length; i++) {
      if (fullText[i] === '?' || fullText[i] === '!' || fullText[i] === '.') {
        rightIndex = i;
        break;
      }
    }
    const originalSentence = fullText.slice(leftIndex, rightIndex+1).trim();

    // api 요청, 응답 받기
    // 요청 시간이 약 1초 소요되는데 이 때 로딩화면 돌리기
    store.dispatch('synonymGenerator', { contextText: originalSentence, targetText: draggedText })
    .then((response) => {
      let synonymList = response;

      if (synonymList.length === 0) {
        SynonymMenuBar.remove();
        outerModal.remove();
        store.commit('SET_ERROR_MESSAGE', "적절한 유사 단어 추천에 실패했습니다.")
        store.commit('SET_SHOW_ERROR_MODAL', true)
        return;
      }

      SynonymProgressSpinner.innerHTML = '';

      for (let i = 0; i < synonymList.length; i++) {
        const SynonymMenuItem = document.createElement('div');
        SynonymMenuItem.classList.add('ssdam-synonym-menu-item', 'flex', 'justify-start', 'items-center', 'self-stretch', 'flex-grow-0', 'flex-shrink-0', 'relative', 'py-1.5', 'rounded', 'hover:bg-gray-100', 'cursor-pointer');
        SynonymMenuItem.innerHTML = 
          `<svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="ssdam-synonym-icon flex-grow-0 flex-shrink-0 w-6 h-6 relative"
            preserveAspectRatio="none">
            <path
              d="M15.0704 12.551C15.3746 12.2467 15.3746 11.7534 15.0704 11.4491L10.1213 6.50007C9.73079 6.10955 9.09763 6.10955 8.7071 6.50007C8.31658 6.8906 8.31658 7.52376 8.70711 7.91428L12.7929 12.0001L8.7071 16.0859C8.31658 16.4764 8.31658 17.1095 8.70711 17.5001C9.09763 17.8906 9.73079 17.8906 10.1213 17.5001L15.0704 12.551Z"
              fill="#D6D8DC">
            </path>
          </svg>
          <p class="flex-grow-0 flex-shrink-0 text-sm font-semibold text-center text-[#5743d0]">
            ${synonymList[i]}
          </p>`

        SynonymMenuItem.addEventListener('click', () => {
          // 선택된 텍스트를 삭제
          range.deleteContents();
        
          // 새로운 텍스트 노드를 생성하여 범위에 삽입
          const newText = document.createTextNode(synonymList[i]);
          range.insertNode(newText);
        
          // 새로운 노드 이후에 커서를 위치시킴 (선택 범위가 새 텍스트 노드 끝으로 이동)
          range.setStartAfter(newText);
          range.setEndAfter(newText);
        
          // 선택된 범위를 새롭게 설정
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);

          outerModal.remove();
          SynonymMenuBar.remove();

          gtag.event('synonym-recommendation', {
            'previous_phrase': draggedText,
            'recommended_phrase': synonymList[i]
          })
        });

        SynonymMenuList.appendChild(SynonymMenuItem);
      }
    })
    .catch((error) => {
      SynonymMenuBar.remove();
      outerModal.remove();
      store.commit('SET_ERROR_MESSAGE', '유사 단어 추천 중 오류가 발생했습니다.')
      store.commit('SET_SHOW_ERROR_MODAL', true)
      console.log(error)
      return;
    });

    const SynonymMenuBar = document.createElement('div');
    // inlineToolbar의 포지션에 따라 짤리지 않도록 조정
    const inlineToolbar = document.querySelector('.ce-inline-toolbar');
    const inlineToolbarRect = inlineToolbar.getBoundingClientRect();

    SynonymMenuBar.classList.add('ssdam-synonym-menu-bar', 'flex', 'flex-col', 'fixed', 'justify-start', 'items-start', 'w-[302px]', 'gap-4', 'p-4', 'rounded-[10px]', 'bg-white', 'z-30');

    if (inlineToolbarRect.left + 570 > window.innerWidth) {
      SynonymMenuBar.style.right = '10px';
      SynonymMenuBar.style.top = `${inlineToolbarRect.top + 63}px`;
    } else {
      SynonymMenuBar.style.marginLeft = '260px';
      SynonymMenuBar.style.top = `${inlineToolbarRect.top + 63}px`;
    }
    SynonymMenuBar.style.boxShadow = '0px 4px 12.899999618530273px 0 rgba(0,0,0,0.1)';

    const SynonymMenuTitle = document.createElement('div');
    SynonymMenuTitle.classList.add('flex', 'flex-col', 'justify-start', 'items-start', 'self-stretch', 'flex-grow-0', 'flex-shrink-0', 'relative', 'gap-1');
    SynonymMenuTitle.innerHTML = `<p class="self-stretch flex-grow-0 flex-shrink-0 w-[270px] text-[13px] text-left text-[#474747]">유사단어 추천</p>
      <p class="self-stretch flex-grow-0 flex-shrink-0 w-[270px] text-sm font-semibold text-left text-[#494949]"> 
        ${draggedText} 
      </p>`;

    const SynonymMenuLine = document.createElement('div');
    SynonymMenuLine.innerHTML = '<svg width="270" height="1" viewBox="0 0 270 1" fill="none" xmlns="http://www.w3.org/2000/svg" class="self-stretch flex-grow-0 flex-shrink-0" preserveAspectRatio="none"><line y1="0.5" x2="270" y2="0.5" stroke="#F2F2F2"></line></svg>';

    SynonymMenuBar.appendChild(SynonymMenuTitle);
    SynonymMenuBar.appendChild(SynonymMenuLine);

    const SynonymMenuList = document.createElement('div');
    SynonymMenuList.classList.add('ssdam-synonym-menu-list', 'flex', 'flex-col', 'justify-start', 'items-start', 'self-stretch', 'flex-grow-0', 'flex-shrink-0');

    // 로딩중 화면 출력
    const SynonymProgressSpinner = document.createElement('div');
    SynonymProgressSpinner.classList.add('ssdam-synonym-progress-spinner', 'flex', 'flex-col', 'justify-center', 'items-center');

    SynonymProgressSpinner.innerHTML = `
    <img src="/assets/progress.gif" alt="Loading..." class="w-[100px] h-[100px] justify-center items-center">
    <p class="w-[270px] text-sm font-semibold text-center text-[#474747] pb-9">
      유사 단어 추천 중
    </p>`;

    const outerModal = document.createElement('div');
    outerModal.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'z-10');

    outerModal.addEventListener('click', () => {
      outerModal.remove();
      SynonymMenuBar.remove();
    });

    SynonymMenuBar.appendChild(SynonymMenuList);
    SynonymMenuBar.appendChild(SynonymProgressSpinner);

    inlineToolbar.appendChild(outerModal);
    inlineToolbar.appendChild(SynonymMenuBar);
  }

  checkState() {
    return false;
  }

  static get sanitize() {
    return {
      mark: {
        class: this.class,
      },
    }
  }

  static get shortcut() {
    return 'CMD+SHIFT+S';
  }
}

export default Synonym;