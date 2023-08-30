import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import {
  ITEMS_STORAGE_KEY,
  ORDERS_STORAGE_KEY,
  COMPLETEDORDERS_STORAGE_KEY,
} from "./keys";

const firebaseConfig = {
  apiKey: "AIzaSyBF4A_qZPX5HB-mv8rRXt0DTdCqLGT68ac",
  authDomain: "ecommerce-app-feb0d.firebaseapp.com",
  projectId: "ecommerce-app-feb0d",
  storageBucket: "ecommerce-app-feb0d.appspot.com",
  messagingSenderId: "803168511954",
  appId: "1:803168511954:web:714cb8e9e339617c53ca0b",
};

export function createStorage() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function getData() {
    const ref = collection(db, ITEMS_STORAGE_KEY);
    const q = query(ref, orderBy("createdAt"));
    const querySnapshot = await getDocs(q);

    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        model: doc.data().model,
        quantity: doc.data().quantity,
        series: doc.data().series,
        cost: doc.data().price.cost,
        currency: doc.data().price.currency,
        description: {
          shortDescription: doc.data().description.shortDescription,
          longDescription: doc.data().description.longDescription,
          miniDescription: doc.data().description.miniDescription,
        },
        rating: doc.data().rating,
        imageURL: doc.data().imageURL,
        createdAt: doc.data().createdAt,
      });
    });

    return items;
  }

  async function addToOrders(item) {
    try {
      const ordersCollectionRef = collection(db, ORDERS_STORAGE_KEY);
      const q = query(ordersCollectionRef, where("id", "==", item.id));
      const snapshot = await getDocs(q);
      console.log("Success add to orders");

      if (!snapshot.empty) {
        const existingOrder = snapshot.docs[0];
        const updatedQuantity = existingOrder.data().quantity + 1;

        await updateDoc(doc(db, ORDERS_STORAGE_KEY, existingOrder.id), {
          quantity: updatedQuantity,
        });
      } else {
        const orderDocRef = doc(ordersCollectionRef, item.id);
        await setDoc(orderDocRef, {
          id: item.id,
          quantity: 1,
          model: item.model,
          series: item.series,
          cost: item.cost,
          currency: item.currency,
          description: {
            shortDescription: item.description.shortDescription,
            longDescription: item.description.longDescription,
            miniDescription: item.description.miniDescription,
          },
          rating: item.rating,
          imageURL: item.imageURL,
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error("Error adding/updating order:", e);
    }
  }

  async function getOrders() {
    const ref = collection(db, ORDERS_STORAGE_KEY);
    const q = query(ref, orderBy("createdAt"));
    const querySnapshot = await getDocs(q);

    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        model: doc.data().model,
        quantity: doc.data().quantity,
        series: doc.data().series,
        cost: doc.data().cost,
        currency: doc.data().currency,
        description: {
          shortDescription: doc.data().description.shortDescription,
          longDescription: doc.data().description.longDescription,
          miniDescription: doc.data().description.miniDescription,
        },
        rating: doc.data().rating,
        imageURL: doc.data().imageURL,
        createdAt: doc.data().createdAt,
      });
    });

    console.log("Orders from Firestore:", orders);

    return orders;
  }

  async function removeAllOrders() {
    try {
      const orders = await getOrders();

      if (orders && orders.length > 0) {
        await clearOrders(orders);
        window.location.href = "order.html";
      } else {
        console.log("No orders found to clear.");
      }
    } catch (e) {
      console.error("Error removing all orders:", e);
    }
  }

  async function clearOrders() {
    try {
      console.log("Starting to clear orders...");
      const orders = await getOrders();

      if (!orders.length) {
        console.log("No orders to clear.");
        return;
      }

      console.log("Очищение заказов:", orders);

      const batch = writeBatch(db);

      orders.forEach((order) => {
        const docRef = doc(db, ORDERS_STORAGE_KEY, order.id);
        batch.delete(docRef);
      });

      await batch.commit();

      console.log("Successfully cleared orders.");
    } catch (e) {
      console.error("Error clearing orders:", e);
    }
  }

  async function updateOrderQuantity(itemID, newQuantity) {
    try {
      const ordersCollectionRef = collection(db, ORDERS_STORAGE_KEY);
      const q = query(ordersCollectionRef, where("id", "==", itemID));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = doc(db, ORDERS_STORAGE_KEY, itemID);

        if (newQuantity <= 0) {
          await deleteDoc(docRef);
          console.log(
            `Deleted order with ID ${itemID} because quantity was ${newQuantity}`
          );
        } else {
          await updateDoc(docRef, { quantity: newQuantity });
          console.log(
            `Updated quantity of item with ID ${itemID} to ${newQuantity}`
          );
        }
      } else {
        console.log(`Item with ID ${itemID} not found in orders.`);
      }
    } catch (e) {
      console.error("Error updating order quantity:", e);
    }
  }

  async function getItemById(itemId) {
    const ref = doc(db, ITEMS_STORAGE_KEY, itemId);
    const itemDoc = await getDoc(ref);

    if (itemDoc.exists()) {
      const data = itemDoc.data();
      return {
        id: itemDoc.id,
        model: data.model,
        quantity: data.quantity,
        series: data.series,
        cost: data.price.cost,
        currency: data.price.currency,
        description: {
          shortDescription: data.description.shortDescription,
          longDescription: data.description.longDescription,
          miniDescription: data.description.miniDescription,
        },
        rating: data.rating,
        imageURL: data.imageURL,
        createdAt: data.createdAt,
      };
    } else {
      return null;
    }
  }

  async function addCompletedOrder(completedOrderData) {
    try {
      const completedOrdersCollectionRef = collection(
        db,
        COMPLETEDORDERS_STORAGE_KEY
      );

      await setDoc(doc(completedOrdersCollectionRef), {
        customerName: completedOrderData.customerName,
        customerAddress: completedOrderData.customerAddress,
        customerCity: completedOrderData.customerCity,
        customerTelephone: completedOrderData.customerTelephone,
        items: completedOrderData.items,
        totalGoodsSum: completedOrderData.totalGoodsSum,
        totalAmount: completedOrderData.totalAmount,
        payMethod: completedOrderData.payMethod,
        deliveryCost: 6.99,
        currency: completedOrderData.items[0].currency,
        createdAt: serverTimestamp(),
      });

      console.log("Successfully added completed order to Firestore.");
    } catch (e) {
      console.error("Error adding completed order:", e);
      console.error(e.message);
    }
  }

  async function getCompletedOrders() {
    try {
      const ref = collection(db, COMPLETEDORDERS_STORAGE_KEY);
      const q = query(ref, orderBy("createdAt"));
      const querySnapshot = await getDocs(q);

      const completedOrders = [];
      querySnapshot.forEach((doc) => {
        completedOrders.push({
          id: doc.id,
          customerName: doc.data().customerName,
          customerAddress: doc.data().customerAddress,
          customerCity: doc.data().customerCity,
          customerTelephone: doc.data().customerTelephone,
          items: doc.data().items,
          totalGoodsSum: doc.data().totalGoodsSum,
          totalAmount: doc.data().totalAmount,
          payMethod: doc.data().payMethod,
          deliveryCost: doc.data().deliveryCost,
          currency: doc.data().currency,
          createdAt: doc.data().createdAt,
        });
      });
      console.log("Completed orders from Firestore:", completedOrders);
      return completedOrders;
    } catch (error) {
      console.error("Error fetching completed orders:", error);
    }
  }

  async function getOrderById(orderId) {
    try {
      const orderRef = doc(db, ORDERS_STORAGE_KEY, orderId);
      const orderDoc = await getDoc(orderRef);

      if (orderDoc.exists()) {
        const data = orderDoc.data();
        return {
          id: orderDoc.id,
          model: data.model,
          quantity: data.quantity,
          series: data.series,
          cost: data.cost,
          currency: data.currency,
          description: {
            shortDescription: data.description.shortDescription,
            longDescription: data.description.longDescription,
            miniDescription: data.description.miniDescription,
          },
          rating: data.rating,
          imageURL: data.imageURL,
          createdAt: data.createdAt,
        };
      } else {
        console.log(`Order with ID ${orderId} not found.`);
        return null;
      }
    } catch (e) {
      console.error("Error fetching order by ID:", e);
    }
  }

  async function deleteOrder(orderId) {
    try {
      const orderRef = doc(db, ORDERS_STORAGE_KEY, orderId);
      await deleteDoc(orderRef);
      console.log(`Successfully deleted order with ID ${orderId}.`);
    } catch (e) {
      console.error("Error deleting order:", e);
    }
  }

  return {
    getData,
    addToOrders,
    getOrders,
    clearOrders,
    updateOrderQuantity,
    getItemById,
    addCompletedOrder,
    getCompletedOrders,
    getOrderById,
    deleteOrder,
    removeAllOrders,
    db,
  };
}

export default createStorage;
