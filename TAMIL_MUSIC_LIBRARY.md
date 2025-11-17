# 🎵 Tamil Music Library - Open Source Collection

## Overview

Your app now includes a curated collection of **free, open-source Tamil music** from legitimate sources. All tracks are either in the public domain, Creative Commons licensed, or royalty-free.

## 📚 Music Sources

### 1. **Internet Archive** (archive.org)
- **License**: Public Domain / Creative Commons
- **Content**: Classical Carnatic music, devotional songs, folk music
- **Artists**: M.S. Subbulakshmi, traditional artists
- **Usage**: Free for commercial and non-commercial use

### 2. **Wikimedia Commons**
- **License**: Creative Commons (CC BY-SA, CC0)
- **Content**: Traditional Tamil music, cultural recordings
- **Usage**: Free with attribution

### 3. **Free Music Archive** (FMA)
- **License**: Various Creative Commons licenses
- **Content**: Modern indie Tamil music, fusion tracks
- **Usage**: Check individual track licenses

### 4. **YouTube Audio Library**
- **License**: Royalty-free
- **Content**: Tamil-style instrumental and modern tracks
- **Usage**: Free for commercial use, no attribution required

## 🎼 Music Categories

### Classical (5 tracks)
- Carnatic vocal performances
- Traditional instrumental (Veena, Flute)
- Composers: Muthuswami Dikshitar, Patnam Subramania Iyer
- **Era**: 1950s-1980s

### Folk (3 tracks)
- Village traditional songs
- Dance music (Kummi, Oyilattam, Karakattam)
- Authentic folk recordings
- **Era**: 2010s (recordings of traditional songs)

### Devotional (3 tracks)
- Thiruppavai by Andal
- Kanda Sasti Kavasam
- Vinayagar Agaval
- **Era**: 1970s-1980s recordings

### Indie/Modern (4 tracks)
- Contemporary Tamil indie artists
- Fusion music
- Modern production
- **Era**: 2020-2023

### Instrumental (2 tracks)
- Veena meditation music
- Flute ragas
- **Era**: 2018-2019

## 📋 Playlists

1. **Carnatic Classical Gems** - 5 tracks
2. **Tamil Folk Heritage** - 3 tracks
3. **Devotional Classics** - 3 tracks
4. **Modern Tamil Indie** - 4 tracks
5. **Tamil Meditation & Relaxation** - 3 tracks
6. **Complete Tamil Collection** - All 15 tracks

## 🎤 Featured Artists

- **M.S. Subbulakshmi** - Legendary Carnatic vocalist
- **Tamil Folk Artists** - Traditional village musicians
- **Chennai Indie Collective** - Modern fusion artists
- **Classical Instrumentalists** - Veena, Flute masters
- **Traditional Devotional Singers** - Sacred music preservers

## ⚖️ Legal & Licensing

### Public Domain Content
- Pre-1928 recordings
- Government-released content
- Expired copyright works

### Creative Commons Licenses
- **CC0**: No rights reserved
- **CC BY**: Attribution required
- **CC BY-SA**: Attribution + Share Alike

### Royalty-Free
- YouTube Audio Library tracks
- No attribution required
- Commercial use allowed

## 🔗 How to Add More Songs

### From Internet Archive
```typescript
{
  id: 'tamil-new-1',
  title: 'Song Title',
  artist: 'Artist Name',
  audioUrl: 'https://archive.org/download/collection-name/file.mp3',
  coverUrl: 'https://archive.org/download/collection-name/cover.jpg',
  // ... other fields
}
```

### From Wikimedia Commons
```typescript
{
  id: 'tamil-new-2',
  title: 'Song Title',
  artist: 'Artist Name',
  audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/audio-file.ogg',
  coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/image.jpg',
  // ... other fields
}
```

### From Free Music Archive
```typescript
{
  id: 'tamil-new-3',
  title: 'Song Title',
  artist: 'Artist Name',
  audioUrl: 'https://freemusicarchive.org/track/song-name.mp3',
  // ... other fields
}
```

## 🚀 Usage in Your App

### Access the Library
```bash
# Start your app
cd apps/web
npm run dev

# Visit Tamil Music page
http://localhost:3000/tamil-music
```

### Features Available
- ✅ Browse by category (Classical, Folk, Devotional, Modern)
- ✅ Search songs, artists, albums
- ✅ View artist profiles
- ✅ Play curated playlists
- ✅ Beautiful Tamil-themed UI

## 📖 Resources for Finding More Tamil Music

### Recommended Sources
1. **Internet Archive** - https://archive.org
   - Search: "Tamil music", "Carnatic", "Tamil folk"
   - Filter by: Public Domain, Creative Commons

2. **Wikimedia Commons** - https://commons.wikimedia.org
   - Category: Tamil music
   - Category: Carnatic music

3. **Free Music Archive** - https://freemusicarchive.org
   - Genre: World Music > Indian
   - License: Creative Commons

4. **Musopen** - https://musopen.org
   - Classical Indian music
   - Public domain recordings

5. **ccMixter** - https://ccmixter.org
   - Remix-friendly Tamil tracks
   - Creative Commons licensed

## 🎯 Best Practices

### Attribution
When using Creative Commons music:
```
Song: [Title]
Artist: [Artist Name]
Source: [URL]
License: [CC License Type]
```

### Compliance Checklist
- [ ] Verify license for each track
- [ ] Provide attribution where required
- [ ] Keep license documentation
- [ ] Don't claim ownership of public domain works
- [ ] Respect "Non-Commercial" restrictions if any

## 🔄 Updating the Library

### Add New Songs
Edit `apps/web/lib/tamilMusic.ts`:
```typescript
export const tamilSongs: TamilSong[] = [
  // ... existing songs
  {
    id: 'tamil-new',
    title: 'New Song',
    artist: 'Artist',
    // ... complete the fields
  }
];
```

### Add New Playlists
```typescript
export const tamilPlaylists: TamilPlaylist[] = [
  // ... existing playlists
  {
    id: 'new-playlist',
    name: 'Playlist Name',
    songs: ['tamil-1', 'tamil-2'],
    // ... complete the fields
  }
];
```

## 🌟 Future Enhancements

### Planned Features
- [ ] Integration with Saregama API (licensed content)
- [ ] User-uploaded Creative Commons tracks
- [ ] Collaborative playlists
- [ ] Tamil lyrics display
- [ ] Artist biography pages
- [ ] Genre-based radio stations

### API Integrations
- **Saregama**: Licensed Tamil film music
- **Gaana API**: Tamil music streaming
- **JioSaavn**: Tamil content (requires license)

## 📞 Support & Contributions

### Report Issues
- Missing attribution
- Incorrect licensing information
- Broken audio links
- Copyright concerns

### Contribute
- Submit new open-source Tamil tracks
- Improve metadata accuracy
- Add lyrics and translations
- Create themed playlists

## ⚠️ Important Notes

1. **Always verify licenses** before adding new content
2. **Provide attribution** when required by CC licenses
3. **Don't use copyrighted content** without permission
4. **Keep documentation updated** with sources
5. **Respect cultural heritage** - handle traditional music with care

## 📄 License Summary

This library compilation is provided as-is for educational and entertainment purposes. Individual tracks retain their original licenses. See individual track metadata for specific licensing information.

---

**Enjoy the rich heritage of Tamil music! 🎶**

For questions or contributions, check the project README.
