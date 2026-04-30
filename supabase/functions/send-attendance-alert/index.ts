// Supabase Edge Function stub.
// Send low-attendance warning and critical email notifications.

Deno.serve(async () => {
  return new Response(JSON.stringify({ ok: true, message: "Attendance alert function placeholder" }), {
    headers: { "content-type": "application/json" }
  });
});
