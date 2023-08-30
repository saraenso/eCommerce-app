import createStorage from "../storage.js";

const storage = createStorage();
const orderedItemsCart = document.querySelector(".ordered-items-cart");
const customerNameElem = document.querySelector(".customers-name");
const customerAddressElem = document.querySelector(".customers-address");
const customerCityElem = document.querySelector(".customers-city");
const customerTelephoneElem = document.querySelector(".customers-telephone");
const paymentTypeElem = document.querySelector(".payment-checked-type"); 

storage.clearOrders();

async function displayCompletedOrders() {
  const completedOrders = await storage.getCompletedOrders();

  if (completedOrders.length > 0) {
    const lastOrder = completedOrders[completedOrders.length - 1];

    customerNameElem.innerText = lastOrder.customerName;
    customerAddressElem.innerText = lastOrder.customerAddress;
    customerCityElem.innerText = lastOrder.customerCity;
    customerTelephoneElem.innerText = lastOrder.customerTelephone;
    paymentTypeElem.innerText = lastOrder.payMethod;

    for (let item of lastOrder.items) {
      const itemElem = document.createElement("li");
      itemElem.classList.add("ordered-item-cart");
    
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("ordered-item-cart__img-wrapper");
    
      const img = document.createElement("img");
      img.setAttribute("src", item.imageURL);
      img.setAttribute("alt", item.model);
      img.classList.add("ordered-item-cart__img");
    
      imgWrapper.appendChild(img);
    
      const descWrapper = document.createElement("div");
      descWrapper.classList.add("ordered-item-cart__desc-wrapper");
    
      const model = document.createElement("p");
      model.classList.add("ordered-item-cart__model");
      model.innerText = item.model;
    
      const series = document.createElement("p");
      series.classList.add("ordered-item-cart__series");
      series.innerText = item.series;
    
      const miniDescription = document.createElement("p");
      miniDescription.classList.add("ordered-item-cart__short-description");
      miniDescription.innerText = item.miniDescription;
    
      const priceRatingWrapper = document.createElement("div");
      priceRatingWrapper.classList.add("ordered-item-cart__price-rating-wrapper");
    
      const priceWrapper = document.createElement("div");
      priceWrapper.classList.add("ordered-item-cart__price-wrapper");
    
      const price = document.createElement("p");
      price.classList.add("ordered-item-cart__price");
      price.innerText = `${item.cost} ${item.currency}`;
    
      const multiplier = document.createElement("p");
      multiplier.classList.add("x");
      multiplier.innerText = "x";
    
      const quantity = document.createElement("p");
      quantity.classList.add("ordered-item-cart__quantity");
      quantity.innerText = item.quantity;
    
      priceWrapper.appendChild(price);
      priceWrapper.appendChild(multiplier);
      priceWrapper.appendChild(quantity);
    
      priceRatingWrapper.appendChild(priceWrapper);
    
      descWrapper.appendChild(model);
      descWrapper.appendChild(series);
      descWrapper.appendChild(miniDescription);
      descWrapper.appendChild(priceRatingWrapper);
    
      itemElem.appendChild(imgWrapper);
      itemElem.appendChild(descWrapper);
    
      orderedItemsCart.appendChild(itemElem);
    }    

    const goodsSumElem = document.querySelector(".goods-sum");
    const deliveryCostElem = document.querySelector(".delivery-cost");
    const totalAmountElem = document.querySelector(".sum-up-amount");

    const formattedGoodsSum = lastOrder.totalGoodsSum; 
    const formattedDeliveryCost = lastOrder.deliveryCost; 
    const formattedTotalAmount = lastOrder.totalAmount; 

    goodsSumElem.innerText = `${lastOrder.items[0].currency} ${formattedGoodsSum.toFixed(2)}`;
    deliveryCostElem.innerText = `${lastOrder.items[0].currency} ${formattedDeliveryCost.toFixed(2)}`;
    totalAmountElem.innerText = `${lastOrder.items[0].currency} ${formattedTotalAmount.toFixed(2)}`;
  }
}

displayCompletedOrders();