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
});

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
        window.location.href = '/article/list';
    });
}