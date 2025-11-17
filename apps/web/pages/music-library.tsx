import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { play } from '@youtify/services';
import {
  wynkSongs,
  wynkPlaylists,
  wynkCategories,
  searchWynkSongs,
  getWynkSongsByCategory,
} from '../lib/wynkMusic';
import {
  jioSaavnSongs,
  jioSaavnPlaylists,
  jioSaavnCategories,
  searchJioSaavnSongs,
  getJioSaavnSongsByCategory,
} from '../lib/jioSaavn';
import {
  miMusicSongs,
  miMusicPlaylists,
  miMusicCategories,
  searchMiMusicSongs,
  getMiMusicSongsByCategory,
} from '../lib/miMusic';
import styles from '../styles/MusicLibrary.module.css';

type MusicService = 'wynk' | 'jiosaavn' | 'mimusic';

export default function MusicLibraryPage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<MusicService>('wynk');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get current service data
  const getCurrentSongs = () => {
    if (searchQuery) {
      switch (selectedService) {
        case 'wynk':
          return searchWynkSongs(searchQuery);
        case 'jiosaavn':
          return searchJioSaavnSongs(searchQuery);
        case 'mimusic':
          return searchMiMusicSongs(searchQuery);
      }
    }

    switch (selectedService) {
      case 'wynk':
        return selectedCategory === 'all' ? wynkSongs : getWynkSongsByCategory(selectedCategory);
      case 'jiosaavn':
        return selectedCategory === 'all' ? jioSaavnSongs : getJioSaavnSongsByCategory(selectedCategory);
      case 'mimusic':
        return selectedCategory === 'all' ? miMusicSongs : getMiMusicSongsByCategory(selectedCategory);
    }
  };

  const getCurrentCategories = () => {
    switch (selectedService) {
      case 'wynk':
        return wynkCategories;
      case 'jiosaavn':
        return jioSaavnCategories;
      case 'mimusic':
        return miMusicCategories;
    }
  };

  const displaySongs = getCurrentSongs();
  const categories = getCurrentCategories();

  const handlePlaySong = async (song: any) => {
    const track = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      artistId: song.artist,
      duration: song.duration,
      coverUrl: song.coverUrl,
      audioUrl: song.audioUrl,
      genre: song.genre,
    };

    await play(track);
    router.push('/player-enhanced');
  };

  return (
    <>
      <Head>
        <title>Music Library - Mittai's Music</title>
        <meta name="description" content="Browse music from Wynk, JioSaavn, and Mi Music" />
      </Head>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>🎵 Music Library</h1>
            <p className={styles.heroDescription}>
              Browse millions of songs from India's top music streaming services
            </p>
          </div>
        </section>

        {/* Service Selector */}
        <div className={styles.serviceSelector}>
          <button
            className={`${styles.serviceBtn} ${selectedService === 'wynk' ? styles.active : ''}`}
            onClick={() => {
              setSelectedService('wynk');
              setSelectedCategory('all');
            }}
          >
            <span className={styles.serviceIcon}>🎵</span>
            <span className={styles.serviceName}>Wynk Music</span>
          </button>
          <button
            className={`${styles.serviceBtn} ${selectedService === 'jiosaavn' ? styles.active : ''}`}
            onClick={() => {
              setSelectedService('jiosaavn');
              setSelectedCategory('all');
            }}
          >
            <span className={styles.serviceIcon}>🎶</span>
            <span className={styles.serviceName}>JioSaavn</span>
          </button>
          <button
            className={`${styles.serviceBtn} ${selectedService === 'mimusic' ? styles.active : ''}`}
            onClick={() => {
              setSelectedService('mimusic');
              setSelectedCategory('all');
            }}
          >
            <span className={styles.serviceIcon}>🎼</span>
            <span className={styles.serviceName}>Mi Music</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className={styles.categories}>
          <button
            className={`${styles.categoryBtn} ${selectedCategory === 'all' ? styles.active : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <span className={styles.categoryIcon}>🎵</span>
            All Songs
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryBtn} ${selectedCategory === category.id ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Songs Grid */}
        <main className={styles.main}>
          <div className={styles.grid}>
            {displaySongs.map((song) => (
              <div key={song.id} className={styles.songCard} onClick={() => handlePlaySong(song)}>
                <div className={styles.cardImage}>
                  <img src={song.coverUrl} alt={song.title} />
                  <div className={styles.playOverlay}>
                    <button className={styles.playBtn}>▶</button>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{song.title}</h3>
                  <p className={styles.cardArtist}>{song.artist}</p>
                  {song.album && <p className={styles.cardAlbum}>{song.album}</p>}
                  <div className={styles.cardMeta}>
                    <span className={styles.language}>{song.language}</span>
                    <span className={styles.genre}>{song.genre}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displaySongs.length === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🎵</div>
              <h3>No songs found</h3>
              <p>Try a different search term or category</p>
            </div>
          )}
        </main>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>🎵 Wynk Music</h3>
            <p>Airtel's music streaming service with millions of songs across languages</p>
          </div>
          <div className={styles.infoCard}>
            <h3>🎶 JioSaavn</h3>
            <p>India's largest music streaming platform with Bollywood, regional, and international music</p>
          </div>
          <div className={styles.infoCard}>
            <h3>🎼 Mi Music</h3>
            <p>Xiaomi's music service offering curated playlists and personalized recommendations</p>
          </div>
        </section>
      </div>
    </>
  );
}
