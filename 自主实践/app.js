const form = document.querySelector('#add-form');
const titleInput = document.querySelector('#book-title');
const authorInput = document.querySelector('#book-author');
const ratingInput = document.querySelector('#book-rating');
const tip = document.querySelector('#tip');
const list = document.querySelector('#book-list');
const filters = document.querySelector('.filters');
const searchInput = document.querySelector('#search');
let books = [];
let currentFilter = 'all';
let keyword = '';
const showTip = (msg, ok = false) => {
  tip.textContent = msg;
  tip.classList.toggle('ok', ok);
};
const render = () => {
  list.innerHTML = '';
  const shown = books
    .filter(book => currentFilter === 'all' ? true : currentFilter === 'active' ? !book.done : book.done)
    .filter(book => !keyword ||
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword));
  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有符合条件的图书';
    list.appendChild(li);
    return;
  }
  shown.forEach(book => {
    const li = document.createElement('li');
    if (book.done) li.classList.add('done');
    const span = document.createElement('span');
    span.textContent = `《${book.title}》 作者：${book.author} 评分：${'★'.repeat(book.rating)}${book.done ? '（已读）' : ''}`;
    li.appendChild(span);
    li.addEventListener('click', () => {
      book.done = !book.done;
      render();
    });
    const editBtn = document.createElement('button');
    editBtn.textContent = '修改';
    editBtn.className = 'edit';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newTitle = prompt('修改书名：', book.title);
      if (newTitle === null) return;
      const newAuthor = prompt('修改作者：', book.author);
      if (newAuthor === null) return;
      const newRating = prompt('修改评分（1-5 的整数）：', String(book.rating));
      if (newRating === null) return;
      const r = Number(newRating.trim());
      if (newTitle.trim() === '' || newAuthor.trim() === '' ||
          !Number.isInteger(r) || r < 1 || r > 5) {
        showTip('修改失败：书名、作者不能为空，评分必须是 1~5 的整数');
        return;
      }
      book.title = newTitle.trim();
      book.author = newAuthor.trim();
      book.rating = r;
      showTip('修改成功', true);
      render();
    });
    const delBtn = document.createElement('button');
    delBtn.textContent = '删除';
    delBtn.className = 'del';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`确定删除《${book.title}》吗？`)) {
        books = books.filter(b => b !== book);
        showTip('已删除', true);
        render();
      }
    });
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
};
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const rating = Number(ratingInput.value.trim());
  if (title === '') {
    showTip('书名不能为空');
    titleInput.focus();
    return;
  }
  if (author === '') {
    showTip('作者不能为空');
    authorInput.focus();
    return;
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    showTip('评分必须是 1 到 5 之间的整数');
    ratingInput.focus();
    return;
  }
  books.push({ title, author, rating, done: false });
  showTip('添加成功', true);
  titleInput.value = '';
  authorInput.value = '';
  ratingInput.value = '';
  render();
});
filters.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  currentFilter = e.target.dataset.filter;
  filters.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === e.target));
  render();
});
searchInput.addEventListener('input', () => {
  keyword = searchInput.value.trim().toLowerCase();
  render();
});
render();