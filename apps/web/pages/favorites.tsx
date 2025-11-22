import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { play } from '@youtify/services';
import { getFavorites, removeFromFavorites, clearFavorites } from '../lib/favorites';
import type { FavoriteSong } from '../lib/favorites';
import styles from '../styles/Favorites.module.css';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites(favs);
  };

  const handleRemove = (songId: string) => {
    removeFromFavorites(songId);
    loadFavorites();
  };

  const handleClearAll = () => {
    if (confirm('Remove all favorites?')) {
      clearFavorites();
      loadFavorites();
    }
  };

  const handlePlay = async (song: FavoriteSong) => {
    const track = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      artistId: song.artist,
      duration: 0,
      coverUrl: song.coverUrl,
      audioUrl: '',
      genre: '',
    };

    await play(track);
    router.push('/player-enhanced');
  };

  return (
    <>
      <Head>
        <title>Favorites - Mittai's Music</title>
        <meta name="description" content="Your favorite songs" />
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>❤️ Favorites</h1>
          <p className={styles.subtitle}>{favorites.length} songs</p>
          {favorites.length > 0 && (
            <button className={styles.clearBtn} onClick={handleClearAll}>
              Clear All
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>💔</div>
            <h2>No favorites yet</h2>
            <p>Start adding songs to your favorites!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {favorites.map((song) => (
              <div key={song.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <img src={song.coverUrl} alt={song.title} />
                  <div className={styles.overlay}>
                    <button
                      className={styles.playBtn}
                      onClick={() => handlePlay(song)}
                    >
                      ▶
                    </button>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{song.title}</h3>
                  <p className={styles.cardArtist}>{song.artist}</p>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(song.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
