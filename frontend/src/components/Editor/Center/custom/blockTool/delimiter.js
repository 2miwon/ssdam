class Delimiter {
  // block 메뉴에 표시될 아이콘과 이름
  static get toolbox() {
    return {
      title: 'Delimiter',
      icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M2 11H4V13H2V11ZM6 11H18V13H6V11ZM20 11H22V13H20V11Z" fill="#727272"></path></svg>',
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
    const el = document.createElement('div');
    el.classList.add('ssdam-delimiter');

    el.innerHTML = `
      <svg
        width="1218"
        height="1"
        viewBox="0 0 1218 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="flex-grow-0 flex-shrink-0 h-full w-full relative mt-4 mb-4"
        preserveAspectRatio="xMidYMid meet">
        <line x1="0.666992" y1="0.5" x2="1217.67" y2="0.5" stroke="#CECECE" stroke-width="5"></line>
      </svg>`;

    this.wrapper.appendChild(el);
    return this.wrapper;
  }

  // block content를 저장
  save() {
    return {
    };
  }

  // // 정의한 tag 외에 거르기
  // static get sanitize() {
  //   return {
  //     text: {
  //       mark: true,
  //       b: true,
  //       i: true,
  //       u: true,
  //       strike: true,
  //       comment: true,
  //     }
  //   };
  // }

  static get isReadOnlySupported() {
    return true;
  }
}

export default Delimiter;

