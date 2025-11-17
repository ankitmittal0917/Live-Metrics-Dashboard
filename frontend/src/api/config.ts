const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getConfig() {
  const response = await fetch(`${API_BASE_URL}/config`);
  if (!response.ok) {
    throw new Error('Failed to fetch config');
  }
  return response.json();
}

export async function updateServiceCount(count: number) {
  const response = await fetch(`${API_BASE_URL}/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ serviceCount: count })
  });
  
  if (!response.ok) {
    throw new Error('Failed to update service count');
  }
  
  return response.json();
}

