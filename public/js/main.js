const testbtn = document.querySelector('#testbtn');

testbtn.addEventListener('click', async () => {
  const postImgFile = document.querySelector('#post-upload-img').files[0];
  const postTitle = document.querySelector('#create-post-title').value;
  const postContent = document.querySelector('#create-post-content').value;

  const formData = new FormData();
  formData.append('profilePicture', postImgFile);
  formData.append('title', postTitle);
  formData.append('content', postContent);

  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    alert('게시글을 작성하였습니다.');
    window.location.href = '/';
  } catch (error) {
    alert('게시글 작성에 실패하였습니다.');
  }
});
