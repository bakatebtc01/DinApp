import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Card from '@/components/Card';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'NKDDA - Nipa-Kutubu District Development Authority',
  description: 'Official website of the Nipa-Kutubu District Development Authority – transparency, development updates, and community engagement.',
};

export default function Home() {
  return (
    <>
      <Header />
      <Navigation />
      <Hero />

      {/* Latest News */}
      <section className="py-12 px-4 bg-nkd-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-nkd-green mb-8">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="NKDDA Signs Historic Law & Order MOA">
              <p>The District strengthens public safety through a partnership with RPNGC, including recruitment of reserve personnel.</p>
            </Card>
            <Card title="Prime Minister Launches K370m Road Project">
              <p>Official launch of the Poroma–Kutubu road sealing project, improving access and economic growth.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Governance & Leadership */}
      <section id="governance" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-nkd-green mb-8">Governance & Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Leadership">
              <p><strong>Chairman:</strong> Dr. Billy Joseph</p>
              <p><strong>CEO:</strong> Camilus Ombalo</p>
            </Card>
            <Card title="District Development Plan (2023–2027)">
              <p>A K1.3 billion strategic roadmap focused on infrastructure, security, and social services.</p>
              <p><a href="#" className="text-nkd-green font-semibold hover:text-nkd-gold">Download Plan (PDF)</a></p>
            </Card>
          </div>
        </div>
      </section>

      {/* Major Projects */}
      <section id="projects" className="py-12 px-4 bg-nkd-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-nkd-green mb-8">Major Projects – 2026</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Infrastructure">
              <p>Poroma–Kutubu Road (100.6km sealing). Regular updates provided to ensure transparency.</p>
            </Card>
            <Card title="Public Safety">
              <p>Law & Order partnership, reserve police recruitment, and police housing upgrades.</p>
            </Card>
            <Card title="Modernization">
              <p>Construction of a new three-storey Nipa District Administrative Building.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Community & Social Services */}
      <section id="community" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-nkd-green mb-8">Community & Social Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Youth & Data">
              <p>Access the Kutubu Youth Data Collection portal to support planning and employment initiatives.</p>
            </Card>
            <Card title="Health & WASH">
              <p>Updates on clean water and sanitation projects in partnership with Santos Foundation and World Vision.</p>
            </Card>
            <Card title="Education">
              <p>Scholarship opportunities and school infrastructure development updates.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Transparency & Media */}
      <section id="media" className="py-12 px-4 bg-nkd-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-nkd-green mb-8">Transparency & Media</h2>
          <div className="bg-white border-l-4 border-l-nkd-gold p-4 mb-4 rounded">
            <p className="text-gray-700">NKDDA is committed to transparency. Public notices, clarifications, and official statements are published here.</p>
          </div>
          <p className="text-gray-700">Photo and video gallery showcasing project milestones will be available.</p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-nkd-green mb-8">Contact Us</h2>
          <p className="text-gray-700 mb-4">For community feedback, project inquiries, or official correspondence:</p>
          <p className="text-gray-700">
            Email: <a href="mailto:info@nkd-da.gov.pg" className="text-nkd-green font-semibold hover:text-nkd-gold">info@nkd-da.gov.pg</a><br />
            Phone: <a href="tel:+675" className="text-nkd-green font-semibold hover:text-nkd-gold">+675 XXX XXXX</a>
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
