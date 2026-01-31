// =============================================
// SUPABASE CLIENT CONFIGURATION
// =============================================

console.log('🚀 Supabase Client v2.1 (Fix Applied) Loaded');

const SUPABASE_URL = 'https://ckfbkfcukokrgprpxuai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZmJrZmN1a29rcmdwcnB4dWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg1MDQsImV4cCI6MjA4NTM3NDUwNH0.Bv86d6zfPKO2fiEza69kiChkqTu6XiZbg6Ct-K8N-4Q';

// Supabase client başlatma
let supabaseClient;
if (window.supabase) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase bağlantısı başlatıldı: ', SUPABASE_URL);
    } catch (err) {
        console.error('Supabase başlatma hatası:', err);
    }
} else {
    console.warn('⚠️ Supabase kütüphanesi yüklenemedi!');
}

// Generate or retrieve unique ID for this device
function getDeviceId() {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
}

const DEVICE_ID = getDeviceId();

// Helper to get current profile ('rabbit' or 'fox')
function getCurrentProfile() {
    return localStorage.getItem('userProfile') || 'unknown';
}

// =============================================
// USER PROFILE FUNCTIONS
// =============================================

async function saveUserProfile(profileType) {
    if (!supabaseClient) return;
    try {
        // Just log the selection, don't necessarily enforce one user per profile in this simple structure
        // But we can link this device ID to a profile
        const { data, error } = await supabaseClient
            .from('user_profiles')
            .upsert({
                user_id: DEVICE_ID,
                profile_type: profileType,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            });

        if (error) throw error;
        console.log('✅ Profil kaydedildi (Supabase):', profileType);
        return data;
    } catch (error) {
        console.error('❌ Profil kaydetme hatası:', error);
        alert('Supabase Hatası: ' + (error.message || JSON.stringify(error))); // Debug için
    }
}

// =============================================
// POEMS FUNCTIONS
// =============================================

async function savePoem(title, content) {
    if (!supabaseClient) return;
    const profile = getCurrentProfile();
    try {
        const { data, error } = await supabaseClient
            .from('poems')
            .insert({
                user_id: DEVICE_ID, /* Store who wrote it (device) */
                // We could also add a 'author_profile' field if we migrated the schema, but relying on device_id is consistent with schema
                title: title || 'Başlıksız',
                content: content
            })
            .select()
            .single();

        if (error) throw error;
        console.log('✅ Şiir kaydedildi');
        return data;
    } catch (error) {
        console.error('❌ Şiir kaydetme hatası:', error);
        return null;
    }
}

async function getPoems() {
    if (!supabaseClient) return [];
    try {
        // SHARED: Get ALL poems, not just mine
        const { data, error } = await supabaseClient
            .from('poems')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('❌ Şiir okuma hatası:', error);
        return [];
    }
}

// =============================================
// MEMORIES / PHOTOS FUNCTIONS
// =============================================

async function uploadMemoryPhoto(slotNumber, file) {
    if (!supabaseClient) return;
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `slot_${slotNumber}_${Date.now()}.${fileExt}`;

        // Upload to Storage
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('memory-photos')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: urlData } = supabaseClient.storage
            .from('memory-photos')
            .getPublicUrl(fileName);

        // Save to Database
        // SHARED: All memories are shared, so we use a fixed ID or just query by slot_number
        // But schema enforces UNIQUE(user_id, slot_number).
        // TO SHARE: We must use a SHARED user_id constant for memories, OR allow multiple users to have slot 1.
        // Assuming the site layout has fixed 9 slots total (shared board), we should use a CONSTANT user_id for the board.
        const SHARED_BOARD_ID = 'shared_board_v1';

        const { error: dbError } = await supabaseClient
            .from('memories')
            .upsert({
                user_id: SHARED_BOARD_ID, // Use shared ID so everyone sees the same slot 1
                slot_number: slotNumber,
                image_url: urlData.publicUrl,
                width: 200, // placeholder
                height: 200 // placeholder
                // updated_at removed because table doesn't have it
            }, {
                onConflict: 'user_id,slot_number'
            })
            .select()
            .single();

        if (dbError) throw dbError;
        console.log('✅ Fotoğraf yüklendi');
        return urlData.publicUrl;
    } catch (error) {
        console.error('❌ Fotoğraf yükleme hatası:', error);
        return null;
    }
}

async function getMemories() {
    if (!supabaseClient) return [];
    try {
        const SHARED_BOARD_ID = 'shared_board_v1';

        const { data, error } = await supabaseClient
            .from('memories')
            .select('*')
            .eq('user_id', SHARED_BOARD_ID) // Only get the shared board memories
            .order('slot_number');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('❌ Anı okuma hatası:', error);
        return [];
    }
}

// =============================================
// CHAT MESSAGES FUNCTIONS
// =============================================

async function saveChatMessage(text) {
    if (!supabaseClient) return;
    const sender = getCurrentProfile(); // 'rabbit' or 'fox' or 'user'

    try {
        const { data, error } = await supabaseClient
            .from('chat_messages')
            .insert({
                user_id: DEVICE_ID, // Track who sent it
                sender: sender,     // Display name/profile
                message: text
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('❌ Mesaj kaydetme hatası:', error);
        return null;
    }
}

async function getChatMessages() {
    if (!supabaseClient) return [];
    try {
        // SHARED: Get ALL messages
        const { data, error } = await supabaseClient
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('❌ Mesaj okuma hatası:', error);
        return [];
    }
}

function subscribeToChatMessages(callback) {
    if (!supabaseClient) return;
    return supabaseClient
        .channel('chat-messages')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages'
        }, (payload) => {
            console.log('🔔 Yeni mesaj:', payload.new);
            callback(payload.new);
        })
        .subscribe();
}

// =============================================
// GAME SCORES FUNCTIONS
// =============================================

async function saveGameScore(gameType, score, resultData) {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from('game_scores')
            .insert({
                game_type: gameType,
                score: score,
                result_data: resultData
            })
            .select()
            .single();

        if (error) throw error;
        console.log('✅ Oyun skoru kaydedildi:', gameType);
        return data;
    } catch (error) {
        console.error('❌ Skor kaydetme hatası:', error);
        return null;
    }
}

async function getGameScores() {
    if (!supabaseClient) return [];
    try {
        const { data, error } = await supabaseClient
            .from('game_scores')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5); // Son 5 oyun

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('❌ Skor okuma hatası:', error);
        return [];
    }
}


// =============================================
// EXPORT HELPER
// =============================================

window.supabaseHelpers = {
    saveUserProfile,
    savePoem,
    getPoems,
    uploadMemoryPhoto,
    getMemories,
    saveChatMessage,
    getChatMessages,
    subscribeToChatMessages,
    saveGameScore,
    getGameScores
};
