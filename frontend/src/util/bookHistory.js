// memento
class BookMemento {
  constructor({ bookContent, pageContent, currentBlockIndex, currentBlockOffset }) {
    this.bookContent = bookContent
    this.pageContent = pageContent;
    this.currentBlockIndex = currentBlockIndex;
    this.currentBlockOffset = currentBlockOffset;
  }

  getBookContent() {
    return this.bookContent;
  }

  getPageContent() {
    return this.pageContent;
  }

  getCurrentBlockIndex() {
    return this.currentBlockIndex;
  }

  getCurrentBlockOffset() {
    return this.currentBlockOffset;
  }

  setBookContent(bookContent) {
    this.bookContent = bookContent;
  }

  setPageContent(pageContent) {
    this.pageContent = pageContent;
  }

  setCurrentBlockIndex(currentBlockIndex) {
    this.currentBlockIndex = currentBlockIndex;
  }

  setCurrentBlockOffset(currentBlockOffset) {
    this.currentBlockOffset = currentBlockOffset;
  }
}

// caretaker
class BookCaretaker {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  saveMemento(memento) {
    if(memento.getBookContent()==null && this.undoStack.length>0){
      memento.setBookContent(this.undoStack[this.undoStack.length-1].getBookContent());
    }
    if(memento.getPageContent()==null && this.undoStack.length>0){
      memento.setPageContent(this.undoStack[this.undoStack.length-1].getPageContent());
    }
    this.undoStack.push(memento);
    if (this.undoStack.length > 100) {
      this.undoStack.shift()
    }
    this.redoStack = [];
  }

  // getPageContent() {
  //   return this.undoStack[this.undoStack.length - 1].getPageContent();
  // }

  getUndoObject() {
    if (this.undoStack.length <= 1) {
      return null;
    }
    this.redoStack.push(this.undoStack.pop());
    return this.undoStack[this.undoStack.length - 1];
  }

  getRedoObject() {
    if (this.redoStack.length === 0) {
      return null;
    }
    this.undoStack.push(this.redoStack[this.redoStack.length - 1]);
    return this.redoStack.pop();
  }

  undoPossible() {
    return this.undoStack.length > 1;
  }

  redoPossible() {
    return this.redoStack.length > 0;
  }
}

export { BookMemento, BookCaretaker };