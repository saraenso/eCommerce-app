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
  selectedCartItemPriceRatingWrapper.className = "selected-item-cart__price-rating-wrapper";

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

  const selectedCartItemQuantityBar = document.createElement("div");
  selectedCartItemQuantityBar.className = "selected-item-cart__quantity-bar";

  const selectedCartItemQuantityMinus = document.createElement("button");
  selectedCartItemQuantityMinus.className = "selected-item-cart__quantity-minus";
  selectedCartItemQuantityBar.appendChild(selectedCartItemQuantityMinus);

  const selectedCartItemQuantityIndex = document.createElement("p");
  selectedCartItemQuantityIndex.className = "selected-item-cart__quantity-index";
  selectedCartItemQuantityIndex.textContent = order.quantity;
  selectedCartItemQuantityBar.appendChild(selectedCartItemQuantityIndex);

  const selectedCartItemQuantityPlus = document.createElement("button");
  selectedCartItemQuantityPlus.className = "selected-item-cart__quantity-plus";
  selectedCartItemQuantityBar.appendChild(selectedCartItemQuantityPlus);

  selectedCartItemPriceRatingWrapper.appendChild(selectedCartItemQuantityBar);
  selectedCartItemDescWrapper.appendChild(selectedCartItemPriceRatingWrapper);
  selectedCartItem.appendChild(selectedCartItemDescWrapper);

  return selectedCartItem;
}

async function renderSelectedItems() {
  try {
    const orders = await storage.getOrders();
    const selectedItemsCartList = document.querySelector(".selected-items-cart");
    selectedItemsCartList.innerHTML = "";

    let totalSum = 0;

    if (orders.length === 0) {
      document.getElementById("cartTitle").textContent = "Корзина пуста";
    } else {
      document.getElementById("cartTitle").textContent = "Проверь корзину";
    }

    for (const order of orders) {
      const selectedCartItem = createCartItemElement(order);
      selectedItemsCartList.appendChild(selectedCartItem);

      const itemTotal = order.cost * order.quantity;
      totalSum += itemTotal;
    }

    const selectedItemsSum = document.querySelector(".selected-items-sum");
    selectedItemsSum.textContent = `Сумма: ${orders[0].currency} ${totalSum.toFixed(2)}`;

    const selectedItemsList = document.querySelector(".selected-items");
    selectedItemsList.innerHTML = "";

    for (const order of orders) {
      const selectedOrderItem = document.createElement("li");
      selectedOrderItem.className = "selected-item";

      const selectedOrderItemLink = document.createElement("a");
      selectedOrderItemLink.setAttribute("href", `item.html?id=${order.id}`);

      const selectedOrderItemImage = document.createElement("img");
      selectedOrderItemImage.className = "selected-item-img";
      selectedOrderItemImage.setAttribute("src", order.imageURL);
      selectedOrderItemImage.setAttribute("alt", order.model);

      selectedOrderItemLink.appendChild(selectedOrderItemImage);
      selectedOrderItem.appendChild(selectedOrderItemLink);

      selectedItemsList.appendChild(selectedOrderItem);
    }

    const quantityMinusButtons = document.querySelectorAll(".selected-item-cart__quantity-minus");
    const quantityPlusButtons = document.querySelectorAll(".selected-item-cart__quantity-plus");

    quantityMinusButtons.forEach((button, index) => {
      button.addEventListener("click", () => updateOrderQuantity(orders[index].id, "decrease"));
    });

    quantityPlusButtons.forEach((button, index) => {
      button.addEventListener("click", () => updateOrderQuantity(orders[index].id, "increase"));
    });

  } catch (error) {
    console.error("Error rendering selected items in cart:", error);
  }
}

async function updateOrderQuantity(orderId, action) {
  try {
    const order = await storage.getOrderById(orderId); 
    let newQuantity = order.quantity;

    if (action === "increase") {
      newQuantity += 1;
    } else if (action === "decrease") {
      newQuantity -= 1;
    }

    if (newQuantity <= 0) {
      await storage.deleteOrder(orderId); 
    } else {
      await storage.updateOrderQuantity(orderId, newQuantity); 
    }

    await renderSelectedItems();
  } catch (error) {
    console.error("Error updating order quantity:", error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await renderSelectedItems();
});
