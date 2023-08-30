import createStorage from "../storage";
import { addToCart, renderOrders } from "../to-cart";

const itemsNode = document.querySelector(".js-items");
const storage = createStorage();

function createItemListItem(item) {
  const listItem = document.createElement("li");
  listItem.className = "item";
  listItem.dataset.id = item.id;

  const itemImgWrapper = document.createElement("a");
  itemImgWrapper.className = "item-img-wrapper";
  itemImgWrapper.href = `item.html?id=${item.id}`;
  const imgElement = document.createElement("img");
  imgElement.className = "item-img";
  imgElement.src = item.imageURL;
  imgElement.alt = item.model;
  itemImgWrapper.appendChild(imgElement);

  const modelWrapper = document.createElement("a");
  modelWrapper.className = "item-model-wrapper";
  modelWrapper.href = `item.html?id=${item.id}`;
  const modelElement = document.createElement("p");
  modelElement.className = "item-model";
  modelElement.textContent = item.model;
  modelWrapper.appendChild(modelElement);

  const seriesWrapper = document.createElement("a");
  seriesWrapper.className = "item-series-wrapper";
  seriesWrapper.href = `item.html?id=${item.id}`;
  const seriesElement = document.createElement("p");
  seriesElement.className = "item-series";
  seriesElement.textContent = item.series;
  seriesWrapper.appendChild(seriesElement);

  const priceWrapper = document.createElement("div");
  priceWrapper.className = "item-price-wrapper";
  const priceElement = document.createElement("p");
  priceElement.className = "item-price";
  priceElement.textContent = item.cost && item.currency
    ? `${item.currency} ${item.cost}`
    : "Price information missing";

  const addToCartButton = document.createElement("button");
  addToCartButton.className = "item-add-to-cart-btn";
  addToCartButton.addEventListener("click", async () => {
    try {
      await storage.addToOrders(item);
      await renderOrders();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  });

  priceWrapper.appendChild(priceElement);
  priceWrapper.appendChild(addToCartButton);
  listItem.appendChild(itemImgWrapper);
  listItem.appendChild(modelWrapper);
  listItem.appendChild(seriesWrapper);
  listItem.appendChild(priceWrapper);

  return listItem;
}

async function renderItems() {
  try {
    const items = await storage.getData();
    itemsNode.innerHTML = "";
    items.forEach(item => {
      const listItem = createItemListItem(item);
      itemsNode.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error rendering items:", error);
  }
}

async function init() {
  try {
    await renderItems();
    await renderOrders();
  } catch (error) {
    console.error("An error occurred while initializing:", error);
  }
}

document.addEventListener("DOMContentLoaded", init);