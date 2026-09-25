import Link from "next/link";

export default function Header() {
  return (
    <header className="hidden bg-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        {/* LOGO */}

        <Link href="/" className="block">
          <img
            src="/images/schemes/headerwithlogo.jpg"
            alt="Byas Saving & Credit Co-Operative Ltd."
            className="h-auto w-full max-w-[430px] object-contain"
          />
        </Link>

        {/* TRANSACTION INFORMATION */}

        <div className="min-w-[300px] border border-red-500 bg-[#162E6A] px-4 py-3 text-center text-white">
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