'use client';

export default function Navigation() {
  return (
    <nav className="bg-nkd-light-green border-b-4 border-nkd-gold">
      <ul className="max-w-7xl mx-auto flex flex-wrap list-none m-0 p-0">
        <li>
          <a href="#home" className="block px-4 py-3 text-white hover:bg-nkd-gold hover:text-black text-sm">
            Home
          </a>
        </li>
        <li>
          <a href="#governance" className="block px-4 py-3 text-white hover:bg-nkd-gold hover:text-black text-sm">
            Governance
          </a>
        </li>
        <li>
          <a href="#projects" className="block px-4 py-3 text-white hover:bg-nkd-gold hover:text-black text-sm">
            Major Projects
          </a>
        </li>
        <li>
          <a href="#community" className="block px-4 py-3 text-white hover:bg-nkd-gold hover:text-black text-sm">
            Community & Services
          </a>
        </li>
        <li>
          <a href="#media" className="block px-4 py-3 text-white hover:bg-nkd-gold hover:text-black text-sm">
            Transparency & Media
          </a>
        </li>
        <li>
          <a href="#contact" className="block px-4 py-3 text-white hover:bg-nkd-gold hover:text-black text-sm">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}
