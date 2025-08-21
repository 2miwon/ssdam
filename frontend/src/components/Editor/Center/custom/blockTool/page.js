class Page {
  // block 메뉴에 표시될 아이콘과 이름
  static get toolbox() {
    return {
      title: 'Page',
      icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM16 11V13H8V11H16Z" fill="#727272"></path><path d="M16 17V15H8V17H16Z" fill="#727272"></path></svg></div>',
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
    el.placeholder = this.api.i18n.t(this.config.placeholder || 'Page');

    this.wrapper.appendChild(el);
    return this.wrapper;
  }

  // block content를 저장
  save(blockContent) {
    return {
      text: blockContent.querySelector('h5').innerHTML || this.data.text || this.data.text || '',
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

export default Page;

