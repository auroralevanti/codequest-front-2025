import { getUserCookie } from '@/lib/cookies';

export async function uploadToCloudinary(file: File): Promise<string> {
  // First try to get a signed signature from our backend
  try {
    const token = getUserCookie()?.token;
    const reqInit: RequestInit | undefined = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') || '';
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
    const sigUrl = apiBase ? `${apiBase}/api/${apiVersion}/cloudinary/signature` : `/api/${apiVersion}/cloudinary/signature`;

    const sigRes = await fetch(sigUrl, reqInit);
    if (!sigRes.ok) {
      const text = await sigRes.text().catch(() => '');
      console.error('Cloudinary signature request failed', { url: sigUrl, status: sigRes.status, body: text });
      throw new Error(`Signature request failed: ${sigRes.status} ${text}`);
    }

    const sigJson = await sigRes.json();
    const { timestamp, signature, api_key, cloud_name } = sigJson as { timestamp: number; signature: string; api_key: string; cloud_name: string };
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', api_key);
    fd.append('timestamp', String(timestamp));
    fd.append('signature', signature);

    const res = await fetch(uploadUrl, { method: 'POST', body: fd });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      console.error('Cloudinary signed upload failed', { uploadUrl, status: res.status, body: txt });
      throw new Error(`Cloudinary signed upload failed: ${res.status} ${txt}`);
    }

    const json = await res.json();
    return json.secure_url || json.url;
  } catch (err) {
    // if anything fails, we'll fallback to unsigned preset if configured
    console.warn('Signed Cloudinary upload not available, falling back to unsigned preset', err);
  }

  // Fallback: unsigned preset using NEXT_PUBLIC_CLOUDINARY_URL or NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL
  const url = process.env.NEXT_PUBLIC_CLOUDINARY_URL || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!url || !uploadPreset) {
    throw new Error('Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_URL and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, or enable backend signature.');
  }

  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', uploadPreset);

  const res = await fetch(url, {
    method: 'POST',
    body: fd,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    console.error('Cloudinary unsigned upload failed', { url, status: res.status, body: txt });
    throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`);
  }

  const json = await res.json();
  return json.secure_url || json.url;
}
