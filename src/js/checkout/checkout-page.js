import createStorage from "../storage";

const storage = createStorage();

function createCartItemElement(order) {
  const selectedCartItem = document.createElement("li");
  selectedCartItem.className = "selected-item-cart";

  const selectedCartItemImgWrapper = document.createElement("div");
  selectedCartItemImgWrapper.className = "selected-item-cart__img-wrapper";

  const selectedCartItemImg = document.createElement("img");
  selectedCartItemImg.className = "selected-item-cart__img";
  selectedCartItemImg.setAttribute("src", order.imageURL);
  selectedCartItemImg.setAttribute("alt", order.model);

  selectedCartItemImgWrapper.appendChild(selectedCartItemImg);
  selectedCartItem.appendChild(selectedCartItemImgWrapper);

  const selectedCartItemDescWrapper = document.createElement("div");
  selectedCartItemDescWrapper.className = "selected-item-cart__desc-wrapper";

  const selectedCartItemModel = document.createElement("p");
  selectedCartItemModel.className = "selected-item-cart__model";
  selectedCartItemModel.textContent = order.model;
  selectedCartItemDescWrapper.appendChild(selectedCartItemModel);

  const selectedCartItemSeries = document.createElement("p");
  selectedCartItemSeries.className = "selected-item-cart__series";
  selectedCartItemSeries.textContent = order.series;
  selectedCartItemDescWrapper.appendChild(selectedCartItemSeries);

  const selectedCartItemShortDesc = document.createElement("p");
  selectedCartItemShortDesc.className = "selected-item-cart__short-description";
  selectedCartItemShortDesc.textContent = order.description.miniDescription;
  selectedCartItemDescWrapper.appendChild(selectedCartItemShortDesc);

  const selectedCartItemPriceRatingWrapper = document.createElement("div");
  selectedCartItemPriceRatingWrapper.className =
    "selected-item-cart__price-rating-wrapper";

  const selectedCartItemPriceWrapper = document.createElement("div");
  selectedCartItemPriceWrapper.className = "selected-item-cart__price-wrapper";

  const selectedCartItemPrice = document.createElement("p");
  selectedCartItemPrice.className = "selected-item-cart__price";
  selectedCartItemPrice.textContent = `${order.currency} ${order.cost}`;
  selectedCartItemPriceWrapper.appendChild(selectedCartItemPrice);

  const xElement = document.createElement("p");
  xElement.className = "x";
  xElement.textContent = "x";
  selectedCartItemPriceWrapper.appendChild(xElement);

  const selectedCartItemQuantity = document.createElement("p");
  selectedCartItemQuantity.className = "selected-item-cart__quantity";
  selectedCartItemQuantity.textContent = order.quantity;
  selectedCartItemPriceWrapper.appendChild(selectedCartItemQuantity);

  selectedCartItemPriceRatingWrapper.appendChild(selectedCartItemPriceWrapper);
  selectedCartItemDescWrapper.appendChild(selectedCartItemPriceRatingWrapper);
  selectedCartItem.appendChild(selectedCartItemDescWrapper);

  return selectedCartItem;
}

async function renderSelectedItems() {
  let totalGoodsSum = 0;
  try {
      const orders = await storage.getOrders();
      const selectedItemsCartList = document.querySelector(".selected-items-cart");
      selectedItemsCartList.innerHTML = "";

      for (const order of orders) {
          const selectedCartItem = createCartItemElement(order);
          selectedItemsCartList.appendChild(selectedCartItem);

          totalGoodsSum += order.cost * order.quantity;
      }

      const deliveryCost = 6.99;

      const goodsSumElement = document.querySelector(".goods-sum");
      goodsSumElement.textContent = `${orders[0].currency} ${totalGoodsSum.toFixed(2)}`;

      const deliveryCostElement = document.querySelector(".delivery-cost");
      deliveryCostElement.textContent = `${orders[0].currency} ${deliveryCost.toFixed(2)}`;

      const totalAmount = totalGoodsSum + deliveryCost;
      const totalAmountElement = document.querySelector(".sum-up-amount");
      totalAmountElement.textContent = `${orders[0].currency} ${totalAmount.toFixed(2)}`;
  } catch (error) {
      console.error("Error rendering selected items in cart:", error);
  }
  return { totalGoodsSum }; 
}

