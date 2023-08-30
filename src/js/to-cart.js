import createStorage from "./storage";

const storage = createStorage();

export async function addToCart(item) {
  try {
    await storage.addToOrders(item);
    await renderOrders();
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
}

export async function renderOrders() {
  try {
    const orders = await storage.getOrders();
    const selectedItemsList = document.querySelector(".selected-items");
    selectedItemsList.innerHTML = "";

    for (const order of orders) {
      const selectedItem = document.createElement("li");
      selectedItem.className = "selected-item";

      const selectedItemLink = document.createElement("a");
      selectedItemLink.setAttribute("href", `item.html?id=${order.id}`);

      const selectedItemImg = document.createElement("img");
      selectedItemImg.className = "selected-item-img";
      selectedItemImg.setAttribute("src", `${order.imageURL}`);
      selectedItemImg.setAttribute("alt", `${order.model}`);

      selectedItemLink.appendChild(selectedItemImg);
      selectedItem.appendChild(selectedItemLink);

      selectedItemsList.appendChild(selectedItem);
    }
  } catch (error) {
    console.error("Error rendering orders:", error);
  }
}
