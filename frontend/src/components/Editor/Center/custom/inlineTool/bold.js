class Bold {
  static get isInline() {
    return true;
  }

  constructor({api}) {
    this.api = api;
		this.button = null;
		this.tag = 'B';
		this.class = 'ssdam-bold';
		this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    }
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
		this.button.innerHTML = '<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"> <path d="M8 11.5H12.5C13.8807 11.5 15 10.3807 15 9C15 7.61929 13.8807 6.5 12.5 6.5H8V11.5ZM18 16C18 18.4853 15.9853 20.5 13.5 20.5H6V4.5H12.5C14.9853 4.5 17 6.51472 17 9C17 10.2043 16.5269 11.2981 15.7564 12.1058C17.0979 12.8847 18 14.337 18 16ZM8 13.5V18.5H13.5C14.8807 18.5 16 17.3807 16 16C16 14.6193 14.8807 13.5 13.5 13.5H8Z" fill="#727272"></path></svg>';
		this.button.classList.add(this.api.styles.inlineToolButton);
    return this.button;
  }

  surround(range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag(this.tag, this.class);

    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

	wrap(range) {
    const obj = document.createElement(this.tag);
    obj.classList.add(this.class);

    obj.appendChild(range.extractContents());
    range.insertNode(obj);

    this.api.selection.expandToTag(obj);
	}

  unwrap(termWrapper) {
    // 현재 드래그된 레인지가 포함하는 태그를 선택 => 개선 대상?
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    if (!sel) {
      return;
    }

    let range1 = sel.getRangeAt(0);
    if (!range1) {
      return;
    }

    let range = sel.getRangeAt(0);
    if (!range) {
      return;
    }

    let unwrappedContent = range.extractContents();
    if (!unwrappedContent) {
      return;
    }

    // 여기가 이상함
    termWrapper.parentNode.removeChild(termWrapper);
    
    range.insertNode(unwrappedContent);

    sel.removeAllRanges
    sel.addRange(range);
  }


  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, this.class);
    this.button.classList.toggle(this.iconClasses.active, !!termTag);
    return !!termTag;
  }

  static get sanitize() {
    return {
      mark: {
        class: this.class,
      },
    }
  }

  static get shortcut() {
    return 'CMD+B';
  }
}

export default Bold;