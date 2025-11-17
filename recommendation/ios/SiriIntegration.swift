//
//  SiriIntegration.swift
//  Youtify
//
//  Siri Shortcuts and Intents integration
//  Allows users to control the app with voice commands
//

import Foundation
import Intents
import IntentsUI

// MARK: - Play Music Intent

@available(iOS 12.0, *)
class PlayMusicIntentHandler: NSObject, PlayMusicIntentHandling {
    
    func handle(intent: PlayMusicIntent, completion: @escaping (PlayMusicIntentResponse) -> Void) {
        guard let trackName = intent.trackName else {
            completion(PlayMusicIntentResponse(code: .failure, userActivity: nil))
            return
        }
        
        // Search for track
        MusicPlayerBridge.shared.playTrack(name: trackName) { success, track in
            if success, let track = track {
                let response = PlayMusicIntentResponse(code: .success, userActivity: nil)
                response.trackName = track.title
                response.artistName = track.artist
                completion(response)
            } else {
                let response = PlayMusicIntentResponse(code: .failure, userActivity: nil)
                completion(response)
            }
        }
    }
    
    func resolveTrackName(for intent: PlayMusicIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
        guard let trackName = intent.trackName, !trackName.isEmpty else {
            completion(INStringResolutionResult.needsValue())
            return
        }
        completion(INStringResolutionResult.success(with: trackName))
    }
}

// MARK: - Get Recommendations Intent

@available(iOS 12.0, *)
class GetRecommendationsIntentHandler: NSObject, GetRecommendationsIntentHandling {
    
    func handle(intent: GetRecommendationsIntent, completion: @escaping (GetRecommendationsIntentResponse) -> Void) {
        let count = intent.count?.intValue ?? 10
        
        MusicPlayerBridge.shared.getRecommendations(count: count) { recommendations in
            if !recommendations.isEmpty {
                let response = GetRecommendationsIntentResponse(code: .success, userActivity: nil)
                response.recommendations = recommendations.map { $0.title }.joined(separator: ", ")
                response.count = NSNumber(value: recommendations.count)
                completion(response)
            } else {
                let response = GetRecommendationsIntentResponse(code: .failure, userActivity: nil)
                completion(response)
            }
        }
    }
}

// MARK: - Play Playlist Intent

@available(iOS 12.0, *)
class PlayPlaylistIntentHandler: NSObject, PlayPlaylistIntentHandling {
    
    func handle(intent: PlayPlaylistIntent, completion: @escaping (PlayPlaylistIntentResponse) -> Void) {
        guard let playlistName = intent.playlistName else {
            completion(PlayPlaylistIntentResponse(code: .failure, userActivity: nil))
            return
        }
        
        MusicPlayerBridge.shared.playPlaylist(name: playlistName) { success, playlist in
            if success, let playlist = playlist {
                let response = PlayPlaylistIntentResponse(code: .success, userActivity: nil)
                response.playlistName = playlist.name
                response.trackCount = NSNumber(value: playlist.tracks.count)
                completion(response)
            } else {
                let response = PlayPlaylistIntentResponse(code: .failure, userActivity: nil)
                completion(response)
            }
        }
    }
}

// MARK: - Search Music Intent

@available(iOS 12.0, *)
class SearchMusicIntentHandler: NSObject, SearchMusicIntentHandling {
    
    func handle(intent: SearchMusicIntent, completion: @escaping (SearchMusicIntentResponse) -> Void) {
        guard let query = intent.query else {
            completion(SearchMusicIntentResponse(code: .failure, userActivity: nil))
            return
        }
        
        MusicPlayerBridge.shared.searchMusic(query: query) { results in
            if !results.isEmpty {
                let response = SearchMusicIntentResponse(code: .success, userActivity: nil)
                response.results = results.map { "\($0.title) by \($0.artist)" }.joined(separator: ", ")
                response.resultCount = NSNumber(value: results.count)
                completion(response)
            } else {
                let response = SearchMusicIntentResponse(code: .failure, userActivity: nil)
                completion(response)
            }
        }
    }
}

// MARK: - Play Similar Intent

@available(iOS 12.0, *)
class PlaySimilarIntentHandler: NSObject, PlaySimilarIntentHandling {
    
    func handle(intent: PlaySimilarIntent, completion: @escaping (PlaySimilarIntentResponse) -> Void) {
        guard let trackName = intent.trackName else {
            completion(PlaySimilarIntentResponse(code: .failure, userActivity: nil))
            return
        }
        
        MusicPlayerBridge.shared.playSimilar(to: trackName) { success, tracks in
            if success, !tracks.isEmpty {
                let response = PlaySimilarIntentResponse(code: .success, userActivity: nil)
                response.similarTracks = tracks.map { $0.title }.joined(separator: ", ")
                response.trackCount = NSNumber(value: tracks.count)
                completion(response)
            } else {
                let response = PlaySimilarIntentResponse(code: .failure, userActivity: nil)
                completion(response)
            }
        }
    }
}

// MARK: - Music Player Bridge

class MusicPlayerBridge {
    static let shared = MusicPlayerBridge()
    
    private init() {}
    
    // Bridge to React Native
    func playTrack(name: String, completion: @escaping (Bool, Track?) -> Void) {
        NotificationCenter.default.post(
            name: NSNotification.Name("PlayTrack"),
            object: nil,
            userInfo: ["trackName": name]
        )
        
        // Wait for response from React Native
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            // In real implementation, this would wait for actual response
            completion(true, Track(id: "1", title: name, artist: "Unknown"))
        }
    }
    
    func getRecommendations(count: Int, completion: @escaping ([Track]) -> Void) {
        NotificationCenter.default.post(
            name: NSNotification.Name("GetRecommendations"),
            object: nil,
            userInfo: ["count": count]
        )
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            completion([])
        }
    }
    
    func playPlaylist(name: String, completion: @escaping (Bool, Playlist?) -> Void) {
        NotificationCenter.default.post(
            name: NSNotification.Name("PlayPlaylist"),
            object: nil,
            userInfo: ["playlistName": name]
        )
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            completion(true, Playlist(name: name, tracks: []))
        }
    }
    
    func searchMusic(query: String, completion: @escaping ([Track]) -> Void) {
        NotificationCenter.default.post(
            name: NSNotification.Name("SearchMusic"),
            object: nil,
            userInfo: ["query": query]
        )
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            completion([])
        }
    }
    
    func playSimilar(to trackName: String, completion: @escaping (Bool, [Track]) -> Void) {
        NotificationCenter.default.post(
            name: NSNotification.Name("PlaySimilar"),
            object: nil,
            userInfo: ["trackName": trackName]
        )
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            completion(true, [])
        }
    }
}

// MARK: - Models

struct Track {
    let id: String
    let title: String
    let artist: String
}

struct Playlist {
    let name: String
    let tracks: [Track]
}
