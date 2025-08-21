function getTextNodePosition(node) {
  let len = 0;
  node.childNodes.forEach(node => {
    if (node.nodeType == 3) { // nodeType 3 is a text node
      len += node.length;
    }
    else if(node.nodeType == 1) { // nodeType 1 is an element node   
      len += this.getTextNodePosition(node);
    }
  })
  return len;
}

function setTextNodePosition(node, len) {
  for(let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (child.nodeType == 3) { // nodeType 3 is a text node
      if (child.length > len) {
        const range = document.createRange();
        range.setStart(child, len);
        range.collapse(true);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        return -1;
      }
      len -= child.length;
    }
    else if(node.nodeType == 1) { // nodeType 1 is an element node
      len = this.setTextNodePosition(child, len);
      if (len == -1) return -1;
    }
  }
  return len;
}

function mergeInlineTags(node) {
  node.childNodes.forEach(node => {
    if (node.nodeType == 1) { // nodeType 1 is an element node
      while (node.nextSibling && node.nextSibling.nodeType == 1 && node.tagName == node.nextSibling.tagName) {
        node.innerHTML += node.nextSibling.innerHTML;
        node.nextSibling.remove();
      }
      this.mergeInlineTags(node);
    }
  })
}

function makeFragment(htmlString) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString.trim();
  const fragment = document.createDocumentFragment();
  fragment.append(...Array.from(tempDiv.childNodes));
  return fragment;
}

function isCaretAtEnd(element) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(element);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  const caretPosition = preCaretRange.toString().length;

  function getTextContent(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    return Array.from(node.childNodes).map(getTextContent).join('');
  }

  const totalLength = getTextContent(element).length;

  return caretPosition === totalLength;
}


export { getTextNodePosition, setTextNodePosition, mergeInlineTags, makeFragment, isCaretAtEnd };