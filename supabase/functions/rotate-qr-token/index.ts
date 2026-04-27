// Supabase Edge Function stub.
// Rotate active attendance_sessions.qr_token every configured interval and set qr_expires_at.

Deno.serve(async () => {
  return new Response(JSON.stringify({ ok: true, message: "QR rotation function placeholder" }), {
    headers: { "content-type": "application/json" }
  });
});
