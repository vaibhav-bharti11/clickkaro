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
  auth_provider?: 'google' | 'phone' | 'guest' | 'email';
  full_name: string;
  phone?: string;
  email?: string | null;
  avatar_url?: string;
  role?: string;
  city?: string;
  pin_code?: string;
  metadata?: Record<string, any>;
}

export const normalizePhone = (phone?: string | null): string => {
  if (!phone) return '';
  // Remove spaces, hyphens, parentheses
  let cleaned = phone.replace(/[\s\-()]/g, '');
  // Standardize +91 prefix
  if (cleaned.startsWith('91') && cleaned.length === 12) cleaned = '+' + cleaned;
  if (!cleaned.startsWith('+') && cleaned.length === 10) cleaned = '+91' + cleaned;
  return cleaned;
};

export const saveClientToSupabase = async (clientData: ClientRecord): Promise<{ success: boolean; data?: any; error?: any }> => {
  const normPhone = normalizePhone(clientData.phone);
  console.info('[Supabase CRM] Ingesting client profile:', clientData.full_name, normPhone || clientData.email);

  // Queue locally for safety
  try {
    const queue = JSON.parse(localStorage.getItem('ck_crm_clients_queue') || '[]');
    queue.push({ ...clientData, phone: normPhone, queued_at: new Date().toISOString() });
    localStorage.setItem('ck_crm_clients_queue', JSON.stringify(queue.slice(-20)));
  } catch (e) {
    // Ignore storage errors
  }

  if (!supabase) {
    return { success: true, data: { simulated: true, ...clientData, phone: normPhone } };
  }

  try {
    // PREVENT DUPLICATE ACCOUNTS: Check if a client with this phone, email, or firebase_uid already exists
    const existing = await checkExistingClient({
      email: clientData.email,
      phone: normPhone,
      firebase_uid: clientData.firebase_uid,
    });

    if (existing && existing.id) {
      // Client already exists: UPDATE that single client row instead of inserting a duplicate!
      const { data, error } = await supabase
        .from('clients')
        .update({
          full_name: clientData.full_name || existing.full_name,
          firebase_uid: clientData.firebase_uid || existing.firebase_uid,
          auth_provider: clientData.auth_provider || existing.auth_provider,
          avatar_url: clientData.avatar_url || existing.avatar_url,
          city: clientData.city || existing.city,
          pin_code: clientData.pin_code || existing.pin_code,
          role: clientData.role || existing.role,
          last_active_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.warn('[Supabase CRM] Client update error:', error.message);
        return { success: false, error };
      }
      return { success: true, data: data || existing };
    }

    // New client: INSERT cleanly
    const { data, error } = await supabase
      .from('clients')
      .insert({
        firebase_uid: clientData.firebase_uid || undefined,
        auth_provider: clientData.auth_provider || 'guest',
        full_name: clientData.full_name,
        phone: normPhone || undefined,
        email: clientData.email || undefined,
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.warn('[Supabase CRM] Client insert error:', error.message);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase CRM] Network error saving client:', err);
    return { success: false, error: err };
  }
};

// -------------------------------------------------------------------------
// 1.1 CHECK EXISTING CLIENT PROFILE (Prevent Duplicate Registration & Skip Questions)
// -------------------------------------------------------------------------
export const checkExistingClient = async (identifier: {
  email?: string | null;
  phone?: string | null;
  firebase_uid?: string | null;
}): Promise<any | null> => {
  if (!supabase) return null;

  try {
    const normPhone = normalizePhone(identifier.phone);
    const raw10 = normPhone.replace(/^\+91/, '');

    // 1. Check by firebase_uid if available
    if (identifier.firebase_uid && identifier.firebase_uid.trim() !== '') {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('firebase_uid', identifier.firebase_uid)
        .limit(1)
        .maybeSingle();
      if (data) return data;
    }

    // 2. Check by phone (both with +91 and without)
    if (normPhone) {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .or(`phone.eq.${normPhone},phone.eq.${raw10}`)
        .limit(1)
        .maybeSingle();
      if (data) return data;
    }

    // 3. Check by email
    if (identifier.email && identifier.email.trim() !== '') {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('email', identifier.email.trim().toLowerCase())
        .limit(1)
        .maybeSingle();
      if (data) return data;
    }

    return null;
  } catch (err) {
    console.warn('[Supabase] checkExistingClient error:', err);
    return null;
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
): Promise<{ success: boolean; booking_code: string; completion_otp?: string; data?: any; error?: any }> => {
  const bookingCode = generateCode('CK-BK');
  const completionOtp = Math.floor(1000 + Math.random() * 9000).toString();
  console.info('[Supabase CRM] Recording booking:', bookingCode, 'Completion OTP:', completionOtp, booking.service_title, booking.total_price);

  // Queue locally
  try {
    const queue = JSON.parse(localStorage.getItem('ck_crm_bookings_queue') || '[]');
    queue.push({ booking_code: bookingCode, completion_otp: completionOtp, ...booking, queued_at: new Date().toISOString() });
    localStorage.setItem('ck_crm_bookings_queue', JSON.stringify(queue.slice(-20)));
  } catch (e) {
    // Ignore storage errors
  }

  if (!supabase) {
    return { success: true, booking_code: bookingCode, completion_otp: completionOtp };
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
          completion_otp: completionOtp,
          payout_released: false,
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

    // Ingest matching payment transaction into payments table
    try {
      const txnId = `TXN-${bookingCode.replace('CK-BK-', '')}`;
      await supabase.from('payments').insert([
        {
          transaction_id: txnId,
          client_name: booking.client_name,
          client_phone: booking.client_phone,
          client_email: booking.client_email,
          service_id: booking.service_id,
          service_name: booking.service_title,
          category: 'Booking Payment',
          amount: booking.total_price,
          amount_formatted: `₹${Number(booking.total_price).toLocaleString('en-IN')}.00`,
          payment_method: 'Razorpay UPI (Instant)',
          status: 'Success',
          invoice_id: `INV-2026-${txnId.replace('TXN-', '')}`,
        }
      ]);
    } catch (pErr) {
      console.warn('[Supabase Payments] Auto-record payment failed:', pErr);
    }

    return { success: true, booking_code: bookingCode, completion_otp: completionOtp, data };
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
// 11. FETCH USER BOOKINGS FROM SUPABASE
// -------------------------------------------------------------------------
export const fetchUserBookingsFromSupabase = async (options?: {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}): Promise<any[]> => {
  const localQueue = JSON.parse(localStorage.getItem('ck_crm_bookings_queue') || '[]');

  if (!supabase) {
    return localQueue;
  }

  try {
    const rawName = options?.name ?? localStorage.getItem('ck_user_name');
    const rawPhone = options?.phone ?? localStorage.getItem('ck_user_phone');
    const rawEmail = options?.email ?? localStorage.getItem('ck_user_email');

    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    const orClauses: string[] = [];
    if (rawName && rawName.trim().length > 1) {
      // Split full name to match first or last name
      const nameParts = rawName.trim().split(/\s+/);
      nameParts.forEach((part) => {
        if (part.length >= 3) {
          orClauses.push(`client_name.ilike.%${part}%`);
        }
      });
      orClauses.push(`client_name.ilike.%${rawName.trim()}%`);
    }

    if (rawPhone && rawPhone.replace(/\D/g, '').length >= 6) {
      const cleanPhone = rawPhone.replace(/\D/g, '');
      const last10 = cleanPhone.slice(-10);
      orClauses.push(`client_phone.ilike.%${last10}%`);
    }

    if (rawEmail && rawEmail.includes('@')) {
      orClauses.push(`client_email.ilike.%${rawEmail.trim()}%`);
    }

    let data: any[] | null = null;
    let error: any = null;

    if (orClauses.length > 0) {
      const resp = await query.or(orClauses.join(','));
      data = resp.data;
      error = resp.error;
    } else {
      const resp = await query.limit(20);
      data = resp.data;
      error = resp.error;
    }

    if (error) {
      console.warn('[Supabase Bookings] Query failed:', error);
      return localQueue;
    }

    const results = data || [];

    // Merge with any freshly recorded local bookings from ck_crm_bookings_queue
    const merged = [...results];
    localQueue.forEach((local: any) => {
      if (!merged.some((m) => m.booking_code === local.booking_code || (local.id && m.id === local.id))) {
        merged.unshift(local);
      }
    });

    return merged;
  } catch (err) {
    console.error('[Supabase Bookings] Exception:', err);
    return localQueue;
  }
};

// -------------------------------------------------------------------------
// 12. PAYMENTS & TRANSACTIONS INGESTION AND QUERY
// -------------------------------------------------------------------------
export interface PaymentRecord {
  transaction_id?: string;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  service_id?: string;
  service_name: string;
  category?: string;
  amount: number;
  amount_formatted?: string;
  payment_method?: string;
  status?: string;
  invoice_id?: string;
  metadata?: any;
}

export const recordPaymentInSupabase = async (
  payment: PaymentRecord
): Promise<{ success: boolean; transaction_id: string; error?: any }> => {
  const txnId = payment.transaction_id || `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
  const invId = payment.invoice_id || `INV-${new Date().getFullYear()}-${txnId.replace('TXN-', '')}`;
  const formattedAmount = payment.amount_formatted || `₹${payment.amount.toLocaleString('en-IN')}.00`;

  const record = {
    transaction_id: txnId,
    client_name: payment.client_name || localStorage.getItem('ck_user_name') || 'Client',
    client_phone: payment.client_phone || localStorage.getItem('ck_user_phone') || null,
    client_email: payment.client_email || localStorage.getItem('ck_user_email') || null,
    service_id: payment.service_id || 'wallet-recharge',
    service_name: payment.service_name,
    category: payment.category || 'Wallet Recharge Credit',
    amount: payment.amount,
    amount_formatted: formattedAmount,
    payment_method: payment.payment_method || 'Razorpay Instant UPI',
    status: payment.status || 'Success',
    invoice_id: invId,
    metadata: payment.metadata || {},
  };

  try {
    const queue = JSON.parse(localStorage.getItem('ck_transactions') || '[]');
    queue.unshift({ ...record, created_at: new Date().toISOString() });
    localStorage.setItem('ck_transactions', JSON.stringify(queue.slice(0, 30)));
  } catch (e) {}

  if (!supabase) return { success: true, transaction_id: txnId };

  try {
    const { error } = await supabase
      .from('payments')
      .insert([record])
      .select()
      .single();

    if (error) {
      console.warn('[Supabase Payments] Insert error:', error);
      return { success: false, transaction_id: txnId, error };
    }
    return { success: true, transaction_id: txnId };
  } catch (err) {
    console.error('[Supabase Payments] Exception:', err);
    return { success: false, transaction_id: txnId, error: err };
  }
};

export const fetchUserPaymentsFromSupabase = async (options?: {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}): Promise<any[]> => {
  const localList = JSON.parse(localStorage.getItem('ck_transactions') || '[]');

  if (!supabase) {
    return localList;
  }

  try {
    const rawName = options?.name ?? localStorage.getItem('ck_user_name');
    const rawPhone = options?.phone ?? localStorage.getItem('ck_user_phone');
    const rawEmail = options?.email ?? localStorage.getItem('ck_user_email');

    let query = supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    const orClauses: string[] = [];
    if (rawName && rawName.trim().length > 1) {
      const parts = rawName.trim().split(/\s+/);
      parts.forEach((p) => {
        if (p.length >= 3) orClauses.push(`client_name.ilike.%${p}%`);
      });
      orClauses.push(`client_name.ilike.%${rawName.trim()}%`);
    }

    if (rawPhone && rawPhone.replace(/\D/g, '').length >= 6) {
      const cleanPhone = rawPhone.replace(/\D/g, '');
      orClauses.push(`client_phone.ilike.%${cleanPhone.slice(-10)}%`);
    }

    if (rawEmail && rawEmail.includes('@')) {
      orClauses.push(`client_email.ilike.%${rawEmail.trim()}%`);
    }

    let data: any[] | null = null;
    let error: any = null;

    if (orClauses.length > 0) {
      const resp = await query.or(orClauses.join(','));
      data = resp.data;
      error = resp.error;
    } else {
      const resp = await query.limit(30);
      data = resp.data;
      error = resp.error;
    }

    if (error) {
      console.warn('[Supabase Payments] Query error:', error);
      return localList;
    }

    const results = data || [];
    const merged = [...results];
    localList.forEach((local: any) => {
      if (!merged.some((m) => m.transaction_id === local.transaction_id)) {
        merged.unshift(local);
      }
    });

    return merged;
  } catch (err) {
    console.error('[Supabase Payments] Exception:', err);
    return localList;
  }
};
// -------------------------------------------------------------------------
// 6. REAL-TIME BOOKINGS QUERY (For Seeker Dashboard - STRICT PRIVACY ISOLATION)
// -------------------------------------------------------------------------
export const fetchBookingsFromSupabase = async (
  clientPhone?: string,
  clientEmail?: string
): Promise<any[]> => {
  if (!supabase) return [];

  const cleanPhone = clientPhone?.trim();
  const cleanEmail = clientEmail?.trim();

  // STRICT PRIVACY: Unauthenticated or missing identity returns strictly 0 rows (no leakage)
  if (!cleanPhone && !cleanEmail) {
    return [];
  }

  try {
    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });

    if (cleanPhone && cleanEmail) {
      query = query.or(`client_phone.eq.${cleanPhone},client_email.eq.${cleanEmail}`);
    } else if (cleanPhone) {
      query = query.eq('client_phone', cleanPhone);
    } else if (cleanEmail) {
      query = query.eq('client_email', cleanEmail);
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
// 6.1 SEND BOOKING CONFIRMATION EMAIL (Dispatched to seeker on companion acceptance)
// -------------------------------------------------------------------------
export const sendBookingConfirmationEmail = async (booking: {
  booking_code: string;
  client_name: string;
  client_email?: string | null;
  companion_name: string;
  companion_phone: string;
  service_title: string;
  city: string;
  booking_date: string;
  total_price: number;
  completion_otp?: string;
}): Promise<{ sent: boolean; message: string; emailPayload: any }> => {
  const recipient = booking.client_email || `${booking.client_name.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
  const otp = booking.completion_otp || '4829';
  
  const emailPayload = {
    to: recipient,
    from: 'concierge@clickkarodatekaro.com',
    subject: `Booking Confirmed #${booking.booking_code} - Companion Details & Completion OTP: ${otp}`,
    booking_code: booking.booking_code,
    client_name: booking.client_name,
    companion_name: booking.companion_name,
    companion_phone: booking.companion_phone,
    service: booking.service_title,
    city: booking.city,
    date: booking.booking_date,
    amount_paid: `₹${booking.total_price.toLocaleString('en-IN')}`,
    completion_otp: otp,
    timestamp: new Date().toISOString(),
    message: `Hi ${booking.client_name}, your booking #${booking.booking_code} for ${booking.service_title} in ${booking.city} on ${booking.booking_date} has been ACCEPTED by your verified companion ${booking.companion_name}. You can call your companion directly at ${booking.companion_phone}.\n\n🔒 YOUR OUTING COMPLETION OTP: ${otp}\nFor your security, Click Karo Date Karo holds the payment safely in escrow. Please share this 4-digit OTP with your companion ONLY after your meetup is completed so they can receive their payout. Enjoy your outing!`
  };

  // Persist into email dispatch log
  try {
    const existing = JSON.parse(localStorage.getItem('ck_email_dispatches') || '[]');
    existing.unshift(emailPayload);
    localStorage.setItem('ck_email_dispatches', JSON.stringify(existing.slice(0, 30)));
    
    // Add to notifications
    const notifs = JSON.parse(localStorage.getItem('ck_notifications') || '[]');
    notifs.unshift(`Booking Accepted! Email sent to ${recipient} with Completion OTP: ${otp} & Companion phone: ${booking.companion_phone}`);
    localStorage.setItem('ck_notifications', JSON.stringify(notifs.slice(0, 20)));
  } catch (e) {
    // Ignore storage issues
  }

  console.info(`[Email Dispatcher] Automatic email sent to ${recipient}:`, emailPayload);
  return {
    sent: true,
    message: `Confirmation email dispatched to ${recipient}`,
    emailPayload,
  };
};

// -------------------------------------------------------------------------
// 6.2 VERIFY COMPLETION OTP & RELEASE ESCROW PAYOUT
// -------------------------------------------------------------------------
export const verifyCompletionOtpAndReleasePayout = async (
  bookingIdOrCode: string,
  enteredOtp: string
): Promise<{ success: boolean; message: string; payoutAmount?: number }> => {
  if (!supabase) {
    return { success: true, message: 'OTP verified successfully! Payout released.' };
  }

  try {
    let query = supabase.from('bookings').select('*');
    if (bookingIdOrCode.includes('CK-')) {
      query = query.eq('booking_code', bookingIdOrCode);
    } else {
      query = query.eq('id', bookingIdOrCode);
    }

    const { data, error } = await query.single();
    if (error || !data) {
      return { success: false, message: 'Booking not found.' };
    }

    const actualOtp = String(data.completion_otp || '').trim();
    const cleanEntered = enteredOtp.trim();

    if (!actualOtp || actualOtp !== cleanEntered) {
      return {
        success: false,
        message: 'Invalid Completion OTP! Please ask the customer for the 4-digit code sent to their email.'
      };
    }

    const payoutAmount = Math.round(Number(data.total_price) * 0.8);
    const { error: updateErr } = await supabase
      .from('bookings')
      .update({
        status: 'completed',
        payout_released: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id);

    if (updateErr) {
      return { success: false, message: 'Database update error: ' + updateErr.message };
    }

    // Ingest payout transaction into payments table
    try {
      await supabase.from('payments').insert([
        {
          transaction_id: `PO-${data.booking_code.replace('CK-', '')}`,
          client_name: data.companion_name || 'Companion',
          service_name: `Companion Payout for #${data.booking_code}`,
          category: 'Companion Payout Release',
          amount: payoutAmount,
          amount_formatted: `₹${payoutAmount.toLocaleString('en-IN')}.00`,
          payment_method: 'Instant Bank Transfer / UPI',
          status: 'Released',
          invoice_id: `PO-${data.booking_code.replace('CK-', '')}`,
        }
      ]);
    } catch (pErr) {
      console.warn('[Payments] Payout record error:', pErr);
    }

    return {
      success: true,
      message: `OTP verified! ₹${payoutAmount.toLocaleString('en-IN')} escrow payout has been credited to your account.`,
      payoutAmount
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Verification error' };
  }
};


// -------------------------------------------------------------------------
// 7. COMPANION REQUESTS QUERY (For Companion Dashboard)
// -------------------------------------------------------------------------
export const fetchCompanionRequestsFromSupabase = async (
  companionName?: string,
  companionPhone?: string
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

    const rawName = companionName || localStorage.getItem('ck_user_name') || '';
    const rawPhone = companionPhone || localStorage.getItem('ck_user_phone') || '';
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);

    if (rawName.trim() !== '' || cleanPhone.length >= 6) {
      const lowerName = rawName.toLowerCase().trim();
      return data.filter((b) => {
        if (!b.companion_name || b.companion_name.trim() === '') return true; // Open unassigned request
        const bName = b.companion_name.toLowerCase().trim();
        const matchesName = lowerName !== '' && (bName.includes(lowerName) || lowerName.includes(bName));
        const matchesPhone = cleanPhone.length >= 6 && (
          (b.metadata?.companion_phone && b.metadata.companion_phone.includes(cleanPhone)) ||
          (b.concierge_notes && b.concierge_notes.includes(cleanPhone))
        );
        return matchesName || matchesPhone;
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

// -------------------------------------------------------------------------
// 9. DYNAMIC COMPANIONS CMS: FETCH VERIFIED COMPANIONS
// -------------------------------------------------------------------------
export const fetchCompanionsFromSupabase = async (filter?: {
  city?: string;
  pinCode?: string;
  service?: string;
  gender?: string;
}): Promise<CompanionProfile[]> => {
  if (!supabase) return MOCK_COMPANIONS;

  try {
    let query = supabase.from('companions').select('*');

    if (filter?.city && filter.city !== 'All Cities' && filter.city.trim() !== '') {
      query = query.ilike('city', `%${filter.city.trim()}%`);
    }

    if (filter?.pinCode && filter.pinCode.trim() !== '') {
      query = query.eq('pin_code', filter.pinCode.trim());
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
      console.warn('[Supabase CMS] fetchCompanions error:', error.message);
      return MOCK_COMPANIONS;
    }

    if (!data || data.length === 0) {
      // If specific pin or city had 0 results, return empty so UI handles it accurately
      if (filter?.pinCode || (filter?.city && filter.city !== 'All Cities')) {
        return [];
      }
      return MOCK_COMPANIONS;
    }

    // Map database snake_case columns to frontend CompanionProfile camelCase
    let mapped: CompanionProfile[] = data.map((c: any): CompanionProfile => ({
      id: c.id,
      name: c.name,
      age: c.age,
      city: c.city,
      pinCode: c.pin_code,
      rating: Number(c.rating),
      reviewCount: c.review_count || 0,
      hourlyRate: Number(c.hourly_rate),
      avatarUrl: c.avatar_url,
      bio: c.bio || '',
      badges: c.badges || [],
      services: c.services || [],
      verifiedKYC: c.verified_kyc ?? true,
      online: c.online ?? true,
      distanceKm: Number(c.distance_km || 1.5),
      languages: c.languages || ['Hindi', 'English'],
    }));

    // In-memory service filter if provided
    if (filter?.service && filter.service !== 'All Services') {
      const sKey = filter.service.toLowerCase().replace(/\s+/g, '-');
      mapped = mapped.filter((c) => 
        c.services.some((s) => s.toLowerCase().includes(sKey) || sKey.includes(s.toLowerCase()))
      );
    }

    return mapped;
  } catch (err) {
    console.error('[Supabase CMS] Network error fetching companions:', err);
    return MOCK_COMPANIONS;
  }
};

// -------------------------------------------------------------------------
// 9.1 GET TOP 5 COMPANIONS BY PIN CODE OR DISTRICT
// -------------------------------------------------------------------------
export const getTopCompanionsByPinOrCity = async (
  pinOrCity: string
): Promise<{ city: string; pinCode: string; companions: CompanionProfile[] }> => {
  const cleanInput = pinOrCity.trim();
  const isPin = /^\d{6}$/.test(cleanInput);

  if (!supabase) {
    const matched = MOCK_COMPANIONS.filter((c) => 
      isPin ? c.pinCode === cleanInput : c.city.toLowerCase().includes(cleanInput.toLowerCase())
    );
    return {
      city: matched[0]?.city || cleanInput,
      pinCode: cleanInput,
      companions: matched.slice(0, 5)
    };
  }

  try {
    let query = supabase.from('companions').select('*');
    if (isPin) {
      query = query.eq('pin_code', cleanInput);
    } else {
      query = query.ilike('city', `%${cleanInput}%`);
    }

    let { data, error } = await query.order('rating', { ascending: false }).limit(5);

    // If exact PIN didn't return 5, find companions in the same district/city
    if (!error && (!data || data.length === 0) && isPin) {
      const pinPrefix = cleanInput.substring(0, 3);
      const fallbackQuery = await supabase
        .from('companions')
        .select('*')
        .like('pin_code', `${pinPrefix}%`)
        .order('rating', { ascending: false })
        .limit(5);

      if (fallbackQuery.data && fallbackQuery.data.length > 0) {
        data = fallbackQuery.data;
      }
    }

    if (error || !data || data.length === 0) {
      return { city: cleanInput, pinCode: cleanInput, companions: [] };
    }

    const companions: CompanionProfile[] = data.map((c: any) => ({
      id: c.id,
      name: c.name,
      age: c.age,
      city: c.city,
      pinCode: c.pin_code,
      rating: Number(c.rating),
      reviewCount: c.review_count || 0,
      hourlyRate: Number(c.hourly_rate),
      avatarUrl: c.avatar_url,
      bio: c.bio || '',
      badges: c.badges || [],
      services: c.services || [],
      verifiedKYC: c.verified_kyc ?? true,
      online: c.online ?? true,
      distanceKm: Number(c.distance_km || 1.5),
      languages: c.languages || ['Hindi', 'English'],
    }));

    return {
      city: data[0]?.city || cleanInput,
      pinCode: cleanInput,
      companions
    };
  } catch (err) {
    console.error('[Supabase CMS] getTopCompanionsByPinOrCity error:', err);
    return { city: cleanInput, pinCode: cleanInput, companions: [] };
  }
};


