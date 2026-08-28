"use client";

import { useEffect, useState } from "react";

type Weather = {
  temperature: number;
  description: string;
  icon: string;
};

function weatherInfo(code: number) {
  if (code === 0) return { description: "Clear Sky", icon: "☀️" };
  if (code <= 3) return { description: "Partly Cloudy", icon: "⛅" };
  if (code <= 48) return { description: "Cloudy", icon: "☁️" };
  if (code <= 67) return { description: "Rain", icon: "🌧️" };
  if (code <= 77) return { description: "Rain / Snow", icon: "🌦️" };
  if (code <= 82) return { description: "Rain Showers", icon: "🌦️" };
  return { description: "Thunderstorm", icon: "⛈️" };
}

export default function Home() {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    async function getWeather() {
      try {
        const locationResponse = await fetch(
          "https://geocoding-api.open-meteo.com/v1/search?name=Kattikkulam&count=1&language=en&format=json"
        );

        const locationData = await locationResponse.json();

        const latitude = locationData.results?.[0]?.latitude;
        const longitude = locationData.results?.[0]?.longitude;

        if (!latitude || !longitude) return;

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
        );

        const weatherData = await weatherResponse.json();
        const info = weatherInfo(weatherData.current.weather_code);

        setWeather({
          temperature: Math.round(weatherData.current.temperature_2m),
          description: info.description,
          icon: info.icon,
        });
      } catch (error) {
        console.error("Weather error:", error);
      }
    }

    getWeather();
  }, []);

  return (
    <main className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-6 text-white sm:px-10">
        <div className="text-lg font-semibold tracking-[0.2em]">
          MYSTERY MAZE
        </div>

        <div className="hidden items-center gap-8 text-sm md:flex">
          <a href="#stay" className="transition hover:text-white/70">
            Stay
          </a>
          <a href="#experiences" className="transition hover:text-white/70">
            Experiences
          </a>
          <a href="#gallery" className="transition hover:text-white/70">
            Gallery
          </a>
          <a href="#location" className="transition hover:text-white/70">
            Location
          </a>
        </div>

        <button className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black">
          Book Now
        </button>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden">
        <img
          src="/images/resort-hero.jpg"
          alt="Mystery Maze Resort"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-36 pt-28 text-center text-white">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-white/80">
              Wayanad, Kerala
            </p>

            <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
              Mystery Maze Resort
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
              A peaceful escape surrounded by nature, experiences and the
              beauty of Wayanad.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <button className="rounded-full bg-white px-8 py-4 font-medium text-black transition hover:bg-white/90">
                Book Your Stay
              </button>

              <button className="rounded-full border border-white/50 px-8 py-4 font-medium text-white transition hover:bg-white/10">
                Explore Resort
              </button>
            </div>
          </div>
        </div>

        {/* Bottom information bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/20 bg-black/65 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl divide-y divide-white/20 px-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5 lg:px-8">

            <div className="flex items-center gap-4 px-4 py-5 lg:px-6">
              <div className="text-3xl">⌖</div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Wayanad, Kerala
                </p>
                <p className="mt-1 text-xs text-white/65">
                  Surrounded by lush green nature
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-5 lg:px-6">
              <div className="text-3xl">♧</div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Nature Retreat
                </p>
                <p className="mt-1 text-xs text-white/65">
                  Reconnect with nature and yourself
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-5 lg:px-6">
              <div className="text-3xl">♧</div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Family Friendly
                </p>
                <p className="mt-1 text-xs text-white/65">
                  Perfect for families and groups
                </p>
              </div>
            </div>

            <div
              id="location"
              className="flex items-center gap-4 px-4 py-5 lg:px-6"
            >
              <div className="text-3xl">⌖</div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Location
                </p>

                <p className="mt-1 text-xs text-white/65">
                  Kattikkulam, Palvelicham
                </p>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Mystery+Maze+Resort+Kattikkulam+Palvelicham+Wayanad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-white underline underline-offset-2"
                >
                  View on Map ↗
                </a>
              </div>
            </div>

            {/* Live Weather */}
            <div className="flex items-center gap-4 px-4 py-5 lg:px-6">
              <div className="text-4xl">
                {weather?.icon ?? "⛅"}
              </div>

              <div>
                {weather ? (
                  <>
                    <p className="text-2xl font-semibold text-white">
                      {weather.temperature}°C
                    </p>

                    <p className="text-xs text-white/70">
                      {weather.description}
                    </p>

                    <p className="mt-1 text-xs text-white/50">
                      Wayanad
                      <span className="ml-2 text-green-400">● Live</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-white">
                      Weather
                    </p>

                    <p className="mt-1 text-xs text-white/60">
                      Loading live weather...
                    </p>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}