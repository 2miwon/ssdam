class List {
  // block 메뉴에 표시될 아이콘과 이름
  static get toolbox() {
    return [
      {
        title: 'List',
        icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M8 4H21V6H8V4ZM3 3.5H6V6.5H3V3.5ZM3 10.5H6V13.5H3V10.5ZM3 17.5H6V20.5H3V17.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" fill="#727272"></path></svg></div>',
        data: {
          text: '',
          isNumbered: false,
          index: null,
        }
      },
      {
        title: 'NumberedList',
        icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M8 4H21V6H8V4ZM5 3V6H6V7H3V6H4V4H3V3H5ZM3 14V11.5H5V11H3V10H6V12.5H4V13H6V14H3ZM5 19.5H3V18.5H5V18H3V17H6V21H3V20H5V19.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" fill="#727272"></path></svg></div>',
        data: {
          text: '',
          isNumbered: true,
          index: 1,
        }
      }
    ]
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
    this.wrapper.classList.add('ssdam-list')
    this.wrapper.style.cursor = 'text';

    const prefix = document.createElement('h5');
    prefix.classList.add('prefix', 'pr-2')
    if (this.data.isNumbered) {
      prefix.innerHTML = this.data.index + '.';
    } 
    else {
      prefix.innerHTML = '•';
    }

    const el = document.createElement('h5');

    el.contentEditable = true;
    el.innerHTML = this.data && this.data.text ? this.data.text : '';
    el.style.wordBreak = 'break-word';
    el.classList.add('outline-none');
    
    const placeholderText = this.api.i18n.t(this.config.placeholder || 'List');
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
      setTimeout(updatePlaceholder, 0);
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
        else {
          if (event.isComposing) return; // korean input
          event.preventDefault();
          event.stopImmediatePropagation();

          const sel = window.getSelection();
          const range = sel.getRangeAt(0);
          const text1 = html.substring(0, range.startOffset);
          const text2 = html.substring(range.startOffset);
          el.innerHTML = text1;

          const blockIndex = this.api.blocks.getCurrentBlockIndex();
          this.api.blocks.insert(
            'list',
            {
              text: text2,
              isNumbered: this.data.isNumbered,
              index: this.data.isNumbered ? parseInt(this.data.index) + 1 : null,
            },
            undefined,
            blockIndex + 1,
            undefined,
            false,
          )
          this.api.caret.setToBlock(blockIndex+1, 'start', 0);
        }
        return;
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
        if ((textBeforeCaret === '-' || textBeforeCaret === '*') && this.data.isNumbered) {
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
        if (textBeforeCaret === '#' || textBeforeCaret === '##' || textBeforeCaret === '###') {
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
          el.innerHTML = '';
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

    this.wrapper.addEventListener('click', () => {
      el.focus();
    });

    this.wrapper.appendChild(prefix);
    this.wrapper.appendChild(el);
    return this.wrapper;
  }

  // block content를 저장
  save(blockContent) {
    return {
      text: blockContent.querySelectorAll('h5')[1].innerHTML || this.data.text || '',
      isNumbered: this.data.isNumbered,
      index: this.data.isNumbered ? blockContent.querySelector('h5').innerHTML.split('.')[0] : null,
    };
  }

  // 정의한 tag 외에 거르기
  static get sanitize() {
    return {
      text: {
        mark: true,
        b: true,
        i: true,
        u: true,
        strike: true,
        comment: true,
      }
    };
  }
  merge(data) {
    if (!this.wrapper || !data.text) {
      return;
    }
    this.data.text += data.text;
    const el = this.wrapper.querySelectorAll('h5')[1];
    el.innerHTML += data.text;
    
    if (el.innerHTML === '') {
      el.classList.add('placeholder');
    }
    else {
      el.classList.remove('placeholder');
    }


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

export default List;

