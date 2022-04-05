document.addEventListener('DOMContentLoaded', e => {
  getQuoteData();
  submitNewQuote();
  createSortButton();
})

function getQuoteData() {
  fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(data => {
      showQuotes(data);
      // sortQuotesClient(data);
      sortQuotesServer(data);
    })
}

function showQuotes(quotesArray) {
  const quoteList = document.getElementById('quote-list');
  quoteList.innerHTML = '';
  
  quotesArray.map(eachQuote => {
    let likesArray = eachQuote.likes;
    let counter = 0;
    const currentLikes = likesArray.filter(likes => {
      counter++;
    })

    const quoteInfo = document.createElement('li');
    const blockquote = document.createElement('blockquote');
    const quoteText = document.createElement('p');
    const authorFooter = document.createElement('footer');
    const breakLine = document.createElement('br');
    const likeButton = document.createElement('button');
    const likeSpan = document.createElement('span');
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');
    const editForm = document.createElement('form');
    const editQuoteInput = document.createElement('input');
    const submitButton = document.createElement('input');

    quoteInfo.className = 'quote-card';
    quoteInfo.id = eachQuote.id;
    blockquote.className = 'blockquote';
    quoteText.className = 'mb-0';
    quoteText.textContent = eachQuote.quote;
    authorFooter.className = 'blockquote-footer';
    authorFooter.textContent = eachQuote.author;
    likeButton.className = 'btn-success';
    likeButton.textContent = 'Likes: ';
    likeSpan.textContent = counter;
    deleteButton.className = 'btn-danger';
    deleteButton.textContent = 'Delete';
    editButton.className = 'edit-btn';
    editButton.textContent = 'Edit';
    editForm.hidden = true;
    editQuoteInput.type = 'text';
    submitButton.type = 'submit'
    submitButton.value = 'Submit Changes';

    editForm.append(editQuoteInput, submitButton);
    likeButton.append(likeSpan);
    blockquote.append(quoteText, authorFooter, breakLine, likeButton, deleteButton, editButton, editForm);
    quoteInfo.append(blockquote);
    quoteList.append(quoteInfo);
  })
  deleteQuote();
  likeQuote();
  editQuote();
}

function submitNewQuote() {
  const submitForm = document.getElementById('new-quote-form');
  const submitButton = submitForm.querySelector('button');
  submitButton.addEventListener('click', e => handleSubmitNewQuote(e));
}

function handleSubmitNewQuote(e) {
  e.preventDefault();
  const quoteInputValue = e.target.parentNode.getElementsByClassName('form-group')[0].querySelector('input').value;
  const authorInputValue = e.target.parentNode.getElementsByClassName('form-group')[1].querySelector('input').value;

  postNewQuote(quoteInputValue, authorInputValue).then(data => {
    getQuoteData();
    e.target.parentNode.reset();
  });
}

function postNewQuote(newQuote, newAuthor) {
  return fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor
    })
  })
    .then(response => response.json())
}

function deleteQuote() {
  const deleteButton = document.getElementsByClassName('btn-danger');
  const deleteBtnArray = [...deleteButton];
  deleteBtnArray.map(button => button.addEventListener('click', e => handleDeleteQuote(e)));
}

function handleDeleteQuote(e) {
  const quoteElement = e.target.parentNode.parentNode;
  const id = quoteElement.id;
  postDeleteQuote(id);
}

function postDeleteQuote(id) {
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => getQuoteData())
}

function likeQuote() {
  const likeButton = document.getElementsByClassName('btn-success');
  const likeBtnArray = [...likeButton];
  likeBtnArray.map(button => button.addEventListener('click', e => handleLikeQuote(e)));
}

function handleLikeQuote(e) {
  const quoteId = e.target.parentNode.parentNode.id;
  const numId = parseInt(quoteId);
  console.log(Date.now());

  postLikeQuote(numId)
}

function postLikeQuote(numId) {
  fetch(`http://localhost:3000/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      quoteId: numId,
      createdAt: Date.now()
    })
  })
    .then(response => response.json())
    .then(data => getQuoteData())
}

function editQuote() {
  const editButton = document.getElementsByClassName('edit-btn');
  const editBtnArray = [...editButton];
  editBtnArray.map(button => button.addEventListener('click', e => handleEditButton(e)));
}

function handleEditButton(e) {
  const form = e.target.parentNode.querySelector('form');
  const textInput = form.childNodes[0];
  const quoteText = e.target.parentNode.querySelector('p').textContent;
  const submitButton = form.childNodes[1];
  form.hidden = false;
  textInput.value = quoteText;

  submitButton.addEventListener('click', e => handleSubmitButton(e))
}

function handleSubmitButton(e) {
  e.preventDefault();
  const textToChange = e.target.parentNode[0].value;
  const quoteId = e.target.parentNode.parentNode.parentNode.id;
  
  patchQuoteEdit(quoteId, textToChange);
}

function patchQuoteEdit(id, quoteText) {
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      quote: quoteText
    })
  })
  .then(response => response.json())
  .then(data => getQuoteData())
}

function createSortButton() {
  const sortDiv = document.getElementById('sorting');
  const sortButton = document.createElement('button');

  sortButton.id = 'btn-sort';
  sortButton.textContent = 'Sort: Off';

  sortDiv.append(sortButton);
}

// function sortQuotesClient(quotesArray) {
//   const sortButton = document.getElementById('btn-sort')
//   sortButton.addEventListener('click', e => {
//     const quotesForm = document.getElementById('quote-list');
    
//     if (sortButton.textContent === 'Sort: Off') {
//       quotesArray.sort(function(a, b) {
//       if (a.author < b.author) { return -1}
//       if (a.author > b.author) { return 1 }
//       return 0;
//     })
//     sortButton.textContent = 'Sort: On';
//     showQuotes(quotesArray);
//   } else {
//     quotesArray.sort(function(a, b) {
//       if (a.id < b.id) {return -1}
//       if (a.id > b.id) {return 1}
//       return 0;
//     })
//     sortButton.textContent = 'Sort: Off';
//     showQuotes(quotesArray);
//   }
//   })
// }

function sortQuotesServer(quotesArray) {
  const sortButton = document.getElementById('btn-sort');
  console.log(quotesArray);
  sortButton.addEventListener('click', e => {
    if (sortButton.textContent === 'Sort: Off') {
    fetch(`http://localhost:3000/quotes?_sort=author&_embed=likes`)
      .then(response => response.json())
      .then(data => {
        console.log('data', data)
        sortButton.textContent = 'Sort: On';
        showQuotes(data);
      })
      
    } else {
      sortButton.textContent = 'Sort: Off';
      showQuotes(quotesArray);
    }
  })
}