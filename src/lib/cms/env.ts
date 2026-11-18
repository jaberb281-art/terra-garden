export function supabaseConfig() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!value || !key || !/^sb_publishable_[\w-]+$/.test(key)) return null;
  try {
    const url = new URL(value);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) ||
        url.pathname !== '/' || url.username || url.password || url.search || url.hash) return null;
    return { url: url.origin, key };
  } catch {
    return null;
  }
}

export function cloudinaryConfig() {
  const name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const key = process.env.CLOUDINARY_API_KEY?.trim();
  const secret = process.env.CLOUDINARY_API_SECRET?.trim();
  return name && /^[a-z0-9_-]+$/i.test(name) && key && secret
    ? { cloud_name: name, api_key: key, api_secret: secret }
    : null;
}
