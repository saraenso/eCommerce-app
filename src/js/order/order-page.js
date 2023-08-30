import createStorage from "../storage.js";

const storage = createStorage();
const orderedItemsCart = document.querySelector(".ordered-items-cart");
const customerNameElem = document.querySelector(".customers-name");
const customerAddressElem = document.querySelector(".customers-address");
const customerCityElem = document.querySelector(".customers-city");
const customerTelephoneElem = document.querySelector(".customers-telephone");
const paymentTypeElem = document.querySelector(".payment-checked-type"); 

async function displayCompletedOrders() {
  const completedOrders = await storage.getCompletedOrders();

  if (completedOrders.length > 0) {
    const firstOrder = completedOrders[0];

    customerNameElem.innerText = firstOrder.customerName;
    customerAddressElem.innerText = firstOrder.customerAddress;
    customerCityElem.innerText = firstOrder.customerCity;
    customerTelephoneElem.innerText = firstOrder.customerTelephone;

    paymentTypeElem.innerText = firstOrder.payMethod;

    for (let item of firstOrder.items) {
      const itemElem = document.createElement("li");
      itemElem.classList.add("ordered-item-cart");
      itemElem.innerHTML = `
                <div class="ordered-item-cart__img-wrapper">
                    <img src="${item.imageURL}" alt="${item.model}" class="ordered-item-cart__img">
                </div>
                <div class="ordered-item-cart__desc-wrapper">
                    <p class="ordered-item-cart__model">${item.model}</p>
                    <p class="ordered-item-cart__series">${item.series}</p>
                    <p class="ordered-item-cart__short-description">${item.miniDescription}</p>
                    <div class="ordered-item-cart__price-rating-wrapper">
                        <div class="ordered-item-cart__price-wrapper">
                            <p class="ordered-item-cart__price">${item.cost} ${item.currency}</p>
                            <p class="x">x</p>
                            <p class="ordered-item-cart__quantity">${item.quantity}</p>
                        </div>
                    </div>
                </div>
            `;
      orderedItemsCart.appendChild(itemElem);
    }

    const goodsSumElem = document.querySelector(".goods-sum");
    const deliveryCostElem = document.querySelector(".delivery-cost");
    const totalAmountElem = document.querySelector(".sum-up-amount");

    const formattedGoodsSum = firstOrder.totalGoodsSum; 
    const formattedDeliveryCost = firstOrder.deliveryCost; 
    const formattedTotalAmount = firstOrder.totalAmount; 

    goodsSumElem.innerText = `${firstOrder.items[0].currency} ${formattedGoodsSum.toFixed(2)}`;
    deliveryCostElem.innerText = `${firstOrder.items[0].currency} ${formattedDeliveryCost.toFixed(2)}`;
    totalAmountElem.innerText = `${firstOrder.items[0].currency} ${formattedTotalAmount.toFixed(2)}`;
  }
}

displayCompletedOrders();
