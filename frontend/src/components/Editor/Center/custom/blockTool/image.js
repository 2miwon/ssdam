import store from '@/store/index.js'
import { gtag } from '@/main.js';

class Image {
  // block 메뉴에 표시될 아이콘과 이름
  static get toolbox() {
    return {
      title: 'Image',
      icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V18.999L14 9L17 12V14.829L14 11.8284L6.827 19H14V21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z" fill="#727272"></path></svg></div>',
    }
  }

  // 생성자 { data, api, config, readOnly, block }
  constructor({ data, api, config, wrapper }) {
    this.data = data;
    this.api = api;
    this.config = config || {};
    this.wrapper = wrapper;
  }

  // block이 생성될 때 block의 data를 받아와서 block content를 생성
  render() {

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('ssdam-image', 'flex', 'flex-col', 'justify-center', 'items-center');

    if (this.data) {
      const urlPattern = /https?:\/\/\S+\.(png|jpe?g)/i;
      if(urlPattern.test(this.data.src)) {
        this._createImage(this.data.src, this.data.caption, this.data.s3ImageKey, this.data.width);
        return this.wrapper;
      }
      if (this.data.s3ImageKey) {
        const key = this.data.s3ImageKey;
        if (this.data.src) {
          // 이미지 src가 있으면 이미지 파일을 호출 없이 불러옴
          // _createImage에 key를 보낼 때 const에 넣어서 해야 작동함
          // 이유는 지옥에서 알아보자
          this._createImage(this.data.src, this.data.caption, key, this.data.width);
          return this.wrapper;
        }
        if (store.getters.getImageByKey(key)) {
          this.data.src = store.getters.getImageByKey(key);
          this._createImage(this.data.src, this.data.caption, key, this.data.width);
          return this.wrapper;
        }
        const url = "https://d2t55cwcw1wtgw.cloudfront.net/" + key;
        this._createImage(url, this.data.caption, key, this.data.width);
        return this.wrapper;

        // store.dispatch('getImageFile', { key: key })
        // .then((response) => {
        //   store.commit('SET_IMAGE_KEY_VALUE', { key: key, value: response });
        //   this._createImage(response, this.data.caption, this.data.s3ImageKey, this.data.width);
        //   return this.wrapper;
        // })
        // .catch((error) => {
        //   console.error(error);
        // });
      }
    }

    if(this.data.isUploading) {
      gtag.event('image-generated', {})
      store.dispatch('generateIllustration', {
        userPrompt: this.data.userPrompt,
        excerpt: this.data.excerpt
      }).then((response) => {
        this.data.isUploading = false;
        this.data.s3ImageKey = response;
        // SynonymProgressSpinner.remove();
        const url = "https://d2t55cwcw1wtgw.cloudfront.net/" + this.data.s3ImageKey;
        this._createImage(url, this.data.caption, this.data.s3ImageKey);

      }).catch((error) => {
        this.data.isUploading = false;
        this.wrapper.innerHTML = '';
        console.error(error);        
      })

      const SynonymProgressSpinner = document.createElement('div');
      SynonymProgressSpinner.classList.add('ssdam-synonym-progress-spinner', 'flex', 'flex-col', 'justify-center', 'items-center');
  
      SynonymProgressSpinner.innerHTML = `
      <img src="/assets/progress.gif" alt="Loading..." class="w-[100px] h-[100px] justify-center items-center">
      <p class="w-[270px] text-sm font-semibold text-center text-[#474747]">
        이미지 생성 중
      </p>
      <p class="w-[120px] text-sm font-semibold text-center text-[#474747]">
        예상 소요시간: 10초
      </p>`;
      this.wrapper.appendChild(SynonymProgressSpinner);

      return this.wrapper;
    }

    const inputDiv = document.createElement('div');
    inputDiv.classList.add('flex', 'w-full', 'h-[50px]', 'bg-[#f2f2f2]', 'border', 'border-[#f2f2f2]', 'justify-center', 'items-center', 'gap-2.5', 'p-2.5', 'hover:bg-gray-200', 'cursor-pointer');

    // Create an SVG element
    const svgNamespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNamespace, 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('xmlns', svgNamespace);
    svg.classList.add('flex-grow-0', 'flex-shrink-0', 'w-6', 'h-6', 'relative',);
    svg.setAttribute('preserveAspectRatio', 'none');

    // Create a path element for the SVG
    const path = document.createElementNS(svgNamespace, 'path');
    path.setAttribute('d', 'M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V18.999L14 9L17 12V14.829L14 11.8284L6.827 19H14V21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z');
    path.setAttribute('fill', '#727272');
    path.style.stroke = 'none';

    // Append the path to the SVG
    svg.appendChild(path);

    // Append the SVG to the wrapper
    inputDiv.appendChild(svg);

    // Create a paragraph element for the description
    const description = document.createElement('p');
    description.classList.add('text-[15px]', 'font-semibold', 'text-center', 'text-[#727272]');
    description.innerHTML = this.api.i18n.t(this.config.uploadPlaceholder || 'File Upload');
    inputDiv.appendChild(description);

    inputDiv.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!this._validateFile(file)) {
          return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const s3ImageKey = await store.dispatch('uploadImageFile', { file: formData });
        const url = "https://d2t55cwcw1wtgw.cloudfront.net/" + s3ImageKey;

        const reader = new FileReader();
        reader.onload = () => {
          this._createImage(url, '', s3ImageKey, this.data.width);
        }
        reader.readAsDataURL(file);
      }
      input.click();
    });

    this.wrapper.appendChild(inputDiv);
    return this.wrapper;
  }

  _validateFile(file){
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      store.commit('SET_ERROR_MESSAGE', "JPG, JPEG, PNG 형식의 이미지만 업로드 가능합니다.")
      store.commit('SET_SHOW_ERROR_MODAL', true)
      return false;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      store.commit('SET_ERROR_MESSAGE', "이미지 크기가 허용된 범위를 벗어났습니다")
      store.commit('SET_SHOW_ERROR_MODAL', true)
      return false;
    }
    return true;
  }

  _createImage(src, captionText, key, width) {
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('inline-block', 'relative', 'w-fit-content', 'items-center', 'justify-center', 'group')

    const image = document.createElement('img');
    image.src = src;
    image.dataset.key = key;
    image.setAttribute('crossorigin', 'anonymous');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper', 'flex', 'flex-col', 'justify-center', 'items-center', 'display-none');
    
    image.addEventListener('load', () => {
      // 이미지의 크기가 저장되어 있거나, 이미지의 기본 너비를 선택
      image.style.width = (width || image.naturalWidth);

      // 이미지 wrapper가 최대 너비를 설정해 에디터 영역을 초과하지 않도록 함
      // 이미지 자체는 style이 리사이징에 의해 변동된 최대값을 항상 저장
      imageWrapper.style.maxWidth = this.wrapper.offsetWidth + 'px';
    });

    image.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });

    window.addEventListener('resize', () => {
      imageWrapper.style.maxWidth = this.wrapper.offsetWidth + 'px';
    });

    const imageResizerLeft = document.createElement('div');
    // 리사이징 바의 크기는 50% 이고 중간에 위치하도록 37.5%로 설정
    imageResizerLeft.classList.add('absolute', 'top-[37.5%]', 'bottom-0', 'w-[8px]', 'h-[25%]', 'cursor-col-resize', 'left-[5px]', 'rounded-lg', 'group-hover:bg-[#727272]', 'group-hover:border', 'group-hover:border-white');

    const imageResizerRight = document.createElement('div');
    imageResizerRight.classList.add('absolute', 'top-[37.5%]', 'bottom-0', 'w-[8px]', 'h-[25%]', 'cursor-col-resize', 'right-[5px]', 'rounded-lg', 'group-hover:bg-[#727272]', 'group-hover:border', 'group-hover:border-white');

    let initialWidth = 0;
    let initialX = 0;

    imageResizerLeft.addEventListener('mousedown', (event) => {
      event.preventDefault();
      initialWidth = image.width;
      initialX = event.clientX;

      function resizeImage(event) {
        const deltaX = event.clientX - initialX;
        // 최소 너비를 100px로 설정, 리사이징바가 보이긴 해야되니까
        image.style.width = Math.max(initialWidth - deltaX, 100) + 'px';
      }

      window.addEventListener('mousemove', resizeImage);


      // 리사이징바에서 마우스를 떼는 순간 사이즈 저장
      // arrow function을 사용하면 removeEventListener에서 함수를 찾지 못함
      // bind(this)를 사용하여 this를 전달
      window.addEventListener('mouseup', function stopResizeImage() {
        this.data.width = image.style.width;
        window.removeEventListener('mousemove', resizeImage);
        window.removeEventListener('mouseup', stopResizeImage);
      }.bind(this)); 
    });

    imageResizerRight.addEventListener('mousedown', (event) => {
      event.preventDefault();
      initialWidth = image.width;
      initialX = event.clientX;

      function resizeImage(event) {
        const deltaX = event.clientX - initialX;
        image.style.width = Math.max(initialWidth + deltaX, 100) + 'px';
      }

      window.addEventListener('mousemove', resizeImage);

      window.addEventListener('mouseup', function stopResizeImage() {
        this.data.width = image.style.width;
        window.removeEventListener('mousemove', resizeImage);
        window.removeEventListener('mouseup', stopResizeImage);
      }.bind(this));
    });

    imageDiv.appendChild(image)
    imageDiv.appendChild(imageResizerLeft);
    imageDiv.appendChild(imageResizerRight);

    const captionWrapper = document.createElement('div');
    captionWrapper.style.cursor = 'text';
    captionWrapper.addEventListener('click', () => {
      caption.focus();
    });
    captionWrapper.classList.add('caption-wrapper', 'flex', 'justify-start', 'items-center', 'w-full', 'border-[#efefef]');

    const caption = document.createElement('p');
    caption.classList.add('block', 'text-col', 'text-[15px]', 'text-start', 'font-medium', 'text-[#888]', 'ml-2.5');
    caption.contentEditable = true;
    caption.innerHTML = captionText || '';
    caption.style.wordBreak = 'break-word';
    caption.classList.add('outline-none');
    const placeholderText = this.api.i18n.t(this.config.captionPlaceholder || 'Caption');
    caption.setAttribute('placeholder', placeholderText);

    const updatePlaceholder = () => {
      if (caption.innerHTML === '') {
        caption.classList.add('placeholder');
      }
      else {
        caption.classList.remove('placeholder');
      }
    };

    updatePlaceholder();

    caption.addEventListener('input', updatePlaceholder);

    captionWrapper.appendChild(caption);
    imageWrapper.appendChild(imageDiv);
    imageWrapper.appendChild(captionWrapper);

    // delete the button made on render()
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(imageWrapper);
  }

  // block content를 저장
  save(blockContent) {
    const image = blockContent.querySelector('img');
    const caption = blockContent.querySelector('[contenteditable]');

    return {
      src: image ? image.src : (this.data.src || ''),
      caption: caption ? caption.innerHTML : (this.data.caption || ''),
      s3ImageKey: image ? (image.dataset ? image.dataset.key : (this.data.s3ImageKey || '')) : (this.data.s3ImageKey || ''),
      width: image&&image.style.width ? image.style.width : (this.data.width || ''),
      isUploading: false,
      // image의 style.width가 CSS property undefined로 뜨는 경우가 있는 것 같음. 이 경우 this.data.width 사용
    };
  }

  validate(savedData) {
    if (!savedData.src || !savedData.src.trim()) {
      return true;
      // return false;
    }
    return true;
  }

  // 정의한 tag 외에 거르기
  static get sanitize() {
    return {
      src: false,
      caption: {
        mark: true,
        b: true,
        i: true,
        u: true,
        strike: true,
        comment: true,
      },
      s3ImageKey: true,
    };
  }
  
  static get pasteConfig() {
    return {
      tags: ['img'],
      files: {
        mimeTypes: ['image/*'],
        extensions: ['png', 'jpeg', 'jpg']
      },
      patterns: {
        image: /https?:\/\/\S+\.(png|jpe?g)/i,
      }
    }
  }

  async onPaste(event) {
    if (store.getters.noImagePaste) {
      store.commit('SET_NO_IMAGE_PASTE', false);
      this.api.blocks.delete(this.api.blocks.getCurrentBlockIndex() - store.getters.indexDiff);
      return;
    }
    switch (event.type) {
      // 이미지 html tag -> 노션에서 이미지를 드래그해서 복사하면 발생, 그 외 상황은 잘 모르겠음, 처리하기 힘듦
      case 'tag': {
        const img = event.detail.data;
        this._createImage(img.src, '');
        break;
      }
      // 이미지 파일 복사 붙여넣기
      case 'file': {
        const file = event.detail.file;
        const formData = new FormData();
        formData.append('file', file);

        const s3ImageKey = await store.dispatch('uploadImageFile', { file: formData });
        const url = "https://d2t55cwcw1wtgw.cloudfront.net/" + s3ImageKey;

        const reader = new FileReader();

        reader.onload = () => {
          this._createImage(url, this.data.caption, s3ImageKey);
        }
        reader.readAsDataURL(file);
        break;
      }
      // 이미지 주소 복사 붙여넣기
      case 'pattern': {
        const src = event.detail.data;
        this._createImage(src, '', '');
        break;
      }
    }
  }

  static get isReadOnlySupported() {
    return true;
  }
}

export default Image;

