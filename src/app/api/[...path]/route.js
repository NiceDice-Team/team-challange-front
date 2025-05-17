export async function GET(request, { params }) {
  try {
    // Отримуємо шлях з параметрів маршруту
    const path = params.path.join("/");

    // Отримуємо пошукові параметри
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // Формуємо повний URL для бекенду
    const apiUrl = `http://bgshop.work.gd:8000/api/${path}${queryString ? `?${queryString}` : ""}`;

    // Виконуємо запит
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Перевіряємо чи запит успішний
    if (!response.ok) {
      throw new Error(`API Error! status: ${response.status}`);
    }

    // Повертаємо результат
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error(`API Error (${params.path.join("/")}):`, error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Додаємо підтримку інших HTTP методів (POST, PUT, DELETE), якщо потрібно
export async function POST(request, { params }) {
  try {
    const path = params.path.join("/");
    const body = await request.json();

    const apiUrl = `http://bgshop.work.gd:8000/api/${path}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error(`API Error (${params.path.join("/")}):`, error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
