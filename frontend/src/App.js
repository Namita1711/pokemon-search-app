import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const TYPE_COLORS = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const QUICK_SEARCHES = ["pikachu", "bulbasaur", "charmander", "squirtle", "snorlax", "mewtwo"];

function App() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const [allNames, setAllNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const audioRef = useRef(null);

  // Fetch list of names once for autocomplete
  useEffect(() => {
    async function fetchNames() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await res.json();
        const names = data.results.map((p) => p.name);
        setAllNames(names);
      } catch (e) {
        console.warn("Failed to load pokemon list for autocomplete");
      }
    }
    fetchNames();
  }, []);

  const handleSearch = async (nameFromClick) => {
    const finalQuery = (nameFromClick || query).trim().toLowerCase();

    if (!finalQuery) {
      setError("Please enter a Pokémon name.");
      setPokemon(null);
      return;
    }

    setLoading(true);
    setError("");
    setPokemon(null);
    setShowSuggestions(false);

    try {
      const response = await fetch(
        `http://localhost:8080/api/pokemon/${finalQuery}`
      );

      if (!response.ok) {
        throw new Error("Pokémon not found");
      }

      const data = await response.json();
      setPokemon(data);

      // reset audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim() || allNames.length === 0) {
      setSuggestions([]);
      return;
    }

    const v = value.toLowerCase();
    const filtered = allNames
      .filter((name) => name.startsWith(v))
      .slice(0, 8);
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name) => {
    setQuery(name);
    setShowSuggestions(false);
    handleSearch(name);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePlaySound = async () => {
    if (!pokemon?.cries?.latest) return;

    try {
      // Stop and reset any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create new audio instance
      audioRef.current = new Audio(pokemon.cries.latest);

      // Wait for audio to be ready
      await audioRef.current.load();

      // Play audio and handle the promise
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (error) {
      console.warn("Error playing audio:", error);
    }
  };

  const maxStat =
    pokemon?.stats && pokemon.stats.length
      ? Math.max(...pokemon.stats.map((s) => s.base_stat))
      : 1;

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <header className="header">
        <h1 className="title">Pokédex Explorer</h1>
        <button
         type="button"
          className="toggle-theme"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <div className="search-area">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Pokémon by name…"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            className="search-input"
          />
        
          <button
             type="button"
            className="search-button"
           onClick={() => handleSearch()}
>              Search
                </button>

          {showSuggestions && suggestions.length > 0 && (
            <ul
              className="suggestions"
              onMouseLeave={() => setShowSuggestions(false)}
            >
              {suggestions.map((name) => (
                <li
                  key={name}
                  onClick={() => handleSuggestionClick(name)}
                  className="suggestion-item"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="quick-searches">
          <span className="quick-label">Try:</span>
          {QUICK_SEARCHES.map((name) => (
            <button
              key={name}
              className="quick-chip"
              onClick={() => handleSearch(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loader-wrapper">
          <div className="pokeball-loader" />
          <p className="info-text">Catching Pokémon data…</p>
        </div>
      )}

      {error && !loading && <p className="error-text">{error}</p>}

      {pokemon && !loading && (
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <h2 className="pokemon-name">
                {pokemon.name} <span>#{pokemon.id}</span>
              </h2>
              <div className="type-row">
                {pokemon.types.map((t) => {
                  const typeName = t.type.name;
                  return (
                    <span
                      key={typeName}
                      className="type-badge"
                      style={{
                        backgroundColor: TYPE_COLORS[typeName] || "#9CA3AF",
                      }}
                    >
                      {typeName}
                    </span>
                  );
                })}
              </div>
              <p className="subtle-text">
                Height: {pokemon.height} &nbsp;•&nbsp; Weight: {pokemon.weight}{" "}
                &nbsp;•&nbsp; Base XP: {pokemon.base_experience}
              </p>
            </div>

            <div className="card-header-right">
              {pokemon.sprites?.front_default && (
                <div className="image-wrapper">
                  <img
                    className="pokemon-image"
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                  />
                  <div className="image-glow" />
                </div>
              )}
              {pokemon.cries?.latest && (
                <button className="sound-button" onClick={handlePlaySound}>
                  🔊 Play sound
                </button>
              )}
            </div>
          </div>

          <div className="card-body">
            <div className="section">
              <h3>Abilities</h3>
              <div className="ability-badges">
                {pokemon.abilities.map((a) => (
                  <span key={a.ability.name} className="ability-badge">
                    {a.ability.name}
                    {a.is_hidden && " (hidden)"}
                  </span>
                ))}
              </div>

            </div>

            <div className="section">
              <h3>Base Stats</h3>
              <div className="stats-list">
                {pokemon.stats.map((s) => {
                  const percent = (s.base_stat / maxStat) * 100;
                  return (
                    <div key={s.stat.name} className="stat-item" data-stat={s.stat.name}>
                      <div className="stat-label">
                        <span>{s.stat.name}</span>
                        <span>{s.base_stat}</span>
                      </div>
                      <div className="stat-bar">
                        <div
                          className="stat-bar-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="section footer-note">
              <p>
                Fast results powered by your Java Spring Boot backend with
                Caffeine caching.
              </p>
            </div>
          </div>
        </div>
      )}
    {!pokemon && !loading && !error && (
  <section className="hero">
    <div className="hero-inner">
      <div className="hero-left">
        <h2 className="hero-title">Discover Pokémon — fast & fun</h2>
        <p className="hero-sub">
          Search any Pokémon by name, or get a quick surprise. Beautiful UI,
          instant results and local caching for fast lookups.
        </p>

        <div className="hero-ctas">
          <button
            className="cta-primary"
            onClick={() => handleSearch("pikachu")}
          >
            Search Pikachu
          </button>

          <button
            className="cta-secondary"
            onClick={() => {
              // pick a random name from the loaded list (fallback to QUICK_SEARCHES)
              const pool = allNames && allNames.length ? allNames : QUICK_SEARCHES;
              const random = pool[Math.floor(Math.random() * pool.length)];
              setQuery(random);
              handleSearch(random);
            }}
          >
            🎲 Surprise me
          </button>
        </div>

        <div className="hero-hint">Tip: Try typing “pi” for autocomplete</div>
      </div>

      <div className="hero-right" aria-hidden>
        <div className="pokeball-hero" />
      </div>
    </div>
  </section>
)}
    </div>
  );
}

export default App;
