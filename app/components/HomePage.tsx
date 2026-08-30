"use client";
import React, { useState, useEffect, useRef, type ReactNode } from "react";
import {
  Menu, X, Phone, MessageCircle, MapPin, Star, Users, BedDouble,
  Maximize2, ChevronRight, ChevronLeft, Compass, Leaf, TreePine,
  Waves, Sparkles, Gamepad2, UtensilsCrossed, Flame, ArrowRight,
  Quote,  Calendar, Sun, Moon,
  Cloud, CloudSun, CloudMoon, CloudRain, CloudDrizzle, CloudLightning,
  CloudSnow, CloudFog, Layers, Send, MessageSquareText, Minus
} from "lucide-react";

/* ---------------------------------------------------------------
   DATA
---------------------------------------------------------------- */
type WeatherState = {
  temp: number;
  code: number;
  isDay: boolean;
};

type Room = {
  id: string;
  name: string;
  world: "Mystery Maze" | "Forest Maze";
  price: number;
  size: number;
  guests: number;
  units: number;
  tag: string;
  desc: string;
};

type ChatMessage = {
  from: "arun" | "user";
  text: string;
};

type WeatherData = {
  temperature: number;
  weatherCode: number;
  isDay: number;
  rain: number;
  precipitation: number;
  cloudCover: number;
};

function getWeatherInfo(code: number) {
  if (code === 0)
    return { label: "Clear Sky", type: "sunny", icon: "☀️" };

  if (code === 1 || code === 2)
    return { label: "Partly Cloudy", type: "cloudy", icon: "🌤️" };

  if (code === 3)
    return { label: "Overcast", type: "overcast", icon: "☁️" };

  if ([45, 48].includes(code))
    return { label: "Foggy", type: "fog", icon: "🌫️" };

  if ([51, 53, 55, 56, 57].includes(code))
    return { label: "Drizzle", type: "drizzle", icon: "🌦️" };

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return { label: "Rain", type: "rain", icon: "🌧️" };

  if ([95, 96, 99].includes(code))
    return { label: "Thunderstorm", type: "storm", icon: "⛈️" };

  return { label: "Wayanad Weather", type: "cloudy", icon: "🌤️" };
}
const ROOMS: Room[] = [
  { id: "paddy-cottage", name: "Paddy View Cottage", world: "Mystery Maze", price: 7500, size: 280, guests: 2, units: 6, tag: "Popular",
    desc: "A simple cottage room opening straight onto the working paddy fields, closest to the sunrise." },
  { id: "wooden-cottage", name: "Wooden Cottage", world: "Mystery Maze", price: 8000, size: 300, guests: 2, units: 8, tag: "Entry level",
    desc: "Standalone timber cottage with a wraparound balcony, closest to the village dining hall." },
  { id: "comfy-room", name: "Comfy Rooms", world: "Mystery Maze", price: 6000, size: 240, guests: 2, units: 4, tag: "Budget",
    desc: "Compact, no-fuss rooms in the main village block — everything you need, nothing you don't." },
  { id: "pool-villa", name: "Private Pool Villa", world: "Mystery Maze", price: 22000, size: 650, guests: 2, units: 2, tag: "Most reserved",
    desc: "Your own plunge pool behind a teak screen wall, with the paddy fields as the only view." },
  { id: "honeymoon", name: "Honeymoon Cottage with Jacuzzi", world: "Mystery Maze", price: 18000, size: 500, guests: 2, units: 1, tag: "Couples",
    desc: "A four-poster bed, an in-room jacuzzi, and a private sit-out over the paddy stay. Only one, ever." },
  { id: "bamboo-chalet", name: "Artisan Bamboo Chalet", world: "Forest Maze", price: 15000, size: 400, guests: 2, units: 6, tag: "Rustic",
    desc: "Hand-built from bamboo sourced on the estate, with woven walls that let the forest sounds in." },
  { id: "cave-room", name: "Cave House", world: "Forest Maze", price: 18000, size: 550, guests: 2, units: 2, tag: "Signature",
    desc: "Built into the hillside itself — cool stone walls, a hidden entrance, candlelit dining on request." },
  { id: "tree-hut", name: "Tree Hut", world: "Forest Maze", price: 13000, size: 500, guests: 2, units: 2, tag: "Adventure",
    desc: "Raised on stilts eight feet up, reached by a rope-and-timber walkway through the forest." },
  { id: "jacuzzi-villa", name: "Jacuzzi Villa", world: "Forest Maze", price: 18000, size: 550, guests: 2, units: 2, tag: "Couples",
    desc: "An in-room jacuzzi facing the treeline, with a private deck for morning coffee above the canopy." },
  { id: "luxury-villa", name: "Luxury Villa", world: "Forest Maze", price: 20000, size: 600, guests: 4, units: 2, tag: "Families",
    desc: "A two-room layout with a shared verandah, built for families travelling with children." },
  { id: "pool-suite", name: "Private Pool Suite", world: "Forest Maze", price: 24000, size: 620, guests: 2, units: 2, tag: "Premium",
    desc: "A suite-and-pool layout tucked into the treeline, with a private deck and outdoor soaking tub." },
  { id: "independent-villa", name: "Independent Villa", world: "Forest Maze", price: 30000, size: 900, guests: 4, units: 1, tag: "Exclusive",
    desc: "A standalone multi-room villa with its own gate and garden — the only one on the estate." },
];

const TOTAL_ROOMS = ROOMS.reduce((sum, r) => sum + r.units, 0);

const WEATHER_CODES = {
  0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Foggy",
  51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
  56: "Freezing drizzle", 57: "Freezing drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  66: "Freezing rain", 67: "Freezing rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Rain showers", 81: "Rain showers", 82: "Violent showers",
  85: "Snow showers", 86: "Snow showers",
  95: "Thunderstorm", 96: "Thunderstorm", 99: "Severe thunderstorm",
};

function weatherIcon(code: number, isDay: boolean) {
  if (code === 0) return isDay ? Sun : Moon;
  if (code === 1 || code === 2) return isDay ? CloudSun : CloudMoon;
  if (code === 3) return Cloud;
  if (code === 45 || code === 48) return CloudFog;
  if ([51, 53, 55, 56, 57].includes(code)) return CloudDrizzle;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return CloudRain;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return CloudSnow;
  if ([95, 96, 99].includes(code)) return CloudLightning;
  return isDay ? Sun : Moon;
}

const RESORT_COORDS = { lat: 11.95, lon: 76.08 };

const EXPERIENCES = [
  { icon: UtensilsCrossed, title: "Village dining hall", body: "South Indian, European and Asian menus, plus a candlelit table set inside the cave for two." },
  { icon: Sparkles, title: "Spa & Ayurveda", body: "Curtained treatment rooms, faint scent, and therapists trained in traditional Kerala massage." },
  { icon: Gamepad2, title: "Indoor games room", body: "Carrom, foosball, pool and French billiards for the hours between meals." },
  { icon: Flame, title: "Campfire evenings", body: "Live acoustic music around the fire pit most nights, weather permitting." },
  { icon: Compass, title: "Jungle safari", body: "Guided jeep rides at dawn through the buffer forests bordering Kabini." },
  { icon: Waves, title: "Swimming pool", body: "A shared pool set into the village lawn, open from sunrise to late evening." },
];

const NEARBY = [
  { name: "Kuruva Island", dist: "18 km", note: "A river-island nature reserve reached by bamboo raft." },
  { name: "Kabini River", dist: "12 km", note: "Boat safaris and riverside walks at the forest's edge." },
  { name: "Edakkal Caves", dist: "26 km", note: "Prehistoric rock carvings, a steep 45-minute climb up." },
  { name: "Tholpetty Sanctuary", dist: "9 km", note: "Elephant and bison sightings on the early jeep safari." },
  { name: "Pazhassi Raja Museum", dist: "21 km", note: "Colonial-era weapons and local history, half a day." },
  { name: "Valliyoorkavu Temple", dist: "15 km", note: "An active Bhagavathi shrine, best visited at dusk." },
];

