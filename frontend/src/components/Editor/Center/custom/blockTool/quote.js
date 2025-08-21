class Quote {
  // block 메뉴에 표시될 아이콘과 이름
  static get toolbox() {
    return {
      title: 'Quote',
      icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M4.58341 17.321C3.55316 16.2273 3 14.9999 3 13.0102C3 9.5108 5.45651 6.3736 9.03059 4.82312L9.92328 6.20073C6.58804 8.00533 5.93618 10.3459 5.67564 11.8219C6.21263 11.5442 6.91558 11.4465 7.60471 11.5104C9.40908 11.6777 10.8312 13.1589 10.8312 14.9999C10.8312 16.9329 9.26416 18.4999 7.33116 18.4999C6.2581 18.4999 5.23196 18.0094 4.58341 17.321ZM14.5834 17.321C13.5532 16.2273 13 14.9999 13 13.0102C13 9.5108 15.4565 6.3736 19.0306 4.82312L19.9233 6.20073C16.588 8.00533 15.9362 10.3459 15.6756 11.8219C16.2126 11.5442 16.9156 11.4465 17.6047 11.5104C19.4091 11.6777 20.8312 13.1589 20.8312 14.9999C20.8312 16.9329 19.2642 18.4999 17.3312 18.4999C16.2581 18.4999 15.232 18.0094 14.5834 17.321Z" fill="#727272"></path></svg>',
    }
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
    this.wrapper.classList.add('ssdam-quote');
    this.wrapper.style.cursor = 'text';

    const top = document.createElement('div');
    top.classList.add('flex', 'justify-start', 'items-start', 'h-full', 'relative', 'gap-2.5');
    top.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-auto relative" preserveAspectRatio="none"><path d="M4.58341 17.3212C3.55316 16.2275 3 15.0001 3 13.0104C3 9.51092 5.45651 6.37372 9.03059 4.82324L9.92328 6.20085C6.58804 8.00545 5.93618 10.3461 5.67564 11.8221C6.21263 11.5444 6.91558 11.4467 7.60471 11.5106C9.40908 11.6779 10.8312 13.1591 10.8312 15.0001C10.8312 16.9331 9.26416 18.5001 7.33116 18.5001C6.2581 18.5001 5.23196 18.0096 4.58341 17.3212ZM14.5834 17.3212C13.5532 16.2275 13 15.0001 13 13.0104C13 9.51092 15.4565 6.37372 19.0306 4.82324L19.9233 6.20085C16.588 8.00545 15.9362 10.3461 15.6756 11.8221C16.2126 11.5444 16.9156 11.4467 17.6047 11.5106C19.4091 11.6779 20.8312 13.1591 20.8312 15.0001C20.8312 16.9331 19.2642 18.5001 17.3312 18.5001C16.2581 18.5001 15.232 18.0096 14.5834 17.3212Z" fill="#B3B7BC"></path></svg>';

    const divwrap = document.createElement('div');
    const el = document.createElement('h5');

    el.contentEditable = true;
    el.innerHTML = this.data && this.data.text ? this.data.text : '';
    el.classList.add('outline-none');
    el.style.wordBreak = 'break-word';
    const placeholderText = this.api.i18n.t(this.config.placeholder || 'Quote');
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

    divwrap.appendChild(el);

    const bottom = document.createElement('div');
    bottom.classList.add('flex', 'justify-end', 'items-end', 'h-full', 'relative', 'gap-2.5');
    bottom.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"> <path d="M19.4166 6.67884C20.4468 7.77254 21 8.99994 21 10.9896C21 14.4891 18.5435 17.6263 14.9694 19.1768L14.0767 17.7991C17.412 15.9945 18.0638 13.6539 18.3244 12.1779C17.7874 12.4556 17.0844 12.5533 16.3953 12.4894C14.5909 12.3221 13.1688 10.8409 13.1688 8.99994C13.1688 7.06694 14.7358 5.49994 16.6688 5.49994C17.7419 5.49994 18.768 5.99044 19.4166 6.67884ZM9.4166 6.67884C10.4468 7.77254 11 8.99994 11 10.9896C11 14.4891 8.5435 17.6263 4.9694 19.1768L4.0767 17.7991C7.412 15.9945 8.0638 13.6539 8.3244 12.1779C7.7874 12.4556 7.0844 12.5533 6.3953 12.4894C4.5909 12.3221 3.1688 10.8409 3.1688 8.99994C3.1688 7.06694 4.7358 5.49994 6.6688 5.49994C7.7419 5.49994 8.768 5.99044 9.4166 6.67884Z" fill="#B3B7BC"></path></svg>';

    function resize() {
      top.style.height = el.offsetHeight + 63 + 'px';
      bottom.style.height = el.offsetHeight + 63 + 'px';
    }

    // dynamically gets the size of el content after render
    setTimeout(resize, 0);
    el.addEventListener('input', resize);

    this.wrapper.appendChild(top);
    this.wrapper.appendChild(divwrap);
    this.wrapper.appendChild(bottom);

    this.wrapper.addEventListener('click', () => {
      el.focus();
    });

    return this.wrapper;
  }

  // block content를 저장
  save(blockContent) {
    return {
      text: blockContent.querySelector('h5').innerHTML || this.data.text || '',
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
        p: function(el) {
          el.innerHTML = ''
        }
      }
    };
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

export default Quote;

