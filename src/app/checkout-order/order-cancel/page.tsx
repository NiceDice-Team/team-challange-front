const OrderCancel = () => {
  return (
    <div className="flex flex-col items-center mt-23 mb-65 px-4">
      <h1 className="mb-9 md:text-title text-xl text-center uppercase">
        Order Cancelled!
      </h1>
      <p className="text-base">Your order has been cancelled successfully.</p>
      <p className="mb-9 text-base text-center">
        We&apos;re sorry to see you go and hope to welcome you back soon! 🎲
      </p>
      <p className="mb-12 text-base">
        Thank you for choosing <span className="font-bold">Dice & Decks</span>.
      </p>
      <p className=" text-base">See you again soon!</p>
      <p className="mb-12 font-bold">Dice & Decks Team</p>
    </div>
  );
};

export default OrderCancel;
