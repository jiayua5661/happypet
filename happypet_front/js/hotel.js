// shoppingcarfixed
document.addEventListener("scroll", function () {
  const shoppingCar = document.querySelector(".shoppingcarfixed");
  const footer = document.querySelector("footer");

  const footerRect = footer.getBoundingClientRect(); //傳回元素的大小及其相對於視口的位置
  const shoppingCarRect = shoppingCar.getBoundingClientRect();
  const offsetTop = window.pageYOffset + shoppingCarRect.top;
  const stickyTop = 85; // 設定 sticky 的頂部距離

  // 當購物車區塊的底部接近 footer 的頂部
  if (shoppingCarRect.bottom > footerRect.top) {
    shoppingCar.style.position = "absolute";
    shoppingCar.style.top = `${
      footerRect.top + window.scrollY - shoppingCarRect.height
    }px`;
  } else {
    shoppingCar.style.position = "sticky";
    shoppingCar.style.top = `${stickyTop}px`;
  }
});

// 選日期更新購物車日期跟計算晚數
document.addEventListener("DOMContentLoaded", function () {
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  const checkinDisplay = document.getElementById("checkinDisplay");
  const checkoutDisplay = document.getElementById("checkoutDisplay");
  const nightdayDisplay = document.getElementById("nightdayDisplay");
  const sameroomNightday = document.getElementById("sameroomNightday");

  function calculateNights() {
    const checkinDate = new Date(checkinInput.value);
    const checkoutDate = new Date(checkoutInput.value);
    const timeDifference = checkoutDate - checkinDate;
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    const daysDifference2 = timeDifference / (1000 * 3600 * 24);

    if (!isNaN(daysDifference) && daysDifference > 0) {
      checkinDisplay.textContent = `入住日期: ${checkinInput.value}`;
      checkoutDisplay.textContent = `退房日期: ${checkoutInput.value}`;
      nightdayDisplay.textContent = `晚數: ${daysDifference}`;
      sameroomNightday.textContent = `同房晚數: ${daysDifference2}`;
    } else {
      nightdayDisplay.textContent = "晚數: ";
      sameroomNightday.textContent = "同房晚數: ";
    }
  }

  checkinInput.addEventListener("change", calculateNights);
  checkoutInput.addEventListener("change", calculateNights);
});

