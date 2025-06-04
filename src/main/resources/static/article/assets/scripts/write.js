document.getElementById('writeForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nickname = document.querySelector('input[name="nickname"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();
    const passwordConfirm = document.querySelector('input[name="passwordConfirm"]').value.trim();
    const title = document.querySelector('input[name="title"]').value.trim();
    const content = document.querySelector('textarea[name="content"]').value.trim();

    if (!nickname) {
        alert('닉네임을 입력해주세요.');
        return;
    }

    if (!password) {
        alert('비밀번호를 입력해주세요.');
        return;
    }

    if (password.length < 4) {
        alert('비밀번호는 4자 이상 입력해주세요.');
        return;
    }

    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    if (!title) {
        alert('제목을 입력해주세요.');
        return;
    }

    if (title.length > 100) {
        alert('제목은 100자 이하로 입력해주세요.');
        return;
    }

    if (!content) {
        alert('내용을 입력해주세요.');
        return;
    }

    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('password', password);
    formData.append('title', title);
    formData.append('content', content);

    console.log('전송할 데이터:', {nickname, password, title, content});

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/article/', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    console.log('서버 응답:', response);

                    if (response.result === 'success') {
                        alert('게시글이 작성되었습니다.');
                        window.location.href = '/article/?index=' + response.index;
                    } else if (response.result === 'failure') {
                        alert(response.message || '알 수 없는 이유로 작성에 실패하였습니다.');
                    } else {
                        alert('알 수 없는 응답입니다.');
                    }
                } catch (error) {
                    console.error('응답 파싱 오류:', error);
                    alert('서버 응답을 처리하는 중 오류가 발생했습니다.');
                }
            } else {
                console.error('HTTP 오류:', xhr.status);
                alert('통신 도중 오류가 발생하였습니다.');
            }
        }
    };

    xhr.onerror = function() {
        console.error('네트워크 오류');
        alert('통신 도중 오류가 발생하였습니다.');
    };

    xhr.send(formData);
});