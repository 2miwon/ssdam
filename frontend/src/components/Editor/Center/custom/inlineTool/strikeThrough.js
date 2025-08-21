class StrikeThrough {
  static get isInline() {
    return true;
  }

  constructor({api}) {
    this.api = api;
		this.button = null;
		this.tag = 'STRIKE';
		this.class = 'ssdam-strikethrough';
		this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    }
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
		this.button.innerHTML = '<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-grow-0 flex-shrink-0 w-6 h-6 relative" preserveAspectRatio="none"><path d="M17.1538 14.5C17.3846 15.0161 17.5 15.5893 17.5 16.2196C17.5 17.5625 16.9762 18.6116 15.9286 19.367C14.8809 20.1223 13.4335 20.5 11.5862 20.5C9.94674 20.5 8.32335 20.1185 6.71592 19.3555V17.1009C8.23538 17.9783 9.7908 18.417 11.3822 18.417C13.9333 18.417 15.2128 17.6846 15.2208 16.2196C15.2208 15.5939 15.0049 15.0598 14.5731 14.6173C14.5339 14.5772 14.4939 14.5381 14.4531 14.5H3V12.5H21V14.5H17.1538ZM13.076 11.5H7.62908C7.4566 11.3433 7.29616 11.1692 7.14776 10.9778C6.71592 10.4208 6.5 9.74559 6.5 8.95207C6.5 7.71602 6.96583 6.665 7.89749 5.799C8.82916 4.93299 10.2706 4.5 12.2219 4.5C13.6934 4.5 15.1009 4.82808 16.4444 5.48426V7.63591C15.2448 6.94921 13.9293 6.60587 12.4978 6.60587C10.0187 6.60587 8.77917 7.38793 8.77917 8.95207C8.77917 9.37172 8.99709 9.73796 9.43293 10.0508C9.86878 10.3636 10.4066 10.6135 11.0463 10.8004C11.6665 10.9816 12.3431 11.2148 13.076 11.5Z" fill="#727272"></path></svg>';
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
    return 'CMD+SHIFT+X';
  }
}

export default StrikeThrough;