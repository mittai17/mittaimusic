/**
 * Share Button Component
 */
import { useState } from 'react';
import styles from '../styles/ShareButton.module.css';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
}

export const ShareButton = ({ title, text, url }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title,
      text: text || title,
      url: url || window.location.href,
    };

    // Try native share API first
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <button className={styles.shareBtn} onClick={handleShare} title="Share">
      {copied ? '✓ Copied!' : '🔗 Share'}
    </button>
  );
};
