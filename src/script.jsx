import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.scss';
import './styles/BookHolder.scss';
import './styles/Book.scss';
// TODO: Add popup to warn about non entered text fields; and complete the app.
const addButton = document.querySelector('#addButton');
const formOverlay = document.querySelector('.formOverlay');
const addButtonForm = document.querySelector('#formAdd');
const cancelButtonForm = document.querySelector('#formCancel');
const addBookForm = document.querySelector('#addBookForm');
const popUpAlert = document.querySelector('#popUpAlert');
const popUpAlertText = document.querySelector('#popUpAlertText');
const storage = window.localStorage;
function storageAvailable(type) {
  try {
    const strg = window[type];
    const x = '__storage_test__';
    strg.setItem(x, x);
    strg.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0
    );
  }
}

function opacityUp(element) {
  const e = element;
  e.style.display = 'block';
  setTimeout(() => {
    e.style.opacity = 1;
  }, 1);
}
function opacityDown(element) {
  const e = element;
  e.style.opacity = 0;
  setTimeout(() => {
    e.style.display = 'none';
  }, 300);
}

function getFormContents() {
  const form = document.querySelector('#addBookForm');
  let inputs = form.querySelectorAll('input');
  const REP = [];
  const pleaseEnter = [];
  inputs = Array.from(inputs);
  inputs.forEach((e) => {
    if (!e.value) {
      pleaseEnter.push(e.id);
    }
  });
  if (pleaseEnter.length) {
    REP.push(false);
    REP.push(pleaseEnter);
  } else if (!pleaseEnter.length) {
    const book = {
      title: inputs[0].value,
      author: inputs[1].value,
      pages: inputs[2].value,
      read: inputs[3].checked,
    };
    REP.push(true);
    REP.push(book);
  }
  return REP;
}
function addButtonHandler() {
  opacityUp(formOverlay);
}
addButton.addEventListener('click', addButtonHandler);

function cancelButtonHandler() {
  opacityDown(popUpAlert);
  opacityDown(formOverlay);
}
cancelButtonForm.addEventListener('click', cancelButtonHandler);
function popUpAlertHandler() {
  opacityDown(popUpAlert);
}
popUpAlert.addEventListener('click', popUpAlertHandler);
class Shelf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      book: [
        {
          title: 'Grab the Ghost',
          author: "Flic m'Cock",
          pages: 234,
          read: false,
        },
        {
          title: 'Bootleg Brandy',
          author: 'Max Murgh',
          pages: 432,
          read: true,
        },
      ],
    };
    this.addBook = this.addBook.bind(this);
    this.addButtonFormHandler = this.addButtonFormHandler.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.isRead = this.isRead.bind(this);
    this.renderBook = this.renderBook.bind(this);
  }

  componentWillMount() {
    addButtonForm.addEventListener('click', this.addButtonFormHandler);
    if (storageAvailable('localStorage') && storage.library) {
      const lib = storage.getItem('library');
      let shelf = lib.split('∏');
      shelf = shelf.map(e => JSON.parse(e));
      this.setState({
        book: shelf,
      });
    }
  }

  componentDidUpdate() {
    if (storageAvailable('localStorage')) {
      let shelf = this.state.book.slice();
      shelf = shelf.map(e => JSON.stringify(e));
      shelf = shelf.join('∏');
      storage.setItem('library', shelf);
    }
    return true;
  }

  addBook(book) {
    const shelf = this.state.book.slice();
    shelf.push(book);
    this.setState({
      book: shelf,
    });
  }
  addButtonFormHandler(e) {
    e.preventDefault();
    const REP = getFormContents();
    const [r, a] = REP;
    if (r) {
      this.addBook(a);
      addBookForm.reset();
      opacityDown(formOverlay);
    } else if (!r) {
      popUpAlertText.innerText = 'Please fill all the fields';
      opacityUp(popUpAlert);
    }
  }

  removeBook(i) {
    const newLib = this.state.book;
    newLib.splice(i, 1);
    this.setState({
      book: newLib,
    });
  }

  isRead(i) {
    const shelf = this.state.book;
    shelf[i].read = !shelf[i].read;
    this.setState({
      book: shelf,
    });
  }

  renderBook() {
    // console.log(this.state.book);
    let shelf = this.state.book.slice();
    shelf = shelf.map((e, i) => {
      const {
        title, author, pages, read,
      } = e;
      const component = (
        <Book
          key={`book-${i + 1}`}
          index={i + 1}
          title={title}
          author={author}
          pages={String(pages)}
          read={read}
          removeBook={this.removeBook}
          isRead={this.isRead}
        />
      );
      return component;
    });
    return shelf;
  }
  render() {
    return (
      <div>
        <BookHolder renderBook={this.renderBook} />
      </div>
    );
  }
}

function BookHolder(props) {
  const books = props.renderBook();
  return <div className="bookHolderDiv">{books}</div>;
}

function Book(props) {
  const {
    title, author, pages, read, removeBook, index, isRead,
  } = props;
  function remove() {
    removeBook(index - 1);
  }
  function changeRead() {
    isRead(index - 1);
  }
  return (
    <div>
      <h3>{title}</h3>
      <p>by</p>
      <h4>{author}</h4>
      <h5>Pages: {pages}</h5>
      <button onClick={changeRead}>{`Read: ${read ? ' yup ' : ' nope '}`}</button>
      <button onClick={remove}>
        <i className="fa fa-trash-o" aria-hidden="true" />
      </button>
    </div>
  );
}

Book.propTypes = {
  index: PropTypes.number.isRequired,
  removeBook: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  pages: PropTypes.string.isRequired,
  read: PropTypes.bool.isRequired,
  isRead: PropTypes.func.isRequired,
};

BookHolder.propTypes = {
  renderBook: PropTypes.func.isRequired,
};
ReactDOM.render(<Shelf />, document.querySelector('.root'));

// <h1>{title}</h1>
// <h2 onClick={changeRead}>{author + pages + read}</h2>
// <button onClick={remove}>
//   <i className="fa fa-trash-o" aria-hidden="true" title="Delete book." />
// </button>
