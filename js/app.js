/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
let bookCounter;
const sectionBooks = document.querySelector('.bookshelf');
const sectionAddBook = document.querySelector('.addBooks');
const inputTitle = document.getElementById('title');
const inputAuthor = document.getElementById('author');
const inputPages = document.getElementById('pages');
const inputReadedYes = document.getElementById('readedYes');
const inputReadedNo = document.getElementById('readedNo');
const buttonSubmit = document.getElementById('buttonSubmitBook');
const warning = document.getElementById('warning');
const buttonAddBook = document.getElementById('buttonAddBook');

/* *********** LOCAL STORAGE *********** */

let myLibrary = [];
let myLibraryStringfied = [];

if (localStorage.getItem('myLibrary')) {
  myLibraryStringfied = localStorage.getItem('myLibrary').split('/');
  myLibrary = myLibraryStringfied.map((book) => JSON.parse(book));
  myLibrary.map((book) => displayBook(book));
  let counter = 0;
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].id > counter) counter = myLibrary[i].id;
  }
  bookCounter = counter;
} else {
  localStorage.setItem('myLibrary', '');
  bookCounter = 0;
}

/* *********** BUTTON ADD BOOKS *********** */

sectionAddBook.style.display = 'none';

buttonAddBook.addEventListener('click', (event) => {
  if (sectionAddBook.style.display === 'none') {
    sectionAddBook.style.display = 'block';
    event.currentTarget.textContent = 'Close';
  } else {
    sectionAddBook.style.display = 'none';
    event.currentTarget.textContent = 'New Book';
  }
});

// Book constructor

function Book(title, author, pages, readed) {
  this.title = title;
  this.author = author;
  this.pages = pages > 0 ? pages : 'invalid number of pages';
  this.readed = readed;
  // eslint-disable-next-line no-unused-expressions
  this.id;

  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages}${
      typeof this.pages === 'number'
        ? this.pages === 1
          ? ' page'
          : ' pages'
        : ''
    }, ${this.readed ? 'readed' : 'not readed yet'}`;
  };
  this.toggleReaded = function () {
    this.readed = !this.readed;
  };
}

/* *********** ADD BOOKS *********** */

function verifyInputs() {
  if (!inputAuthor.value || !inputPages.value || !inputTitle.value) return false;
  if (!inputReadedYes.checked && !inputReadedNo.checked) return false;
  return true;
}

function clearInputs() {
  inputTitle.value = '';
  inputAuthor.value = '';
  inputPages.value = '';
  warning.textContent = '';
  if (inputReadedYes.checked) inputReadedYes.checked = false;
  else inputReadedNo.checked = false;
}

function displayBook(book) {
  /* DOM variables */

  const divBook = document.createElement('div');
  const bookTitle = document.createElement('span');
  const divContent = document.createElement('div');
  const paraAuthor = document.createElement('p');
  const bookAuthor = document.createElement('span');
  const bookPages = document.createElement('p');
  const bookReaded = document.createElement('p');
  const divButtons = document.createElement('div');
  const buttonDelete = document.createElement('button');
  const buttonReaded = document.createElement('button');

  /* Styles */

  divBook.style.boxShadow = book.readed
    ? '0px -5px white, 0px -8px #00fa9a'
    : '0px -5px white, 0px -8px #e9967a';
  bookReaded.style.borderBottom = book.readed
    ? '2px solid #00fa9a'
    : '2px solid #e9967a';
  divBook.classList.add('divBook');
  bookTitle.classList.add('divBook_bookTitle');
  divContent.classList.add('divBook_divContent');
  buttonDelete.classList.add('divBook_buttonDelete');
  buttonReaded.classList.add('divBook_buttonReaded');

  /* Contents */

  bookTitle.textContent = book.title;
  paraAuthor.textContent = 'By ';
  bookAuthor.textContent = book.author;
  bookPages.textContent = `${book.pages} ${book.pages > 1 ? 'pages' : 'page'}`;
  bookReaded.textContent = `Status: ${
    book.readed ? 'Readed' : 'Not readed yet'
  }`;
  buttonDelete.textContent = 'Delete';
  buttonReaded.textContent = 'Change Status';

  /* Event Listeners */

  buttonDelete.addEventListener('click', () => {
    for (let i = 0; i < myLibrary.length; i++) {
      if (myLibrary[i].id === book.id) {
        myLibrary.splice(i, 1);
        myLibraryStringfied.splice(i, 1);
        localStorage.setItem('myLibrary', myLibraryStringfied.join('/'));
      }
    }
    sectionBooks.removeChild(divBook);
  });

  buttonReaded.addEventListener('click', () => {
    book.readed = !book.readed;
    for (let i = 0; i < myLibrary.length; i++) {
      if (myLibrary[i].id === book.id) {
        const bookParsed = JSON.parse(myLibraryStringfied[i]);
        bookParsed.readed = !bookParsed.readed;
        myLibraryStringfied.splice(i, 1, JSON.stringify(bookParsed));
        localStorage.setItem('myLibrary', myLibraryStringfied.join('/'));
      }
    }
    localStorage.setItem('myLibrary', myLibraryStringfied.join('/'));
    bookReaded.textContent = `Status: ${
      book.readed ? 'Readed' : 'Not readed yet'
    }`;
    divBook.style.boxShadow = book.readed
      ? '0px -5px white, 0px -8px #00fa9a'
      : '0px -5px white, 0px -8px #e9967a';
    bookReaded.style.borderBottom = book.readed
      ? '3px solid #00fa9a'
      : '3px solid #e9967a';
  });

  /* Display */

  paraAuthor.appendChild(bookAuthor);

  divContent.appendChild(paraAuthor);
  divContent.appendChild(bookPages);
  divContent.appendChild(bookReaded);

  divButtons.appendChild(buttonDelete);
  divButtons.appendChild(buttonReaded);

  divBook.appendChild(bookTitle);
  divBook.appendChild(divContent);
  divBook.appendChild(divButtons);

  sectionBooks.appendChild(divBook);
}

function addBookToLibrary(event) {
  event.preventDefault();

  if (verifyInputs()) {
    bookCounter++;
    let readed = false;
    if (inputReadedYes.checked) readed = true;

    const book = new Book(
      inputTitle.value,
      inputAuthor.value,
      inputPages.value,
      readed,
    );
    book.id = bookCounter;

    myLibrary.push(book);
    myLibraryStringfied.push(JSON.stringify(book));
    localStorage.setItem('myLibrary', myLibraryStringfied.join('/'));

    displayBook(book);
    clearInputs();
  } else {
    warning.textContent = 'Please fill the empty places';
  }
}

buttonSubmit.addEventListener('click', addBookToLibrary);