document.addEventListener("DOMContentLoaded", async function () {
  const { totalGoodsSum } = await renderSelectedItems();

  const customerInfoChangeButton = document.querySelector(
    ".customer-info-change-button"
  );
  const paymentTypeChangeButton = document.querySelector(
    ".payment-type-change-button"
  );
  const popUp = document.querySelector(".pop-up");
  const popUpPayment = document.querySelector(".pop-up-payment");

  customerInfoChangeButton.addEventListener("click", () => {
    popUp.classList.add("pop-up-open");

    const customerData = JSON.parse(localStorage.getItem("customerData"));
    if (customerData) {
      const nameInput = document.querySelector(".name");
      const addressInput = document.querySelector(".address");
      const cityInput = document.querySelector(".city");
      const telephoneInput = document.querySelector(".telephone");

      nameInput.value = customerData.name;
      addressInput.value = customerData.address;
      cityInput.value = customerData.city;
      telephoneInput.value = customerData.telephone;
    }
  });

  const saveButton = popUp.querySelector(".save");
  saveButton.addEventListener("click", async () => {
    const nameInput = document.querySelector(".name");
    const addressInput = document.querySelector(".address");
    const cityInput = document.querySelector(".city");
    const telephoneInput = document.querySelector(".telephone");

    const customersNameElement = document.querySelector(".customers-name");
    const customersAddressElement =
      document.querySelector(".customers-address");
    const customersCityElement = document.querySelector(".customers-city");
    const customersTelephoneElement = document.querySelector(
      ".customers-telephone"
    );

    const customerData = {
      name: nameInput.value,
      address: addressInput.value,
      city: cityInput.value,
      telephone: telephoneInput.value,
    };

    customersNameElement.textContent = customerData.name;
    customersAddressElement.textContent = customerData.address;
    customersCityElement.textContent = customerData.city;
    customersTelephoneElement.textContent = customerData.telephone;

    let payMethod = "";
    const cardCheckbox = document.getElementById("card");
    const cashCheckbox = document.getElementById("cash");

    if (cardCheckbox.checked) {
      payMethod = "Оплата картой при получении";
    } else if (cashCheckbox.checked) {
      payMethod = "Оплата наличными при получении";
    }

    const paymentCheckedTypeElement = document.querySelector(
      ".payment-checked-type"
    );
    paymentCheckedTypeElement.textContent = payMethod;

    popUp.classList.remove("pop-up-open");
  });

  const popUpContent = document.querySelector(".pop-up-elements");

  popUp.addEventListener("click", (event) => {
    if (!event.composedPath().includes(popUpContent)) {
      popUp.classList.remove("pop-up-open");
    }
  });

  paymentTypeChangeButton.addEventListener("click", () => {
    popUpPayment.classList.add("pop-up-open");

    const cardCheckbox = document.getElementById("card");
    const cashCheckbox = document.getElementById("cash");

    cardCheckbox.addEventListener("change", () => {
      if (cardCheckbox.checked) {
        cashCheckbox.checked = false;
      }
    });

    cashCheckbox.addEventListener("change", () => {
      if (cashCheckbox.checked) {
        cardCheckbox.checked = false;
      }
    });
  });

  const paymentTypeSaveButton = popUpPayment.querySelector(".save-btn");
  paymentTypeSaveButton.addEventListener("click", async () => {
    const cardCheckbox = document.getElementById("card");
    const cashCheckbox = document.getElementById("cash");
    const paymentCheckedTypeElement = document.querySelector(
      ".payment-checked-type"
    );

    if (cardCheckbox.checked) {
      paymentCheckedTypeElement.textContent = "Оплата картой при получении";
    } else if (cashCheckbox.checked) {
      paymentCheckedTypeElement.textContent = "Оплата наличными при получении";
    } else {
      paymentCheckedTypeElement.textContent = "Способ оплаты не выбран";
    }

    popUpPayment.classList.remove("pop-up-open");
  });

  const popUpPaymentContent = document.querySelector(
    ".pop-up-elements-payment"
  );
  popUpPayment.addEventListener("click", (event) => {
    if (!event.composedPath().includes(popUpPaymentContent)) {
      popUpPayment.classList.remove("pop-up-open");
    }
  });

  const checkoutButton = document.querySelector(".checkout-btn");
  checkoutButton.addEventListener("click", async () => {
    try {
      const customersNameElement = document
        .querySelector(".customers-name")
        .textContent.trim();
      const customersAddressElement = document
        .querySelector(".customers-address")
        .textContent.trim();
      const customersCityElement = document
        .querySelector(".customers-city")
        .textContent.trim();
      const customersTelephoneElement = document
        .querySelector(".customers-telephone")
        .textContent.trim();
      const cardCheckbox = document.getElementById("card");
      const cashCheckbox = document.getElementById("cash");

      if (
        customersNameElement === "" ||
        customersAddressElement === "" ||
        customersCityElement === "" ||
        customersTelephoneElement === ""
      ) {
        alert("Пожалуйста, заполните все данные клиента.");
        return;
      }

      if (!cardCheckbox.checked && !cashCheckbox.checked) {
        alert("Пожалуйста, выберите метод оплаты.");
        return;
      }

      const customerInfo = {
        name: document.querySelector(".customers-name").textContent,
        address: document.querySelector(".customers-address").textContent,
        city: document.querySelector(".customers-city").textContent,
        telephone: document.querySelector(".customers-telephone").textContent,
      };

      const selectedItemsCart = document.querySelectorAll(
        ".selected-item-cart"
      );
      const selectedItems = [];
      let totalAmount = 0;

      selectedItemsCart.forEach((item) => {
        const itemModel = item.querySelector(
          ".selected-item-cart__model"
        ).textContent;
        const itemSeries = item.querySelector(
          ".selected-item-cart__series"
        ).textContent;
        const itemQuantity = parseInt(
          item.querySelector(".selected-item-cart__quantity").textContent
        );
        const itemCost = parseFloat(
          item
            .querySelector(".selected-item-cart__price")
            .textContent.replace(/[^\d.]/g, "")
        );
        const itemCurrency = item
          .querySelector(".selected-item-cart__price")
          .textContent.replace(/[\d.]/g, "")
          .trim();
        const itemImageURL = item
          .querySelector(".selected-item-cart__img")
          .getAttribute("src");

        const itemMiniDescription = item.querySelector(
          ".selected-item-cart__short-description"
        ).textContent;

        totalAmount += itemCost * itemQuantity;

        selectedItems.push({
          model: itemModel,
          series: itemSeries,
          quantity: itemQuantity,
          cost: itemCost,
          currency: itemCurrency,
          miniDescription: itemMiniDescription,
          imageURL: itemImageURL,
        });
      });

      const paymentTypeLabel = document.querySelector(
        ".payment-checked-type"
      ).textContent;

      await storage.addCompletedOrder({
        customerName: customerInfo.name,
        customerAddress: customerInfo.address,
        customerCity: customerInfo.city,
        customerTelephone: customerInfo.telephone,
        items: selectedItems,
        totalGoodsSum: totalGoodsSum,
        totalAmount: totalGoodsSum + 6.99,
        payMethod: paymentTypeLabel,
      });

      window.location.href = "order.html"; 

    } catch (error) {
      console.error("Ошибка:", error); 
    }
  });
});