import createStorage from "../storage";
import { addToCart, renderOrders } from "../to-cart";

const itemContainer = document.querySelector(".item");
const itemsColumn = document.querySelector(".items-column");
const storage = createStorage();

async function renderSelectedItem() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get("id");

    const item = await storage.getItemById(itemId);

    if (!item) {
      const errorElement = document.createElement("p");
      errorElement.className = "error";
      errorElement.textContent = "Ошибка. Такого товара нет.";
      itemContainer.appendChild(errorElement);
      return; 
    }

    const { imageURL, model, series, cost, currency, description } = item;

    const itemImgWrapper = document.createElement("li");
    itemImgWrapper.className = "item-img-wrapper";

    const imgElement = document.createElement("img");
    imgElement.className = "item-img";
    imgElement.setAttribute("src", imageURL);
    imgElement.setAttribute("alt", model);
    itemImgWrapper.appendChild(imgElement);

    const itemDesc = document.createElement("li");
    itemDesc.className = "item-desc";

    const modelElement = document.createElement("p");
    modelElement.className = "item-model";
    modelElement.textContent = model;
    itemDesc.appendChild(modelElement);

    const seriesElement = document.createElement("p");
    seriesElement.className = "item-series";
    seriesElement.textContent = series;
    itemDesc.appendChild(seriesElement);

    const priceElement = document.createElement("p");
    priceElement.className = "item-price";
    if (cost && currency) {
      priceElement.textContent = `${currency} ${cost}`;
    } else {
      priceElement.textContent = "Price information missing";
    }
    itemDesc.appendChild(priceElement);

    const shortDescElement = document.createElement("p");
    shortDescElement.className = "item-short-description";
    shortDescElement.textContent = description.shortDescription;
    itemDesc.appendChild(shortDescElement);

    itemContainer.appendChild(itemImgWrapper);
    itemContainer.appendChild(itemDesc);

    const addToCartBtnWrapper = document.createElement("div");
    addToCartBtnWrapper.className = "item-add-to-cart-btn-wrapper";

    const addToCartButton = document.createElement("button");
    addToCartButton.className = "item-add-to-cart-btn";
    addToCartButton.addEventListener("click", async function() {
      addToCart(item);
      console.log("Товар добавлен в корзину!");
    });

    addToCartBtnWrapper.appendChild(addToCartButton);
    itemDesc.appendChild(addToCartBtnWrapper);

    const itemDescTitle = document.createElement("p");
    itemDescTitle.className = "item-desс-title";
    itemDescTitle.textContent = "Описание";
    itemsColumn.insertAdjacentElement('beforeend', itemDescTitle);

    const longDescElement = document.createElement("p");
    longDescElement.className = "item-long-description";
    longDescElement.textContent = description.longDescription;
    itemsColumn.insertAdjacentElement('beforeend', longDescElement);

  } catch (error) {
    console.error("Error rendering selected item:", error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await renderSelectedItem();
  await renderOrders();
});