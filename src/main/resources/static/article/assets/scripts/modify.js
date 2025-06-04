function getArticleIndex() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('index');
}

function loadArticleForModify() {
    const articleIndex = getArticleIndex();

    if(!articleIndex) {
        alert('게시글을 찾을 수 없습니다.');
        window.location.href = '/article/list';
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:8080/article/?index=${articleIndex}`, true);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status >= 200 && xhr.status < 300) {
                loadArticleData(articleIndex);
            } else {
                alert('게시글을 불러오는 중 오류가 발생했습니다.');
                window.location.href = '/article/list';
            }
        }
    }

    xhr.send();
}

function loadArticleData(articleIndex) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:8080/article/api/modify?index=${articleIndex}`, true);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);

                    if(response.result === "success" && response.article) {
                        fillForm(response.article);
                    } else {
                        alert('게시글을 찾을 수 없습니다.');
                        window.location.href = '/article/list';
                    }
                } catch (error) {
                    alert('게시글을 불러오는 중 오류가 발생했습니다.');
                    window.location.href = '/article/list';
                }
            } else {
                alert('게시글을 찾을 수 없습니다.');
                window.location.href = '/article/list';
            }
        }
    }

    xhr.send();
}

function fillForm(article) {
    document.getElementById('nickname').value = article.nickName || '';
    document.getElementById('title').value = article.title || '';
    document.getElementById('content').value = article.content || '';
}

function modifyArticle() {
    const articleIndex = getArticleIndex();
    const nicknameInput = document.getElementById('nickname');
    const passwordInput = document.getElementById('password');
    const titleInput = document.getElementById('title');
    const contentTextarea = document.getElementById('content');

    const nickname = nicknameInput.value.trim();
    const password = passwordInput.value.trim();
    const title = titleInput.value.trim();
    const content = contentTextarea.value.trim();

    // 유효성 검증
    if (!nickname) {
        alert('닉네임을 입력해주세요.');
        nicknameInput.focus();
        return;
    }

    if (!password) {
        alert('비밀번호를 입력해주세요.');
        passwordInput.focus();
        return;
    }

    if (password.length < 4 || password.length > 25) {
        alert('비밀번호는 4자 이상 25자 미만으로 입력해 주세요.');
        passwordInput.focus();
        return;
    }

    if (!title) {
        alert('제목을 입력해주세요.');
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        alert('제목은 100자 이하로 입력해주세요.');
        titleInput.focus();
        return;
    }

    if (!content) {
        alert('내용을 입력해주세요.');
        contentTextarea.focus();
        return;
    }

    const formData = new FormData();
    formData.append('index', articleIndex);
    formData.append('nickname', nickname);
    formData.append('password', password);
    formData.append('title', title);
    formData.append('content', content);

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', 'http://localhost:8080/article/', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    console.log('서버 응답:', response);

                    if (response.result === 'success') {
                        alert('게시글이 수정되었습니다.');
                        // 수정된 게시글로 이동
                        window.location.href = `/article/?index=${articleIndex}`;
                    } else if (response.result === 'failure') {
                        alert(response.message || '게시글 수정에 실패했습니다.');
                    } else {
                        alert('알 수 없는 응답입니다.');
                    }
                } catch (error) {
                    console.error('응답 파싱 오류:', error);
                    alert('서버 응답을 처리하는 중 오류가 발생했습니다.');
                }
            } else {
                console.error('HTTP 오류:', xhr.status);
                alert('통신 중 오류가 발생했습니다.');
            }
        }
    };

    xhr.onerror = function() {
        console.error('네트워크 오류');
        alert('통신 도중 오류가 발생하였습니다.');
    };

    console.log('전송할 데이터:', {articleIndex, nickname, title, content});
    xhr.send(formData);
}

document.addEventListener('DOMContentLoaded', function() {
    loadArticleForModify();

    const modifyForm = document.getElementById('modifyForm');
    if (modifyForm) {
        modifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            modifyArticle();
        });
    }

    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modifyArticle();
        });
    }
});