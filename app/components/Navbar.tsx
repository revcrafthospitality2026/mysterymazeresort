"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { name: "Stay", href: "#stay" },
  { name: "Experiences", href: "#experiences" },
  { name: "Gallery", href: "#gallery" },
  { name: "Location", href: "#location" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute left-0 right-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
        {/* Logo */}
        <a
          href="#home"
          className="text-lg font-semibold tracking-[0.28em] text-white"
        >
          MYSTERY MAZE
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/90 transition hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Book Button */}
        <a
          href="#booking"
          className="hidden rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#17251d] shadow-lg transition hover:scale-105 md:block"
        >
          Book Now
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur-md md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="mx-4 overflow-hidden rounded-2xl border border-white/20 bg-[#17251d]/95 p-5 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-white transition hover:bg-white/10"
              >
                {link.name}
              </a>
            ))}

            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-white px-4 py-3 text-center font-semibold text-[#17251d]"
            >
              Book Your Stay
            </a>
          </div>
        </div>
      )}
    </header>
  );
}