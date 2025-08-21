class InlineComment {
  static get isInline() {
    return true;
  }

  constructor({api}) {
    this.api = api;
		this.button = null;
		this.tag = 'COMMENT';
		this.class = 'ssdam-comment';
		this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    }
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
		this.button.innerHTML = '<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M6.45455 19.5L2 23V4.5C2 3.94772 2.44772 3.5 3 3.5H21C21.5523 3.5 22 3.94772 22 4.5V18.5C22 19.0523 21.5523 19.5 21 19.5H6.45455ZM5.76282 17.5H20V5.5H4V18.8851L5.76282 17.5ZM11 10.5H13V12.5H11V10.5ZM7 10.5H9V12.5H7V10.5ZM15 10.5H17V12.5H15V10.5Z" fill="#727272"></path></svg>';
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
    return 'CMD+SHIFT+M';
  }
}

export default InlineComment;