document.getElementById('writeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nickname = document.querySelector('input[name="nickname"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();
    const passwordConfirm = document.querySelector('input[name="passwordConfirm"]').value.trim();
    const title = document.querySelector('input[name="title"]').value.trim();
    const content = document.querySelector('textarea[name="content"]').value.trim();

    if(!nickname) {
        alert('닉네임을 입력해주세요.');
        nickname.focus();
        return;
    }

    if(nickname > 10) {
        alert('닉네임은 10자리 미만이어야 합니다.');
        nickname.focus();
        return;
    }

    if(!password) {
        alert('비밀번호를 입력해주세요.');
        password.focus();
        return;
    }

    if(password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    if(password < 4 || password > 25) {
        alert('비밀번호는 4자 ~ 25자 사이여야 합니다.');
        password.focus();
        return;
    }

    if(!title) {
        alert('제목을 입력해주세요.');
        title.focus();
        return;
    }

    if(!content) {
        alert('내용을 입력해주세요.');
        content.focus();
        return;
    }

    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('password', password);
    formData.append('title', title);
    formData.append('content', content);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/article/', true);

    xhr.onreadystatechange = function () {
        if(xhr.onreadystatechange === XMLHttpRequest.DONE) {
            if(xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);

                    if(response.result === 'success') {
                        alert('게시글이 생성되었습니다.');
                        print('게시글 생성 완료');
                    } else if(response.put === 'failure') {
                        alert('알 수 없는 이유로 실패했습니다.');
                    } else {
                        alert('알 수 없는 응답입니다.');
                    }
                } catch (error) {
                    alert('서버 응답을 처리하는 중 오류가 발생했습니다.');
                }
            } else {
                alert('통신 중 오류가 발생했습니다.')
            }
        }
    };

    xhr.onerror = function () {
        alert('통신 도중 오류가 발생했습니다.');
    }

    xhr.send(formData);
});

