class Marker{
  static get isInline() {
    return true;
  }

  constructor({api}) {
    this.api = api;
    this.button = null;
    this.tag = 'MARK';
    this.class = 'ssdam-marker';
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    }
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = '<svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0" preserveAspectRatio="xMidYMid meet"><circle cx="14" cy="14.5" r="13.5" fill="lemonchiffon" stroke="#F2F2F2"></circle></svg>';
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
    return 'CMD+M';
  }
}

export default Marker;