class Table {
  // block 메뉴에 표시될 아이콘과 이름
  static get toolbox() {
    return {
      title: 'Table',
      icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M3 3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3H3ZM8 5V8H4V5H8ZM4 14V10H8V14H4ZM4 16H8V19H4V16ZM10 16H20V19H10V16ZM20 14H10V10H20V14ZM20 5V8H10V5H20Z" fill="#727272"></path></svg></div>',
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
    const el = document.createElement('h5');

    el.contentEditable = true;
    el.innerHTML = this.data && this.data.text ? this.data.text : '';
    el.classList.add('outline-none');
    el.placeholder = this.api.i18n.t(this.config.placeholder || 'Table');

    this.wrapper.appendChild(el);
    return this.wrapper;
  }

  // block content를 저장
  save(blockContent) {
    return {
      text: blockContent.querySelector('h5').innerHTML || this.data.text || '',
      level: this.data.level,
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
  
  static get isReadOnlySupported() {
    return true;
  }
}

export default Table;

