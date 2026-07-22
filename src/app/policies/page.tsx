import type { ReactNode } from "react";

const policySections: {
  id: string;
  title: string;
  paragraphs: ReactNode[];
  listTitle?: string;
  list?: string[];
}[] = [
  {
    id: "shipping",
    title: "Shipping",
    paragraphs: [
      "Dice & Decks offers international shipping worldwide. Delivery times are estimates and may vary depending on the destination country, customs processing, and local courier services.",
      "Customers are responsible for providing accurate shipping information when placing an order.",
    ],
  },
  {
    id: "order-processing",
    title: "Order Processing",
    paragraphs: [
      "Orders are usually processed within 1-2 business days after payment confirmation.",
      "Customers will receive an email confirmation once the order has been shipped.",
    ],
  },
  {
    id: "returns",
    title: "Returns",
    paragraphs: [
      "If you receive a damaged or incorrect item, please contact us within 14 days of delivery.",
      "Items must be returned in their original condition and packaging. Refunds will be processed after the returned item has been received and inspected.",
      "Shipping costs are non-refundable unless the return is due to an error on our side.",
    ],
    listTitle: "To request a return, please provide:",
    list: [
      "Order number",
      "Description of the issue",
      "Photos of the damaged or incorrect product, if applicable",
    ],
  },
  {
    id: "terms-of-service",
    title: "Terms of Service",
    paragraphs: [
      "Welcome to Dice & Decks. By using our website and placing an order, you agree to the following terms.",
      "All orders are subject to product availability. We reserve the right to cancel an order if a product becomes unavailable or if there is an error in pricing or product information.",
      "All payments must be completed before an order is shipped. We accept the payment methods displayed during checkout.",
      "We make every effort to ensure that product descriptions, images, and prices are accurate. However, minor differences in product appearance or packaging may occur.",
      "Dice & Decks is not responsible for delays caused by shipping carriers, customs procedures, or events beyond our reasonable control.",
      "We may update these Terms of Service from time to time. Any changes will be published on this page.",
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    paragraphs: [
      "When you place an order, we may collect your name, email address, shipping address, and payment-related information processed securely through our payment providers.",
      "We use your information to process and deliver orders, provide customer support, send order updates and confirmations, and improve our services.",
      "If you choose to subscribe to our newsletter, we may occasionally send promotional emails. You can unsubscribe at any time using the unsubscribe link included in our emails.",
      "We take reasonable measures to protect your personal information and prevent unauthorised access.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      "If you have questions regarding these policies, please contact Dice & Decks customer support through the contact information provided on our website.",
      <>
        Write to us at email{" "}
        <a
          href="mailto:dicedecks2025@gmail.com"
          className="text-[var(--color-orange)] underline-offset-4 transition-colors hover:underline"
        >
          dicedecks2025@gmail.com
        </a>
        .
      </>,
    ],
  },
];

const shippingOptions = [
  {
    method: "DHL International Express",
    price: "$50",
    deliveryTime: "Approximately 3 business days",
  },
  {
    method: "Meest International Economy",
    price: "$15",
    deliveryTime: "Approximately 14 business days",
  },
];

export default function PoliciesPage() {
  return (
    <main className="mb-16 px-4 sm:mb-20 sm:px-6 md:px-8 lg:mb-25 lg:px-20">
      <div className="container mx-auto min-w-0 max-w-full">
        <section className="mb-6 max-w-4xl sm:mb-8 lg:mb-10">
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-gray-500 sm:mb-3 sm:text-sm">
            Dice &amp; Decks
          </p>
          <h1 className="mb-3 text-2xl font-semibold tracking-wide uppercase sm:mb-4 sm:text-3xl md:mb-5 md:text-title">
            Policies
          </h1>
          <p className="text-sm leading-6 text-gray-700 sm:text-base sm:leading-7 md:text-lg">
            Here you can find our shipping, returns, terms of service, and
            privacy policy information.
          </p>
        </section>

        <div className="grid min-w-0 w-full gap-6 sm:gap-8 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10">
          <nav
            aria-label="Policies navigation"
            className="min-w-0 h-fit bg-gray-50 p-4 sm:p-5 lg:sticky lg:top-8"
          >
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 sm:mb-4 sm:text-sm">
              On this page
            </h2>
            <ul className="flex min-w-0 flex-row gap-x-4 gap-y-2 overflow-x-auto pb-1 sm:flex-col sm:gap-3 sm:overflow-visible sm:pb-0">
              {policySections.map((section) => (
                <li key={section.id} className="shrink-0">
                  <a
                    href={`#${section.id}`}
                    className="whitespace-nowrap text-sm text-gray-800 underline-offset-4 transition-colors hover:text-[var(--color-orange)] hover:underline sm:text-base"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-8">
            <section
              aria-labelledby="delivery-options-title"
              className="bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-6"
            >
              <h2
                id="delivery-options-title"
                className="mb-4 text-xl font-semibold uppercase tracking-wide sm:mb-5 sm:text-2xl"
              >
                Available Delivery Options
              </h2>

              <div className="flex flex-col gap-3 md:hidden">
                {shippingOptions.map((option) => (
                  <div
                    key={option.method}
                    className="flex flex-col gap-2 border border-gray-100 p-4"
                  >
                    <p className="font-medium text-gray-900">{option.method}</p>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-gray-700">
                      <span>
                        <span className="text-gray-500">Price: </span>
                        {option.price}
                      </span>
                      <span>{option.deliveryTime}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm uppercase tracking-wide text-gray-500">
                      <th className="py-3 pr-4 font-medium">Shipping Method</th>
                      <th className="py-3 pr-4 font-medium">Price</th>
                      <th className="py-3 font-medium">Delivery Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippingOptions.map((option) => (
                      <tr
                        key={option.method}
                        className="border-b border-gray-100"
                      >
                        <td className="py-4 pr-4 font-medium text-gray-900">
                          {option.method}
                        </td>
                        <td className="py-4 pr-4 text-gray-700">
                          {option.price}
                        </td>
                        <td className="py-4 text-gray-700">
                          {option.deliveryTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {policySections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-20 bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-6 lg:scroll-mt-8"
              >
                <h2 className="mb-3 text-xl font-semibold uppercase tracking-wide sm:mb-4 sm:text-2xl">
                  {section.title}
                </h2>

                <div className="flex flex-col gap-3 text-sm leading-6 text-gray-700 sm:gap-4 sm:text-base sm:leading-7">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.id}-${index}`}>{paragraph}</p>
                  ))}

                  {section.list && (
                    <div>
                      <p className="mb-3 font-medium text-gray-900">
                        {section.listTitle}
                      </p>
                      <ul className="list-disc space-y-2 pl-5">
                        {section.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
