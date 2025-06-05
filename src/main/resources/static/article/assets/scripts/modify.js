function getArticleIndex() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('index');
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

    if (!nickname) {
        alert('닉네임을 입력해주세요.');
        nicknameInput.focus();
        return;
    }

    if (nickname.length < 2 || nickname.length > 10) {
        alert('닉네임은 2자 이상 10자 이하로 입력해주세요.');
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

    if (content.length > 10000) {
        alert('내용은 10000자 이하로 입력해주세요.');
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
    xhr.open('PATCH', 'http://localhost:8080/article/', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);

                    if (response.result === 'success') {
                        window.location.href = `/article/?index=${articleIndex}`;
                    } else if (response.result === 'failure_password') {
                        alert('비밀번호가 올바르지 않습니다.');
                    } else if (response.result === 'failure') {
                        alert('알 수 없는 이유로 수정에 실패하였습니다.');
                    } else {
                        alert('알 수 없는 응답입니다.');
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

document.addEventListener('DOMContentLoaded', function() {
    // 게시글이 존재하지 않는 경우 처리
    const form = document.getElementById('modifyForm');
    if (!form) {
        alert('게시글을 찾을 수 없습니다.');
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.close();
        }
        return;
    }

    const nicknameInput = document.getElementById('nickname');
    if (nicknameInput) {
        nicknameInput.focus();
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        modifyArticle();
    });

    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const articleIndex = getArticleIndex();
            if (articleIndex) {
                window.location.href = `/article/?index=${articleIndex}`;
            } else {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.close();
                }
            }
        });
    }
});