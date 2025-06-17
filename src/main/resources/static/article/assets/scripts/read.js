function getArticleIndex() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('index');
}

function deleteArticle() {
    const articleIndex = getArticleIndex();
    const passwordInput = document.querySelector('input[name="password"]');
    const password = passwordInput.value.trim();

    if(!password) {
        alert('비밀번호를 입력해주세요.');
        passwordInput.focus();
        return;
    }

    if(password.length < 4 || password.length > 25) {
        alert('비밀번호는 4자 이상 25자 미만으로 입력해 주세요.');
        passwordInput.focus();
        return;
    }

    const formData = new FormData();
    formData.append('index', articleIndex);
    formData.append('password', password);

    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'http://localhost:8080/article/', true);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);

                    if(response.result === 'success') {
                        alert('게시글이 삭제되었습니다.');
                        window.location.href = '/article/write';
                    } else if(response.result === 'failure') {
                        alert('게시글 삭제에 실패했습니다.');
                    } else {
                        alert('알 수 없는 응답입니다.')
                    }
                } catch (error) {
                    alert('서버 응답을 처리하는 중 오류가 발생했습니다.');
                }
            } else {
                alert('통신 중 오류가 발생했습니다.');
            }
        }
    };

    xhr.onerror = function() {
        alert('통신 도중 오류가 발생하였습니다.');
    };

    xhr.send(formData);
}

document.addEventListener('DOMContentLoaded', function() {
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteArticle);
    }

    const modifyBtn = document.querySelector('button[name="modifyBtn"]');
    if (modifyBtn) {
        modifyBtn.addEventListener('click', function() {
            const articleIndex = getArticleIndex();
            if (articleIndex) {
                window.location.href = `/article/modify?index=${articleIndex}`;
            }
        });
    }

    const listBtn = document.querySelector('button[name="listBtn"]');
    if (listBtn) {
        listBtn.addEventListener('click', function() {
            window.location.href = '/article/board';
        });
    }

    const commentSubmitBtn = document.getElementById(`commentSubmitBtn`);
    if(commentSubmitBtn) {
        commentSubmitBtn.addEventListener('click', submitComment);
    }

});

function loadComments() {
    const articleIndex = getArticleIndex();
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:8080/comment/?articleIndex=${articleIndex}`);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    displayComments(response);
                } catch (error) {
                    console.error('댓글 로드 오류:', error);
                }
            }
        }
    };

    xhr.send();
}

function displayComments(comments) {
    const commentList = document.getElementById('commentList');

    if(!comments || comments.length === 0) {
        commentList.innerHTML = `<div class="no-comments">등록된 댓글이 없습니다.</div>`;
        return;
    }

    let html = '';
    comments.forEach(comment => {
        html += `
            <div class="comment-item">
                <div class="comment-content">
                    <div class="comment-author">${escapeHtml(comment.nickname)}</div>
                    <div class="comment-text">${escapeHtml(comment.content)}</div>
                    <div class="comment-date">${formatDate(comment.createdAt)}</div>
                </div>
                <div class="comment-actions">
                    <a href="#" class="comment-delete" onclick="deleteComment(${comment.index}); return false;">삭제</a>
                </div>
            </div>
        `;
    });

    commentList.innerHTML = html;
}

function submitComment() {
    const articleIndex = getArticleIndex();
    const nicknameInput = document.querySelector('input[name="commentNickname"]');
    const contentInput = document.querySelector('input[name="commentContent"]');

    const nickname = nicknameInput.value.trim();
    const content = contentInput.value.trim();

    if (!nickname) {
        alert('닉네임을 입력해주세요.');
        nicknameInput.focus();
        return;
    }

    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        contentInput.focus();
        return;
    }

    const formData = new FormData();
    formData.append('articleIndex', articleIndex);
    formData.append('nickname', nickname);
    formData.append('content', content);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/comment/', true);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);

                    if(response.result === 'success') {
                        alert('댓글이 작성되었습니다.');
                        nicknameInput.value = '';
                        contentInput.value = '';
                        loadComments();
                    } else if(response.result === 'failure') {
                        alert('알 수 없는 이유로 댓글 작성에 실패하였습니다.');
                    }
                } catch (error) {
                    alert('서버 응답을 처리하는 중 오류가 발생했습니다.');
                }
            } else {
                alert('통신 도중 오류가 발생하였습니다.');
            }
        }
    };

    xhr.onerror = function() {
        alert('통신 도중 오류가 발생하였습니다.');
    };

    xhr.send(formData);
}

function deleteComment(commentIndex) {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
        return;
    }

    const formData = new FormData();
    formData.append('index', commentIndex);

    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'http://localhost:8080/comment/', true);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);

                    if(response.result === 'success') {
                        loadComments();
                    } else if(response.result === 'failure') {
                        alert('알 수 없는 이유로 댓글 삭제에 실패하였습니다.');
                    }
                } catch (error) {
                    alert('서버 응답을 처리하는 중 오류가 발생했습니다.');
                }
            } else {
                alert('통신 도중 오류가 발생하였습니다.');
            }
        }
    };

    xhr.onerror = function() {
        alert('통신 도중 오류가 발생하였습니다.');
    };

    xhr.send(formData);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0');
}










