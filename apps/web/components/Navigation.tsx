import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Navigation.module.css';

export const Navigation: React.FC = () => {
  const router = useRouter();

  const navItems = [
    { path: '/search', label: 'Search', icon: '🔍' },
    { path: '/tamil-music', label: 'Tamil Music', icon: '🎼' },
    { path: '/player', label: 'Player', icon: '🎵' },
  ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🎵</span>
          <span className={styles.logoText}>Mittai's Music</span>
        </Link>

        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navLink} ${
                router.pathname === item.path ? styles.navLinkActive : ''
              }`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </div>


      </div>
    </nav>
  );
};