const TESTIMONIALS = [
  { name: "Adnan Muhammed", body: "The forest ambience is the whole story here — quiet mornings, a genuinely helpful staff, and food that didn't taste like a hotel kitchen made it." },
  { name: "Vijay Kumar", body: "Brought a group of clients for two nights and every one of them asked for the contact details before we left. Clean, calm, and never felt staged." },
  { name: "Priya Raghavendra", body: "We came for the wellness package and stayed an extra night for it — the ayurvedic team actually explained what they were doing, which I appreciated." },
  { name: "Lokesh H", body: "Suresh, who runs the place, remembered a request we'd mentioned in passing on day one and had it sorted by day two without us asking again." },
];

const OFFERS = [
  { title: "Three nights, pay for two", body: "Reserve three consecutive nights in any Forest Maze villa and the third is on us. Valid through the monsoon season.", code: "MONSOON3" },
  { title: "Spa weekend for two", body: "A two-night couples package with a 90-minute ayurvedic massage each, plus late checkout.", code: "SPAWEEK" },
  { title: "Early booking, 15% off", body: "Reserve any Mystery Maze room 30 days ahead and take 15% off the full stay.", code: "EARLY15" },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const NAV_STOPS = [
  { label: "Rooms", href: "#rooms" },
  { label: "Experience", href: "#experience" },
  { label: "Trail", href: "#trail" },
  { label: "Offers", href: "#offers" },
  { label: "Contact", href: "#contact" },
];

const FIREFLIES = [
  { top: "18%", left: "8%", delay: "0s", dur: "7.2s" },
  { top: "62%", left: "5%", delay: "1.4s", dur: "8.6s" },
  { top: "30%", left: "22%", delay: "2.8s", dur: "6.4s" },
  { top: "72%", left: "18%", delay: ".6s", dur: "9.1s" },
  { top: "45%", left: "12%", delay: "3.6s", dur: "7.8s" },
  { top: "12%", left: "31%", delay: "2s", dur: "8.2s" },
];

function isDaytimeNow() {
  const h = new Date().getHours();
  return h >= 6 && h < 18.5;
}

/* ---------------------------------------------------------------
   ARUN — RULE-BASED CHAT AGENT
   Answers from the resort's own data below. No external API key
   is used or required; swap `arunReply` for a fetch() to your own
   backend if you later want a full LLM-backed agent.
---------------------------------------------------------------- */

const ARUN_GREETING = "Namaskaram! I'm Arun, the Mystery Maze concierge. Ask me about rooms, prices, offers, things to do, or how to reach us.";

const ARUN_QUICK_REPLIES = ["Room prices", "Offers", "Things nearby", "How to book"];

function arunReply(raw: string): string {
  const t = raw.toLowerCase();

  if (/\b(hi|hello|hey|namaskaram|namaste)\b/.test(t)) {
    return "Hello! Happy to help — ask about rooms, prices, offers, nearby places, or how to reserve.";
  }
  if (/\b(book|reserve|reservation|availability|available)\b/.test(t)) {
    return "You can check dates with the \u201cCheck availability\u201d button up top, or call/WhatsApp us on +91 85901 05054 and we'll hold a room while you decide.";
  }
  if (/\b(price|cost|rate|charge|how much|budget)\b/.test(t)) {
    const cheapest = ROOMS.reduce((a, b) => (a.price < b.price ? a : b));
    const priciest = ROOMS.reduce((a, b) => (a.price > b.price ? a : b));
    return `Rooms run from \u20b9${cheapest.price.toLocaleString("en-IN")}/night (${cheapest.name}) up to \u20b9${priciest.price.toLocaleString("en-IN")}/night (${priciest.name}). Tell me your budget and I'll suggest a room.`;
  }
  if (/\b(room|villa|cottage|hut|chalet|suite|stay|sleep)\b/.test(t)) {
    const match = ROOMS.find((r) => t.includes(r.name.toLowerCase().split(" ")[0]));
    if (match) {
      return `${match.name} (${match.world}): \u20b9${match.price.toLocaleString("en-IN")}/night, ${match.size} ft\u00b2, up to ${match.guests} guests, ${match.units} unit${match.units > 1 ? "s" : ""} on the estate. ${match.desc}`;
    }
    return `We have ${TOTAL_ROOMS} rooms across ${ROOMS.length} room types — from Comfy Rooms and Wooden Cottages up to the Independent Villa. Which kind of stay are you after: budget, couples, or family?`;
  }
  if (/\b(offer|discount|deal|promo|code)\b/.test(t)) {
    return OFFERS.map((o) => `${o.title} — code ${o.code}`).join(" · ");
  }
  if (/\b(pool|jacuzzi|swim)\b/.test(t)) {
    return "There's a shared village pool open sunrise to late evening, plus a handful of villas with their own private plunge pool or jacuzzi — the Private Pool Villa, Private Pool Suite, and Jacuzzi Villa.";
  }
  if (/\b(food|eat|dinner|restaurant|dining|menu)\b/.test(t)) {
    return "The village dining hall serves South Indian, European and Asian menus, and we can set up a candlelit table inside the cave for two on request.";
  }
  if (/\b(safari|jungle|wildlife|kabini|animal)\b/.test(t)) {
    return "We run guided jeep safaris at dawn through the buffer forests bordering Kabini, and Tholpetty Sanctuary (9 km) is a good bet for elephant and bison sightings.";
  }
  if (/\b(near|around|visit|see|place|attraction|trail)\b/.test(t)) {
    return NEARBY.slice(0, 3).map((n) => `${n.name} (${n.dist})`).join(", ") + " — and a few more on the Nearby section of the page.";
  }
  if (/\b(contact|phone|call|whatsapp|number|address|location|direction)\b/.test(t)) {
    return "Call or WhatsApp us on +91 85901 05054, or find us at Kattikkulam, Palvelicham, Wayanad, Kerala 670646.";
  }
  if (/\b(weather|rain|climate|temperature)\b/.test(t)) {
    return "Check the live weather chip in the hero at the top of the page — it's pulled straight from the estate's coordinates.";
  }
  if (/\b(thank|thanks|thank you)\b/.test(t)) {
    return "You're welcome! Anything else — rooms, offers, or getting here?";
  }
  return "I might not have that exact answer, but our team will over WhatsApp — tap the WhatsApp button, or ask me about rooms, prices, offers, or nearby places.";
}

/* ---------------------------------------------------------------
   REVEAL-ON-SCROLL HOOK
---------------------------------------------------------------- */

function useReveal(): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------
   SMALL PIECES
---------------------------------------------------------------- */

function TrailMark({ label }: { label: string }) {
  return (
    <div className="trailmark">
      <svg width="30" height="46" viewBox="0 0 30 46" fill="none" aria-hidden="true">
        <path d="M15 0 V12 C15 19 3 19 3 26 C3 33 27 33 27 40 V46" stroke="var(--gold)" strokeWidth="1" />
        <circle cx="15" cy="12" r="2.5" fill="var(--gold)" />
      </svg>
      <span className="trailmark-label">{label}</span>
    </div>
  );
}

function Divider() {
  return (
    <div className="mm-divider" aria-hidden="true">
      <span className="mm-divider-line" />
      <span className="mm-divider-dot" />
      <span className="mm-divider-line" />
    </div>
  );
}

function ScrollTrail({ progress }: { progress: number }) {
  return (
    <div className="scroll-trail" aria-hidden="true">
      <svg width="18" height="100%" viewBox="0 0 18 1000" preserveAspectRatio="none" className="scroll-trail-svg">
        <path d="M9 0 C9 60 3 90 3 150 C3 210 15 240 15 300 C15 360 3 390 3 450 C3 510 15 540 15 600 C15 660 3 690 3 750 C3 810 15 840 15 900 C15 940 9 960 9 1000"
          stroke="rgba(228,205,151,.16)" strokeWidth="1.5" fill="none" />
        <path d="M9 0 C9 60 3 90 3 150 C3 210 15 240 15 300 C15 360 3 390 3 450 C3 510 15 540 15 600 C15 660 3 690 3 750 C3 810 15 840 15 900 C15 940 9 960 9 1000"
          stroke="var(--gold)" strokeWidth="1.5" fill="none"
          strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} />
      </svg>
      <div className="scroll-trail-mark" style={{ top: `${progress}%` }}>
        <span className="scroll-trail-dot" />
      </div>
    </div>
  );
}

