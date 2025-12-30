import DealCard from '../components/deal/DealCard';

export default function Deals() {
  const deals = [
    { name: 'BrightMart Supplies', sector: 'Retail ops · Working capital', amount: '$120,000', yieldPct: '11.8%', status: 'Active', location: 'Singapore', tenor: '12 months', risk: 'On track', href: '/deals/brightmart' },
    { name: 'AgroLink MSME', sector: 'Agri inputs · Inventory', amount: '$85,000', yieldPct: '10.9%', status: 'Active', location: 'Malaysia', tenor: '10 months', risk: 'On track', href: '/deals/agrolink' },
    { name: 'Nova Parts Co', sector: 'Manufacturing · PO finance', amount: '$140,000', yieldPct: '11.2%', status: 'Pending', location: 'Vietnam', tenor: '9 months', risk: 'Review', href: '/deals/nova' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F9FC] text-[#111827] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-[#0F172A]">Deals</h1>
          <p className="text-sm text-[#4B5563]">Browse active, pending, and pipeline MSME deals.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {deals.map((deal) => (
            <DealCard key={deal.name} {...deal} />
          ))}
        </div>
      </div>
    </div>
  );
}