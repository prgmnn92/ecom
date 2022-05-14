import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (cartItems.length <= 0) return;

    let pers = {
      cartItems: [...cartItems],
      totalPrice: totalPrice,
      totalQuantities: totalQuantities,
    };

    localStorage.setItem("pers", JSON.stringify(pers));
  }, [cartItems, totalPrice, totalQuantities]);

  useEffect(() => {
    let pers = localStorage.getItem("pers");

    pers = JSON.parse(pers);

    if (pers) {
      pers.cartItems = pers.cartItems.filter((item) => (item ? true : false));
      let q = 0;
      let t = 0;
      pers.cartItems.forEach((element) => {
        q += element.quantity;
        t += element.price * element.quantity;
      });
      setCartItems([...pers.cartItems]);
      setTotalPrice(t);
      setTotalQuantities(q);
    }
  }, []);

  let foundProduct;
  let index;

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => {
      return item?._id === product._id;
    });
    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct?._id === product._id) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
        } else {
          //else case vergessen... dadurch wurde immer wieder ein undefined object hinzugefügt
          return cartProduct;
        }
      });
      setCartItems([...updatedCartItems]);
      toast.success(`${qty} ${product.name} added to the cart`);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
  };

  const onRemove = (id) => {
    foundProduct = cartItems.find((item) => item._id === id);
    const newCartItems = cartItems.filter((item) => item._id !== id);
    if (newCartItems.length === 0) {
      localStorage.removeItem("pers");
    }
    setCartItems([...newCartItems]);
    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
  };

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);

    index = cartItems.findIndex((product) => product._id === id);
    const newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === "inc") {
      foundProduct["quantity"] = foundProduct.quantity + 1;
      setCartItems(
        [...newCartItems, { ...foundProduct }].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        foundProduct["quantity"] = foundProduct.quantity - 1;
        setCartItems(
          [...newCartItems, { ...foundProduct }].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        toggleCartItemQuantity,
        onRemove,
        setQty,
        setTotalPrice,
        setCartItems,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