function Celestial({ isDay, code }: { isDay: boolean; code?: number | null }) {
  const Icon = code != null ? weatherIcon(code, isDay) : (isDay ? Sun : Moon);
  return (
    <div className={`celestial ${isDay ? "is-day" : "is-night"}`} aria-hidden="true">
      <span className="celestial-glow" />
      <span className="celestial-body">
        <Icon size={isDay ? 28 : 24} strokeWidth={1.3} />
      </span>
    </div>
  );
}

function WeatherChip({ weather }: { weather: WeatherState | null }) {
  if (!weather) return null;
  const Icon = weatherIcon(weather.code, weather.isDay);
  return (
    <div className="weather-chip fade-up" style={{ animationDelay: ".05s" }}>
      <Icon size={14} aria-hidden="true" />
      <span>{Math.round(weather.temp)}&deg;C &middot; WEATHER_LABELS[code as keyof typeof WEATHER_LABELS] || "—" &middot; Wayanad</span>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function RoomCard({ room, index }: { room: Room; index: number }) {
  const hue = room.world === "Mystery Maze" ? "var(--fern)" : "var(--espresso)";
  const WorldIcon = room.world === "Mystery Maze" ? Leaf : TreePine;
  return (
    <Reveal className="room-card-wrap">
      <article className="room-card">
        <div className="room-thumb" style={{ background: `linear-gradient(155deg, ${hue}, var(--ink))` }}>
          <WorldIcon className="room-thumb-icon" size={120} strokeWidth={0.7} aria-hidden="true" />
          <span className="room-index">{ROMAN[index]}</span>
          <span className="room-tag">{room.tag}</span>
          <span className="room-world">{room.world}</span>
        </div>
        <div className="room-body">
          <h3>{room.name}</h3>
          <p className="room-desc">{room.desc}</p>
          <div className="room-meta">
            <span><Maximize2 size={12} aria-hidden="true" /> {room.size} ft&sup2;</span>
            <span><BedDouble size={12} aria-hidden="true" /> 1 bed</span>
            <span><Users size={12} aria-hidden="true" /> {room.guests} guests</span>
            <span><Layers size={12} aria-hidden="true" /> {room.units} unit{room.units > 1 ? "s" : ""}</span>
          </div>
          <div className="room-foot">
            <div>
              <span className="room-from">From</span>
              <span className="room-price">&#8377;{room.price.toLocaleString("en-IN")}</span>
              <span className="room-night">/ night</span>
            </div>
            <button className="btn-line">Reserve <ArrowRight size={13} aria-hidden="true" /></button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ArunChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ from: "arun", text: ARUN_GREETING }]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  function send(text?: string) {
    const clean = (text ?? input).trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: "user", text: clean }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { from: "arun", text: arunReply(clean) }]);
    }, 500);
  }

  return (
    <div className="arun-widget">
      {open && (
        <div className="arun-panel">
          <div className="arun-head">
            <div className="arun-head-id">
              <span className="arun-avatar">A</span>
              <div>
                <div className="arun-name">Arun</div>
                <div className="arun-status"><span className="arun-dot" /> Online now</div>
              </div>
            </div>
            <button className="arun-close" onClick={() => setOpen(false)} aria-label="Close chat"><Minus size={16} /></button>
          </div>
          <div className="arun-list" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={`arun-bubble ${m.from}`}>{m.text}</div>
            ))}
          </div>
          {messages.length <= 1 && (
            <div className="arun-quick">
              {ARUN_QUICK_REPLIES.map((q) => (
                <button key={q} onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}
          <form className="arun-input-row" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Arun anything..." aria-label="Message Arun" />
            <button type="submit" aria-label="Send"><Send size={15} /></button>
          </form>
        </div>
      )}
      <button className="arun-launcher" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close chat with Arun" : "Chat with Arun"}>
        {open ? <X size={20} /> : <MessageSquareText size={20} />}
        {!open && <span className="arun-launcher-label">Chat with Arun</span>}
      </button>
    </div>
  );
}


/* ---------------------------------------------------------------
   LIVE WEATHER ATMOSPHERE
   The Open-Meteo result controls the complete hero atmosphere:
   clear / cloudy / drizzle / rain / fog / thunderstorm / night.
---------------------------------------------------------------- */

const WEATHER_PARTICLES = Array.from({ length: 110 }, (_, i) => ({
  left: `${(i * 37.17) % 100}%`,
  delay: `${((i * 0.137) % 2.4).toFixed(2)}s`,
  duration: `${(0.55 + ((i * 0.071) % 0.7)).toFixed(2)}s`,
  height: `${18 + ((i * 11) % 24)}px`,
}));

function WeatherAtmosphere({ weather }: { weather: WeatherState | null }) {
  if (!weather) return null;

  const { code, isDay } = weather;

  const isRain = [61, 63, 65, 66, 67, 80, 81, 82].includes(code);
  const isDrizzle = [51, 53, 55, 56, 57].includes(code);
  const isFog = [45, 48].includes(code);
  const isCloudy = [1, 2, 3].includes(code);
  const isStorm = [95, 96, 99].includes(code);
  const isWet = isRain || isDrizzle || isStorm;

  let mode = "clear";
  if (isStorm) mode = "storm";
  else if (isRain) mode = "rain";
  else if (isDrizzle) mode = "drizzle";
  else if (isFog) mode = "fog";
  else if (isCloudy) mode = "cloudy";
  else if (!isDay) mode = "night";

  return (
    <div className={`weather-atmosphere weather-${mode}`} aria-hidden="true">
      <div className="weather-color-wash" />

      {(isCloudy || isWet || isFog) && (
        <div className="weather-cloud-bank">
          <span className="weather-cloud cloud-a" />
          <span className="weather-cloud cloud-b" />
          <span className="weather-cloud cloud-c" />
        </div>
      )}

      {isDay && !isStorm && !isFog && (
        <div className="weather-sun-haze" />
      )}

      {!isDay && !isStorm && (
        <div className="weather-night-haze" />
      )}

      {(isRain || isDrizzle) && (
        <div className={`weather-rain-field ${isDrizzle ? "is-drizzle" : ""}`}>
          {WEATHER_PARTICLES.map((particle, i) => (
            <span
              key={i}
              className="weather-rain-drop"
              style={{
                left: particle.left,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
                height: particle.height,
              }}
            />
          ))}
        </div>
      )}

      {isFog && (
        <div className="weather-fog">
          <span className="fog-one" />
          <span className="fog-two" />
          <span className="fog-three" />
        </div>
      )}

      {isStorm && (
        <>
          <div className="weather-storm-clouds" />
          <div className="weather-lightning" />
        </>
      )}

      {isWet && <div className="weather-wet-vignette" />}
    </div>
  );
}

/* ---------------------------------------------------------------
   MAIN
---------------------------------------------------------------- */