// 找空房正確版
document.addEventListener("DOMContentLoaded", function () {
  const resultsContainers = {
    深景房: document.getElementById("availabilityResults1"),
    奢華房: document.getElementById("availabilityResults2"),
    總統房: document.getElementById("availabilityResults3"),
    喵皇房: document.getElementById("availabilityResults4"),
  };

  const rooms = [
    {
      type: "深景房",
      imageSrc: "../../img/30_hotel/product1.jpg",
      roomPrice: "$400",
      sameroom: "$100",
    },
    {
      type: "奢華房",
      imageSrc: "../../img/30_hotel/product2.webp",
      roomPrice: "$600",
      sameroom: "$150",
    },
    {
      type: "總統房",
      imageSrc: "../../img/30_hotel/product3.jpg",
      roomPrice: "$900",
      sameroom: "$200",
    },
    {
      type: "喵皇房",
      imageSrc: "../../img/30_hotel/product4.jpg",
      roomPrice: "$500",
      sameroom: "$100",
    },
  ];

  function renderRooms(roomData) {
    // 清除之前的內容
    Object.values(resultsContainers).forEach((container) => {
      container.innerHTML = "";
    });

    roomData.forEach((room) => {
      let priceTableHTML;

      if (room.type === "喵皇房") {
        priceTableHTML = `
                <div class="col-lg-7 col-md-12 col-sm-12 text-center price-table-container">
                    <table id="priceTable" class="table">
                        <thead id="mythead" class="fs-5">
                            <tr>
                              <th class="text-light">房型</th>
                              <th class="text-light">喵皇房</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="custom-table">
                              <td class="text-light">最多可住宿隻數</td>
                              <td>三隻貓貓</td>
                            </tr>
                            <tr class="custom-table">
                              <td class="text-light">房價(一晚)</td>
                              <td>$500</td>
                            </tr>
                            <tr class="custom-table">
                              <td class="text-light">同房價(隻)</td>
                              <td>$100</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                `;
      } else {
        priceTableHTML = `
                <div class="col-lg-7 col-md-12 col-sm-12 text-center price-table-container">
                    <table id="priceTable" class="table">
                        <thead id="mythead" class="fs-5">
                            <tr>
                              <th class="text-light">房型</th>
                              <th class="text-light">深景房</th>
                              <th class="text-light">奢華房</th>
                              <th class="text-light">總統房</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="custom-table">
                              <td class="text-light">最多可住宿隻數</td>
                              <td>兩隻小型犬</td>
                              <td>三隻小型犬<br />一隻中型犬<br />一隻小型犬&一隻中型犬</td>
                              <td>一隻大型犬<br />四隻小型犬<br />兩隻中型犬</td>
                            </tr>
                            <tr class="custom-table">
                              <td class="text-light">房價(一晚)</td>
                              <td>$400</td>
                              <td>$600</td>
                              <td>$900</td>
                            </tr>
                            <tr class="custom-table">
                              <td class="text-light">同房價(隻)</td>
                              <td>$100</td>
                              <td>$150</td>
                              <td>$200</td>
                            </tr>
                            <thead id="mythead" class="fs-5">
                              <th class="text-light fs-5" colspan="4">住宿限制</th>
                            </thead>
                            <tr class="custom-table">
                              <td class="text-light">體重</td>
                              <td>小型犬<br />10kg以下</td>
                              <td>中型犬<br />10~20kg</td>
                              <td>大型犬<br />20~40kg</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                `;
      }

      const roomHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-5 col-md-12 col-sm-12 d-flex justify-content-center pe-5">
                    <div class="myProduct product-container border border-secondary border-opacity-25 border-2 rounded-2 position-relative">
                        <div id="myProductimg" class="text-center mb-3 mt-0">
                            <img src="${room.imageSrc}" alt="${room.type}" class="img-fluid" />
                            <p class="room">
                                <span class="fw-bold fs-4 text-light">${room.type}</span>
                            </p>
                        </div>
                        <div class="d-flex align-items-center fs-5">
                            <button class="choose ms-1 p-2" data-room-type="${room.type}">選擇寵物</button>
                            <div class="pet-container"></div>
                        </div>
                        <div class="quantity-container mt-3 ms-2 fs-5">
                            <label for="productQuantity${room.type}">數量:</label>
                            <input type="number" value="1" min="1" max="3" class="hotelQuantity" id="hotelQuantity${room.type}" />
                        </div>
                        <div class="mt-3 ms-2 fs-5">
                            <p>房價：${room.roomPrice}</p>
                        </div>
                        <div class="mt-3 ms-2 fs-5">
                            <p>同房價：${room.sameroom}</p>
                        </div>
                        <div class="text-end">
                            <button class="btn btn-outline-secondary opacity-75 position-absolute bottom-0 end-0 m-3 btn-lg addToCartBtn" data-room-type="${room.type}" data-room-price="${room.roomPrice}">
                                加入購物車
                            </button>
                        </div>
                    </div>
                </div>
                ${priceTableHTML}
            </div>`;

      // 將房型 HTML 插入到對應的容器中
      const container = resultsContainers[room.type];
      if (container) {
        container.innerHTML = roomHTML;
      }
    });

    // 綁定 "選擇寵物" 按鈕的事件監聽器
    const chooseButtons = document.querySelectorAll(".choose");
    chooseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // 取得當前按鈕所在的容器
        const petContainer = button.nextElementSibling;

        // 發送 AJAX 請求獲取 UID 3 的寵物名稱
        fetch(
          "http://localhost/happypet/happypet_back/public/api/hotel_user_pets"
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // 清空之前的內容
            petContainer.innerHTML = "";

            // 動態生成勾選框和 label
            const petData = data.map((pet) => pet);
            petData.forEach((pet, index) => {
              const petCheckboxHTML = `
                        <div class="form-check ms-2">
                            <input class="form-check-input pet-checkbox" type="checkbox" value="${pet.pid}" id="petCheckbox${index}" />
                            <label class="form-check-label" for="petCheckbox${index}">
                                ${pet.pet_name}
                            </label>
                        </div>`;
              petContainer.innerHTML += petCheckboxHTML;
            });

            // 綁定勾選框的事件監聽器
            const petCheckboxes =
              petContainer.querySelectorAll(".pet-checkbox");
            petCheckboxes.forEach((checkbox) => {
              checkbox.addEventListener("change", updateSameRoomCount);
            });
          });
      });
    });

    // 同房數跟同房價
    function updateSameRoomCount() {
      // 獲取所有勾選中的勾選框
      const selectedCheckboxes = document.querySelectorAll(
        ".pet-checkbox:checked"
      );
      const sameRoomCountElement = document.getElementById("sameRoomCount");
      const sameRoomPriceElement = document.getElementById("sameRoomPrice");

      // 如果勾選多於一個寵物，從1開始累加；如果只勾選一個，顯示0
      const sameRoomCount =
        selectedCheckboxes.length > 1 ? selectedCheckboxes.length - 1 : 0;
      console.log("selectedCheckboxes", selectedCheckboxes.length);
      // 更新同房數
      if (sameRoomCountElement) {
        sameRoomCountElement.textContent = `同房數: ${sameRoomCount}`;
      }

      // 取得當前房型
      const roomType = selectedCheckboxes[0]
        ?.closest(".product-container")
        .querySelector(".room")
        .textContent.trim();

      // 更新同房價
      if (sameRoomPriceElement) {
        if (sameRoomCount === 0) {
          sameRoomPriceElement.textContent = "同房價: $0";
        } else {
          const room = rooms.find((r) => r.type === roomType);
          const sameRoomPrice =
            parseInt(room.sameroom.replace("$", "")) * sameRoomCount;
          sameRoomPriceElement.textContent = `同房價: $${sameRoomPrice}`;
        }
      }
    }

    // 更新總金額的函數
    function updateCartTotal() {
      const nightCountText =
        document.getElementById("nightdayDisplay")?.textContent || "0";
      const quantityText =
        document.getElementById("hotelCartQuantity")?.textContent || "0";
      const roomPriceText =
        document.getElementById("hotelCartPrice")?.textContent || "0";
      const sameRoomCountText =
        document.getElementById("sameRoomCount")?.textContent || "0";
      const sameRoomPriceText =
        document.getElementById("sameRoomPrice")?.textContent || "0";

      // 提取數字部分
      const nightCount =
        parseInt(nightCountText.replace("晚數:", "").trim()) || 0;
      const quantity = parseInt(quantityText.replace("數量:", "").trim()) || 0;
      const roomPrice =
        parseInt(roomPriceText.replace("房價:", "").replace("$", "").trim()) ||
        0;
      const sameRoomCount = parseInt(
        sameRoomCountText.replace("同房數:", "").trim()
      );
      const sameRoomPrice =
        parseInt(
          sameRoomPriceText.replace("同房價:", "").replace("$", "").trim()
        ) || 0;
      console.log("quantityText", quantityText);
      console.log("sameRoomCountText", sameRoomCountText);
      console.log("數---->", quantityText.replace("數量:", "").trim());
      console.log("sameRoomCount", sameRoomCount);
      console.log("sameRoomPrice", sameRoomPrice);
      console.log(
        "sameRoomPrice------->",
        sameRoomCountText.replace("同房數:", "").trim()
      );

      // 計算總金額
      const totalPrice =
        nightCount * quantity * roomPrice +
        sameRoomCount * sameRoomPrice * nightCount;

      // 格式化總金額為數字
      const numericTotalPrice = totalPrice; // 直接使用數字值

      // 格式化總金額讓它變成 $x,xxx
      const formattedTotalPrice = totalPrice.toLocaleString("en-US");

      // 更新總金額顯示，帶 $ 符號
      document.getElementById(
        "roomTotal"
      ).textContent = `NT$${formattedTotalPrice}`;
      console.log(formattedTotalPrice);

      // 儲存數字總金額到 localStorage
      localStorage.setItem("roomTotal", numericTotalPrice.toString());
    }

    // 綁定 "加入購物車" 按鈕的事件監聽器
    const addToCartButtons = document.querySelectorAll(".addToCartBtn");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // 取得房型和房價
        const roomType = button.getAttribute("data-room-type");
        const roomPrice = button.getAttribute("data-room-price");

        const productContainer = button.closest(".product-container");
        if (productContainer) {
          const selectedQuantity =
            productContainer.querySelector(".hotelQuantity");
          const selectedPets = Array.from(
            productContainer.querySelectorAll(".pet-checkbox:checked")
          ).map((checkbox) => {
            const petId = checkbox.value;
            const petName = checkbox.nextElementSibling.textContent;
            return { petId, petName };
          });

          if (selectedQuantity) {
            const quantity = selectedQuantity.value;

            // 更新產品名稱
            const hotelNameElement = document.getElementById("hotelName");
            if (hotelNameElement) {
              hotelNameElement.textContent = `產品名稱: ${roomType}`;
            }

            // 更新購物車數量
            const cartQuantityElement =
              document.getElementById("hotelCartQuantity");
            if (cartQuantityElement) {
              cartQuantityElement.textContent = `數量: ${quantity}`;
            }

            // 更新購物車房價
            const cartPriceElement = document.getElementById("hotelCartPrice");
            if (cartPriceElement) {
              cartPriceElement.textContent = `房價: ${roomPrice}`;
            }

            // 更新購物車寵物名稱
            const cartPetsElement = document.getElementById("hotelPetName");
            if (cartPetsElement) {
              const petNames = selectedPets
                .map((pet) => pet.petName)
                .join(", ");
              cartPetsElement.textContent = `入住寵物: ${petNames}`;
            }
            // 保存到localStorage
            const petIds = selectedPets.map((pet) => pet.petId).join(", ");
            localStorage.setItem("selectedPetIds", petIds); // 儲存pid

            // 清理 selectedPetNames 中的多餘空白和換行符號
            const cleanedPetNames = selectedPets
              .map((pet) => pet.petName.trim()) // 去除每個名稱前後的空白
              .filter((name) => name !== "") // 過濾掉空字串
              .join(", "); // 重新組合為用逗號分隔的字串

            localStorage.setItem("selectedPetNames", cleanedPetNames); // 儲存清理後的名稱

            // 更新購物車總金額
            updateCartTotal();
          }
        }
      });
    });
  }

  function fetchAndRenderRooms(query = "") {
    fetch(
      `http://localhost/happypet/happypet_back/public/api/check-availability${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("房間", data);
        if (data.room_availability.length === 0) {
          Object.values(resultsContainers).forEach((container) => {
            container.innerHTML = "<p>沒有空房，請重新選擇日期！</p>";
          });
        } else {
          const availableRooms = rooms.filter((room) =>
            data.room_availability.some(
              (r) => r.room_type === room.type && r.available_rooms > 0
            )
          );
          renderRooms(availableRooms);
        }
      })
      .catch((error) => {
        console.error("發生錯誤：", error);
        Object.values(resultsContainers).forEach((container) => {
          container.innerHTML = "<p>發生錯誤，請稍後再試。</p>";
        });
      });
  }

  // 頁面加載時顯示所有房間
  renderRooms(rooms);

  document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // 防止表單提交

      const checkinDate = document.getElementById("checkin").value;
      const checkoutDate = document.getElementById("checkout").value;

      const query = `?checkin=${encodeURIComponent(
        checkinDate
      )}&checkout=${encodeURIComponent(checkoutDate)}`;
      fetchAndRenderRooms(query);
    });
});

