const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const api = async (
  path: string,
  method = "GET",
  body?: any,
  token?: string
) => {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => null);

  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return res.json();
};
