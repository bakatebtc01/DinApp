'use client';

export default function Header() {
  return (
    <header className="bg-nkd-green text-white py-5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
            [Logo]
          </div>
          <div>
            <h1 className="text-2xl font-bold">Nipa-Kutubu District Development Authority (NKDDA)</h1>
            <p className="text-gray-200">Transparency • Development • Community</p>
          </div>
        </div>
      </div>
    </header>
  );
}
