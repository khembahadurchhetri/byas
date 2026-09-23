"use client";

import { useEffect, useMemo, useState } from "react";

import { NepaliDate } from "@lacspace/nepali-date";

interface ForexRate {
  currency: {
    unit: number;
    name: string;
    ISO3: string;
  };
  buy: string;
  sell: string;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatAdDate(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function EmiCalculatorPage() {
  const [amount, setAmount] = useState(2500000);

  const [rate, setRate] = useState(10.5);

  const [tenure, setTenure] = useState(20);

  const [tenureType, setTenureType] = useState<"years" | "months">("years");

  const [forexRates, setForexRates] = useState<ForexRate[]>([]);

  const [forexDate, setForexDate] = useState("");

  const [forexLoading, setForexLoading] = useState(true);

  const [adDate, setAdDate] = useState(formatAdDate(new Date()));

  const [bsYear, setBsYear] = useState("");

  const [bsMonth, setBsMonth] = useState("");

  const [bsDay, setBsDay] = useState("");

  const [adToBsResult, setAdToBsResult] = useState("");

  const [bsToAdResult, setBsToAdResult] = useState("");

  const [dateError, setDateError] = useState("");

  const result = useMemo(() => {
    const principal = Number(amount) || 0;

    const annualRate = Number(rate) || 0;

    const months =
      tenureType === "years" ? Number(tenure) * 12 : Number(tenure);

    if (principal <= 0 || annualRate < 0 || months <= 0) {
      return {
        emi: 0,
        totalInterest: 0,
        totalPayment: 0,
        principalPercent: 0,
        interestPercent: 0,
      };
    }

    if (annualRate === 0) {
      return {
        emi: principal / months,
        totalInterest: 0,
        totalPayment: principal,
        principalPercent: 100,
        interestPercent: 0,
      };
    }

    const monthlyRate = annualRate / 12 / 100;

    const power = Math.pow(1 + monthlyRate, months);

    const emi = (principal * monthlyRate * power) / (power - 1);

    const totalPayment = emi * months;

    const totalInterest = totalPayment - principal;

    const principalPercent =
      totalPayment > 0 ? (principal / totalPayment) * 100 : 0;

    return {
      emi,
      totalInterest,
      totalPayment,
      principalPercent,
      interestPercent: 100 - principalPercent,
    };
  }, [amount, rate, tenure, tenureType]);

  useEffect(() => {
    async function loadForex() {
      try {
        setForexLoading(true);

        const today = new Date();

        const date = today.toISOString().split("T")[0];

        const response = await fetch(
          `https://www.nrb.org.np/api/forex/v1/rates?page=1&per_page=10&from=${date}&to=${date}`,
        );

        if (!response.ok) {
          throw new Error("Forex request failed");
        }

        const data = await response.json();

        const payload = data?.data?.payload;

        if (Array.isArray(payload) && payload.length > 0) {
          const latest = payload[0];

          setForexDate(latest.date || date);

          setForexRates(latest.rates || []);
        }
      } catch (error) {
        console.error("Failed to load forex:", error);
      } finally {
        setForexLoading(false);
      }
    }

    loadForex();
  }, []);

  function convertAdToBs() {
    try {
      setDateError("");

      const [year, month, day] = adDate.split("-").map(Number);

      if (!year || !month || !day) {
        throw new Error("Enter a valid AD date.");
      }

      const date = new Date(year, month - 1, day);

      const converted = new NepaliDate(date);

      setAdToBsResult(converted.toString());
    } catch {
      setAdToBsResult("");

      setDateError("Could not convert that AD date.");
    }
  }

  function convertBsToAd() {
    try {
      setDateError("");

      const year = Number(bsYear);

      const month = Number(bsMonth);

      const day = Number(bsDay);

      if (!year || !month || !day) {
        throw new Error("Invalid BS date");
      }

      const converted = new NepaliDate(year, month, day).toAD();

      setBsToAdResult(formatAdDate(converted));
    } catch {
      setBsToAdResult("");

      setDateError("Could not convert that BS date.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}

      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-700">
            Mahila SACCOS
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            EMI Calculator
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Estimate loan installments, view exchange rates and convert AD / BS
            dates.
          </p>
        </div>
      </section>

      {/* EMI */}

      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1fr_1fr]">
            {/* INPUT */}

            <div className="p-5 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900">Loan Details</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Loan Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Interest Rate (%)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full rounded-lg border px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Loan Tenure
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="min-w-0 flex-1 rounded-lg border px-3 py-2.5 text-sm"
                    />

                    <select
                      value={tenureType}
                      onChange={(e) =>
                        setTenureType(e.target.value as "years" | "months")
                      }
                      className="rounded-lg border px-3 py-2.5 text-sm"
                    >
                      <option value="years">Years</option>

                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RESULTS */}

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <CompactResult
                  label="Monthly EMI"
                  value={`रु ${formatMoney(result.emi)}`}
                  important
                />

                <CompactResult
                  label="Interest"
                  value={`रु ${formatMoney(result.totalInterest)}`}
                />

                <CompactResult
                  label="Total Payment"
                  value={`रु ${formatMoney(result.totalPayment)}`}
                />
              </div>
            </div>

            {/* SMALL CHART */}

            <div className="border-t bg-green-50/40 p-5 sm:p-6 lg:border-l lg:border-t-0">
              <div className="flex flex-col items-center justify-center sm:flex-row sm:gap-7 lg:flex-col">
                <div>
                  <h2 className="text-center text-sm font-semibold text-gray-800">
                    Payment Breakdown
                  </h2>

                  <div className="mt-4 flex justify-center">
                    <div
                      className="relative h-36 w-36 rounded-full"
                      style={{
                        background: `conic-gradient(
                          #16a34a 0% ${result.principalPercent}%,
                          #f59e0b ${result.principalPercent}% 100%
                        )`,
                      }}
                    >
                      <div className="absolute inset-5 flex items-center justify-center rounded-full bg-white text-center shadow-sm">
                        <div>
                          <p className="text-[10px] text-gray-400">Total</p>

                          <p className="mt-0.5 text-sm font-bold text-gray-800">
                            रु {formatMoney(result.totalPayment)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 w-full max-w-xs space-y-2 sm:mt-0 lg:mt-5">
                  <CompactLegend
                    label="Principal"
                    className="bg-green-600"
                    percentage={result.principalPercent}
                  />

                  <CompactLegend
                    label="Interest"
                    className="bg-amber-500"
                    percentage={result.interestPercent}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-gray-400">
          EMI values are estimates only. Actual installments depend on the
          cooperative&apos;s loan rules.
        </p>
      </section>

      {/* FOREX */}

      <section id="forex" className="mx-auto max-w-6xl px-4 pb-7 sm:px-6">
        <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-green-700">
                Nepal Rastra Bank
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Exchange Rates
              </h2>
            </div>

            {forexDate && <p className="text-xs text-gray-400">{forexDate}</p>}
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border">
            {forexLoading ? (
              <div className="p-7 text-center text-sm text-gray-400">
                Loading exchange rates...
              </div>
            ) : forexRates.length > 0 ? (
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold">
                      Currency
                    </th>

                    <th className="px-4 py-2.5 text-center text-xs font-semibold">
                      Unit
                    </th>

                    <th className="px-4 py-2.5 text-right text-xs font-semibold">
                      Buy
                    </th>

                    <th className="px-4 py-2.5 text-right text-xs font-semibold">
                      Sell
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {forexRates.map((item, index) => (
                    <tr
                      key={`${item.currency.ISO3}-${item.currency.name}-${index}`}
                    >
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-gray-800">
                          {item.currency.name}
                        </div>

                        <div className="text-[11px] text-gray-400">
                          {item.currency.ISO3}
                        </div>
                      </td>

                      <td className="px-4 py-2.5 text-center text-gray-500">
                        {item.currency.unit}
                      </td>

                      <td className="px-4 py-2.5 text-right font-medium text-gray-700">
                        रु {item.buy}
                      </td>

                      <td className="px-4 py-2.5 text-right font-medium text-gray-700">
                        रु {item.sell}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-7 text-center text-sm text-gray-400">
                Exchange-rate data unavailable.
              </div>
            )}
          </div>

          <p className="mt-2 text-[11px] text-gray-400">
            Source: Nepal Rastra Bank.
          </p>
        </div>
      </section>

      {/* DATE CONVERTER */}

      <section
        id="date-converter"
        className="mx-auto max-w-6xl px-4 pb-12 sm:px-6"
      >
        <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-green-700">
              Date Tools
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              BS ↔ AD Date Converter
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Convert between Bikram Sambat and Gregorian dates.
            </p>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {/* AD → BS */}

            <div className="rounded-xl border bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-800">AD → BS</h3>

              <input
                type="date"
                value={adDate}
                onChange={(e) => setAdDate(e.target.value)}
                className="mt-3 w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
              />

              <button
                type="button"
                onClick={convertAdToBs}
                className="mt-3 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
              >
                Convert to BS
              </button>

              {adToBsResult && (
                <div className="mt-3 rounded-lg bg-white px-4 py-3">
                  <p className="text-xs text-gray-400">Bikram Sambat</p>

                  <p className="mt-1 font-bold text-green-700">
                    {adToBsResult}
                  </p>
                </div>
              )}
            </div>

            {/* BS → AD */}

            <div className="rounded-xl border bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-800">BS → AD</h3>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Year"
                  value={bsYear}
                  onChange={(e) => setBsYear(e.target.value)}
                  className="min-w-0 rounded-lg border bg-white px-3 py-2.5 text-sm"
                />

                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="Month"
                  value={bsMonth}
                  onChange={(e) => setBsMonth(e.target.value)}
                  className="min-w-0 rounded-lg border bg-white px-3 py-2.5 text-sm"
                />

                <input
                  type="number"
                  min="1"
                  max="32"
                  placeholder="Day"
                  value={bsDay}
                  onChange={(e) => setBsDay(e.target.value)}
                  className="min-w-0 rounded-lg border bg-white px-3 py-2.5 text-sm"
                />
              </div>

              <button
                type="button"
                onClick={convertBsToAd}
                className="mt-3 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
              >
                Convert to AD
              </button>

              {bsToAdResult && (
                <div className="mt-3 rounded-lg bg-white px-4 py-3">
                  <p className="text-xs text-gray-400">Gregorian</p>

                  <p className="mt-1 font-bold text-green-700">
                    {bsToAdResult}
                  </p>
                </div>
              )}
            </div>
          </div>

          {dateError && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {dateError}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CompactResult({
  label,
  value,
  important = false,
}: {
  label: string;
  value: string;
  important?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-gray-50 px-3 py-3">
      <p className="text-[11px] text-gray-400">{label}</p>

      <p
        className={`mt-1 font-bold text-gray-900 ${
          important ? "text-lg" : "text-base"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CompactLegend({
  className,
  label,
  percentage,
}: {
  className: string;
  label: string;
  percentage: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-sm ${className}`} />

        <span className="text-gray-600">{label}</span>
      </div>

      <span className="font-semibold text-gray-800">
        {percentage.toFixed(1)}%
      </span>
    </div>
  );
}
