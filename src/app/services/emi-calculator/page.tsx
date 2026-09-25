"use client";

import { useMemo, useState } from "react";

import { Calculator, CalendarDays } from "lucide-react";

import { adToBs, bsToAd } from "@lacspace/nepali-date";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function EmiCalculatorPage() {
  /* =========================
     EMI
  ========================== */

  const [loanAmount, setLoanAmount] = useState("");

  const [interestRate, setInterestRate] = useState("");

  const [tenure, setTenure] = useState("");

  const [showEmiResult, setShowEmiResult] = useState(false);

  const emiResult = useMemo(() => {
    const principal = Number(loanAmount);

    const annualRate = Number(interestRate);

    const years = Number(tenure);

    if (principal <= 0 || annualRate < 0 || years <= 0) {
      return {
        emi: 0,
        totalPayment: 0,
        totalInterest: 0,
      };
    }

    const months = years * 12;

    const monthlyRate = annualRate / 12 / 100;

    let emi = 0;

    if (monthlyRate === 0) {
      emi = principal / months;
    } else {
      emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = emi * months;

    const totalInterest = totalPayment - principal;

    return {
      emi,
      totalPayment,
      totalInterest,
    };
  }, [loanAmount, interestRate, tenure]);

  function calculateEmi() {
    setShowEmiResult(true);
  }

  /* =========================
     DATE CONVERTER
  ========================== */

  const [adDate, setAdDate] = useState("");

  const [bsYear, setBsYear] = useState("");

  const [bsMonth, setBsMonth] = useState("");

  const [bsDay, setBsDay] = useState("");

  const [convertedBs, setConvertedBs] = useState("");

  const [convertedAd, setConvertedAd] = useState("");

  const [dateError, setDateError] = useState("");

  function convertAdToBs() {
    setDateError("");
    setConvertedBs("");

    if (!adDate) {
      setDateError("Please select an AD date.");

      return;
    }

    try {
      const [year, month, day] = adDate.split("-").map(Number);

      /*
        IMPORTANT:
        JS Date month is zero-based.
      */

      const result = adToBs(new Date(year, month - 1, day));

      setConvertedBs(
        `${result.year}-${String(result.month).padStart(2, "0")}-${String(
          result.day,
        ).padStart(2, "0")}`,
      );
    } catch {
      setDateError("Unable to convert that date.");
    }
  }

  function convertBsToAd() {
    setDateError("");
    setConvertedAd("");

    const year = Number(bsYear);

    const month = Number(bsMonth);

    const day = Number(bsDay);

    if (!year || !month || !day) {
      setDateError("Please enter BS year, month and day.");

      return;
    }

    try {
      const result = bsToAd(year, month, day);

      const formatted = `${result.getFullYear()}-${String(
        result.getMonth() + 1,
      ).padStart(2, "0")}-${String(result.getDate()).padStart(2, "0")}`;

      setConvertedAd(formatted);
    } catch {
      setDateError("Invalid BS date or date is outside the supported range.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-blue-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              Services
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Financial Tools
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Calculate your loan EMI and convert dates between A.D. and B.S.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* =====================
              EMI CALCULATOR
          ====================== */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1F3C88]">
                <Calculator size={21} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  EMI Calculator
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Estimate monthly loan repayment.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Loan Amount (रु.)
                </label>

                <input
                  type="number"
                  min="0"
                  value={loanAmount}
                  onChange={(event) => {
                    setLoanAmount(event.target.value);

                    setShowEmiResult(false);
                  }}
                  placeholder="e.g. 500000"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#1F3C88] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Interest Rate (% per annum)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={interestRate}
                  onChange={(event) => {
                    setInterestRate(event.target.value);

                    setShowEmiResult(false);
                  }}
                  placeholder="e.g. 7.5"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#1F3C88] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tenure (years)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={tenure}
                  onChange={(event) => {
                    setTenure(event.target.value);

                    setShowEmiResult(false);
                  }}
                  placeholder="e.g. 5"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#1F3C88] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                onClick={calculateEmi}
                className="w-full rounded-xl bg-[#1F3C88] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#162E6A]"
              >
                Calculate EMI
              </button>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <ResultRow
                  label="Monthly EMI"
                  value={`रु. ${
                    showEmiResult ? formatMoney(emiResult.emi) : "0"
                  }`}
                />

                <ResultRow
                  label="Total Interest"
                  value={`रु. ${
                    showEmiResult ? formatMoney(emiResult.totalInterest) : "0"
                  }`}
                />

                <ResultRow
                  label="Total Payment"
                  value={`रु. ${
                    showEmiResult ? formatMoney(emiResult.totalPayment) : "0"
                  }`}
                  last
                />
              </div>
            </div>
          </section>

          {/* =====================
              DATE CONVERTER
          ====================== */}

          <section
            id="date-converter"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1F3C88]">
                <CalendarDays size={21} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Date Converter
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Convert A.D. and B.S. dates.
                </p>
              </div>
            </div>

            {/* AD → BS */}

            <div className="mt-6">
              <p className="text-sm font-bold text-gray-800">A.D. → B.S.</p>

              <div className="mt-3">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Select A.D. Date
                </label>

                <input
                  type="date"
                  value={adDate}
                  onChange={(event) => setAdDate(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1F3C88] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                onClick={convertAdToBs}
                className="mt-3 w-full rounded-xl bg-[#1F3C88] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#162E6A]"
              >
                Convert to B.S.
              </button>

              {convertedBs && (
                <div className="mt-3 rounded-xl bg-[#EEF4FF] px-4 py-3">
                  <p className="text-xs font-medium text-gray-500">
                    Bikram Sambat
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#1F3C88]">
                    {convertedBs}
                  </p>
                </div>
              )}
            </div>

            {/* DIVIDER */}

            <div className="my-6 border-t border-gray-200" />

            {/* BS → AD */}

            <div>
              <p className="text-sm font-bold text-gray-800">B.S. → A.D.</p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={bsYear}
                  onChange={(event) => setBsYear(event.target.value)}
                  placeholder="Year"
                  className="min-w-0 rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#1F3C88]"
                />

                <input
                  type="number"
                  min="1"
                  max="12"
                  value={bsMonth}
                  onChange={(event) => setBsMonth(event.target.value)}
                  placeholder="Month"
                  className="min-w-0 rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#1F3C88]"
                />

                <input
                  type="number"
                  min="1"
                  max="32"
                  value={bsDay}
                  onChange={(event) => setBsDay(event.target.value)}
                  placeholder="Day"
                  className="min-w-0 rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#1F3C88]"
                />
              </div>

              <button
                type="button"
                onClick={convertBsToAd}
                className="mt-3 w-full rounded-xl bg-[#1F3C88] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#162E6A]"
              >
                Convert to A.D.
              </button>

              {convertedAd && (
                <div className="mt-3 rounded-xl bg-[#EEF4FF] px-4 py-3">
                  <p className="text-xs font-medium text-gray-500">
                    Gregorian Date
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#1F3C88]">
                    {convertedAd}
                  </p>
                </div>
              )}

              {dateError && (
                <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {dateError}
                </div>
              )}
            </div>
          </section>
        </div>

        <p className="mt-5 text-left text-xs leading-5 text-gray-500">
          EMI calculations are estimates for reference only. Actual loan
          repayment may vary according to the cooperative&apos;s applicable
          policies and charges.
        </p>
      </div>
    </main>
  );
}

function ResultRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-2 ${
        !last ? "border-b border-gray-200" : ""
      }`}
    >
      <span className="text-sm font-medium text-gray-600">{label}</span>

      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );
}
