import { createContext, useEffect, useReducer } from "react";

export const GlobalContext = createContext();

const initialState = () => {
  return localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {
        cart: [],
        totalPrice: 0,
        totalAmount: 0,
      };
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "ADD_TO_CART":
      return { ...state, cart: [...state.cart, payload] };
    case "DELETE":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id != payload),
      };
    case "INCREASE":
      return {
        ...state,
        cart: state.cart.map((item) => {
          if (item.id == payload) {
            return { ...item, amount: item.amount + 1 };
          } else {
            return item;
          }
        }),
      };
    case "DECREASE":
      return {
        ...state,
        cart: state.cart.map((item) => {
          if (item.id == payload) {
            return { ...item, amount: item.amount - 1 };
          } else {
            return item;
          }
        }),
      };
    case "CALCULATE_TOTAL":
      const { totalAmount, totalPrice } = state.cart.reduce(
        (acc, curVal) => {
          const { amount, price } = curVal;
          const itemTotal = amount * price;

          acc.totalPrice += itemTotal;
          acc.totalAmount += amount;

          return acc;
        },
        {
          totalPrice: 0,
          totalAmount: 0,
        }
      );
      return { ...state, totalAmount, totalPrice };
    case "CLEAR":
      return { cart: [], totalPrice: 0, totalAmount: 0 };
    default:
      return state;
  }
};

export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState());
  console.log(state);

  useEffect(() => {
    dispatch({ type: "CALCULATE_TOTAL" });
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state.cart]);

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
