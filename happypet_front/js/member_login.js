
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLoginCustomer');

    form.addEventListener('submit', async (event) => {
        if (form.checkValidity() === false) {

            event.preventDefault();
            event.stopPropagation();

        } else {
            event.preventDefault();

            const email = form.querySelector('input[name="login_email"]').value;
            const password = form.querySelector('input[name="login_password"]').value;

            try {
<<<<<<< HEAD
                const response = await fetch('http://localhost/happypet_Lee/happypet_back/public/api/member_login', {
=======
                const response = await fetch('http://localhost/happypet/happypet_back/public/api/member_login', {
>>>>>>> 9ed2c47d2f0ee8eb6183055cf3749de644a0f94d
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();

                if (response.ok) {
<<<<<<< HEAD
                    // 登入成功後儲存 uid 到 localStorage
                    localStorage.setItem('uid', result.uid);

                    alert('登入成功！');
                    
                    //確認後跳轉至首頁
                    window.location.href = '../10_member/member_center.html';
=======
                    alert('登入成功！');
>>>>>>> 9ed2c47d2f0ee8eb6183055cf3749de644a0f94d
                } else {
                    alert(result.message || '登入失敗，請檢查您的電子信箱和密碼。');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('登入時發生錯誤，請稍後再試。');
            }
        }

        form.classList.add('was-validated');
    });
<<<<<<< HEAD
});

document.getElementById('btnLogout').addEventListener('click', function() {
    console.log('5566');
    
    // 清除 LocalStorage 或 SessionStorage 中的 uid 或 token
    localStorage.removeItem('uid');  // 假設 uid 是儲存在 localStorage 中
    // 或者如果有使用 token
    // localStorage.removeItem('token');

    // 可選：清除所有 localStorage 項目
    // localStorage.clear();

    // 重新導向到登入頁面
    window.location.href = '../10_member/member_center.html'; // 調整為你的登入頁面路徑
=======
>>>>>>> 9ed2c47d2f0ee8eb6183055cf3749de644a0f94d
});