class Convert {
  constructor({ api }) {
    this.api = api;
  }

  render() {
    return {
      icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M6.54545 4H20.1818C20.6839 4 21.0909 4.44772 21.0909 5V12H19.2727V6H6.54545V9L2 5L6.54545 1V4ZM17.4545 20H3.81818C3.31611 20 2.90909 19.5523 2.90909 19V12H4.72727V18H17.4545V15L22 19L17.4545 23V20Z" fill="#727272"></path></svg></div>',
      label: this.api.i18n.t('Convert to'),
      closeOnActivate: true,
      children: {
        items: [
          {
            title: this.api.i18n.t('Text'),
            icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M13 6V21H11V6H5V4H19V6H13Z" fill="#727272"></path></svg></div>',
            closeOnActivate: true,
            // isDisabled: () => {
            //   const o = this.api.blocks.getCurrentBlockIndex(),
            //   i = this.api.blocks.getBlockByIndex(o);
            //   console.log(i.type);
            //   return i.type === 'text';
            // },
            onActivate: () => {
              const o = this.api.blocks.getCurrentBlockIndex(),
              i = this.api.blocks.getBlockByIndex(o);
              this.api.blocks.convert(i.id, 'paragraph');
            }
          },
          {
            title: this.api.i18n.t('Header1'),
            icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M13 20H11V13H4V20H2V4H4V11H11V4H13V20ZM21.0005 8V20H19.0005L19 10.204L17 10.74V8.67L19.5005 8H21.0005Z" fill="#727272" stroke="none"></path></svg></div>',
            data: {
              level: 1,
            },
            closeOnActivate: true, 
            // isDisabled: () => {
            //   const o = this.api.blocks.getCurrentBlockIndex(),
            //   i = this.api.blocks.getBlockByIndex(o);
            //   return i.type === 'header' && i.data.level === 1;
            // },
            onActivate: () => {
              const o = this.api.blocks.getCurrentBlockIndex(),
              i = this.api.blocks.getBlockByIndex(o);
              this.api.blocks.convert(i.id, 'header', { level: 1 });
            }
          },
          {
            title: this.api.i18n.t('Header2'),
            icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 8C20.5711 8 22.25 9.67893 22.25 11.75C22.25 12.6074 21.9623 13.3976 21.4781 14.0292L21.3302 14.2102L18.0343 18H22V20H15L14.9993 18.444L19.8207 12.8981C20.0881 12.5908 20.25 12.1893 20.25 11.75C20.25 10.7835 19.4665 10 18.5 10C17.5818 10 16.8288 10.7071 16.7558 11.6065L16.75 11.75H14.75C14.75 9.67893 16.4289 8 18.5 8Z" fill="#727272"></path></svg></div>',
            data: {
              level: 2,
            },
            closeOnActivate: true, 
            // isDisabled: () => {
            //   const o = this.api.blocks.getCurrentBlockIndex(),
            //   i = this.api.blocks.getBlockByIndex(o);
            //   return i.type === 'header' && i.data.level === 2;
            // },
            onActivate: () => {
              const o = this.api.blocks.getCurrentBlockIndex(),
              i = this.api.blocks.getBlockByIndex(o);
              this.api.blocks.convert(i.id, 'header', { level: 2 });
            }
          },
          {
            title: this.api.i18n.t('Header3'),
            icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M22 8L21.9984 10L19.4934 12.883C21.0823 13.3184 22.25 14.7728 22.25 16.5C22.25 18.5711 20.5711 20.25 18.5 20.25C16.674 20.25 15.1528 18.9449 14.8184 17.2166L16.7821 16.8352C16.9384 17.6413 17.6481 18.25 18.5 18.25C19.4665 18.25 20.25 17.4665 20.25 16.5C20.25 15.5335 19.4665 14.75 18.5 14.75C18.214 14.75 17.944 14.8186 17.7056 14.9403L16.3992 13.3932L19.3484 10H15V8H22ZM4 4V11H11V4H13V20H11V13H4V20H2V4H4Z" fill="#727272"></path></svg></div>',
            data: {
              level: 3,
            },
            closeOnActivate: true,
            // isDisabled: () => {
            //   const o = this.api.blocks.getCurrentBlockIndex(),
            //   i = this.api.blocks.getBlockByIndex(o);
            //   return i.type === 'header' && i.data.level === 2;
            // },
            onActivate: () => {
              const o = this.api.blocks.getCurrentBlockIndex(),
              i = this.api.blocks.getBlockByIndex(o);
              this.api.blocks.convert(i.id, 'header', { level: 3 });
            }
          },
          {
            title: this.api.i18n.t('List'),
            icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M8 4H21V6H8V4ZM3 3.5H6V6.5H3V3.5ZM3 10.5H6V13.5H3V10.5ZM3 17.5H6V20.5H3V17.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" fill="#727272"></path></svg></div>',
            closeOnActivate: true,
            // isDisabled: () => {
            //   const o = this.api.blocks.getCurrentBlockIndex(),
            //   i = this.api.blocks.getBlockByIndex(o);
            //   return i.type === 'quote';
            // },
            onActivate: () => {
              const o = this.api.blocks.getCurrentBlockIndex(),
              i = this.api.blocks.getBlockByIndex(o);
              this.api.blocks.convert(i.id, 'list', { isNumbered: false, index: null });
            }
          },
          {
            title: this.api.i18n.t('NumberedList'),
            icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M8 4H21V6H8V4ZM5 3V6H6V7H3V6H4V4H3V3H5ZM3 14V11.5H5V11H3V10H6V12.5H4V13H6V14H3ZM5 19.5H3V18.5H5V18H3V17H6V21H3V20H5V19.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" fill="#727272"></path></svg></div>',
            closeOnActivate: true,
            // isDisabled: () => {
            //   const o = this.api.blocks.getCurrentBlockIndex(),
            //   i = this.api.blocks.getBlockByIndex(o);
            //   return i.type === 'quote';
            // },
            onActivate: () => {
              const o = this.api.blocks.getCurrentBlockIndex(),
              i = this.api.blocks.getBlockByIndex(o);
              this.api.blocks.convert(i.id, 'list', { isNumbered: true, index: 1 });
            }
          },
          {
            title: this.api.i18n.t('Quote'),
            icon: '<div class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5 rounded-lg border border-[#f2f2f2]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M4.58341 17.321C3.55316 16.2273 3 14.9999 3 13.0102C3 9.5108 5.45651 6.3736 9.03059 4.82312L9.92328 6.20073C6.58804 8.00533 5.93618 10.3459 5.67564 11.8219C6.21263 11.5442 6.91558 11.4465 7.60471 11.5104C9.40908 11.6777 10.8312 13.1589 10.8312 14.9999C10.8312 16.9329 9.26416 18.4999 7.33116 18.4999C6.2581 18.4999 5.23196 18.0094 4.58341 17.321ZM14.5834 17.321C13.5532 16.2273 13 14.9999 13 13.0102C13 9.5108 15.4565 6.3736 19.0306 4.82312L19.9233 6.20073C16.588 8.00533 15.9362 10.3459 15.6756 11.8219C16.2126 11.5442 16.9156 11.4465 17.6047 11.5104C19.4091 11.6777 20.8312 13.1589 20.8312 14.9999C20.8312 16.9329 19.2642 18.4999 17.3312 18.4999C16.2581 18.4999 15.232 18.0094 14.5834 17.321Z" fill="#727272"></path></svg>',
            closeOnActivate: true,
            // isDisabled: () => {
            //   const o = this.api.blocks.getCurrentBlockIndex(),
            //   i = this.api.blocks.getBlockByIndex(o);
            //   return i.type === 'quote';
            // },
            onActivate: () => {
              const o = this.api.blocks.getCurrentBlockIndex(),
              i = this.api.blocks.getBlockByIndex(o);
              this.api.blocks.convert(i.id, 'quote');
            }
          },
        ]
      }
    };
  }

  static get isTune() {
    return true;
  }
}

export default Convert;