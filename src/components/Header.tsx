import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
        
        {/* Logo */}
        <Link href="/" className="block">
          <img
            src="/images/schemes/headerwithlogo.jpg"
            alt="Mahila SACCOS"
            className="h-auto w-full max-w-[430px] object-contain"
          />
        </Link>

        {/* Transaction information */}
        <div className="w-full border border-red-500 bg-green-600 px-4 py-3 text-center text-white md:w-auto md:min-w-[300px]">
          <p className="text-xs font-semibold tracking-wide">
            Transaction Hour
          </p>

          <p className="mt-1 text-xs">
            9:00 AM to 4:00 PM (Mon to Fri)
          </p>

          <p className="mt-1 text-[11px]">
            कार्यालय समय: १०:०० देखि ५:०० सम्म
          </p>

        </div>
      </div>
    </header>
  );
}
