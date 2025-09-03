import Link from 'next/link';
import { CustomButton } from '@/components/shared/CustomButton';

export default function CheckoutPage() {
  return (
    <div className="px-8 lg:px-16">
      <div className="max-w-[1320px] mx-auto">
        <h2 className="text-[40px] w-full flex justify-center items-center mb-4 uppercase">Checkout</h2>
        
        <div className="w-full flex justify-center max-w-md mx-auto">
          <Link href="/checkout/order-review">
            <CustomButton>
              PLACE ORDER
            </CustomButton>
          </Link>
        </div>
      </div>
    </div>
  );
}