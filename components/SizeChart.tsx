'use client';

import { useState } from 'react';

type Row = { size: string; bust: string; waist: string; hip: string };

const DATA: Record<'in' | 'cm', Row[]> = {
  in: [
    { size: 'S', bust: '33–34', waist: '26–27', hip: '36–37' },
    { size: 'M', bust: '35–36', waist: '28–29', hip: '38–39' },
    { size: 'L', bust: '37–39', waist: '30–32', hip: '40–42' },
    { size: 'XL', bust: '40–42', waist: '33–35', hip: '43–45' },
    { size: 'XXL', bust: '43–45', waist: '36–38', hip: '46–48' },
  ],
  cm: [
    { size: 'S', bust: '84–86', waist: '66–69', hip: '91–94' },
    { size: 'M', bust: '89–91', waist: '71–74', hip: '96–99' },
    { size: 'L', bust: '94–99', waist: '76–81', hip: '102–107' },
    { size: 'XL', bust: '102–107', waist: '84–89', hip: '109–114' },
    { size: 'XXL', bust: '109–114', waist: '91–96', hip: '117–122' },
  ],
};

export default function SizeChart() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  return (
    <div>
      {/* Unit toggle */}
      <div className="mb-4 inline-flex rounded-full border border-charcoal/20 p-1">
        {(['in', 'cm'] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            aria-pressed={unit === u}
            className={`rounded-full px-5 py-1.5 text-xs uppercase tracking-[0.12em] transition ${
              unit === u
                ? 'bg-charcoal text-cream'
                : 'text-charcoal hover:opacity-70'
            }`}
          >
            {u === 'in' ? 'Inches' : 'Centimetres'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Thoda Soft size chart — body measurements in{' '}
            {unit === 'in' ? 'inches' : 'centimetres'}
          </caption>
          <thead>
            <tr className="border-b border-charcoal/20">
              <th scope="col" className="py-3 pr-4 font-serif text-base font-normal">
                Size
              </th>
              <th scope="col" className="py-3 pr-4 font-serif text-base font-normal">
                Bust
              </th>
              <th scope="col" className="py-3 pr-4 font-serif text-base font-normal">
                Waist
              </th>
              <th scope="col" className="py-3 font-serif text-base font-normal">
                Hip
              </th>
            </tr>
          </thead>
          <tbody>
            {DATA[unit].map((row) => (
              <tr key={row.size} className="border-b border-charcoal/10">
                <th
                  scope="row"
                  className="py-3 pr-4 font-medium uppercase text-charcoal"
                >
                  {row.size}
                </th>
                <td className="py-3 pr-4 text-charcoal/80">{row.bust}</td>
                <td className="py-3 pr-4 text-charcoal/80">{row.waist}</td>
                <td className="py-3 text-charcoal/80">{row.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-charcoal-muted">
        Measurements are body measurements, not garment measurements. Each piece
        is then cut with a relaxed, feminine drape.
      </p>
    </div>
  );
}
