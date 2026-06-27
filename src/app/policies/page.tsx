const policySections = [
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
    <main className="px-8 lg:px-50 mb-25">
      <div className="container mx-auto">
        <section className="mb-10 max-w-4xl">
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-gray-500">
            Dice &amp; Decks
          </p>
          <h1 className="mb-5 text-title font-semibold tracking-wide uppercase">
            Policies
          </h1>
          <p className="text-base leading-7 text-gray-700 md:text-lg">
            Here you can find our shipping, returns, terms of service, and
            privacy policy information.
          </p>
        </section>

        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <nav
            aria-label="Policies navigation"
            className="h-fit bg-gray-50 p-5 lg:sticky lg:top-8"
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              On this page
            </h2>
            <ul className="flex flex-col gap-3">
              {policySections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-base text-gray-800 underline-offset-4 transition-colors hover:text-[var(--color-orange)] hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-8">
            <section
              aria-labelledby="delivery-options-title"
              className="bg-white p-6 shadow-sm ring-1 ring-black/5"
            >
              <h2
                id="delivery-options-title"
                className="mb-5 text-2xl font-semibold uppercase tracking-wide"
              >
                Available Delivery Options
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left">
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
                className="scroll-mt-8 bg-white p-6 shadow-sm ring-1 ring-black/5"
              >
                <h2 className="mb-4 text-2xl font-semibold uppercase tracking-wide">
                  {section.title}
                </h2>

                <div className="flex flex-col gap-4 text-base leading-7 text-gray-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
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
