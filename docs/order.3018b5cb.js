!function(){var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},r={},t={},o=e.parcelRequire716c;null==o&&((o=function(e){if(e in r)return r[e].exports;if(e in t){var o=t[e];delete t[e];var c={id:e,exports:{}};return r[e]=c,o.call(c.exports,c,c.exports),c.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,r){t[e]=r},e.parcelRequire716c=o);var c=o("hzcNp");let i=(0,c.default)(),d=document.querySelector(".ordered-items-cart"),n=document.querySelector(".customers-name"),s=document.querySelector(".customers-address"),a=document.querySelector(".customers-city"),l=document.querySelector(".customers-telephone"),u=document.querySelector(".payment-checked-type");!async function(){let e=await i.getCompletedOrders();if(e.length>0){let r=e[0];// Заполняем товары
for(let e of(// Заполняем информацию о заказчике
n.innerText=r.customerName,s.innerText=r.customerAddress,a.innerText=r.customerCity,l.innerText=r.customerTelephone,// Заполняем метод оплаты
u.innerText=r.payMethod,r.items)){let r=document.createElement("li");r.classList.add("ordered-item-cart"),r.innerHTML=`
                <div class="ordered-item-cart__img-wrapper">
                    <img src="${e.imageURL}" alt="${e.model}" class="ordered-item-cart__img">
                </div>
                <div class="ordered-item-cart__desc-wrapper">
                    <p class="ordered-item-cart__model">${e.model}</p>
                    <p class="ordered-item-cart__series">${e.series}</p>
                    <p class="ordered-item-cart__short-description">${e.miniDescription}</p>
                    <div class="ordered-item-cart__price-rating-wrapper">
                        <div class="ordered-item-cart__price-wrapper">
                            <p class="ordered-item-cart__price">${e.cost} ${e.currency}</p>
                            <p class="x">x</p>
                            <p class="ordered-item-cart__quantity">${e.quantity}</p>
                        </div>
                    </div>
                </div>
            `,d.appendChild(r)}// Вставляем totalGoodsSum, deliveryCost и totalAmount
let t=document.querySelector(".goods-sum"),o=document.querySelector(".delivery-cost"),c=document.querySelector(".sum-up-amount");t.innerText=`${r.totalGoodsSum} ${r.items[0].currency}`,o.innerText=`${r.deliveryCost} ${r.items[0].currency}`,c.innerText=`${r.totalAmount} ${r.items[0].currency}`}}()}();