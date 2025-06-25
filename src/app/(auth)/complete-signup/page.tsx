import Link from "next/link";
import ArrowNext from "../../../../public/icons/ArrowNext.svg";
import Image from "next/image";

export default function CofirmSignUp() {
  return (
    <div className="flex flex-col items-center mb-65 mt-23">
      <h1 className="text-title mb-9 uppercase">Thank you for registering!</h1>
      <p className="text-base">
        A confirmation email has been sent to your inbox.
      </p>
      <p className="text-base mb-12">
        Please click the link in that email to activate your account
      </p>
      <Link href="/catalog" className="flex gap-1">
        <span className="text-purple underline ">Browse games</span>
        <Image src={ArrowNext} alt="arrow" />
      </Link>
    </div>
  );
}
