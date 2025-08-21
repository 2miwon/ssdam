class ImageGenerator {
  constructor({ api }) {
    this.api = api;
  }

  render() {
    return {
      icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 relative" preserveAspectRatio="none"><path d="M19.9586 2.84766C20.4869 2.84766 20.915 3.26065 20.915 3.7697V12.1294H18.9864V4.70401H3.55697V17.6975L13.2003 8.4167L16.0934 11.2012V13.827L13.2003 11.042L6.28315 17.6984H13.2003V19.5548H2.58473C2.05651 19.5548 1.6283 19.1418 1.6283 18.6327V3.7697C1.6283 3.26047 2.06737 2.84766 2.58473 2.84766H19.9586ZM7.41432 6.56035C8.4795 6.56035 9.34299 7.39147 9.34299 8.4167C9.34299 9.44196 8.4795 10.2731 7.41432 10.2731C6.34914 10.2731 5.48564 9.44196 5.48564 8.4167C5.48564 7.39147 6.34914 6.56035 7.41432 6.56035Z" fill="#727272"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M20.5726 20.9561C20.5625 20.9258 20.5501 20.8949 20.5355 20.8629L18.5134 16.2966C18.3726 15.9817 18.1239 15.7911 17.7759 15.7911H17.7013C17.3532 15.7911 17.0963 15.9817 16.9554 16.2966L14.9333 20.8629C14.8919 20.9541 14.8587 21.0452 14.8587 21.1364C14.8587 21.2049 14.8697 21.2706 14.8901 21.3317C14.8696 21.2705 14.8586 21.2046 14.8586 21.1359C14.8586 21.0447 14.8917 20.9536 14.9332 20.8624L16.9553 16.2961C17.0961 15.9812 17.353 15.7906 17.7011 15.7906H17.7757C18.1238 15.7906 18.3724 15.9812 18.5133 16.2961L20.5354 20.8624C20.55 20.8945 20.5625 20.9256 20.5726 20.9561ZM16.2787 21.4402L16.6167 20.6469H18.8188L19.1396 21.3975L19.1405 21.3996C19.2867 21.7339 19.5659 21.9977 19.9967 21.9977C20.4876 21.9977 20.8668 21.6008 20.8668 21.1193C20.8668 20.9834 20.8261 20.8613 20.7773 20.7539L18.7553 16.1878C18.5788 15.7931 18.2445 15.5254 17.7757 15.5254H17.7011C17.2354 15.5254 16.8908 15.7909 16.7128 16.1887L14.6912 20.7539C14.6471 20.8509 14.5934 20.9853 14.5934 21.1359C14.5934 21.6089 14.9642 21.9977 15.447 21.9977C15.8248 21.9977 16.1318 21.7793 16.2787 21.4402ZM16.9142 19.2547L16.914 19.2552H18.5217L18.5215 19.2547H16.9142ZM18.1226 18.9895H17.3128L17.7177 18.0253L18.1226 18.9895ZM21.3942 21.0928V16.4685C21.3942 15.9657 21.7947 15.5652 22.2975 15.5652C22.8003 15.5652 23.2008 15.9657 23.2008 16.4685V21.0928C23.2008 21.5956 22.8003 21.9961 22.2975 21.9961C21.7947 21.9961 21.3942 21.5956 21.3942 21.0928ZM21.6594 16.4685V21.0928C21.6594 21.1646 21.6708 21.2333 21.692 21.2974C21.6709 21.2335 21.6596 21.1649 21.6596 21.0933V16.469C21.6596 16.1127 21.9413 15.8309 22.2977 15.8309C22.5823 15.8309 22.8193 16.0106 22.9032 16.2644C22.8194 16.0103 22.5823 15.8304 22.2975 15.8304C21.9412 15.8304 21.6594 16.1122 21.6594 16.4685Z" fill="#727272"></path></svg></div>',
      label: this.api.i18n.t('Generate image'),
      onActivate: () => {
        const inputModal = document.createElement('div');
        const isMobile = window.innerWidth < 660;

        const index = this.api.blocks.getCurrentBlockIndex();
        const block = this.api.blocks.getBlockByIndex(index);
        const text = block.holder.innerText;

        inputModal.classList.add('fixed', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2', 'flex', 'flex-col', 'h-[502px]', 'px-10', 'py-8', 'rounded-xl', 'z-30', 'bg-white');
        inputModal.style.width = isMobile ? '376px' : '638px';
        inputModal.style.boxShadow = '0px 0px 12.100000381469727px 0 rgba(107,107,107,0.25)';


        const inputModalContainer = document.createElement('div');
        inputModalContainer.classList.add('flex', 'flex-col', 'justify-start', 'items-start', 'self-stretch', 'flex-grow-0', 'flex-shrink-0', 'gap-8');

        // title

        const titleDiv1 = document.createElement('div');
        titleDiv1.classList.add('flex', 'flex-col', 'justify-center', 'items-start', 'self-stretch', 'flex-grow-0', 'flex-shrink-0', 'gap-4');

        const titleDiv2 = document.createElement('div');
        titleDiv2.classList.add('flex', 'justify-between', 'items-center', 'self-stretch', 'flex-grow-0', 'flex-shrink-0', 'relative');

        const title = document.createElement('p');
        title.classList.add('flex-grow-0', 'flex-shrink-0', 'text-xl', 'font-bold', 'text-left', 'text-[#1b1b1b]');
        title.innerText = 'AI 이미지 생성';

        const exitButton = document.createElement('div');
        exitButton.classList.add('cursor-pointer', 'rounded', 'hover:bg-[#f2f2f2]');
        exitButton.innerHTML = `
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
          preserveAspectRatio="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.1163 12L5.90144 6.78509L6.78532 5.9012L12.0002 11.1161L17.2151 5.9012L18.099 6.78509L12.8841 12L18.099 17.2149L17.2151 18.0988L12.0002 12.8839L6.78532 18.0988L5.90144 17.2149L11.1163 12Z"
            fill="#636C78"
            stroke="#636C78"
            stroke-width="0.5">
          </path>
        </svg>`
        exitButton.addEventListener('click', () => {
          inputModal.remove();
        });

        titleDiv2.appendChild(title);
        titleDiv2.appendChild(exitButton);
        titleDiv1.appendChild(titleDiv2);
        inputModalContainer.appendChild(titleDiv1);


        // block Content & input form
        const blockContentForm = document.createElement('div');
        blockContentForm.classList.add('flex', 'flex-col', 'justify-start', 'items-start', 'self-stretch', 'flex-grow-0', 'flex-shrink-0', 'gap-[26px]');

        const blockContentShowDiv = document.createElement('div');
        blockContentShowDiv.classList.add('flex', 'flex-col');
        blockContentShowDiv.innerHTML = `
        <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 bg-white">
          <p class="flex-grow-0 flex-shrink-0 text-xs font-bold text-left text-[#474747]">
            선택한 문단 내용
          </p>
          <div class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[105px] relative overflow-y-auto gap-4 pl-5 pr-6 py-4 rounded-md border border-[#f2f2f2]">
            <p class="self-stretch flex-grow-0 flex-shrink-0 w-[514px] text-xs text-left text-[#474747]">
              ${text}
            </p>
          </div>
        </div>`;

        // 이미지 설명 입력에 대한 가이드
        const inputDiv = document.createElement('div');
        inputDiv.classList.add('flex', 'flex-col', 'justify-start', 'items-start', 'self-stretch', 'flex-grow-0', 'flex-shrink-0', 'gap-1');
        
        const inputExplanation = document.createElement('div');
        inputExplanation.classList.add('flex', 'justify-between', 'items-center', 'self-stretch', 'flex-grow-0', 'flex-shrink-0', 'relative', 'px-2');
        inputExplanation.innerHTML = `
        <p class="flex-grow-0 flex-shrink-0 text-xs font-bold text-left text-[#474747]">
          원하는 이미지에 대한 설명을 입력해주세요
        </p>
        <p class="flex-grow-0 flex-shrink-0 text-xs text-left text-[#b3b7bc]">
          *이미지는 선택한 문단 위에 생성됩니다
        </p>`;

        // 입력란 textarea 감싸는 div
        const inputForm = document.createElement('div');
        inputForm.classList.add('flex', 'flex-col', 'h-[105px]', 'justify-start', 'items-start', 'self-stretch', 'flex-grow-0', 'flex-shrink-0', 'gap-4', 'px-5', 'py-4', 'rounded-md', 'bg-[#fafbfc]', 'border', 'border-[#f2f2f2]');
        
        const textArea = document.createElement('textarea');
        textArea.classList.add('self-stretch', 'flex-grow-0', 'flex-shrink-0', 'w-[518px]', 'rounded-md', 'bg-[#fafbfc]', 'text-[13px]', 'text-[#474747]', 'resize-none', 'focus:outline-none');
        textArea.placeholder = '이미지에 대한 설명을 입력해주세요.';
        inputForm.appendChild(textArea);

        inputDiv.appendChild(inputExplanation);
        inputDiv.appendChild(inputForm);

        blockContentForm.appendChild(blockContentShowDiv);
        blockContentForm.appendChild(inputDiv);

        inputModalContainer.appendChild(blockContentForm);

        // saver button
        let additionalInfo = ''

        const saverButton = document.createElement('div');
        saverButton.classList.add('flex', 'justify-center', 'items-center', 'self-stretch', 'flex-grow-0', 'flex-shrink-0', 'h-[52px]', 'relative', 'gap-2.5', 'p-2.5', 'rounded-lg', 'bg-[#5743d0]', 'cursor-pointer', 'hover:bg-[#6146ff]');
        saverButton.innerHTML = `<p class="flex-grow-0 flex-shrink-0 text-sm font-bold text-left text-white">생성하기</p>`
        saverButton.addEventListener('click', () => {
          additionalInfo = textArea.value;
          // api call for image generation
          inputModal.remove();
          this.api.blocks.insert(
            'image',
            {
              caption: '쓰담에서 생성된 이미지',
              isUploading: true,
              userPrompt: additionalInfo,
              excerpt: text,
            },
            undefined,
            index,
            undefined,
            false,
          )
        });
        inputModalContainer.appendChild(saverButton);

        inputModal.appendChild(inputModalContainer);

        const outerModal = document.createElement('div');
        outerModal.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'z-10');
        outerModal.addEventListener('click', () => {
          outerModal.remove();
          inputModal.remove();
        });

        const ssdamEditor = document.querySelector('.ssdam-editor');
        ssdamEditor.appendChild(inputModal);
        ssdamEditor.appendChild(outerModal);
      }
    };
  }

  static get isTune() {
    return true;
  }
}

export default ImageGenerator;