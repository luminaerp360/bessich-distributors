import { apiRequest, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config';

const ACCESS_TOKEN_KEY = 'bessich_access_token';
const REFRESH_TOKEN_KEY = 'bessich_refresh_token';
const USER_KEY = 'bessich_auth_user';

export interface AuthUser {
  _id?: string;
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  role?: string;
  isActive?: boolean;
  addresses?: unknown[];
  [key: string]: unknown;
}

export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: 'admin' | 'customer' | 'staff';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser;
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function storeSession(result: AuthResult): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
    if (result.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    }
  } catch {
    // Storage unavailable; session will not persist across reloads.
  }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
}

function parseUser(user: unknown): AuthUser | undefined {
  if (user && typeof user === 'object') {
    return user as AuthUser;
  }
  return undefined;
}

function extractAuthResult(data: unknown, fallbackRefreshToken = ''): AuthResult {
  const obj = (data ?? {}) as Record<string, unknown>;
  const accessToken = obj.accessToken ?? obj.access_token ?? obj.token;
  const refreshToken = obj.refreshToken ?? obj.refresh_token ?? fallbackRefreshToken;

  if (typeof accessToken === 'string' && accessToken) {
    return {
      accessToken,
      refreshToken: typeof refreshToken === 'string' ? refreshToken : '',
      user: parseUser(obj.user),
    };
  }

  throw new Error('Unexpected response from server: tokens missing');
}

function userIdFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded?.sub || decoded?.userId || decoded?._id || null;
  } catch {
    return null;
  }
}

export async function signupUser(payload: SignupPayload): Promise<AuthResult> {
  const data = await apiRequest(API_ENDPOINTS.signup, {
    method: 'POST',
    body: payload,
  });
  const result = extractAuthResult(data);
  if (result.accessToken) {
    storeSession(result);
  }
  return result;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResult> {
  const data = await apiRequest(API_ENDPOINTS.login, {
    method: 'POST',
    body: payload,
  });
  const result = extractAuthResult(data);
  storeSession(result);
  return result;
}

export async function refreshAccessToken(): Promise<AuthResult> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  const data = await apiRequest(API_ENDPOINTS.refresh, {
    method: 'POST',
    body: { refreshToken } satisfies RefreshPayload,
  });
  const result = extractAuthResult(data, refreshToken);
  storeSession({ ...result, refreshToken: result.refreshToken || refreshToken });
  return result;
}

export async function logoutUser(): Promise<void> {
  try {
    await apiRequest(API_ENDPOINTS.logout, { method: 'POST' });
  } finally {
    clearTokens();
  }
}

export async function fetchMe(): Promise<AuthUser> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  // Preferred: /users/me (documented). The live API currently 404s here,
  // so fall back to /users/{id} derived from the JWT, then to stored user.
  try {
    const me = await apiRequest<AuthUser>(API_ENDPOINTS.me, { token });
    if (me && me.email) return me;
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 404) throw err;
  }

  const userId = userIdFromToken(token);
  if (userId) {
    try {
      const byId = await apiRequest<AuthUser>(`/users/${userId}`, { token });
      if (byId && byId.email) return byId;
    } catch {
      // ignore, fall through to stored user
    }
  }

  const stored = getStoredUser();
  if (stored) return stored;

  throw new Error('Unable to load user profile');
}

// --- Admin: customer account management (physical sign-up at the counter) ---

export interface CustomerInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: 'admin' | 'customer' | 'staff';
}

export interface CustomerRecord {
  _id?: string;
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

export interface UsersListResponse {
  data: CustomerRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function adminCreateCustomer(
  payload: CustomerInput,
  token?: string | null
): Promise<CustomerRecord> {
  return apiRequest<CustomerRecord>('/users', {
    method: 'POST',
    body: payload,
    token,
  });
}

export async function adminListCustomers(
  token?: string | null,
  options: { page?: number; limit?: number; search?: string } = {}
): Promise<UsersListResponse> {
  const params = new URLSearchParams();
  params.set('page', String(options.page ?? 1));
  params.set('limit', String(options.limit ?? 100));
  if (options.search) params.set('search', options.search);
  return apiRequest<UsersListResponse>(`/users?${params.toString()}`, { token });
}

export async function adminDeleteCustomer(
  id: string,
  token?: string | null
): Promise<void> {
  await apiRequest(`/users/${id}/soft`, { method: 'DELETE', token });
}