 import { test, expect } from '@playwright/test';

test('Should retrieve booking details', async ({ request }) => {
  // Retrieve list of all bookings to get a valid, active booking ID
  const listResponse = await request.get('/booking');
  expect(listResponse.ok()).toBeTruthy();
  
  const bookings = await listResponse.json();
  expect(bookings.length).toBeGreaterThan(0);

  // Extract a dynamic booking ID
  const bookingId = bookings[0].bookingid;
  const response = await request.get(`/booking/${bookingId}`);

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  console.log(body);
  expect(body).toHaveProperty('firstname');
});