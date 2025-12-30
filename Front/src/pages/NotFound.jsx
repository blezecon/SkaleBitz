import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F6F9FC] text-[#111827] flex items-center justify-center px-6 py-16">
      <div className="relative w-full max-w-3xl">
        <div className="absolute inset-0 blur-3xl">
          <div className="h-full rounded-3xl bg-linear-to-br from-[#DCEBFF] via-[#E6F7FF] to-[#F4F3FF]" />
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-10 shadow-2xl shadow-[#E0E7FF]">
          <div className="flex items-center gap-3 text-sm font-semibold text-[#1F6FEB]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E6F0FF] text-[#1F6FEB]">
              <Sparkles size={20} />
            </div>
            FintechOS
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0EA5E9]">Error 404</p>
            <h1 className="text-4xl font-semibold text-[#0F172A]">Page not found</h1>
            <p className="text-lg text-[#4B5563] max-w-2xl">
              The page you’re looking for doesn’t exist or has moved. Let’s get you back to where the numbers add up.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-1">
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <p className="text-sm font-semibold text-[#0F172A]">Try these quick links</p>
              <ul className="mt-3 space-y-2 text-sm text-[#4B5563]">
                <li>• Dashboard</li>
                <li>• Deals</li>
                <li>• Onboarding</li>
                <li>• Support</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F6FEB] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1F6FEB33] transition hover:bg-[#195cc7]"
            >
              Back to home
              <ArrowLeft size={18} />
            </a>
            <a
              href="/support"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#1F2937] transition hover:border-[#CBD5E1]"
            >
              Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}