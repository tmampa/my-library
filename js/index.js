let bookCounter;
const sectionBooks = document.querySelector('.bookshelf');
const sectionAddBook = document.querySelector('.addBooks');
const inputTitle = document.getElementById('title');
const inputAuthor = document.getElementById('author');
const inputPages = document.getElementById('pages');
const inputreadYes = document.getElementById('readYes');
const inputreadNo = document.getElementById('readNo');
const buttonSubmit = document.getElementById('buttonSubmitBook');
const warning = document.getElementById('warning');
const buttonAddBook = document.getElementById('buttonAddBook');

let myLibrary = [];
let myLibraryStringfied = [];

if (localStorage.getItem('myLibrary')) {
  myLibraryStringfied = localStorage.getItem('myLibrary').split('/');
  myLibrary = myLibraryStringfied.map((book) => JSON.parse(book));
  // eslint-disable-next-line no-use-before-define
  myLibrary.map((book) => displayBook(book));
  let counter = 0;
  for (let i = 0; i < myLibrary.length; i += 1) {
    if (myLibrary[i].id > counter) counter = myLibrary[i].id;
  }
  bookCounter = counter;
} else {
  localStorage.setItem('myLibrary', '');
  bookCounter = 0;
}

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

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages > 0 ? pages : 'invalid number of pages';
  this.read = read;

  this.info = function () {
    // eslint-disable-next-line no-nested-ternary
    return (`${this.title} by ${this.author}, ${this.pages}${typeof this.pages === 'number' ? this.pages === 1 ? ' page' : ' pages' : ''}, ${this.read ? 'read' : 'not read yet'}`);
  };
  this.toggleread = function () {
    this.read = !(this.read);
  };
}

function verifyInputs() {
  if (
    !(inputAuthor.value)
        || !(inputPages.value)
        || !(inputTitle.value)) return false;
  if (!(inputreadYes.checked) && !(inputreadNo.checked)) return false;
  return true;
}

function clearInputs() {
  inputTitle.value = '';
  inputAuthor.value = '';
  inputPages.value = '';
  warning.textContent = '';
  if (inputreadYes.checked) inputreadYes.checked = false;
  else inputreadNo.checked = false;
}

function displayBook(book) {
  const divBook = document.createElement('div');
  const bookTitle = document.createElement('span');
  const divContent = document.createElement('div');
  const paraAuthor = document.createElement('p');
  const bookAuthor = document.createElement('span');
  const bookPages = document.createElement('p');
  const bookread = document.createElement('p');
  const divButtons = document.createElement('div');
  const buttonDelete = document.createElement('button');
  const buttonread = document.createElement('button');

  divBook.style.boxShadow = book.read ? '0px -5px white, 0px -8px #00fa9a' : '0px -5px white, 0px -8px #e9967a';
  bookread.style.borderBottom = book.read ? '2px solid #00fa9a' : '2px solid #e9967a';
  divBook.classList.add('divBook');
  bookTitle.classList.add('divBook_bookTitle');
  divContent.classList.add('divBook_divContent');
  buttonDelete.classList.add('divBook_buttonDelete');
  buttonread.classList.add('divBook_buttonread');

  bookTitle.textContent = book.title;
  paraAuthor.textContent = 'By ';
  bookAuthor.textContent = book.author;
  bookPages.textContent = `${book.pages} ${book.pages > 1 ? 'pages' : 'page'}`;
  bookread.textContent = `Status: ${book.read ? 'read' : 'Not read yet'}`;
  buttonDelete.textContent = 'Delete';
  buttonread.textContent = 'Change Status';

  buttonDelete.addEventListener('click', () => {
    for (let i = 0; i < myLibrary.length; i += 1) {
      if (myLibrary[i].id === book.id) {
        myLibrary.splice(i, 1);
        myLibraryStringfied.splice(i, 1);
        localStorage.setItem('myLibrary', myLibraryStringfied.join('/'));
      }
    }
    sectionBooks.removeChild(divBook);
  });

  buttonread.addEventListener('click', () => {
    book.read = !(book.read);
    for (let i = 0; i < myLibrary.length; i += 1) {
      if (myLibrary[i].id === book.id) {
        const bookParsed = JSON.parse(myLibraryStringfied[i]);
        bookParsed.read = !(bookParsed.read);
        myLibraryStringfied.splice(i, 1, JSON.stringify(bookParsed));
        localStorage.setItem('myLibrary', myLibraryStringfied.join('/'));
      }
    }
    localStorage.setItem('myLibrary', myLibraryStringfied.join('/'));
    bookread.textContent = `Status: ${book.read ? 'read' : 'Not read yet'}`;
    divBook.style.boxShadow = book.read ? '0px -5px white, 0px -8px #00fa9a' : '0px -5px white, 0px -8px #e9967a';
    bookread.style.borderBottom = book.read ? '3px solid #00fa9a' : '3px solid #e9967a';
  });

  paraAuthor.appendChild(bookAuthor);

  divContent.appendChild(paraAuthor);
  divContent.appendChild(bookPages);
  divContent.appendChild(bookread);

  divButtons.appendChild(buttonDelete);
  divButtons.appendChild(buttonread);

  divBook.appendChild(bookTitle);
  divBook.appendChild(divContent);
  divBook.appendChild(divButtons);

  sectionBooks.appendChild(divBook);
}

function addBookToLibrary(event) {
  event.preventDefault();

  if (verifyInputs()) {
    bookCounter += 1;
    let read = false;
    if (inputreadYes.checked) read = true;

    const book = new Book(inputTitle.value, inputAuthor.value, inputPages.value, read);
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