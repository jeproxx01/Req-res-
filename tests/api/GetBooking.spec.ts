 import { test, expect } from '@playwright/test';

    test('Should retrieve booking details', async ({ request }) => {
      // Playwright automatically sends this GET to https://restful-booker.herokuapp.com/booking/1
      const response = await request.get('/booking/1');

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      console.log(body);
      expect(body).toHaveProperty('firstname');
    });