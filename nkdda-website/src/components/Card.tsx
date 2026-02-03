'use client';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="border border-gray-300 border-t-4 border-t-nkd-green rounded-lg p-4 bg-white">
      <h3 className="mt-0 text-nkd-green font-bold text-lg">{title}</h3>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
