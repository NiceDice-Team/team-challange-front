import { create } from "zustand";
import { persist } from "zustand/middleware";

// Типы для адреса
export interface AddressData {
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  zipCode: string;
  city: string;
  email: string;
  phone: string;
}

// Типы для метода доставки
export interface DeliveryOption {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Типы для полной формы checkout
export interface CheckoutFormData {
  // Shipping адрес
  shippingCountry: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingApartment?: string;
  shippingZipCode: string;
  shippingCity: string;
  shippingEmail: string;
  shippingPhone: string;

  // Billing адрес (опциональный, если copyBilling = true)
  billingCountry?: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingAddress?: string;
  billingApartment?: string;
  billingZipCode?: string;
  billingCity?: string;
  billingEmail?: string;
  billingPhone?: string;

  // Флаг копирования
  copyBilling: boolean;
}

// Состояние store
interface CheckoutState {
  // Данные формы
  formData: CheckoutFormData;

  // Выбранный метод доставки
  paymentMethod: DeliveryOption | null;

  // Действия для обновления данных формы
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  setFormData: (data: CheckoutFormData) => void;
  resetFormData: () => void;

  // Действия для обновления метода доставки
  setPaymentMethod: (method: DeliveryOption) => void;

  // Действия для копирования shipping адреса в billing
  copyShippingToBilling: () => void;

  // Действия для очистки всего состояния
  resetCheckout: () => void;
}

// Начальные значения
const initialFormData: CheckoutFormData = {
  shippingCountry: "",
  shippingFirstName: "",
  shippingLastName: "",
  shippingAddress: "",
  shippingApartment: "",
  shippingZipCode: "",
  shippingCity: "",
  shippingEmail: "",
  shippingPhone: "",
  billingCountry: "",
  billingFirstName: "",
  billingLastName: "",
  billingAddress: "",
  billingApartment: "",
  billingZipCode: "",
  billingCity: "",
  billingEmail: "",
  billingPhone: "",
  copyBilling: false,
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      formData: initialFormData,
      paymentMethod: null,

      // Обновление части данных формы
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      // Установка полных данных формы
      setFormData: (data) =>
        set({
          formData: data,
        }),

      // Сброс данных формы
      resetFormData: () =>
        set({
          formData: initialFormData,
        }),

      // Установка метода доставки
      setPaymentMethod: (method) =>
        set({
          paymentMethod: method,
        }),

      // Копирование shipping адреса в billing
      copyShippingToBilling: () =>
        set((state) => {
          const { formData } = state;
          return {
            formData: {
              ...formData,
              billingCountry: formData.shippingCountry,
              billingFirstName: formData.shippingFirstName,
              billingLastName: formData.shippingLastName,
              billingAddress: formData.shippingAddress,
              billingApartment: formData.shippingApartment,
              billingZipCode: formData.shippingZipCode,
              billingCity: formData.shippingCity,
              billingEmail: formData.shippingEmail,
              billingPhone: formData.shippingPhone,
              copyBilling: true,
            },
          };
        }),

      // Полный сброс состояния checkout
      resetCheckout: () =>
        set({
          formData: initialFormData,
          paymentMethod: null,
        }),
    }),
    {
      name: "checkout-storage", // ключ для localStorage
      // Исключаем из персистентности только временные поля, если нужно
      partialize: (state) => ({
        formData: state.formData,
        paymentMethod: state.paymentMethod,
      }),
    }
  )
);

// Селекторы для удобного доступа к данным
export const useCheckoutFormData = () =>
  useCheckoutStore((state) => state.formData);
export const usePaymentMethod = () =>
  useCheckoutStore((state) => state.paymentMethod);
export const useCheckoutActions = () =>
  useCheckoutStore((state) => ({
    updateFormData: state.updateFormData,
    setFormData: state.setFormData,
    resetFormData: state.resetFormData,
    setPaymentMethod: state.setPaymentMethod,
    copyShippingToBilling: state.copyShippingToBilling,
    resetCheckout: state.resetCheckout,
  }));
