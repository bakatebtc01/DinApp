'use client';

export default function Hero() {
  return (
    <section 
      id="home" 
      className="bg-gradient-to-b from-nkd-green/90 to-nkd-green/90 bg-cover bg-center text-white py-12 px-4 text-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(11,61,46,0.9), rgba(11,61,46,0.9))',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">The Gateway to Development</h2>
        <p className="text-lg mb-4">Supporting a K1.3 billion development roadmap for the people of Nipa-Kutubu District.</p>
        <p className="text-base">
          <strong>Key Projects:</strong> Poroma–Kutubu Road • Law & Order Partnership • New District Administration Building
        </p>
      </div>
    </section>
  );
}
