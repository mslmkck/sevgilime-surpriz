// =============================================
// MUSIC DATABASE (IndexedDB)
// MP3 dosyalarını tarayıcıda saklamak için kullanılır.
// =============================================

const DB_NAME = 'MusicAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'tracks';

let db;

const initMusicDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("✅ Müzik Veritabanı Başlatıldı");
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // id (otomatik), title, artist, blob (dosya verisi), timestamp
            const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("title", "title", { unique: false });
        };
    });
};

// Müzik Ekle
const addTrackToDB = (file, title, artist) => {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");

        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        const track = {
            title: title,
            artist: artist,
            file: file, // Blob/File objesi
            created_at: new Date().getTime()
        };

        const request = store.add(track);

        request.onsuccess = () => {
            resolve(request.result); // Yeni ID döner
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

// Tüm Müzikleri Getir
const getAllTracksFromDB = () => {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");

        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

// Müzik Sil
const deleteTrackFromDB = (id) => {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");

        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve(true);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

// Global'e aç
window.musicDB = {
    init: initMusicDB,
    addTrack: addTrackToDB,
    getAllTracks: getAllTracksFromDB,
    deleteTrack: deleteTrackFromDB
};
