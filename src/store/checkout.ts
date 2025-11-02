import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

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

export interface DeliveryOption {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface PaymentCardData {
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface CheckoutFormData {
  shippingCountry: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingApartment?: string;
  shippingZipCode: string;
  shippingCity: string;
  shippingEmail: string;
  shippingPhone: string;

  billingCountry?: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingAddress?: string;
  billingApartment?: string;
  billingZipCode?: string;
  billingCity?: string;
  billingEmail?: string;
  billingPhone?: string;

  copyBilling: boolean;
}

interface CheckoutState {
  formData: CheckoutFormData;

  paymentMethod: DeliveryOption | null;
  paymentCard: PaymentCardData | null;

  updateFormData: (data: Partial<CheckoutFormData>) => void;
  setFormData: (data: CheckoutFormData) => void;
  resetFormData: () => void;

  setPaymentMethod: (method: DeliveryOption) => void;
  setPaymentCard: (card: PaymentCardData) => void;

  copyShippingToBilling: () => void;

  resetCheckout: () => void;
}

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

export const useCheckoutStore = create<CheckoutState>()((set, get) => ({
  formData: initialFormData,
  paymentMethod: null,
  paymentCard: null,

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setFormData: (data) => {
    if (data.copyBilling) {
      set({
        formData: {
          ...data,
          billingCountry: data.shippingCountry,
          billingFirstName: data.shippingFirstName,
          billingLastName: data.shippingLastName,
          billingAddress: data.shippingAddress,
          billingApartment: data.shippingApartment,
          billingZipCode: data.shippingZipCode,
          billingCity: data.shippingCity,
          billingEmail: data.shippingEmail,
          billingPhone: data.shippingPhone,
          copyBilling: true,
        },
      });
    } else {
      set({
        formData: data,
      });
    }
  },

  resetFormData: () =>
    set({
      formData: initialFormData,
    }),

  setPaymentMethod: (method) =>
    set({
      paymentMethod: method,
    }),

  setPaymentCard: (card) =>
    set({
      paymentCard: card,
    }),

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

  resetCheckout: () =>
    set({
      formData: initialFormData,
      paymentMethod: null,
      paymentCard: null,
    }),
}));

export const useCheckoutFormData = () =>
  useCheckoutStore((state) => state.formData);
export const usePaymentMethod = () =>
  useCheckoutStore((state) => state.paymentMethod);
export const usePaymentCard = () =>
  useCheckoutStore((state) => state.paymentCard);

// useShallow prevents infinite re-renders by caching the object reference
// Without it, returning a new object {...} on every render causes components to re-render infinitely
export const useCheckoutActions = () =>
  useCheckoutStore(
    useShallow((state) => ({
      updateFormData: state.updateFormData,
      setFormData: state.setFormData,
      resetFormData: state.resetFormData,
      setPaymentMethod: state.setPaymentMethod,
      setPaymentCard: state.setPaymentCard,
      copyShippingToBilling: state.copyShippingToBilling,
      resetCheckout: state.resetCheckout,
    }))
  );
