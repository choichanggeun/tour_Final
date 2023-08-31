document.addEventListener('DOMContentLoaded', () => {
  const commentForm = document.getElementById('comment-form');
  const commentInput = document.getElementById('comment-input');
  const commentList = document.getElementById('comment-list');
  const diaryContainer = document.querySelector('.diary');
  const diary_id = parseInt(diaryContainer.dataset.diary_id, 10);
  console.log('diary_id:', diary_id);
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = commentInput.value.trim();
    if (!content) return;
    createComment(content).then(() => {
      commentInput.value = '';
      loadComments();
    });
  });
  commentList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-comment-btn') || e.target.classList.contains('delete-comment-btn')) {
      const commentElement = e.target.closest('li.list-group-item');
      const comment_idAttr = commentElement.getAttribute('data-comment-id');
      const comment_id = comment_idAttr ? parseInt(comment_idAttr, 10) : null;
      if (e.target.classList.contains('edit-comment-btn')) {
        const content = prompt('수정할 내용을 입력해주세요');
        if (content !== null && comment_id !== null) {
          await updateComment(comment_id, content);
          await loadComments();
        }
      } else if (e.target.classList.contains('delete-comment-btn')) {
        if (confirm('댓글을 삭제하시겠습니까?')) {
          if (comment_id) {
            await deleteComment(comment_id);
            await loadComments();
          } else {
            console.error('댓글을 삭제할 수 없습니다. comment_id가 정의되지 않았습니다.');
          }
        }
      }
    }
  });
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatter.format(date);
  };
  const loadComments = async () => {
    const comments = await findComment();
    commentList.innerHTML = comments
      .map(
        (comment) =>
          `<li class="list-group-item" data-comment-id="${comment.comment_id}">
    ${comment.name}: ${comment.content}
    <span class="text-muted">${formatDate(comment.updatedAt)}</span>
    <button class="btn btn-sm btn-outline-secondary edit-comment-btn">수정</button>
    <button class="btn btn-sm btn-outline-danger delete-comment-btn">삭제</button>
    </li>`
      )
      .join('');
    console.log('Generated HTML:', commentList.innerHTML);
  };
  const findComment = async () => {
    const response = await fetch(`/diaries/${diary_id}/comments`);
    const data = await response.json();
    console.log('comments data:', data);
    return data.data;
  };
  const createComment = async (content) => {
    const response = await fetch(`/diaries/${diary_id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': '/application/json' },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      const responseText = await response.text();
      console.error(`Response Text: ${responseText}`);
      throw new Error('Error creating comment');
    }
    const newComment = await response.json();
    return newComment.id;
  };
  const updateComment = async (comment_id, content) => {
    const response = await fetch(`/comments/${comment_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      const responseText = await response.text();
      console.error(`Response Text: ${responseText}`);
      throw new Error('Error updating comment');
    }
    const updatedComment = await response.json();
    return updatedComment;
  };
  const deleteComment = async (comment_id) => {
    const response = await fetch(`/comments/${comment_id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      const responseText = await response.text();
      console.error(`Response Text: ${responseText}`);
      throw new Error('Error deleting comment');
    }
    return response.json();
  };
  loadComments();
});
