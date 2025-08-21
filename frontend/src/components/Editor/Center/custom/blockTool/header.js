class header {
  // block 메뉴에 표시될 아이콘과 이름
  static get toolbox() {
    return [
      {
        title: 'Header1',
        icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M13 20H11V13H4V20H2V4H4V11H11V4H13V20ZM21.0005 8V20H19.0005L19 10.204L17 10.74V8.67L19.5005 8H21.0005Z" fill="#727272" stroke="none"></path></svg></div>',
        data: {
          level: 1,
        }
      },
      {
        title: 'Header2',
        icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 8C20.5711 8 22.25 9.67893 22.25 11.75C22.25 12.6074 21.9623 13.3976 21.4781 14.0292L21.3302 14.2102L18.0343 18H22V20H15L14.9993 18.444L19.8207 12.8981C20.0881 12.5908 20.25 12.1893 20.25 11.75C20.25 10.7835 19.4665 10 18.5 10C17.5818 10 16.8288 10.7071 16.7558 11.6065L16.75 11.75H14.75C14.75 9.67893 16.4289 8 18.5 8Z" fill="#727272"></path></svg></div>',
        data: {
          level: 2,
        }
      },
      {
        title: 'Header3',
        icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M22 8L21.9984 10L19.4934 12.883C21.0823 13.3184 22.25 14.7728 22.25 16.5C22.25 18.5711 20.5711 20.25 18.5 20.25C16.674 20.25 15.1528 18.9449 14.8184 17.2166L16.7821 16.8352C16.9384 17.6413 17.6481 18.25 18.5 18.25C19.4665 18.25 20.25 17.4665 20.25 16.5C20.25 15.5335 19.4665 14.75 18.5 14.75C18.214 14.75 17.944 14.8186 17.7056 14.9403L16.3992 13.3932L19.3484 10H15V8H22ZM4 4V11H11V4H13V20H11V13H4V20H2V4H4Z" fill="#727272"></path></svg></div>',
        data: {
          level: 3,
        }
      }
    ];
  }

  // 생성자 { data, api, config, readOnly, block }
  constructor({ data, api, config }) {
    this.data = data;
    this.api = api;
    this.config = config || {};
    this.wrapper = undefined;
  }

  // block이 생성될 때 block의 data를 받아와서 block content를 생성
  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('ssdam-header')
    this.wrapper.style.cursor = 'text';
    const el = document.createElement(`h${this.data.level + 1}`);

    el.contentEditable = true;
    el.innerHTML = this.data && this.data.text ? this.data.text : '';
    el.classList.add('outline-none');
    
    const placeholderText = this.api.i18n.t(this.config.placeholder + this.data.level || `Header${this.data.level}`);

    el.setAttribute('placeholder', placeholderText);

    const updatePlaceholder = () => {
      if (el.innerHTML === '') {
        el.classList.add('placeholder');
      }
      else {
        el.classList.remove('placeholder');
      }
    };

    updatePlaceholder();

    el.addEventListener('keydown', (event) => {
      // this makes the placeholder disappear when keydown '/'
      setTimeout(updatePlaceholder,0)
      if (event.key == 'Enter') {
        if(el.innerText === '') {
          this.api.blocks.delete();
          return;
        }
        const html = el.innerText.trim().replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        if (html === '') {
          el.innerText = '';
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
      }
      if (event.key == 'Backspace') {
        if(el.innerText === '') {
          this.api.blocks.delete();
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
        const html = el.innerText.trim().replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        if (html === '') {
          el.innerText = '';
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        return;
      }
      // markdown
      // get the string before caret
      const selection = window.getSelection();
      if(selection.type == 'None') return;
      const range = selection.getRangeAt(0);
      const textBeforeCaret = range.startContainer.data ? range.startContainer.data.slice(0, range.startOffset) : '';
      const textAfterCaret = range.startContainer.data ? range.startContainer.data.slice(range.startOffset) : '';
      if (event.key == ' ') {
        if (textBeforeCaret[textBeforeCaret.length-1] == '.') {
          const numString = textBeforeCaret.slice(0,-1);
          if(/^\d+$/.test(numString)) {
            const num = parseInt(numString);
            if (num > 0) {
              event.preventDefault();
              event.stopImmediatePropagation();

              const blockIndex = this.api.blocks.getCurrentBlockIndex();
              this.api.blocks.delete()
              this.api.blocks.insert(
                'list',
                {
                  text: textAfterCaret,
                  isNumbered: true,
                  index: num,
                },
                undefined,
                blockIndex,
                undefined,
                false,
              )
              this.api.caret.setToBlock(blockIndex, 'start', 0);
              return;
            }
          }
        }
        if (textBeforeCaret === '-' || textBeforeCaret === '*') {
          event.preventDefault();
          event.stopImmediatePropagation();

          const blockIndex = this.api.blocks.getCurrentBlockIndex();
          this.api.blocks.delete()
          this.api.blocks.insert(
            'list',
            {
              text: textAfterCaret,
              isNumbered: false,
              index: null,
            },
            undefined,
            blockIndex,
            undefined,
            false,
          )
          this.api.caret.setToBlock(blockIndex, 'start', 0);
          return;
        }
        if ((textBeforeCaret === '#' && this.data.level != 1) || (textBeforeCaret === '##' && this.data.level != 2) || (textBeforeCaret === '###' && this.data.level != 3)) {
          event.preventDefault();
          event.stopImmediatePropagation();

          const blockIndex = this.api.blocks.getCurrentBlockIndex();
          this.api.blocks.delete()
          this.api.blocks.insert(
            'header',
            {
              text: textAfterCaret,
              level: textBeforeCaret.length,
            },
            undefined,
            blockIndex,
            undefined,
            false,
          )
          this.api.caret.setToBlock(blockIndex, 'start', 0);
          return;
        }
        if (textBeforeCaret === '"' || textBeforeCaret === '>') {
          event.preventDefault();
          event.stopImmediatePropagation();

          const blockIndex = this.api.blocks.getCurrentBlockIndex();
          this.api.blocks.delete()
          this.api.blocks.insert(
            'quote',
            {
              text: textAfterCaret,
            },
            undefined,
            blockIndex,
            undefined,
            false,
          )
          this.api.caret.setToBlock(blockIndex, 'start', 0);
          return;
        }
      }
      if (event.key == '-') {
        if (textBeforeCaret === '--') {
          event.preventDefault();
          event.stopImmediatePropagation();
          el.innerHTML = textAfterCaret;
          const blockIndex = this.api.blocks.getCurrentBlockIndex();
          this.api.blocks.insert(
            'delimiter',
            {
            },
            undefined,
            blockIndex,
            undefined,
            false,
          )
          this.api.caret.setToBlock(blockIndex+1, 'start', 0);
          return;
        }
      }
    });

    this.wrapper.appendChild(el);
    return this.wrapper;
  }

  // block content를 저장
  save(blockContent) {
    return {
      text: blockContent.querySelector(`h${this.data.level + 1}`).innerHTML || this.data.text || '',
      level: this.data.level,
    };
  }

  // 정의한 tag 외에 거르기
  static get sanitize() {
    return {
      text: {
        mark: true,
        b: false,
        i: true,
        u: true,
        strike: true,
        comment: true,
        p: function(el) {
          el.innerHTML = ''
        }
      },
    };
  }

  // 두 블럭이 합쳐질 때 실행
  merge(data) {
    if (!this.wrapper) {
      return;
    }
    this.data.text += data.text;
    this.wrapper.querySelector(`h${this.data.level + 1}`).innerHTML += data.text;

    // // merge the tags if possible
    // mergeInlineTags(node);
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get conversionConfig() {
    return {
      export: 'text',
      import: 'text',
    }
  }
}

export default header;