export default function MysteryMazeResort() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [worldFilter, setWorldFilter] = useState("All");
  const [testiIndex, setTestiIndex] = useState(0);
  const [showReserve, setShowReserve] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [isDay, setIsDay] = useState(isDaytimeNow());
  const [weather, setWeather] = useState<WeatherState | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setIsDay(isDaytimeNow()), 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${RESORT_COORDS.lat}&longitude=${RESORT_COORDS.lon}&current_weather=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const cw = data.current_weather;
        if (!cancelled && cw) {
          setWeather({ temp: cw.temperature, code: cw.weathercode, isDay: cw.is_day === 1 });
          setIsDay(cw.is_day === 1);
        }
      } catch (e) {
        // Network unavailable — hero falls back to the visitor's local clock.
        console.error("Mystery Maze: weather fetch failed —", e);
      }
    }
    loadWeather();
    const timer = setInterval(loadWeather, 15 * 60 * 1000);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowReserve(window.scrollY > 700);
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScrollPct(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredRooms = worldFilter === "All" ? ROOMS : ROOMS.filter(r => r.world === worldFilter);
  const nextT = () => setTestiIndex((i) => (i + 1) % TESTIMONIALS.length);
  const prevT = () => setTestiIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="mm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,340;0,9..144,440;0,9..144,560;1,9..144,440;1,9..144,500&family=Work+Sans:wght@300;400;500;600&family=Space+Mono&display=swap');

        .mm-root {
          --ink: #0F1610;
          --espresso: #241A10;
          --canopy: #1D2A18;
          --fern: #46613A;
          --gold: #AD8B3B;
          --gold-light: #E4CD97;
          --gold-soft: #C9A960;
          --parchment: #F4EFE4;
          --paper: #FBF9F4;
          --text: #2A2018;
          font-family: 'Work Sans', sans-serif;
          font-weight: 300;
          background: var(--parchment);
          color: var(--text);
          line-height: 1.6;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        .mm-root * { box-sizing: border-box; }
        .mm-root h1, .mm-root h2, .mm-root h3 {
          font-family: 'Fraunces', serif;
          font-weight: 440;
          margin: 0;
          color: inherit;
          letter-spacing: -0.01em;
        }
        .mm-root .eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 400;
        }
        .weather-chip {
          display: inline-flex; align-items: center; gap: 7px; margin-top: 14px;
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: .06em;
          color: var(--gold-light); opacity: .85; text-transform: none;
        }
        .weather-chip svg { color: var(--gold-light); flex-shrink: 0; }
        .mm-wrap { max-width: 1180px; margin: 0 auto; padding: 0 32px; }

        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 999; opacity: .035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .reveal { opacity: 0; transform: translateY(22px); transition: opacity .9s cubic-bezier(.2,.6,.2,1), transform .9s cubic-bezier(.2,.6,.2,1); }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }

        /* NAV */
        .mm-nav {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 26px 32px; transition: background .4s, padding .4s, box-shadow .4s, border-color .4s;
          background: transparent; border-bottom: 1px solid transparent;
        }
        .mm-nav.scrolled { background: rgba(15,22,16,.94); backdrop-filter: blur(10px); padding: 16px 32px; border-color: rgba(228,205,151,.12); }
        .mm-logo { font-family: 'Fraunces', serif; font-weight: 440; font-size: 19px; color: var(--paper); letter-spacing: .02em; font-style: italic; }
        .mm-logo span { color: var(--gold-light); font-style: normal; }
        .mm-links { display: none; gap: 34px; align-items: center; }
        .mm-links a { position: relative; color: var(--parchment); text-decoration: none; font-size: 12.5px; letter-spacing: .05em; text-transform: uppercase; opacity: .82; padding-bottom: 4px; }
        .mm-links a::after { content: ''; position: absolute; left: 0; bottom: 0; width: 0; height: 1px; background: var(--gold-light); transition: width .3s; }
        .mm-links a:hover { opacity: 1; }
        .mm-links a:hover::after { width: 100%; }
        .mm-navbtn {
          background: transparent; color: var(--gold-light); border: 1px solid var(--gold); padding: 11px 22px;
          font-family: 'Work Sans', sans-serif; font-weight: 500; font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
          cursor: pointer;
        }
        .mm-navbtn:hover { background: var(--gold); color: var(--ink); }
        .mm-burger { background: none; border: none; color: var(--paper); cursor: pointer; display: block; }
        .mm-mobile { position: fixed; inset: 0; background: var(--ink); z-index: 60; padding: 28px; display: flex; flex-direction: column; }
        .mm-mobile a { color: var(--parchment); text-decoration: none; font-size: 24px; font-family: 'Fraunces', serif; font-style: italic; padding: 15px 0; border-bottom: 1px solid rgba(228,205,151,.1); }
        @media (min-width: 900px) {
          .mm-links { display: flex; }
          .mm-burger { display: none; }
        }

        /* HERO */
        .mm-hero {
          position: relative; min-height: 94vh; display: flex; align-items: center;
          background:
            radial-gradient(ellipse 900px 500px at 15% -5%, rgba(173,139,59,.14), transparent 60%),
            linear-gradient(175deg, var(--ink) 0%, var(--canopy) 60%, var(--fern) 145%);
          margin-top: -85px; padding-top: 85px; overflow: hidden;
          transition: background 1.2s ease;
        }
        .mm-hero.is-day {
          background:
            radial-gradient(ellipse 900px 500px at 15% -5%, rgba(228,205,151,.16), transparent 60%),
            linear-gradient(175deg, var(--ink) 0%, var(--canopy) 58%, var(--fern) 150%);
        }
        .mm-hero.is-night {
          background:
            radial-gradient(ellipse 900px 500px at 15% -5%, rgba(173,139,59,.14), transparent 60%),
            linear-gradient(175deg, #090D0A 0%, var(--canopy) 60%, var(--fern) 145%);
        }
        .mm-hero-watermark {
          position: absolute; right: -4%; top: 50%; transform: translateY(-50%);
          font-family: 'Fraunces', serif; font-style: italic; font-size: min(38vw, 480px); color: rgba(228,205,151,.045);
          white-space: nowrap; pointer-events: none; user-select: none; line-height: 1;
        }
        .mm-hero-lines { position: absolute; inset: 0; opacity: .3; pointer-events: none; }
        .mm-hero-inner { position: relative; z-index: 2; padding: 70px 32px 100px; max-width: 1180px; margin: 0 auto; width: 100%; }
        .mm-hero h1 {
          font-size: clamp(40px, 6.4vw, 80px); color: var(--paper); line-height: 1.04; max-width: 840px;
          font-style: italic; font-weight: 400;
        }
        .mm-hero h1 em { font-style: italic; color: var(--gold-light); font-weight: 440; }
        .mm-hero-sub { color: var(--parchment); opacity: .72; font-size: 16px; font-weight: 300; max-width: 470px; margin-top: 22px; }
        .mm-hero-ctas { display: flex; gap: 16px; margin-top: 40px; flex-wrap: wrap; }
        .btn-gold {
          background: var(--gold); color: var(--ink); border: none; padding: 15px 28px;
          font-weight: 500; font-size: 13px; letter-spacing: .04em; text-transform: uppercase; cursor: pointer;
          display: inline-flex; align-items: center; gap: 9px; transition: background .25s, transform .25s;
        }
        .btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); }
        .btn-ghost {
          background: transparent; color: var(--paper); border: 1px solid rgba(244,239,228,.32); padding: 15px 28px;
          font-weight: 400; font-size: 13px; letter-spacing: .04em; text-transform: uppercase; cursor: pointer;
          display: inline-flex; align-items: center; gap: 9px; transition: border-color .25s;
        }
        .btn-ghost:hover { border-color: var(--gold-light); color: var(--gold-light); }
        .mm-stats { display: flex; gap: 48px; margin-top: 68px; flex-wrap: wrap; }
        .stat-value { font-family: 'Fraunces', serif; font-size: 28px; color: var(--paper); font-weight: 400; }
        .stat-label { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-soft); margin-top: 4px; }

        /* TRAIL + DIVIDER */
        .trailmark { display: flex; flex-direction: column; align-items: center; margin: 4px 0 -4px; }
        .trailmark-label { font-family: 'Space Mono', monospace; font-size: 10.5px; letter-spacing: .18em; color: var(--gold); margin-top: 8px; text-transform: uppercase; }
        .mm-divider { display: flex; align-items: center; gap: 14px; margin: 0 0 20px; }
        .mm-divider-line { width: 40px; height: 1px; background: rgba(173,139,59,.4); }
        .mm-divider-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--gold); }

        /* SECTION generic */
        .mm-section { padding: 120px 0; }
        .mm-section.dark { background: var(--ink); color: var(--parchment); }
        .mm-section.dark h2 { color: var(--paper); }
        .mm-h2 { font-size: clamp(30px, 4.2vw, 46px); max-width: 660px; font-weight: 400; }
        .mm-lead { font-size: 15.5px; max-width: 520px; opacity: .68; margin-top: 16px; font-weight: 300; line-height: 1.7; }

        /* TWO WORLDS */
        .worlds { display: grid; grid-template-columns: 1fr; gap: 22px; margin-top: 56px; }
        @media (min-width: 800px) { .worlds { grid-template-columns: 1fr 1fr; } }
        .world-card { padding: 48px 38px; position: relative; min-height: 360px; display: flex; flex-direction: column; justify-content: flex-end; border: 1px solid rgba(173,139,59,.18); transition: border-color .3s; }
        .world-card:hover { border-color: rgba(173,139,59,.5); }
        .world-card.village { background: linear-gradient(165deg, var(--fern) 0%, var(--canopy) 100%); }
        .world-card.forest { background: linear-gradient(165deg, var(--canopy) 0%, var(--espresso) 100%); }
        .world-card h3 { color: var(--paper); font-size: 30px; font-style: italic; font-weight: 400; }
        .world-card p { color: var(--parchment); opacity: .68; font-size: 14px; margin-top: 12px; max-width: 380px; font-weight: 300; }
        .world-icon { position: absolute; top: 38px; right: 38px; opacity: .45; }
        .world-num { position: absolute; top: 38px; left: 38px; font-family: 'Space Mono', monospace; font-size: 11px; color: var(--gold-soft); letter-spacing: .1em; }

        /* ROOMS */
        .filter-row { display: flex; gap: 10px; margin: 44px 0 8px; flex-wrap: wrap; }
        .filter-chip {
          border: 1px solid rgba(42,32,24,.28); background: transparent; color: var(--text);
          padding: 9px 18px; border-radius: 100px; font-size: 12.5px; cursor: pointer; font-family: 'Work Sans', sans-serif;
          letter-spacing: .02em; transition: all .25s;
        }
        .filter-chip.active { background: var(--espresso); color: var(--paper); border-color: var(--espresso); }
        .rooms-grid { display: grid; grid-template-columns: 1fr; gap: 28px; margin-top: 32px; }
        @media (min-width: 720px) { .rooms-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1080px) { .rooms-grid { grid-template-columns: 1fr 1fr 1fr; } }
        .room-card { background: var(--paper); overflow: hidden; border: 1px solid rgba(42,32,24,.1); transition: transform .35s cubic-bezier(.2,.6,.2,1), box-shadow .35s; height: 100%; }
        .room-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px -20px rgba(15,22,16,.28); }
        .room-thumb { height: 160px; position: relative; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; }
        .room-index { position: absolute; bottom: 14px; right: 18px; font-family: 'Fraunces', serif; font-style: italic; font-size: 34px; color: rgba(244,239,228,.22); }
        .room-tag { align-self: flex-start; background: rgba(251,249,244,.94); color: var(--ink); font-size: 10px; font-weight: 500; padding: 5px 11px; border-radius: 100px; letter-spacing: .04em; text-transform: uppercase; }
        .room-world { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--gold-light); letter-spacing: .1em; text-transform: uppercase; }
        .room-body { padding: 24px 24px 26px; }
        .room-body h3 { font-size: 19px; font-weight: 440; }
        .room-desc { font-size: 13px; opacity: .68; margin-top: 10px; line-height: 1.65; min-height: 64px; font-weight: 300; }
        .room-meta { display: flex; gap: 15px; margin-top: 16px; font-size: 11.5px; opacity: .6; flex-wrap: wrap; }
        .room-meta span { display: inline-flex; align-items: center; gap: 5px; }
        .room-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; padding-top: 18px; border-top: 1px solid rgba(42,32,24,.12); }
        .room-from { font-size: 10px; opacity: .55; display: block; letter-spacing: .04em; text-transform: uppercase; }
        .room-price { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 440; }
        .room-night { font-size: 11px; opacity: .55; margin-left: 2px; }
        .btn-line { background: none; border: 1px solid var(--espresso); color: var(--espresso); padding: 9px 14px; font-size: 11.5px; letter-spacing: .03em; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all .25s; }
        .btn-line:hover { background: var(--espresso); color: var(--paper); }

        /* EXPERIENCES */
        .exp-grid { display: grid; grid-template-columns: 1fr; gap: 1px; margin-top: 52px; background: rgba(244,239,228,.1); }
        @media (min-width: 700px) { .exp-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1000px) { .exp-grid { grid-template-columns: 1fr 1fr 1fr; } }
        .exp-cell { background: var(--ink); padding: 40px 32px; transition: background .3s; }
        .exp-cell:hover { background: #141d15; }
        .exp-cell svg { color: var(--gold); }
        .exp-cell h3 { color: var(--paper); font-size: 17px; margin-top: 20px; font-weight: 440; }
        .exp-cell p { color: var(--parchment); opacity: .6; font-size: 13px; margin-top: 10px; font-weight: 300; line-height: 1.65; }

        /* NEARBY */
        .nearby-list { margin-top: 48px; border-top: 1px solid rgba(42,32,24,.14); }
        .nearby-row { display: flex; align-items: center; gap: 20px; padding: 20px 4px; border-bottom: 1px solid rgba(42,32,24,.14); transition: padding-left .3s, background .3s; }
        .nearby-row:hover { padding-left: 12px; background: rgba(173,139,59,.05); }
        .nearby-dist { font-family: 'Space Mono', monospace; font-size: 11.5px; color: var(--gold); width: 58px; flex-shrink: 0; }
        .nearby-name { font-family: 'Fraunces', serif; font-size: 18px; width: 210px; flex-shrink: 0; font-weight: 440; }
        .nearby-note { font-size: 13px; opacity: .62; font-weight: 300; }

        /* TESTIMONIALS */
        .testi-wrap { max-width: 740px; margin: 52px auto 0; text-align: center; position: relative; }
        .testi-mark { font-family: 'Fraunces', serif; font-size: 90px; color: rgba(228,205,151,.1); line-height: 1; margin-bottom: -30px; }
        .testi-body { font-family: 'Fraunces', serif; font-style: italic; font-size: clamp(19px, 2.7vw, 27px); color: var(--paper); line-height: 1.55; font-weight: 400; }
        .testi-name { margin-top: 26px; font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--gold-soft); }
        .testi-nav { display: flex; justify-content: center; gap: 14px; margin-top: 32px; }
        .testi-nav button { background: transparent; border: 1px solid rgba(244,239,228,.25); color: var(--parchment); width: 38px; height: 38px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .25s; }
        .testi-nav button:hover { border-color: var(--gold); color: var(--gold); }

        /* OFFERS */
        .offers-grid { display: grid; grid-template-columns: 1fr; gap: 22px; margin-top: 52px; }
        @media (min-width: 800px) { .offers-grid { grid-template-columns: 1fr 1fr 1fr; } }
        .offer-card { background: var(--paper); border: 1px solid rgba(42,32,24,.1); padding: 32px; display: flex; flex-direction: column; height: 100%; transition: border-color .3s; }
        .offer-card:hover { border-color: var(--gold); }
        .offer-card h3 { font-size: 19px; font-weight: 440; }
        .offer-card p { font-size: 13px; opacity: .68; margin-top: 12px; flex-grow: 1; font-weight: 300; line-height: 1.65; }
        .offer-code { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--fern); border: 1px dashed var(--fern); display: inline-block; padding: 7px 13px; margin-top: 20px; width: fit-content; letter-spacing: .04em; }

        /* BOOKING BAND */
        .book-band { background: linear-gradient(120deg, var(--fern), var(--canopy)); padding: 64px 0; }
        .book-inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 30px; }
        .book-inner h2 { color: var(--paper); font-size: clamp(24px, 3.4vw, 36px); max-width: 480px; font-style: italic; font-weight: 400; }
        .book-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
        .btn-white { background: var(--paper); color: var(--ink); border: none; padding: 15px 26px; font-weight: 500; font-size: 13px; letter-spacing: .03em; text-transform: uppercase; cursor: pointer; display: inline-flex; align-items: center; gap: 9px; transition: transform .25s; }
        .btn-white:hover { transform: translateY(-1px); }
        .btn-outline-w { background: transparent; color: var(--paper); border: 1px solid rgba(251,249,244,.4); padding: 15px 26px; font-weight: 400; font-size: 13px; letter-spacing: .03em; text-transform: uppercase; cursor: pointer; display: inline-flex; align-items: center; gap: 9px; transition: border-color .25s; }
        .btn-outline-w:hover { border-color: var(--paper); }

        /* FLOATING RESERVE */
        .float-reserve { position: fixed; right: 26px; bottom: 26px; z-index: 55; opacity: 0; transform: translateY(12px) scale(.95); pointer-events: none; transition: opacity .35s, transform .35s; }
        .float-reserve.show { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
        .float-reserve button { background: var(--espresso); color: var(--gold-light); border: 1px solid var(--gold); padding: 14px 22px; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 12px 28px -8px rgba(15,22,16,.4); }
        .float-reserve button:hover { background: var(--gold); color: var(--ink); }

        /* FOOTER */
        .mm-footer { background: var(--ink); color: var(--parchment); padding: 76px 0 30px; }
        .foot-grid { display: grid; grid-template-columns: 1fr; gap: 44px; }
        @media (min-width: 800px) { .foot-grid { grid-template-columns: 1.4fr 1fr 1fr 1fr; } }
        .foot-grid h4 { font-family: 'Space Mono', monospace; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--gold); margin-bottom: 18px; font-weight: 400; }
        .foot-grid a { display: block; color: var(--parchment); opacity: .65; text-decoration: none; font-size: 13px; margin-bottom: 11px; font-weight: 300; transition: opacity .25s; }
        .foot-grid a:hover { opacity: 1; color: var(--gold-light); }
        .foot-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; border-top: 1px solid rgba(244,239,228,.1); margin-top: 56px; padding-top: 26px; font-size: 11.5px; opacity: .5; letter-spacing: .02em; }
        .foot-social { display: flex; gap: 15px; }
        .foot-social a { color: var(--parchment); opacity: .7; }
        .foot-social a:hover { opacity: 1; color: var(--gold-light); }

        .fade-up { animation: fadeUp .9s cubic-bezier(.2,.6,.2,1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: translateY(0);} }
        @media (prefers-reduced-motion: reduce) { .fade-up { animation: none; } }

        html { scroll-behavior: smooth; scroll-padding-top: 90px; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
        :focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

        /* SCROLL TRAIL (signature element) */
        .scroll-trail { position: fixed; left: 22px; top: 50%; transform: translateY(-50%); height: 46vh; max-height: 420px; z-index: 40; display: none; pointer-events: none; }
        @media (min-width: 1240px) { .scroll-trail { display: block; } }
        .scroll-trail-svg { height: 100%; width: 18px; display: block; }
        .scroll-trail-mark { position: absolute; left: 0; width: 18px; transform: translateY(-50%); transition: top .1s linear; }
        .scroll-trail-dot { display: block; width: 9px; height: 9px; border-radius: 50%; background: var(--gold-light); box-shadow: 0 0 0 4px rgba(228,205,151,.16), 0 0 14px rgba(228,205,151,.5); margin-left: 4.5px; }
        @media (prefers-reduced-motion: reduce) { .scroll-trail-mark { transition: none; } }

        /* FIREFLIES */
        .fireflies { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
        .firefly { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: var(--gold-light); box-shadow: 0 0 6px 2px rgba(228,205,151,.7); animation: firefly-drift ease-in-out infinite; opacity: 0; }
        @keyframes firefly-drift {
          0% { opacity: 0; transform: translate(0,0) scale(.8); }
          15% { opacity: .9; }
          50% { opacity: .5; transform: translate(18px,-26px) scale(1.15); }
          85% { opacity: .8; }
          100% { opacity: 0; transform: translate(-10px,-46px) scale(.8); }
        }
        @media (prefers-reduced-motion: reduce) { .firefly { animation: none; opacity: .5; } }

        /* CELESTIAL (sun / moon) */
        .celestial { position: absolute; top: 64px; right: 11%; width: 100px; height: 100px; z-index: 1; display: flex; align-items: center; justify-content: center; }
        .celestial-glow { position: absolute; inset: 0; border-radius: 50%; filter: blur(6px); }
        .celestial.is-day .celestial-glow { background: radial-gradient(circle, rgba(228,205,151,.5) 0%, rgba(228,205,151,.14) 45%, transparent 72%); animation: sun-pulse 5s ease-in-out infinite; }
        .celestial.is-night .celestial-glow { background: radial-gradient(circle, rgba(214,224,240,.32) 0%, rgba(214,224,240,.08) 45%, transparent 70%); animation: moon-glow 6s ease-in-out infinite; }
        .celestial-body { position: relative; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .celestial.is-day .celestial-body { background: radial-gradient(circle at 35% 30%, var(--gold-light), var(--gold) 70%); color: var(--ink); box-shadow: 0 0 34px 6px rgba(228,205,151,.45); }
        .celestial.is-night .celestial-body { background: radial-gradient(circle at 35% 30%, #F4F1E4, #D9DCE6 75%); color: var(--ink); box-shadow: 0 0 26px 4px rgba(214,224,240,.35); }
        @keyframes sun-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: .85; } }
        @keyframes moon-glow { 0%,100% { opacity: .8; } 50% { opacity: 1; } }
        @media (max-width: 900px) { .celestial { top: 50px; right: 6%; width: 76px; height: 76px; } .celestial-body { width: 44px; height: 44px; } }
        @media (max-width: 600px) { .celestial { display: none; } }
        @media (prefers-reduced-motion: reduce) { .celestial-glow { animation: none; } }

        /* HERO TREELINE */
        .mm-hero-treeline { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 70px; z-index: 1; opacity: .55; }

        /* MOBILE NAV LINKS */
        .mm-mobile-link { display: flex; align-items: baseline; gap: 16px; }
        .mm-mobile-num { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--gold); letter-spacing: .1em; }

        /* ROOM THUMB ICON */
        .room-thumb { overflow: hidden; }
        .room-thumb-icon { position: absolute; right: -18px; bottom: -22px; color: rgba(244,239,228,.14); transition: transform .5s cubic-bezier(.2,.6,.2,1); }
        .room-card:hover .room-thumb-icon { transform: translate(-6px,-6px) scale(1.06); }

        /* PREMIUM BUTTON INTERACTIONS */
        .btn-gold, .btn-ghost, .btn-line, .btn-white, .btn-outline-w, .mm-navbtn, .float-reserve button {
          position: relative; will-change: transform;
        }
        .btn-gold:active, .btn-line:active, .btn-white:active, .float-reserve button:active { transform: translateY(0) scale(.97); }
        .btn-gold:hover { box-shadow: 0 10px 26px -10px rgba(173,139,59,.55); }
        .float-reserve button:hover { box-shadow: 0 16px 34px -10px rgba(173,139,59,.5); }

        /* RESPONSIVE REFINEMENTS */
        @media (max-width: 900px) {
          .mm-wrap { padding: 0 22px; }
          .mm-section { padding: 88px 0; }
          .mm-hero { min-height: auto; padding-bottom: 30px; }
          .mm-hero-inner { padding: 54px 22px 70px; }
          .mm-stats { gap: 30px 40px; margin-top: 52px; }
        }
        @media (max-width: 600px) {
          .mm-wrap { padding: 0 18px; }
          .mm-hero-inner { padding: 44px 18px 56px; }
          .mm-hero-sub { font-size: 15px; }
          .mm-hero-ctas { gap: 12px; }
          .mm-hero-ctas button { flex: 1 1 auto; justify-content: center; padding: 14px 18px; }
          .mm-stats { gap: 24px 34px; margin-top: 44px; }
          .stat-value { font-size: 22px; }
          .world-card { padding: 34px 26px; min-height: 300px; }
          .nearby-row { flex-wrap: wrap; gap: 4px 20px; padding: 16px 4px; }
          .nearby-name { width: auto; flex: 1 1 auto; order: 1; }
          .nearby-dist { order: 0; }
          .nearby-note { width: 100%; order: 2; margin-top: 2px; }
          .testi-body { font-size: 18px; }
          .book-inner { text-align: center; justify-content: center; }
          .book-inner h2 { max-width: none; }
          .float-reserve { right: 16px; bottom: 16px; }
          .float-reserve button span { display: none; }
        }
        @media (max-width: 380px) {
          .mm-hero h1 { font-size: 34px; }
          .mm-stats { display: grid; grid-template-columns: 1fr 1fr; }
        }

        /* ARUN CHAT AGENT */
        .arun-widget { position: fixed; left: 26px; bottom: 26px; z-index: 57; display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
        .arun-launcher {
          background: var(--espresso); color: var(--gold-light); border: 1px solid var(--gold);
          padding: 15px; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 10px;
          box-shadow: 0 12px 28px -8px rgba(15,22,16,.4); transition: background .25s, padding .25s, transform .2s;
        }
        .arun-launcher:hover { background: var(--gold); color: var(--ink); }
        .arun-launcher:active { transform: scale(.96); }
        .arun-launcher-label { font-family: 'Work Sans', sans-serif; font-size: 12.5px; font-weight: 500; letter-spacing: .02em; padding-right: 4px; white-space: nowrap; }
        .arun-panel {
          width: min(340px, calc(100vw - 52px)); height: min(460px, 70vh);
          background: var(--paper); border: 1px solid rgba(42,32,24,.14); box-shadow: 0 30px 60px -20px rgba(15,22,16,.45);
          display: flex; flex-direction: column; overflow: hidden; animation: arun-pop .28s cubic-bezier(.2,.7,.3,1) both;
        }
        @keyframes arun-pop { from { opacity: 0; transform: translateY(14px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) { .arun-panel { animation: none; } }
        .arun-head { background: var(--ink); color: var(--paper); padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .arun-head-id { display: flex; align-items: center; gap: 11px; }
        .arun-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(155deg, var(--gold-light), var(--gold)); color: var(--ink); font-family: 'Fraunces', serif; font-style: italic; font-weight: 560; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .arun-name { font-family: 'Fraunces', serif; font-style: italic; font-size: 15px; font-weight: 440; }
        .arun-status { font-size: 10.5px; opacity: .65; display: flex; align-items: center; gap: 6px; margin-top: 2px; font-family: 'Work Sans', sans-serif; }
        .arun-dot { width: 6px; height: 6px; border-radius: 50%; background: #7BBE6E; box-shadow: 0 0 0 3px rgba(123,190,110,.22); flex-shrink: 0; }
        .arun-close { background: transparent; border: none; color: var(--parchment); opacity: .7; cursor: pointer; padding: 6px; display: flex; }
        .arun-close:hover { opacity: 1; }
        .arun-list { flex: 1; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 10px; background: var(--parchment); }
        .arun-bubble { max-width: 84%; padding: 10px 13px; font-size: 13px; line-height: 1.55; font-weight: 300; }
        .arun-bubble.arun { align-self: flex-start; background: var(--paper); border: 1px solid rgba(42,32,24,.1); color: var(--text); }
        .arun-bubble.user { align-self: flex-end; background: var(--espresso); color: var(--gold-light); }
        .arun-quick { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 18px 14px; background: var(--parchment); flex-shrink: 0; }
        .arun-quick button { background: var(--paper); border: 1px solid rgba(173,139,59,.35); color: var(--espresso); padding: 7px 12px; font-size: 11.5px; border-radius: 100px; cursor: pointer; font-family: 'Work Sans', sans-serif; transition: all .2s; }
        .arun-quick button:hover { background: var(--gold); border-color: var(--gold); color: var(--ink); }
        .arun-input-row { display: flex; border-top: 1px solid rgba(42,32,24,.12); background: var(--paper); flex-shrink: 0; }
        .arun-input-row input { flex: 1; border: none; background: transparent; padding: 14px 16px; font-size: 13px; font-family: 'Work Sans', sans-serif; color: var(--text); }
        .arun-input-row input:focus { outline: none; }
        .arun-input-row input::placeholder { color: rgba(42,32,24,.4); }
        .arun-input-row button { background: var(--espresso); color: var(--gold-light); border: none; width: 48px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .2s; }
        .arun-input-row button:hover { background: var(--gold); color: var(--ink); }
        @media (max-width: 600px) {
          .arun-widget { left: 16px; bottom: 16px; }
          .arun-launcher-label { display: none; }
          .arun-launcher { padding: 14px; }
          .arun-panel { position: fixed; left: 12px; right: 12px; bottom: 84px; width: auto; height: min(64vh, 480px); }
        }
      `}</style>

      <div className="grain" />
      <ScrollTrail progress={scrollPct} />

      {/* NAV */}
      <nav className={`mm-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="mm-logo">Mystery <span>Maze</span></div>
        <div className="mm-links">
          <a href="#rooms">Rooms</a>
          <a href="#experience">Experience</a>
          <a href="#trail">Nearby</a>
          <a href="#offers">Offers</a>
          <a href="#contact">Contact</a>
          <button className="mm-navbtn">Reserve</button>
        </div>
        <button className="mm-burger" onClick={() => setNavOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </nav>

      {navOpen && (
        <div className="mm-mobile">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="mm-logo">Mystery <span>Maze</span></div>
            <button className="mm-burger" onClick={() => setNavOpen(false)} aria-label="Close menu"><X size={24} /></button>
          </div>
          <div style={{ marginTop: 44 }}>
            {NAV_STOPS.map((s, i) => (
              <a key={s.label} href={s.href} className="mm-mobile-link" onClick={() => setNavOpen(false)}>
                <span className="mm-mobile-num">{ROMAN[i]}</span>{s.label}
              </a>
            ))}
          </div>
          <button className="btn-gold" style={{ marginTop: "auto" }}>Reserve your stay</button>
        </div>
      )}

      {/* HERO */}
      <header className={`mm-hero ${isDay ? "is-day" : "is-night"}`}>
        <WeatherAtmosphere weather={weather} />
        <div className="mm-hero-watermark">Maze</div>
        <svg className="mm-hero-lines" viewBox="0 0 1180 700" preserveAspectRatio="none">
          <path d="M -50 650 C 200 600, 250 500, 500 480 S 850 380, 1250 300" stroke="var(--gold)" strokeWidth="1" fill="none" />
          <path d="M -50 750 C 250 700, 300 600, 600 600 S 950 480, 1300 420" stroke="var(--gold)" strokeWidth="1" fill="none" />
        </svg>
        <Celestial isDay={isDay} code={weather ? weather.code : null} />
        {!isDay && (
          <div className="fireflies" aria-hidden="true">
            {FIREFLIES.map((f, i) => (
              <span key={i} className="firefly" style={{ top: f.top, left: f.left, animationDelay: f.delay, animationDuration: f.dur }} />
            ))}
          </div>
        )}
        <svg className="mm-hero-treeline" viewBox="0 0 1180 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 90 L0 46 L22 30 L40 46 L58 18 L78 46 L96 34 L118 46 L118 20 L140 46 L162 30 L184 52 L206 24 L228 52 L252 38 L274 52 L296 16 L320 52 L344 40 L368 52 L392 28 L414 52 L438 44 L460 52 L484 20 L508 52 L532 36 L556 52 L580 46 L602 52 L626 22 L650 52 L674 42 L696 52 L720 30 L744 52 L768 46 L790 52 L814 18 L838 52 L862 40 L886 52 L910 44 L932 52 L956 24 L980 52 L1004 42 L1028 52 L1050 34 L1074 52 L1098 46 L1120 52 L1140 40 L1160 52 L1180 46 L1180 90 Z" fill="var(--ink)" opacity="0.9" />
        </svg>
        <div className="mm-hero-inner">
          <div className="eyebrow fade-up">Wayanad &middot; Western Ghats &middot; Est. 2022</div>
          <WeatherChip weather={weather} />
          <h1 className="fade-up" style={{ animationDelay: ".1s", marginTop: 20 }}>Get delightfully <em>lost</em> in the forest.</h1>
          <p className="mm-hero-sub fade-up" style={{ animationDelay: ".2s" }}>
            Two resorts, one estate: a village of pool villas and paddy stays, and a forest of cave rooms and tree huts, both folded quietly into the Western Ghats above Kabini.
          </p>
          <div className="mm-hero-ctas fade-up" style={{ animationDelay: ".3s" }}>
            <button className="btn-gold">Check availability <ArrowRight size={15} aria-hidden="true" /></button>
            <button className="btn-ghost"><MessageCircle size={15} aria-hidden="true" /> Chat on WhatsApp</button>
          </div>
          <div className="mm-stats fade-up" style={{ animationDelay: ".4s" }}>
            <Stat value="4.7 / 5" label="Guest rating" />
            <Stat value={String(TOTAL_ROOMS)} label="Rooms, across the estate" />
            <Stat value={String(ROOMS.length)} label="Room types" />
            <Stat value="12 km" label="From Kabini river" />
          </div>
        </div>
      </header>

      {/* TWO WORLDS */}
      <section className="mm-section">
        <div className="mm-wrap">
          <Reveal><TrailMark label="The two mazes" /></Reveal>
          <Reveal delay={80}><Divider /><h2 className="mm-h2">One estate, two very different mornings.</h2></Reveal>
          <Reveal delay={140}><p className="mm-lead">Reserve into the village for paddy-field quiet, or the forest for something wilder. Guests move freely between both.</p></Reveal>
          <div className="worlds">
            <Reveal delay={100}>
              <div className="world-card village">
                <span className="world-num">01</span>
                <Leaf size={28} className="world-icon" color="var(--gold-light)" aria-hidden="true" />
                <h3>Mystery Maze</h3>
                <p>Pool villas, a honeymoon suite and wooden cottages set among working paddy fields, built in the style of a Kerala village.</p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="world-card forest">
                <span className="world-num">02</span>
                <TreePine size={28} className="world-icon" color="var(--gold-light)" aria-hidden="true" />
                <h3>Forest Maze</h3>
                <p>Cave rooms, tree huts and jacuzzi villas set into the hillside forest, a short walk from the jungle safari trailhead.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="mm-section" id="rooms" style={{ background: "var(--paper)" }}>
        <div className="mm-wrap">
          <Reveal><TrailMark label="Stays" /></Reveal>
          <Reveal delay={80}><Divider /><h2 className="mm-h2">{ROOMS.length} room types, {TOTAL_ROOMS} rooms, no two alike.</h2></Reveal>
          <Reveal delay={140}><p className="mm-lead">Filter by which side of the estate you'd rather wake up on.</p></Reveal>
          <div className="filter-row">
            {["All", "Mystery Maze", "Forest Maze"].map((w) => (
              <button key={w} className={`filter-chip ${worldFilter === w ? "active" : ""}`} onClick={() => setWorldFilter(w)}>{w}</button>
            ))}
          </div>
          <div className="rooms-grid">
            {filteredRooms.map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="mm-section dark" id="experience">
        <div className="mm-wrap">
          <Reveal><TrailMark label="The day here" /></Reveal>
          <Reveal delay={80}><Divider /><h2 className="mm-h2">What fills the hours between meals.</h2></Reveal>
          <div className="exp-grid">
            {EXPERIENCES.map((e, i) => (
              <Reveal key={e.title} delay={i * 60}>
                <div className="exp-cell">
                  <e.icon size={24} aria-hidden="true" />
                  <h3>{e.title}</h3>
                  <p>{e.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEARBY / TRAIL */}
      <section className="mm-section" id="trail" style={{ background: "var(--paper)" }}>
        <div className="mm-wrap">
          <Reveal><TrailMark label="Beyond the estate" /></Reveal>
          <Reveal delay={80}><Divider /><h2 className="mm-h2">The trail continues past our gate.</h2></Reveal>
          <Reveal delay={140}><p className="mm-lead">Everything within an hour's drive, arranged by distance.</p></Reveal>
          <div className="nearby-list">
            {NEARBY.map((n, i) => (
              <Reveal key={n.name} delay={i * 40}>
                <div className="nearby-row">
                  <span className="nearby-dist">{n.dist}</span>
                  <span className="nearby-name">{n.name}</span>
                  <span className="nearby-note">{n.note}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mm-section dark">
        <div className="mm-wrap" style={{ textAlign: "center" }}>
          <Reveal><TrailMark label="Words from guests" /></Reveal>
          <div className="testi-wrap">
            <div className="testi-mark">&ldquo;</div>
            <p className="testi-body">{TESTIMONIALS[testiIndex].body}</p>
            <div className="testi-name">{TESTIMONIALS[testiIndex].name}</div>
            <div className="testi-nav">
              <button onClick={prevT} aria-label="Previous testimonial"><ChevronLeft size={17} /></button>
              <button onClick={nextT} aria-label="Next testimonial"><ChevronRight size={17} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section className="mm-section" id="offers" style={{ background: "var(--paper)" }}>
        <div className="mm-wrap">
          <Reveal><TrailMark label="Offers" /></Reveal>
          <Reveal delay={80}><Divider /><h2 className="mm-h2">A few reasons to reserve sooner.</h2></Reveal>
          <div className="offers-grid">
            {OFFERS.map((o, i) => (
              <Reveal key={o.title} delay={i * 70}>
                <div className="offer-card">
                  <h3>{o.title}</h3>
                  <p>{o.body}</p>
                  <span className="offer-code">{o.code}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING BAND */}
      <section className="book-band">
        <div className="mm-wrap book-inner">
          <h2>Have dates in mind? Let's check the calendar.</h2>
          <div className="book-ctas">
            <button className="btn-white"><Calendar size={15} aria-hidden="true" /> Check availability</button>
            <button className="btn-outline-w"><Phone size={15} aria-hidden="true" /> +91 85901 05054</button>
            <button className="btn-outline-w"><MessageCircle size={15} aria-hidden="true" /> WhatsApp</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mm-footer" id="contact">
        <div className="mm-wrap">
          <div className="foot-grid">
            <div>
              <div className="mm-logo" style={{ marginBottom: 16 }}>Mystery <span>Maze</span></div>
              <p style={{ fontSize: 13, opacity: .65, maxWidth: 280, fontWeight: 300 }}>Kattikkulam, Palvelicham, Wayanad, Kerala 670646. Two resorts, one estate, in the Western Ghats above Kabini.</p>
              <div className="foot-social" style={{ marginTop: 20 }}>
                <a href="#" aria-label="Facebook">f</a>
                <a href="#" aria-label="Instagram">◎</a>
                <a href="#" aria-label="YouTube">YouTube</a>
              </div>
            </div>
            <div>   
              <h4>Explore</h4>
              <a href="#rooms">Rooms</a>
              <a href="#experience">Experience</a>
              <a href="#trail">Nearby</a>
              <a href="#offers">Offers</a>
            </div>
            <div>
              <h4>Contact</h4>
              <a href="tel:+918590105054"><Phone size={11} style={{ marginRight: 7, verticalAlign: -1 }} aria-hidden="true" />+91 85901 05054</a>
              <a href="#"><MessageCircle size={11} style={{ marginRight: 7, verticalAlign: -1 }} aria-hidden="true" />WhatsApp us</a>
              <a href="#"><MapPin size={11} style={{ marginRight: 7, verticalAlign: -1 }} aria-hidden="true" />Get directions</a>
            </div>
            <div>
              <h4>Reserve direct</h4>
              <p style={{ fontSize: 12.5, opacity: .65, marginBottom: 16, fontWeight: 300 }}>No middleman, no markup — best rate guaranteed when you reserve straight with us.</p>
              <button className="btn-line" style={{ borderColor: "var(--gold)", color: "var(--gold-light)" }}>Reserve now <ArrowRight size={12} /></button>
            </div>
          </div>
          <div className="foot-bottom">
            <span>&copy; {new Date().getFullYear()} Mystery Maze Resort &amp; Spa. All rights reserved.</span>
            <span>Terms &middot; Privacy</span>
          </div>
        </div>
      </footer>

      <div className={`float-reserve ${showReserve ? "show" : ""}`}>
        <button><Calendar size={14} aria-hidden="true" /> <span>Reserve</span></button>
      </div>

      <ArunChat />
    </div>
  );
}