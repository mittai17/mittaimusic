import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { play } from '@youtify/services';
import {
  tamilSongs,
  tamilArtists,
  tamilPlaylists,
  tamilCategories,
  getSongsByCategory,
  searchTamilSongs,
  type TamilSong,
} from '../lib/tamilMusic';
import styles from '../styles/TamilMusic.module.css';

export default function TamilMusicPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'songs' | 'artists' | 'playlists'>('songs');

  const displaySongs = searchQuery
    ? searchTamilSongs(searchQuery)
    : selectedCategory === 'all'
    ? tamilSongs
    : getSongsByCategory(selectedCategory);

  const handlePlaySong = async (song: TamilSong) => {
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
        <title>Tamil Music Library - Mittai's Music</title>
        <meta name="description" content="Explore Tamil music - Classical, Folk, Film songs and more" />
      </Head>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <span className={styles.tamilText}>தமிழ் இசை</span>
              <span className={styles.heroSubtext}>Tamil Music Library</span>
            </h1>
            <p className={styles.heroDescription}>
              Explore the rich heritage of Tamil music - from classical Carnatic to modern film songs
            </p>
          </div>
        </section>

        {/* Search Bar */}
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search Tamil songs, artists, albums..."
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
          {tamilCategories.map((category) => (
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

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'songs' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('songs')}
          >
            🎵 Songs ({displaySongs.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'artists' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            🎤 Artists ({tamilArtists.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'playlists' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('playlists')}
          >
            📋 Playlists ({tamilPlaylists.length})
          </button>
        </div>

        {/* Content */}
        <main className={styles.main}>
          {/* Songs Tab */}
          {activeTab === 'songs' && (
            <div className={styles.grid}>
              {displaySongs.map((song) => (
                <div key={song.id} className={styles.songCard} onClick={() => handlePlaySong(song)}>
                  <div className={styles.cardImage}>
                    <img src={song.coverUrl} alt={song.title} />
                    <div className={styles.playOverlay}>
                      <button className={styles.playBtn}>▶</button>
                    </div>
                    {song.year && <div className={styles.yearBadge}>{song.year}</div>}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{song.title}</h3>
                    <p className={styles.cardArtist}>{song.artist}</p>
                    {song.album && <p className={styles.cardAlbum}>{song.album}</p>}
                    {song.composer && (
                      <p className={styles.cardComposer}>🎼 {song.composer}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Artists Tab */}
          {activeTab === 'artists' && (
            <div className={styles.artistsGrid}>
              {tamilArtists.map((artist) => (
                <div key={artist.id} className={styles.artistCard}>
                  <div className={styles.artistImage}>
                    <img src={artist.avatarUrl} alt={artist.name} />
                  </div>
                  <div className={styles.artistInfo}>
                    <h3 className={styles.artistName}>{artist.name}</h3>
                    <p className={styles.artistBio}>{artist.bio}</p>
                    <div className={styles.artistGenres}>
                      {artist.genres.map((genre) => (
                        <span key={genre} className={styles.genreTag}>
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Playlists Tab */}
          {activeTab === 'playlists' && (
            <div className={styles.grid}>
              {tamilPlaylists.map((playlist) => (
                <div key={playlist.id} className={styles.playlistCard}>
                  <div className={styles.playlistImage}>
                    <img src={playlist.coverUrl} alt={playlist.name} />
                    <div className={styles.playlistOverlay}>
                      <button className={styles.playBtn}>▶</button>
                    </div>
                  </div>
                  <div className={styles.playlistInfo}>
                    <h3 className={styles.playlistName}>{playlist.name}</h3>
                    <p className={styles.playlistDesc}>{playlist.description}</p>
                    <p className={styles.playlistMeta}>{playlist.songs.length} songs</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {displaySongs.length === 0 && activeTab === 'songs' && (
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
            <h3>🎼 About Tamil Music</h3>
            <p>
              Tamil music has a rich history spanning thousands of years, from classical Carnatic
              traditions to modern film music. This library features curated Tamil songs from
              various genres and eras.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3>📚 Categories</h3>
            <ul>
              <li><strong>Classical:</strong> Carnatic and traditional music</li>
              <li><strong>Folk:</strong> Traditional village songs</li>
              <li><strong>Film:</strong> Tamil cinema music</li>
              <li><strong>Devotional:</strong> Spiritual songs</li>
              <li><strong>Modern:</strong> Contemporary Tamil music</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
