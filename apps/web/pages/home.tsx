import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  getState, 
  play, 
  type Track,
  getPersonalizedRecommendations,
} from '@youtify/services';
import { getTrendingMusic, searchYouTubeMusic, type YouTubeVideo } from '../lib/youtube';
import styles from '../styles/HomePage.module.css';

export default function HomePage() {
  const router = useRouter();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [trendingSongs, setTrendingSongs] = useState<YouTubeVideo[]>([]);
  const [topPicks, setTopPicks] = useState<YouTubeVideo[]>([]);
  const [personalizedRecs, setPersonalizedRecs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = getState();
    setCurrentTrack(state.currentTrack);

    // Load trending and top picks
    const loadContent = async () => {
      try {
        // Get personalized recommendations first
        const recs = getPersonalizedRecommendations(8);
        setPersonalizedRecs(recs);
        
        const [trending, picks] = await Promise.all([
          getTrendingMusic(12),
          searchYouTubeMusic('top hits 2024', 8),
        ]);

        // No filtering - show all content
        setTrendingSongs(trending.slice(0, 12));
        setTopPicks(picks.slice(0, 8));
      } catch (error) {
        console.error('Failed to load content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handlePlayTrack = async (video: YouTubeVideo) => {
    const track: Track = {
      id: video.videoId,
      title: video.title,
      artist: video.channelTitle,
      artistId: `yt-${video.channelTitle}`,
      duration: 0,
      coverUrl: video.thumbnail,
      audioUrl: `youtube:${video.videoId}`,
      genre: 'YouTube',
    };
    await play(track);
    router.push('/player-enhanced');
  };

  return (
    <>
      <Head>
        <title>Mittai's Music - Your Music, Your Way</title>
        <meta name="description" content="Modern music streaming app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.logo}>Mittai's Music</h1>
            <nav className={styles.nav}>
              <Link href="/home" className={styles.navLink}>
                Home
              </Link>
              <Link href="/search" className={styles.navLink}>
                Search
              </Link>
              {currentTrack && (
                <Link href="/player-enhanced" className={styles.navLink}>
                  Now Playing
                </Link>
              )}
            </nav>
            <div className={styles.headerActions}>
              <button className={styles.profileBtn}>👤</button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>
              Your music,
              <br />
              your way
            </h2>
            <p className={styles.heroSubtitle}>
              Discover millions of songs and podcasts
            </p>
            <Link href="/search">
              <button className={styles.heroButton}>Start Listening</button>
            </Link>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroCircle}>
              <span className={styles.heroIcon}>🎵</span>
            </div>
          </div>
        </section>

        {/* Now Playing Card */}
        {currentTrack && (
          <section className={styles.nowPlayingSection}>
            <div
              className={styles.nowPlayingCard}
              onClick={() => router.push('/player-enhanced')}
            >
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className={styles.nowPlayingImage}
              />
              <div className={styles.nowPlayingInfo}>
                <div className={styles.nowPlayingText}>
                  <h3>{currentTrack.title}</h3>
                  <p>{currentTrack.artist}</p>
                </div>
                <button className={styles.nowPlayingButton}>
                  <span className={styles.playIcon}>▶</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <main className={styles.main}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading music...</p>
            </div>
          ) : (
            <>
              {/* Personalized Recommendations */}
              {personalizedRecs.length > 0 && (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>✨ Recommended for You</h2>
                  </div>
                  <div className={styles.grid}>
                    {personalizedRecs.map((track) => (
                      <div
                        key={track.id}
                        className={styles.card}
                        onClick={() => {
                          play(track);
                          router.push('/player-enhanced');
                        }}
                      >
                        <div className={styles.cardImage}>
                          <img src={track.coverUrl} alt={track.title} />
                          <div className={styles.cardOverlay}>
                            <button className={styles.cardPlayBtn}>▶</button>
                          </div>
                        </div>
                        <div className={styles.cardInfo}>
                          <h3 className={styles.cardTitle}>{track.title}</h3>
                          <p className={styles.cardArtist}>{track.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Top Picks */}
              {topPicks.length > 0 && (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Top Picks for You</h2>
                    <Link href="/search" className={styles.seeAll}>
                      See all →
                    </Link>
                  </div>
                  <div className={styles.grid}>
                    {topPicks.map((video) => (
                      <div
                        key={video.videoId}
                        className={styles.card}
                        onClick={() => handlePlayTrack(video)}
                      >
                        <div className={styles.cardImage}>
                          <img src={video.thumbnail} alt={video.title} />
                          <div className={styles.cardOverlay}>
                            <button className={styles.cardPlayBtn}>▶</button>
                          </div>
                        </div>
                        <div className={styles.cardInfo}>
                          <h3 className={styles.cardTitle}>{video.title}</h3>
                          <p className={styles.cardArtist}>
                            {video.channelTitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Trending Now */}
              {trendingSongs.length > 0 && (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>🔥 Trending Now</h2>
                    <Link href="/search" className={styles.seeAll}>
                      See all →
                    </Link>
                  </div>
                  <div className={styles.listView}>
                    {trendingSongs.map((video, index) => (
                      <div
                        key={video.videoId}
                        className={styles.listItem}
                        onClick={() => handlePlayTrack(video)}
                      >
                        <div className={styles.listItemNumber}>{index + 1}</div>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className={styles.listItemImage}
                        />
                        <div className={styles.listItemInfo}>
                          <h4 className={styles.listItemTitle}>
                            {video.title}
                          </h4>
                          <p className={styles.listItemArtist}>
                            {video.channelTitle}
                          </p>
                        </div>
                        <button className={styles.listItemPlayBtn}>▶</button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Quick Links */}
              <section className={styles.quickLinks}>
                <Link href="/search" className={styles.quickLinkCard}>
                  <div className={styles.quickLinkIcon}>🔍</div>
                  <h3>Search Music</h3>
                  <p>Find your favorite songs</p>
                </Link>
                <Link href="/player-enhanced" className={styles.quickLinkCard}>
                  <div className={styles.quickLinkIcon}>🎵</div>
                  <h3>Player</h3>
                  <p>Control your music</p>
                </Link>
                <Link href="/spotify-library" className={styles.quickLinkCard}>
                  <div className={styles.quickLinkIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </div>
                  <h3>Spotify Library</h3>
                  <p>Connect your Spotify</p>
                </Link>
              </section>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <h3 className={styles.footerLogo}>Mittai's Music</h3>
              <p>Your music, your way</p>
            </div>
            <div className={styles.footerLinks}>
              <div className={styles.footerColumn}>
                <h4>Product</h4>
                <Link href="/search">Search</Link>
                <Link href="/player-enhanced">Player</Link>
              </div>
              <div className={styles.footerColumn}>
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Contact</a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2024 Mittai's Music. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
