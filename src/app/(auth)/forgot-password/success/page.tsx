import Link from "next/link";
import ArrowNext from "../../../../../public/icons/ArrowNext.svg";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center mx-auto mt-32 mb-32 w-[464px]">
      <h1 className="mb-9 text-title uppercase">✉️ Check Your Inbox</h1>
      <p className="mb-12 text-base text-center">
        If the email address you entered is associated with an account, you’ll
        receive a password reset link shortly
      </p>
      <div className="flex flex-row justify-center items-center gap-1 mb-12">
        <p className="text-base">Didn’t receive the email?</p>
        <Link href="/forgot-password" className="flex gap-1">
          <span className="underline">Resend</span>
        </Link>
      </div>

      <Link href="/catalog" className="flex gap-1">
        <span className="text-purple underline">Continue shopping</span>
        <Image src={ArrowNext} alt="arrow" />
      </Link>
    </div>
  );
}
