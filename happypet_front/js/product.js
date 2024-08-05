window.onscroll = function() {
    headerChange()
    // console.log(window.scrollY)
}
function headerChange(){
    let pdNavbar = document.querySelector('.pd_navbar');
    // let logo = document.querySelector('.logo')
    if (window.scrollY > 500 ) {
        pdNavbar.style.position = "sticky";  
        pdNavbar.style.top = "95px";  
        pdNavbar.style.display = "block";  
        if(window.innerWidth <= 1198)pdNavbar.style.top = "148px"
    } else {
        pdNavbar.style.display = "none";  
        pdNavbar.style.position = "static";  
    }
    // console.log('window.innerWidth',window.innerWidth)
    // window.innerWidth == 1200 ? pdNavbar.style.top = "148px" : pdNavbar.style.top = "95px"; 
}


window.onload = function(){
    let isFetching = false  //預設沒有執行fetch
    // changePathname('df',false)

    // changePathname('df')
    let urlParams  = new URLSearchParams(window.location.search)
    console.log('window',window.location.search)
    let categoryID = urlParams.get('category') || 'df'

     // 初始化設定
    changePathname(categoryID, false); // 不要更新歷史紀錄，避免誤操作
    changeBanner(categoryID)
    console.log('window categoryID',categoryID)
    // categoryID ? changePathname(categoryID) :  changePathname('df',false)
   
    
    let dropdownItem = document.querySelectorAll('.dropdown-item')
    let dropdownMenus = document.querySelectorAll('.dropdown-menu')
    let productContainer = document.querySelector('.product_container');
    // let categoryTitle = seriesTile.getAttribute('data-tile')
    let links = document.querySelectorAll('.pet_pdicon li>a')
    
    function updateIconLink(categoryAbbr){
        let categoriesObj = {
            'd': ['df', 'dc', 'dt', 'dh', 'ds'],
            'c': ['cf', 'cc', 'ct', 'ch', 'cs']
        };
        let categories = categoriesObj[categoryAbbr]
        links.forEach((link,index)=>{
            link.setAttribute('data-change-category', categories[index])
        })
    }

    links.forEach((link)=>{
        link.addEventListener('click',function(event){
            event.preventDefault()
            // console.log(event.target.closest('a'))
            let categoryInIcon = event.target.closest('a').getAttribute('data-change-category') 
            // console.log(categoryInIcon)
            productContainer.innerHTML = ''
            changePathname(categoryInIcon)
            let categoryID = urlParams.get('category')
            changeBanner(categoryInIcon)
        })
    })
    
    function changeTagImg(dogOrCat){
        let animalTags = document.querySelectorAll('.animalTag')
        animalTags.forEach((tag)=>{
            tag.style.backgroundImage = `url('../../40_product/img/productIcon/${dogOrCat}.png')`
            // tag.style.backgroundImage = `url('./img/productIcon/${dogOrCat}.png')`
        })
    }
    function changeBanner(category){
        let pdBannerImg = document.getElementById('pdBannerImg')
        pdBannerImg.src = `../../img/40_product/banner/banner-${category}.jpg`
        // pdBannerImg.src = `./img/banner/banner-${category}.jpg`
        console.log('pdBannerImg',pdBannerImg)
    }

    // 彙總
    function updateSeriesTitle(categoryAbbr) {
        if (categoryAbbr === 'd') {
            seriesTile.innerText = "狗狗專區";
            seriesTile.setAttribute('data-title', 'd');
            updateIconLink('d');
            changeTagImg('dog');
        } else {
            seriesTile.innerText = "貓貓專區";
            seriesTile.setAttribute('data-title', 'c');
            updateIconLink('c');
            changeTagImg('cat2');
        }
    }
    dropdownMenus.forEach((dropdownMenu,i)=>{
        // console.log('dropdownMenu',dropdownMenu)
        dropdownMenu.addEventListener('click',function(event){
            event.preventDefault();
            let category = event.target.getAttribute('data-pdcategory')
            
            // console.log('我是類別 = ',category)
            // console.log('event.target',event.target) 
            // window.location.replace();

            // categoryTitle.innerText = category
            // console.log('categoryTitle = ',categoryTitle)
            // console.log('是d嗎',category.startsWith('d'))
            // console.log(link.setAttribute('data-change-category'))


           
            // let urlParams = new URLSearchParams(window.location.search)
            // let urlParams  = new URLSearchParams(window.location.search)
            // console.log('link裡',window.location.search)
            // let categoryID = urlParams.get('category') 
            // console.log('link裡',categoryID)


            // if(category.startsWith('d')  ) {
            //     seriesTile.innerText = "狗狗專區" 
            //     seriesTile.setAttribute('data-title','d')
            //     updateIconLink('d')
            //     // console.log('animalTag',animalTag)
            //     // animalTag.style.backgroundImage = "url('./img/productIcon/dog.png')"
            //     changeTagImg('dog')
            //     // console.log('asbgimg',animalTag.style)
            //     console.log('category.startsWith(d) ' )
                
            // } else{
            //     seriesTile.innerText = "貓貓專區"
            //     seriesTile.setAttribute('data-title','c')
            //     updateIconLink('c')
            //     console.log('貓的category',category)
            //     // changePathname(category)

            //     changeTagImg('cat')
            //     console.log('category.startsWith(c) ' )
            // }

            updateSeriesTitle(category.startsWith('d') ? 'd' : 'c');
            productContainer.innerHTML = ''
            console.log('event.target',category) 
            changePathname(category)
            changeBanner(category)

        })
    //     console.log('category',category)
        // event.target.onclick = ()=>{
            // console.log(event.target)
        // }

    })

    // 切換類別(傳入類別,是否要更改?category="")
    function changePathname(category,updateState = true){
        // const fetchURL = new URL('http://localhost/testpet/public/product/ds')
        // console.log('我是fetchURL = ',fetchURL)
        // let originPathname = "/testpet/public/product/"
        console.log('changePathname的category',category)
        // 如果正在進行請求，就返回
        if(isFetching){ return }
        
        // 設定正在fetch，如果沒有flag，點某類別後產品還沒回傳，再點別的類別，畫面會把兩個類別都show出
        isFetching = true
        loadingArea.style.display = 'block';
        fetch(`http://localhost/testpet/public/product/${category}`,{
                method:'get',
            })
            .then(response=>{
                // console.log('res',response)
                // return response.text()   //圖片
                return response.json()  //陣列
            })
            .then(products=>{
                // console.log(products)
                
                let oneSeries = new Set()
                products.forEach(pd => {
                    if(pd.status != 'f'){

                        // 系料號加到集合中
                        oneSeries.add(pd.series_AINUM)
                    }
                })
                // console.log('我是SET集合',oneSeries)
                
                // let productContainer = document.querySelector('.product_container');
                oneSeries.forEach(arrSeriesID=>{
                    // console.log('我是SET中的系列號',arrSeriesID)
                    // let seriesProduct = products.find(pd=> pd.series_id === arrSeriesID)
                    let seriesProduct = products.find(pd=> pd.series_AINUM === arrSeriesID)
                    let {category_id,series_AINUM,cover_img,series_name,price} = seriesProduct
                    // console.log('我是636行category_id',category_id)
                    console.log('.toLocaleString()',price.toLocaleString()) //可以有千位符
                    console.log('我是seriesProduct',seriesProduct)
                    if(seriesProduct){
                        let productItem = document.createElement('div')
                        // productItem.classList.add('product_item','col-md-3','position-relative')
                        productItem.classList.add('product_item','position-relative')
                            productItem.innerHTML = `
                                <a href="http://localhost/petx/product_item.html?category=${category_id}&sID=${series_AINUM}" data-seriesID="${seriesProduct.series_AINUM}">
                                    <div class="img_wrapper">
                                        <img src="${cover_img}" alt="" class="" />
                                    </div>
                                    <p>${series_name}</p>
                                </a>
                                <p class="pd_price">${price.toLocaleString()}</p>
                                <div class="animalTag d-block position-absolute"></div>
                                `
                            productContainer.appendChild(productItem);
                            // productContainer.appendChild(dogProductItem)
                        }
                    
                })
                loadingArea.style.display = 'none';
                isFetching = false
                
               
      
                if(updateState){
                    // history.pushState(state：物件, title：通常是空字串, url：要改成的url);
                    // pushState可以點上一頁，replaceState 只修改最後一筆網址內容
                    history.pushState({category:category},'',`?category=${category}`)
                }else{
                    history.replaceState({category:category},'',`?category=${category}`)
                }
                updateSeriesTitle(category.startsWith('d') ? 'd' : 'c');

            })
            .catch(error => {
                console.error('Error:', error);
                loadingArea.style.display = 'none';
                isFetching = false

            });
    }        
       
    // 新的一筆紀錄網址會被更改到網址列內，而這時會觸發瀏覽器的內建事件 — popstate 事件
    // 類別點選上一頁時會再fetch該類別
    window.onpopstate  = ( event ) => { 
        console.log(event.state)
        if(event.state){
            productContainer.innerHTML = ''
            changePathname(event.state.category,false)
            changeBanner(event.state.category)
        }
    }
}