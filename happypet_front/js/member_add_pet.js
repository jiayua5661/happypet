//串接新增寵物API
document.getElementById('btnAddPet').onclick = (event) => {
    event.preventDefault();

    let formData = new FormData(document.getElementById('formAddPet'));

    fetch('http://localhost/happypet/happypet_back/public/api/member_add_pet', {
        method: 'post',
        body: formData
    })
        .then(response => {
            console.log(response);

            if (!response.ok) {
                throw new Error(`伺服器錯誤(fetch回傳有問題): ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('我是data1', data.message)
            if (data.message) {
                showAddPetModal(data.message);
            } else {
                showAddPetModal(data.error);
            }
        })
        .catch(error => {
            console.error("錯誤:", error);
            showAddPetModal("新增失敗，請稍後再試。");
        });

    function showAddPetModal(message) {
        $('#add_or_not_Modal').modal('show');
        document.getElementById('alert_message').innerText = message;
        if (message === "新增成功！") {
            setTimeout(() => {
                window.location.href = '../10_member/member_center.html';
            }, 2000); // 2秒延遲，讓用戶能看到成功消息
        }

    }
}

// btnAddPet.onclick = (event) => {
//     event.preventDefault();

//     let formData = new FormData(document.getElementById('formAddPet'));
//     fetch('http://localhost/happypet_Lee/happypet_back/public/api/member_add_pet', {
//         method: 'post',
//         body: formData
//     })
//         .then(response => {
//             console.log(response);
//             if (!response.ok) {
//                 throw new Error(`伺服器錯誤(fetch回傳有問題): ${response.statusText}`);
//             }
//             // return response.text()
//             return response.json()
//         })
//         .then((data) => {
//             console.log('我是data1', data.message)
//             if (data.message){
//                 showAddPetModal( data.message)
//             }else{
//                 showAddPetModal( data.error)
//             }
//             // alert_message.innerText = data.message;
//         })


//         function showAddPetModal(message){
//             $('#add_or_not_Modal').modal('show')
//             alert_message.innerText = message;
//         }
//     }