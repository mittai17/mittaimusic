import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getPlaylist, type Playlist } from '@youtify/services';
import { CoverImage, Button } from '@youtify/ui';
import styles from '../../styles/Playlist.module.css';

export default function PlaylistPage() {
  const router = useRouter();
  const { id } = router.query;
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === 'string') {
      getPlaylist(id).then((playlistData) => {
        setPlaylist(playlistData);
        setLoading(false);
      });
    }
  }, [id]);

  const handleShare = async () => {
    if (navigator.share && playlist) {
      try {
        await navigator.share({
          title: playlist.name,
          text: playlist.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Playlist not found</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{playlist.name} - Mittai's Music</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>Mittai's Music</h1>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/">Home</Link>
            <Link href="/search">Search</Link>
            <Link href="/settings">Settings</Link>
          </div>
        </nav>

        <main className={styles.main}>
          <div className={styles.header}>
            <CoverImage source={{ uri: playlist.coverUrl }} size={240} />
            <div className={styles.headerInfo}>
              <h1 className={styles.title}>{playlist.name}</h1>
              {playlist.description && (
                <p className={styles.description}>{playlist.description}</p>
              )}
              <p className={styles.meta}>{playlist.tracks.length} tracks</p>
              <div className={styles.actions}>
                <Button title="Play" variant="primary" onPress={() => {}} />
                <Button title="Share" variant="secondary" onPress={handleShare} />
              </div>
            </div>
          </div>

          <div className={styles.trackList}>
            {playlist.tracks.map((track, index) => (
              <Link key={track.id} href={`/track/${track.id}`}>
                <div className={styles.trackItem}>
                  <span className={styles.trackNumber}>{index + 1}</span>
                  <CoverImage source={{ uri: track.coverUrl }} size={56} />
                  <div className={styles.trackInfo}>
                    <h4>{track.title}</h4>
                    <p>{track.artist}</p>
                  </div>
                  <span className={styles.trackDuration}>
                    {Math.floor(track.duration / 60)}:
                    {(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

