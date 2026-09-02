import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MOCK_COMPANIONS } from '../data/mockProfiles';
import { CompanionProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 15
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Unique Booking & Application Code Generator (e.g. CK-BK-84920)
export const generateCode = (prefix: 'CK-BK' | 'CK-PT' | 'CK-WL'): string => {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomDigits}`;
};

// -------------------------------------------------------------------------
// 1. CLIENTS / USERS CRM INGESTION
// -------------------------------------------------------------------------
export interface ClientRecord {
  firebase_uid?: string;
  auth_provider?: 'google' | 'phone' | 'guest';
  full_name: string;
  phone?: string;
  email?: string | null;
  avatar_url?: string;
  role?: string;
  city?: string;
  pin_code?: string;
  metadata?: Record<string, any>;
}

export const saveClientToSupabase = async (clientData: ClientRecord): Promise<{ success: boolean; data?: any; error?: any }> => {
  console.info('[Supabase CRM] Ingesting client profile:', clientData.full_name, clientData.phone || clientData.email);

  // Queue locally for safety
  try {
    const queue = JSON.parse(localStorage.getItem('ck_crm_clients_queue') || '[]');
    queue.push({ ...clientData, queued_at: new Date().toISOString() });
    localStorage.setItem('ck_crm_clients_queue', JSON.stringify(queue.slice(-20)));
  } catch (e) {
    // Ignore storage errors
  }

  if (!supabase) {
    return { success: true, data: { simulated: true, ...clientData } };
  }

  try {
    const { data, error } = await supabase
      .from('clients')
      .upsert(
        {
          firebase_uid: clientData.firebase_uid,
          auth_provider: clientData.auth_provider || 'guest',
          full_name: clientData.full_name,
          phone: clientData.phone,
          email: clientData.email,
          avatar_url: clientData.avatar_url,
          role: clientData.role || 'seeker',
          city: clientData.city,
          pin_code: clientData.pin_code,
          metadata: {
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            ...clientData.metadata,
          },
          last_active_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'firebase_uid' }
      )
      .select()
      .single();

    if (error) {
      console.warn('[Supabase CRM] Client upsert error:', error.message);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase CRM] Network error saving client:', err);
    return { success: false, error: err };
  }
};

// -------------------------------------------------------------------------
// 2. BOOKINGS CRM INGESTION
// -------------------------------------------------------------------------
export interface BookingRecord {
  client_id?: string;
  client_name: string;
  client_phone: string;
  client_email?: string | null;
  service_id: string;
  service_title: string;
  city: string;
  pin_code: string;
  booking_date: string;
  hours: number;
  total_price: number;
  companion_name?: string;
  companion_avatar?: string;
  concierge_notes?: string;
}

export const recordBookingInSupabase = async (
  booking: BookingRecord
): Promise<{ success: boolean; booking_code: string; data?: any; error?: any }> => {
  const bookingCode = generateCode('CK-BK');
  console.info('[Supabase CRM] Recording booking:', bookingCode, booking.service_title, booking.total_price);

  // Queue locally
  try {
    const queue = JSON.parse(localStorage.getItem('ck_crm_bookings_queue') || '[]');
    queue.push({ booking_code: bookingCode, ...booking, queued_at: new Date().toISOString() });
    localStorage.setItem('ck_crm_bookings_queue', JSON.stringify(queue.slice(-20)));
  } catch (e) {
    // Ignore storage errors
  }

  if (!supabase) {
    return { success: true, booking_code: bookingCode };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          booking_code: bookingCode,
          client_name: booking.client_name,
          client_phone: booking.client_phone,
          client_email: booking.client_email,
          service_id: booking.service_id,
          service_title: booking.service_title,
          city: booking.city,
          pin_code: booking.pin_code,
          booking_date: booking.booking_date,
          hours: booking.hours,
          total_price: booking.total_price,
          companion_name: booking.companion_name,
          companion_avatar: booking.companion_avatar,
          status: 'pending',
          payment_status: 'unpaid',
          concierge_notes: booking.concierge_notes || 'Client booked via web portal',
          metadata: {
            referrer: document.referrer,
            device: navigator.userAgent,
          },
        },
      ])
      .select()
      .single();

    if (error) {
      console.warn('[Supabase CRM] Booking insert error:', error.message);
      return { success: false, booking_code: bookingCode, error };
    }

    return { success: true, booking_code: bookingCode, data };
  } catch (err) {
    console.error('[Supabase CRM] Booking network error:', err);
    return { success: false, booking_code: bookingCode, error: err };
  }
};

// -------------------------------------------------------------------------
// 3. PARTNER APPLICATIONS CRM INGESTION
// -------------------------------------------------------------------------
export interface PartnerApplicationRecord {
  full_name: string;
  phone: string;
  email?: string;
  city: string;
  pin_code: string;
  selected_plan: string;
  plan_price?: number;
}

export const recordPartnerApplicationInSupabase = async (
  app: PartnerApplicationRecord
): Promise<{ success: boolean; application_code: string; data?: any; error?: any }> => {
  const appCode = generateCode('CK-PT');
  console.info('[Supabase CRM] Recording partner application:', appCode, app.full_name);

  // Queue locally
  try {
    const queue = JSON.parse(localStorage.getItem('ck_crm_partners_queue') || '[]');
    queue.push({ application_code: appCode, ...app, queued_at: new Date().toISOString() });
    localStorage.setItem('ck_crm_partners_queue', JSON.stringify(queue.slice(-20)));
  } catch (e) {
    // Ignore storage errors
  }

  if (!supabase) {
    return { success: true, application_code: appCode };
  }

  try {
    const { data, error } = await supabase
      .from('partner_applications')
      .insert([
        {
          application_code: appCode,
          full_name: app.full_name,
          phone: app.phone,
          email: app.email,
          city: app.city,
          pin_code: app.pin_code,
          selected_plan: app.selected_plan,
          plan_price: app.plan_price || 499.00,
          kyc_status: 'pending_verification',
          status: 'submitted',
        },
      ])
      .select()
      .single();

    if (error) {
      console.warn('[Supabase CRM] Partner app error:', error.message);
      return { success: false, application_code: appCode, error };
    }

    return { success: true, application_code: appCode, data };
  } catch (err) {
    console.error('[Supabase CRM] Partner app error:', err);
    return { success: false, application_code: appCode, error: err };
  }
};

// -------------------------------------------------------------------------
// 4. WAITLIST LEADS INGESTION (Expansion Market Intelligence)
// -------------------------------------------------------------------------
export const recordWaitlistLeadInSupabase = async (
  pinCode: string, 
  city?: string, 
  phone?: string
): Promise<boolean> => {
  console.info('[Supabase CRM] Ingesting waitlist lead for unserviced pin:', pinCode, city);

  if (!supabase) return true;

  try {
    await supabase.from('waitlist_leads').insert([
      {
        pin_code: pinCode,
        city: city || 'Unknown',
        phone: phone || localStorage.getItem('ck_user_phone') || null,
        source: 'landing_pincode_checker',
      },
    ]);
    return true;
  } catch (err) {
    console.warn('[Supabase CRM] Waitlist lead error:', err);
    return false;
  }
};

// -------------------------------------------------------------------------
// 5. COMPANIONS CMS SYNC
// -------------------------------------------------------------------------
export const fetchCompanionsFromSupabase = async (): Promise<CompanionProfile[]> => {
  if (!supabase) {
    return MOCK_COMPANIONS;
  }

  try {
    const { data, error } = await supabase
      .from('companions')
      .select('*')
      .order('rating', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_COMPANIONS;
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      age: row.age,
      city: row.city,
      pinCode: row.pin_code,
      rating: Number(row.rating),
      reviewCount: row.review_count,
      hourlyRate: Number(row.hourly_rate),
      avatarUrl: row.avatar_url,
      badges: row.badges || [],
      bio: row.bio || '',
      verifiedKYC: Boolean(row.verified_kyc),
      online: Boolean(row.online),
      distanceKm: Number(row.distance_km || 1.5),
      languages: row.languages || ['Hindi', 'English'],
      services: row.services || ['hangout', 'movie-partner'],
    }));
  } catch (err) {
    console.warn('[Supabase CMS] Error fetching companions, using local profiles:', err);
    return MOCK_COMPANIONS;
  }
};

// -------------------------------------------------------------------------
// 6. REAL-TIME BOOKINGS QUERY (For Seeker Dashboard)
// -------------------------------------------------------------------------
export const fetchBookingsFromSupabase = async (
  clientPhone?: string,
  clientEmail?: string
): Promise<any[]> => {
  if (!supabase) return [];

  try {
    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });

    if (clientPhone) {
      query = query.or(`client_phone.eq.${clientPhone}${clientEmail ? `,client_email.eq.${clientEmail}` : ''}`);
    } else if (clientEmail) {
      query = query.eq('client_email', clientEmail);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[Supabase] fetchBookings error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('[Supabase] fetchBookings network error:', err);
    return [];
  }
};

// -------------------------------------------------------------------------
// 7. COMPANION REQUESTS QUERY (For Companion Dashboard)
// -------------------------------------------------------------------------
export const fetchCompanionRequestsFromSupabase = async (
  companionName?: string
): Promise<any[]> => {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchCompanionRequests error:', error.message);
      return [];
    }
    if (!data) return [];

    // Filter in-memory to guarantee unassigned or matching companion requests are returned
    if (companionName && companionName.trim() !== '') {
      const lowerName = companionName.toLowerCase().trim();
      return data.filter((b) => {
        if (!b.companion_name || b.companion_name.trim() === '') return true; // Open unassigned request
        const bName = b.companion_name.toLowerCase().trim();
        return bName.includes(lowerName) || lowerName.includes(bName);
      });
    }

    return data;
  } catch (err) {
    console.error('[Supabase] fetchCompanionRequests network error:', err);
    return [];
  }
};

// -------------------------------------------------------------------------
// 7.1 UPDATE USER AVATAR / PROFILE PHOTO IN SUPABASE
// -------------------------------------------------------------------------
export const updateUserAvatarInSupabase = async (
  avatarUrl: string,
  userIdentifier: { phone?: string; email?: string; name?: string }
): Promise<boolean> => {
  if (!supabase) return true;

  try {
    let query = supabase.from('clients').update({ 
      avatar_url: avatarUrl, 
      updated_at: new Date().toISOString() 
    });
    
    if (userIdentifier.phone) {
      query = query.eq('phone', userIdentifier.phone);
    } else if (userIdentifier.email) {
      query = query.eq('email', userIdentifier.email);
    } else if (userIdentifier.name) {
      query = query.eq('full_name', userIdentifier.name);
    } else {
      return false;
    }

    const { error } = await query;
    if (error) {
      console.warn('[Supabase] updateUserAvatar error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] updateUserAvatar network error:', err);
    return false;
  }
};


// -------------------------------------------------------------------------
// 8. UPDATE BOOKING STATUS (Accept / Decline / Complete)
// -------------------------------------------------------------------------
export const updateBookingStatusInSupabase = async (
  bookingId: string,
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
): Promise<boolean> => {
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId);

    if (error) {
      console.warn('[Supabase] updateBookingStatus error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] updateBookingStatus error:', err);
    return false;
  }
};

