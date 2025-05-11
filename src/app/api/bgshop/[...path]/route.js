// app/api/bgshop/[...path]/route.js
export async function GET(req, { params }) {
  const upstream = `http://bgshop.work.gd:8000/api/${params.path.join("/")}`;

  const res = await fetch(upstream, {
    // forward headers or auth if needed
    cache: "no-store", // disable Next caching (optional)
  });

  // Relay status & body unchanged
  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