// 設置入住和退房日期的最小值
const today = new Date().toISOString().split("T")[0];
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");

checkin.setAttribute("min", today);

checkin.addEventListener("change", function () {
  const checkinDate = new Date(checkin.value);
  const checkoutDate = new Date(checkout.value);

  if (checkinDate < new Date(today)) {
    alert("入住日期不能早於今天，請重新選擇！");
    checkin.value = "";
    checkout.value = "";
    checkout.setAttribute("min", today);
  } else {
    checkout.setAttribute("min", checkin.value);
  }

  if (checkoutDate && checkoutDate < checkinDate) {
    alert("入住日期不能晚於退房日期，請重新選擇！");
    checkin.value = "";
    checkout.value = "";
  }
});

checkout.addEventListener("change", function () {
  const checkinDate = new Date(checkin.value);
  const checkoutDate = new Date(checkout.value);

  if (checkinDate && checkoutDate < checkinDate) {
    alert("退房日期不能早於入住日期，請重新選擇！");
    checkin.value = "";
    checkout.value = "";
  }
});
// 獲取購物車中的資訊
function saveToLocalStorageHotelOrder() {
  const getValue = (id) =>
    document.getElementById(id).innerText.split(": ")[1] || "";

  const hotelName = getValue("hotelName");
  const hotelPetName = getValue("hotelPetName");
  const checkinDisplay = getValue("checkinDisplay");
  const checkoutDisplay = getValue("checkoutDisplay");
  const nightdayDisplay = getValue("nightdayDisplay");
  const hotelCartQuantity = getValue("hotelCartQuantity");
  const hotelCartPrice = getValue("hotelCartPrice");
  const sameRoomCount = getValue("sameRoomCount");
  const sameroomNightday = getValue("sameroomNightday");
  const sameRoomPrice = getValue("sameRoomPrice");
  const roomTotal = document
    .getElementById("roomTotal")
    .textContent.replace("NT$", "")
    .replace(",", "")
    .trim(); // 移除NT$和逗號，保留數字

  // 檢查是否所有必填項目都已填寫
  if (
    !hotelName ||
    !hotelPetName ||
    !checkinDisplay ||
    !checkoutDisplay ||
    !nightdayDisplay ||
    !hotelCartQuantity ||
    !hotelCartPrice ||
    !sameRoomCount ||
    !sameroomNightday ||
    !sameRoomPrice ||
    !roomTotal
  ) {
    alert("未填寫完成，請填寫所有項目！");
    return; // 終止保存操作
  }

  // 從 localStorage 中讀取選中的寵物資料
  const selectedPetIds = localStorage.getItem("selectedPetIds") || "";
  const selectedPetNames = localStorage.getItem("selectedPetNames") || "";

  // 將純值存儲到 localStorage
  localStorage.setItem("hotelName", hotelName);
  localStorage.setItem("hotelPetName", hotelPetName);
  localStorage.setItem("checkinDisplay", checkinDisplay);
  localStorage.setItem("checkoutDisplay", checkoutDisplay);
  localStorage.setItem("nightdayDisplay", nightdayDisplay);
  localStorage.setItem("hotelCartQuantity", hotelCartQuantity);
  localStorage.setItem("hotelCartPrice", hotelCartPrice);
  localStorage.setItem("sameRoomCount", sameRoomCount);
  localStorage.setItem("sameroomNightday", sameroomNightday);
  localStorage.setItem("sameRoomPrice", sameRoomPrice);
  localStorage.setItem("roomTotal", roomTotal); // 儲存數字格式的總金額

  // 從 localStorage 中取得現有的訂單陣列，確保它是一個數組
  let orders = JSON.parse(localStorage.getItem("hotelorders")) || [];

  // 建立新的訂單物件
  const newOrder = {
    hotelName,
    hotelPetName,
    checkinDisplay,
    checkoutDisplay,
    nightdayDisplay,
    hotelCartQuantity,
    hotelCartPrice,
    sameRoomCount,
    sameroomNightday,
    sameRoomPrice,
    roomTotal,
    selectedPetIds, // 添加選中的寵物ID
    selectedPetNames, // 添加選中的寵物名稱
  };

  // 將新的訂單追加到訂單陣列中
  orders.push(newOrder);

  // 將更新後的訂單陣列存回 localStorage
  localStorage.setItem("hotelorders", JSON.stringify(orders));

  // 跳轉到 hotelorder.html 頁面
  window.location.href = "hotelorder.html";
}
