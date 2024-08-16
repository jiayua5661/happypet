
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
                const response = await fetch('http://localhost/happypet/happypet_back/public/api/member_login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('登入成功！');
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
});