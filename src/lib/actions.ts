export async function registerUser(name: string, email: string, password: string, phone: string, role: string = 'client') {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone, role }),
  });
  const data = await res.json();
  if (data.error) return { error: data.error };
  return { user: data.user };
}

export async function loginUser(email: string, password: string) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.error) return { error: data.error };
  if (data.token && typeof window !== 'undefined') {
    localStorage.setItem('token', data.token);
  }
  return { user: data.user };
}

export async function getUserById(id: string) {
  const res = await fetch(`/api/user?id=${id}`);
  return res.json();
}

export async function updateUserRole(userId: string, role: string) {
  const res = await fetch(`/api/user?userId=${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  return res.json();
}

export async function createBusiness(userId: string, data: any) {
  const res = await fetch('/api/data/businesses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, userId }),
  });
  return res.json();
}

export async function getBusinessByUserId(userId: string) {
  const res = await fetch(`/api/data/businesses?userId=${userId}`);
  return res.json();
}

export async function getAllBusinesses() {
  const res = await fetch('/api/data/businesses');
  return res.json();
}

export async function getApprovedBusinesses() {
  const res = await fetch('/api/data/businesses?status=approved');
  return res.json();
}

export async function approveBusiness(businessId: string) {
  const res = await fetch(`/api/data/business?businessId=${businessId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'approved' }),
  });
  return res.json();
}

export async function rejectBusiness(businessId: string) {
  const res = await fetch(`/api/data/business?businessId=${businessId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'rejected' }),
  });
  return res.json();
}

export async function getServicesByBusinessId(businessId: string) {
  const res = await fetch(`/api/data/services?businessId=${businessId}`);
  return res.json();
}

export async function createService(businessId: string, data: any) {
  const res = await fetch('/api/data/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, businessId }),
  });
  return res.json();
}

export async function updateService(serviceId: string, data: any) {
  const res = await fetch(`/api/data/services?serviceId=${serviceId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteService(serviceId: string) {
  const res = await fetch(`/api/data/services?serviceId=${serviceId}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function getTimeSlotsByBusinessId(businessId: string, date?: string) {
  const url = `/api/data/timeSlots?businessId=${businessId}${date ? `&date=${date}` : ''}`;
  const res = await fetch(url);
  return res.json();
}

export async function createTimeSlot(businessId: string, data: any) {
  const res = await fetch('/api/data/timeSlots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, businessId }),
  });
  return res.json();
}

export async function deleteTimeSlot(slotId: string) {
  const res = await fetch(`/api/data/timeSlots?slotId=${slotId}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function createBooking(userId: string, businessId: string, serviceId: string, slotId: string) {
  const res = await fetch('/api/data/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, businessId, serviceId, slotId }),
  });
  const data = await res.json();
  if (data.error) return { error: data.error };
  return data;
}

export async function getBookingsByBusinessId(businessId: string) {
  const res = await fetch(`/api/data/bookings?businessId=${businessId}`);
  return res.json();
}

export async function getBookingsByUserId(userId: string) {
  const res = await fetch(`/api/data/bookings?userId=${userId}`);
  return res.json();
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const res = await fetch(`/api/data/bookings?bookingId=${bookingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function getReviewsByBusinessId(businessId: string) {
  const res = await fetch(`/api/reviews?businessId=${businessId}`);
  return res.json();
}

export async function createReview(userId: string, businessId: string, rating: number, comment?: string) {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, businessId, rating, comment }),
  });
  return res.json();
}