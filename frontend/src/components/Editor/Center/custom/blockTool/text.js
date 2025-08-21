import store from '@/store/index.js';
import { gtag } from '@/main.js';
import { isCaretAtEnd } from '../util/htmlParser';

class Text {
  // block 메뉴에 표시될 아이콘과 이름
  static get toolbox() {
    return {
      title: 'Text',
      icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M13 6V21H11V6H5V4H19V6H13Z" fill="#727272"></path></svg></div>',
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
    this.wrapper.classList.add('ssdam-text')
    this.wrapper.style.cursor = 'text';

    const text = this.data && this.data.text ? this.data.text : '';
    const placeholderText = this.api.i18n.t(this.config.placeholder || 'Text');
    const placeholderNoText = this.api.i18n.t(this.config.placeholderNoText || 'Text');

    this._createText(text, placeholderText, placeholderNoText);
    return this.wrapper;
  }

  // 텍스트와 텍스트 중간에 ctrl+v로 붙여넣기를 할 때 사용
  // 어려우니 나중에 할게요
  // _creatTextbetweenBlocks(text) {
  //   const el = document.createElement('h5');

  //   el.contentEditable = true;
  //   el.innerHTML = text ? text : '';
  //   el.classList.add('outline-none');
  //   el.placeholder = this.api.i18n.t(this.config.placeholder || 'Text');

  //   this.wrapper.appendChild(el)
  // }

  // block content를 생성
  _createText(text, placeholderText, placeholderNoText) {
    const el = document.createElement('h5');
    this.wrapper.addEventListener('click', () => {
      el.focus();
    });

    el.contentEditable = true;
    el.innerHTML = text ? text : '';
    el.classList.add('outline-none');
    el.classList.add('sspilot')
    el.setAttribute('placeholder', placeholderText);

    if (store.getters.sspilotOn) {
      el.setAttribute('sspilot', '');

      let saveTimeout = null;
      const updatePlaceholder = () => {
        const length = this.api.blocks.getBlocksCount();
        let textExist = false;
        let placeholder = '';
        for (let i = 0; i < length; i++) {
          if(!this.api.blocks.getBlockByIndex(i).isEmpty) {
            textExist = true;
            break;
          }
        }
        if (textExist) {
          placeholder = placeholderText;
        } else {
          placeholder = placeholderNoText;
        }

        if (document.activeElement == el && el.innerText === '') {
          // sspilot의 ::after는 빈 블럭의 경우에 ::before로 처리, placeholderText 초기화
          el.setAttribute('placeholder', placeholder);
          el.classList.add('placeholder');
        }
        else {
          el.setAttribute('placeholder', placeholder);
          el.classList.remove('placeholder');
        }
      };

      const updateSspilot = () => {
        el.setAttribute('sspilot', '');
        if(window.innerWidth < 660) {
          const button = this.wrapper.querySelector('div .sspilot-button');
          button.style.display = 'none';
        }
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => this._createSspilot(el) , store.getters.sspilotTime * 1000 - 1000);
      };

      el.addEventListener('focus', () => {
        updatePlaceholder();
        updateSspilot();
      });

      el.addEventListener('blur', () => {
        el.classList.remove('placeholder');
        if(window.innerWidth < 660) {
          setTimeout(() => { // 모바일은 터치로 인식되는데 blur 이벤트에 의해 sspilot이 사라지는 것을 방지
            el.setAttribute('sspilot', '');
            const button = this.wrapper.querySelector('div .sspilot-button');
            button.style.display = 'none';
          }, 200);
        } else {
          el.setAttribute('sspilot', '');
        }

        clearTimeout(saveTimeout);
      });

        // event listener가 중복으로 처리 되서 텍스트의 경우 아래 코드를 빼야함
        // el.addEventListener('paste', (event) => {
        //   event.preventDefault()
        //   console.log(event.clipboardData.getData('text'))
        //   this._createText(event.clipboardData.getData('text'));
        // });

      
      // 쓰파일럿의 적용
      if (window.innerWidth < 660) {
        // 모바일: 터치
        const button = document.createElement('div');
        button.style.display = 'none';
        button.classList.add('sspilot-button');
        button.innerHTML = '<div class="flex justify-center items-center w-full h-[37px] relative gap-2.5 p-2.5 rounded-lg bg-[#5743d0]"><p class="flex-grow-0 flex-shrink-0 text-[13px] font-bold text-left text-white">자동 문장 추천 적용</p></div>'

        button.addEventListener('click', () => {
          const content = el.getAttribute('sspilot');
          el.classList.remove('placeholder');
          updateSspilot();

          // save on db
          const prevSentence = this._getPreviousSentence(2);
          if(prevSentence.length > 0) {
            store.dispatch('storeSentenceData', { 
              previousSentence: prevSentence, 
              nextSentence: content.trim()
            })
          }  

          el.innerHTML += content;

          const range = document.createRange();
          const sel = window.getSelection();
      
          range.selectNodeContents(el);
          range.collapse(false); // 콘텐츠의 마지막으로 캐럿을 옮김
      
          sel.removeAllRanges();
          sel.addRange(range);
          gtag.event('sp-event', {})
        });
        
        el.addEventListener('keydown', (event) => {
          // this makes the placeholder disappear when keydown '/'
          setTimeout(updatePlaceholder,0)
          // get the string before caret
          const selection = window.getSelection();
          if(selection.type == 'None') return;
          const range = selection.getRangeAt(0);
          const textBeforeCaret = range.startContainer.data ? range.startContainer.data.slice(0, range.startOffset) : '';
          const textAfterCaret = range.startContainer.data ? range.startContainer.data.slice(range.startOffset) : '';
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
          if (textBeforeCaret === '"' || textBeforeCaret === '>') {
            event.preventDefault();
            event.stopImmediatePropagation();

            const blockIndex = this.api.blocks.getCurrentBlockIndex();
            const block = this.api.blocks.getBlockByIndex(blockIndex);
            this.api.blocks.convert(block.id, 'quote', {
              text: textAfterCaret,
            });
            return;
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
          updateSspilot();
        });

        el.addEventListener('click', () => {
          updatePlaceholder();
          updateSspilot();
        })

        el.addEventListener('paste', () => {
          setTimeout(updatePlaceholder,0)
        })

        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(el);
        this.wrapper.appendChild(button);
      }
      else {
        // 데스크탑: 탭
        el.addEventListener('keydown', (event) => {
          // this makes the placeholder disappear when keydown '/'
          setTimeout(updatePlaceholder, 0);
          if (event.key === 'Tab') {
            event.preventDefault();
            const content = el.getAttribute('sspilot');
            if (event.isComposing) return; // korean input
            if (!content) return;

            // save on db
            const prevSentence = this._getPreviousSentence(2);
            if(prevSentence.length > 0) {
              store.dispatch('storeSentenceData', { 
                previousSentence: prevSentence, 
                nextSentence: content.trim()
              })
            }        
    
            setTimeout(() => {
              el.classList.remove('placeholder');
              updateSspilot();

              el.innerHTML += content;
          
              // 캐럿 포지션을 마지막으로 옮기기
              const range = document.createRange();
              const sel = window.getSelection();
          
              range.selectNodeContents(el);
              range.collapse(false); // 콘텐츠의 마지막으로 캐럿을 옮김
          
              sel.removeAllRanges();
              sel.addRange(range);
            }, 0);
            gtag.event('sp-event', {})
          }
          else if (event.key == 'Backspace') {
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
          else {
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
            updateSspilot();
          }
        })

        el.addEventListener('click', () => {
          updatePlaceholder();
          updateSspilot();
        })

        el.addEventListener('paste', () => {
          setTimeout(updatePlaceholder,0)
        })

        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(el);
      }
    }
    else {
      const updatePlaceholder = () => {
        const length = this.api.blocks.getBlocksCount();
        let textExist = false;
        let placeholder = '';
        for (let i = 0; i < length; i++) {
          if(!this.api.blocks.getBlockByIndex(i).isEmpty) {
            textExist = true;
            break;
          }
        }
        if (textExist) {
          placeholder = placeholderText;
        } else {
          placeholder = placeholderNoText;
        }
        if (document.activeElement == el && el.innerText === '') {
          el.setAttribute('placeholder', placeholder);
          el.classList.add('placeholder');
        }
        else {
          el.setAttribute('placeholder', placeholder);
          el.classList.remove('placeholder');
        }
      };

      el.addEventListener('focus', () => {
        updatePlaceholder();
      });

      el.addEventListener('blur', () => {
        el.classList.remove('placeholder');
      });

      el.addEventListener('keydown', (event) => {
        // this makes the placeholder disappear when keydown '/'
        setTimeout(updatePlaceholder,0)
        // get the string before caret
        const selection = window.getSelection();
        if(selection.type == 'None') return;
        const range = selection.getRangeAt(0);
        const textBeforeCaret = range.startContainer.data ? range.startContainer.data.slice(0, range.startOffset) : '';
        const textAfterCaret = range.startContainer.data ? range.startContainer.data.slice(range.startOffset) : '';
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

      el.addEventListener('paste', () => {
        setTimeout(updatePlaceholder,0)
      })

      this.wrapper.innerHTML = '';
      this.wrapper.appendChild(el);
    }
  }

  _createSspilot(el) {
    // 이미 추천이 존재하는 조건
    if (el.getAttribute('sspilot')) return;
    // 현재 블럭이 포커스를 가지고 있는 조건
    if (document.activeElement != el) return;
    // 캐럿이 블럭의 끝에 있는 조건
    if (!isCaretAtEnd(el)) return;

    const text = this._getPreviousSentence(5);

    if (text.length == 0) return // 현재 페이지에 텍스트가 없는 경우
    store.dispatch('sentencePredictor', { text: text })
    .then(nextSentence => {
      if (el.innerHTML.length > 0 && // 블럭의 첫 문장인 경우 띄어쓰기 x
        (el.innerHTML.length < 6 ||
        el.innerHTML.slice(-6) != '&nbsp;')) { // 띄어쓰기 없으면 붙이기
        nextSentence = ' ' + nextSentence;
      }
      el.classList.remove('placeholder');
      if (document.activeElement != el) return;
      if (!isCaretAtEnd(el)) return;

      if(el.innerHTML=='') {
        el.classList.add('placeholder');
        el.setAttribute('placeholder', nextSentence);
      }
      el.setAttribute('sspilot', nextSentence);
      if(window.innerWidth < 660) {
        const button = this.wrapper.querySelector('div .sspilot-button');
        button.style.display = 'inline-block';
      }   
    })
    .catch(err => {
      console.log(err)
    });
  }

  _getPreviousSentence(lineInputNum) {
    // lineInputNum: 가져올 문장의 최대 개수
    // 이전 블럭들의 문장을 가져오기
    let text = '';
    let blockIndex = this.api.blocks.getCurrentBlockIndex();
    while (blockIndex >= 0 && lineInputNum > 0) {
      const currentBlock = this.api.blocks.getBlockByIndex(blockIndex);
      if (currentBlock.name != 'image' && currentBlock.name != 'delimiter') {
        let blockText = currentBlock.holder.innerText;
        if (blockText) {
          // split 함수를 사용하면 구분자를 저장하지 못함
          let tmpText = blockText.replace(/&nbsp;/g, ' ');

          let matches = [];
          let lastIndex = 0;

          tmpText.replace(/([.!?]{1,})/g, (match, punctuationMark, index) => { // ... 같은 연속 separator 처리
            if (index > lastIndex) {
              matches.push({
                text: tmpText.substring(lastIndex, index).trim(),
                separator: punctuationMark
              });
            }
            lastIndex = index + match.length;
          });

          if (lastIndex < tmpText.length) {
            matches.push({
              text: tmpText.substring(lastIndex).trim(),
              separator: null
            });
          }

          let index = matches.length - 1;
          while (lineInputNum > 0 && index >= 0) {
            if (matches[index].text) {
              text = matches[index].text + (matches[index].separator ? matches[index].separator : '') + " " + text;
              lineInputNum--;
            }
            index--;
          }
        }
      }
      blockIndex--;
    }
    return text;
  }
  
  // block content를 저장
  save(blockContent) {
    const el = blockContent.querySelector('h5');
    return {
      text: (el ? el.innerHTML: '') || this.data.text || '',
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
      },
    };
  }

  // 두 블럭이 합쳐질 때 실행
  merge(data) {
    if (!this.wrapper || !data.text) {
      return;
    }
    this.data.text += data.text;
    this.wrapper.querySelector('h5').innerHTML += data.text;

    // // merge the tags if possible
    // mergeInlineTags(node);
  }

  static get pasteConfig() {
    return {
      tags: ['text'],
      patterns: {
        text: /[\s\S]*[\n\r]+[\s\S]*/
      }
    }
  }

  onPaste(event) {
    switch (event.type) {
      // html tag로 오는 경우 복사 처리
      // 빈 태그는 인식하지 못함
      case 'tag': {
        // * 은 모두 삭제, 노션의 볼드, 이태릭, 등등 모든 태깅 로직은 *로 통일되어서 처리됨. 구분이 안되는 관계로 전부 삭제
        const innerText = event.detail.data.innerHTML.replace(/\*/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');

        // deprecated since too many empty block creation via async block insertion
        // let slicedText = '';

        // if (innerText.length >= 4) {
        //   slicedText = innerText.slice(0,4);
        //   if (slicedText == '### ') {
        //     this.api.blocks.insert(
        //       'header',
        //       {
        //         text: innerText.slice(4),
        //         level: 3,
        //       },
        //       undefined,
        //       undefined,
        //       undefined,
        //       false,
        //     )
        //     return;
        //   }
        // }
        // if (innerText.length >= 3) {
        //   slicedText = innerText.slice(0,3);
        //   if (slicedText == '## ') {
        //     this.api.blocks.insert(
        //       'header',
        //       {
        //         text: innerText.slice(3),
        //         level: 2,
        //       },
        //       undefined,
        //       undefined,
        //       undefined,
        //       false,
        //     )
        //     return;
        //   }
        //   if (slicedText == '---') {
        //     this.api.blocks.insert(
        //       'delimiter',
        //       {
        //       },
        //       undefined,
        //       undefined,
        //       undefined,
        //       false,
        //     )
        //     return;
        //   }
        //   slicedText = innerText.split('.')[0]
        //   if (Number.isInteger(parseInt(slicedText))) {
        //     this.api.blocks.insert(
        //       'list',
        //       {
        //         text: innerText.slice(slicedText.length+1),
        //         isNumbered: true,
        //         index: parseInt(slicedText),
        //       },
        //       undefined,
        //       undefined,
        //       undefined,
        //       false,
        //     )
        //     return;
        //   }
        // }
        // if (innerText.length >= 2) {
        //   slicedText = innerText.slice(0,2);
        //   if (slicedText == '# ') {
        //     this.api.blocks.insert(
        //       'header',
        //       {
        //         text: innerText.slice(2),
        //         level: 1,
        //       },
        //       undefined,
        //       undefined,
        //       undefined,
        //       false,
        //     )
        //     return;
        //   }
        //   if (slicedText == '- ' || slicedText == '* ') {
        //     this.api.blocks.insert(
        //       'list',
        //       {
        //         text: innerText.slice(2),
        //         isNumbered: false,
        //         index: null,
        //       },
        //       undefined,
        //       undefined,
        //       undefined,
        //       false,
        //     )
        //     return;
        //   }
        //   if (slicedText == '> ') {
        //     if (innerText.length == 2) {
        //       return;
        //     }
            
        //     this.api.blocks.insert(
        //       'quote',
        //       {
        //         text: innerText.slice(2),
        //       },
        //       undefined,
        //       undefined,
        //       undefined,
        //       false,
        //     )
        //     return;
        //   }
        // }
        // if (innerText == '>') {
        //   return;
        // }

        // this.api.blocks.insert(
        //   'paragraph',
        //   {
        //     text: innerText,
        //   },
        //   undefined,
        //   undefined,
        //   undefined,
        //   false,
        // )
        
        // deprecated since the block creation above is async, plain text creation is async
        const placeholderText = this.api.i18n.t(this.config.placeholder || 'Text');
        const placeholderNoText = this.api.i18n.t(this.config.placeholderNoText || 'Text');
        this._createText(innerText, placeholderText, placeholderNoText);
        break;
      }
      // case 'pattern': {
      //   const placeholderText = this.api.i18n.t(this.config.placeholder || 'Text');
      //   const placeholderNoText = this.api.i18n.t(this.config.placeholderNoText || 'Text');
      //   this._createText(event.detail.data, placeholderText, placeholderNoText);
      //   console.log(event.detail.data)
      //   break;
      //   // 복붙시 블럭을 여러개 만들어야 되는데 한 블럭에 여러 개를 넣는 것 같음
      //   // editor.mjs 안의 onPaste에서 처리해야 할 것 같음
      //   // let currentData = event.detail.data;
      //   // while(currentData.includes('\n')) {
      //   //   const idx = currentData.indexOf('\n');
      //   //   console.log(idx)
          
      //   //   const text = currentData.slice(0, idx);
      //   //   console.log(text)
      //   //   const placeholderText = this.api.i18n.t(this.config.placeholder || 'Text');
      //   //   this._createText(text, placeholderText);
      //   //   currentData = currentData.slice(idx+1);
      //   // }
      // }
    }
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

export default Text;