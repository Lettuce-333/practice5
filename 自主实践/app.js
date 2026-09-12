const form = document.querySelector('#add-form');
const titleInput = document.querySelector('#book-title');
const authorInput = document.querySelector('#book-author');
const ratingInput = document.querySelector('#book-rating');
const tip = document.querySelector('#tip');
const list = document.querySelector('#book-list');
let books = [];
const render = () => {
  list.innerHTML = '';
  if (books.length === 0) {
    const li = document.createElement('li');
    li.textContent = '暂无藏书';
    list.appendChild(li);
    return;
  }
  books.forEach(book => {
    const li = document.createElement('li');
    li.textContent = `《${book.title}》 作者：${book.author} 评分：${book.rating} 星${book.done ? '（已读）' : ''}`;
    if (book.done) li.classList.add('done');
    list.appendChild(li);
  });
};
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const rating = Number(ratingInput.value.trim());
  tip.classList.remove('ok');
  if (title === '') {
    tip.textContent = '书名不能为空';
    titleInput.focus();
    return;
  }
  if (author === '') {
    tip.textContent = '作者不能为空';
    authorInput.focus();
    return;
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    tip.textContent = '评分必须是 1 到 5 之间的整数';
    ratingInput.focus();
    return;
  }
  books.push({ title, author, rating, done: false });
  tip.textContent = '添加成功';
  tip.classList.add('ok');
  titleInput.value = '';
  authorInput.value = '';
  ratingInput.value = '';
  render();
});
render();