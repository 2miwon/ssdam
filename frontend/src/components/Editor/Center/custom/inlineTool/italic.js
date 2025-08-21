class Italic {
  static get isInline() {
    return true;
  }

  constructor({api}) {
    this.api = api;
		this.button = null;
		this.tag = 'I';
		this.class = 'ssdam-italic';
		this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    }
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
		this.button.innerHTML = '<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M15 20.5H7V18.5H9.92661L12.0425 6.5H9V4.5H17V6.5H14.0734L11.9575 18.5H15V20.5Z" fill="#727272" stroke="none"></path></svg>';
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
    return 'CMD+I';
  }
}

export default Italic;