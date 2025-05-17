export async function GET() {
  try {
    // Безпосередній запит до вашого HTTP API сервера
    const response = await fetch("http://bgshop.work.gd:8000/api/categories/");

    // Показуємо статус запиту для діагностики
    console.log("API Response Status:", response.status);

    // Отримуємо дані
    const data = await response.json();

    // Повертаємо результат як JSON
    return Response.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("API Error:", error);

    // Повертаємо деталі помилки
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
