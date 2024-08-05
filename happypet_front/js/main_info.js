let inserBtn = document.getElementById('inserBtn')
    window.onload = ()=>{
        let myModal = document.getElementById('myModal')
        let myInput = document.getElementById('myInput')
        // let infoBtn = document.querySelector('.bi-info-circle-fill')
        myModal.addEventListener('shown.bs.modal', function () {
            myInput.focus()
        })
        function showMsg(msg){
            $('#myModal').modal('show')
            $('#alertMsg').text(msg)
        }
        $('.bi-info-circle-fill').click(()=>{
            $(".descriptionInfo").removeClass('d-none');
        })
        $('.bi-x-circle-fill').click(()=>{
            $(".descriptionInfo").addClass('d-none');
        })
        // $('.bi-info-circle-fill').hover(function(){
        //     // $(".descriptionInfo").removeClass('info_opacity');
        //     $(".descriptionInfo").removeClass('d-none');
        // },function(){
        //     // $("p").css("background-color","pink");
        //     // $(".descriptionInfo").addClass('info_opacity');
        //     $(".descriptionInfo").addClass('d-none');

        // });
        // coverimg.onchange = ()=>{
        //     // let coverIMG = coverimg
        //     console.log('我是封面圖',coverimg.files)
        //     console.log('我是封面圖',coverimg.files[0])
        //     let imgreader = new FileReader();
        //     imgreader.readAsDataURL(coverimg.files[0])
        //     imgreader.onload = (event)=>{
        //         console.log('eee',event) 
        //         // src在event裡面的target的result
        //         showImg.innerHTML += `<img src="${event.target.result}">`
        //     }
        // }
        pdSeries.onchange = (event)=>{
            // let formData = new FormData(document.getElementById('pdInfo'));
            // formData.append('action', 'fetch');
            // fetch('infoupload.php',{
            console.log('event.target.value',event.target.value)
            // fetch(`http://localhost/testpet/public/api/product_back/info/select/${event.target.value}`,{
            fetch(`http://localhost/happypet/happypet_back/public/api/product_back/info/select/${event.target.value}`,{
                method:'get',
                // body:formData
            })
            .then(response=>{
                // console.log(response)
                // return response.json()
                return response.json()
            })
            .then(({message,categories})=>{
                console.log('message = ',message.message)
                // let {message,data} = data
                showMsg(message.message)
            })
        }
        coverimg.onchange = ()=>{
            let imgreader = new FileReader();
            // console.log('imgreader',imgreader)
            imgreader.readAsDataURL(coverimg.files[0])
            showCoverImg.innerHTML = ''
            imgreader.onload = (event)=>{
                // console.log('eee',event) 
                // src在event裡面的target的result
                showCoverImg.innerHTML += `<img src="${event.target.result}">`
            }
            
            // console.log('我是封面圖',descimgs.files[0])
        }
        descimgs.onchange = ()=>{
            // console.log('我是敘述圖',descimgs.files)
            let descIMGs = Array.from(descimgs.files); // 轉換為陣列
            descIMGs.forEach((img)=>{
                // console.log('我是敘述圖單張',img)
                let imgreader = new FileReader();
                imgreader.readAsDataURL(img)
                showDescImgs.innerHTML = ''
                imgreader.onload = (event)=>{
                    // console.log('eee',event) 
                    // src在event裡面的target的result
                    showDescImgs.innerHTML += `<img src="${event.target.result}">`
                }
            })
            // console.log('我是封面圖',descimgs.files[0])
        }
        othersImgs.onchange = ()=>{
            let othersIMGs = Array.from(othersImgs.files); // 轉換為陣列
            othersIMGs.forEach((img)=>{
                let imgreader = new FileReader();
                imgreader.readAsDataURL(img)
                showOthersImgs.innerHTML = ''
                imgreader.onload = (event)=>{
                    // console.log('eee',event) 
                    // src在event裡面的target的result
                    showOthersImgs.innerHTML += `<img src="${event.target.result}">`
                }
            })
            // console.log('我是封面圖',descimgs.files[0])
        }
        
        // 查詢option列出的類別
        // fetch('category.php',{
        // fetch('http://localhost/testpet/public/product_back/info/select',{
        fetch('http://localhost/happypet/happypet_back/public/api/product_back/info/select',{
                method:'get',
        })
        .then(response=>{
            // console.log(response)
            // return response.text()
            return response.json()
        })
        .then(({categories})=>{
        // .then((aaa)=>{
            // alert(data)
            console.log('我是options',categories)
            // console.log('我是options',aaa)
            categories.forEach((category) => {   //多張照片遍歷
                // console.log('category = ', category)
                // console.log('我是index',index)
                // console.log(category.split('-'))  //分割後取英文([0])
                categoryOptions.innerHTML += `<option value="${category.split('-')[0]}">${category}</option>`
            });
        })


        inserBtn.onclick = (event)=>{
            event.preventDefault();
            let formData = new FormData(document.getElementById('pdInfo'));
            formData.append('action', 'insert');
            // fetch('infoupload.php',{
            //     method:'post',
            //     body:formData
            // })
            // fetch('http://localhost/testpet/public/api/product_back/info/create',{
            fetch('http://localhost/happypet/happypet_back/public/api/product_back/info/create',{
                method:'post',
                body:formData
            })
            .then(response=>{
                if (!response.ok) {
                    throw new Error(`伺服器錯誤: ${response.statusText}`);
                }
                // console.log(response)
                // return response.text()
                return response.json()
            })
            .then(data=>{
                // alert(data)
                console.log('我是data1',data)

                // let parsedData = JSON.parse(data)
                // console.log('我是data2',data)
                console.log('parsedData',data)
                if (data.message) {
                    console.log(data.message);
                    showMsg(data.message)
                    setTimeout(()=>{
                        location.reload()// 刷新頁面
                    },1000)
                } else if (data.error) {
                    showMsg(data.error)
                    

                }
                // if (parsedData.message) {
                //     console.log(parsedData.message);
                //     showMsg(parsedData.message)
                //     // alert(parsedData.message)
                //     setTimeout(()=>{
                //         location.reload()// 刷新頁面
                //     },1000)
                // } else if (parsedData.error) {
                //     // console.log('Error:', parsedData.error);
                //     showMsg(parsedData.error)
                //     // alert(parsedData.error)

                // }
            })
        }
    }