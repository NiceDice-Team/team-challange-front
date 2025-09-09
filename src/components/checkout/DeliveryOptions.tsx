import Image from "next/image";
import icon from "../../assets/icons/attention.svg";
const deliveryOptions = [
  {
    id: 1,
    name: "DHL",
    price: 35,
    description: "1-3 business days",
  },
  {
    id: 2,
    name: "Nova poshta",
    price: 20,
    description: "3-5 business days",
  },
  {
    id: 3,
    name: "Fedex",
    price: 15,
    description: "5-7 business days",
  },
  {
    id: 4,
    name: "Ukrposhta",
    price: 12,
    description: "7-10 business days",
  },
];

const DeliveryOptions = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="mb-6 text-xl uppercase">Choose delivery option</div>
      <div className="flex flex-col gap-3">
        {deliveryOptions.map((option) => (
          <div key={option.id} className="flex gap-2">
            <p className="font-bold text-purple">${option.price}</p>
            <h3 className="font-medium">{option.name}</h3>
            <p className="text-gray-2">{option.description}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Image src={icon} alt="info" className="w-6 h-6" />
        <p className="text-gray-2">
          Please note that all international shipments may be subject to customs
          duties and taxes depending on your local regulations. These charges
          are the full responsibility of the buyer and are not included in the
          item price.
        </p>
      </div>
    </div>
  );
};

export default DeliveryOptions;
