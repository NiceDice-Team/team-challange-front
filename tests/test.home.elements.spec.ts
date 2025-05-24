// Test module for home elements 
// playwright test should check all components on the home page
// and their functionality

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';


test('test description', async ({ page }, testInfo) => {
  // steps
  await page.goto(BASE_URL);

  await expect(page.getByText('new arrivals', { exact: true })).toBeVisible();
  await expect(page.getByText('bestsellers', { exact: true })).toBeVisible();
  await expect(page.getByText('ENnew')).toBeVisible();
  await expect(page.getByText('sale', { exact: true })).toBeVisible();
  await expect(page.getByText('reviews', { exact: true })).toBeVisible();
  await expect(page.getByText('about', { exact: true })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^ENnew arrivalsbestsellersboard gamessalecomming soonreviewsabout$/ }).locator('rect').first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^ENnew arrivalsbestsellersboard gamessalecomming soonreviewsabout$/ }).locator('rect').nth(1)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: 'ENnew' }).nth(1)).toBeVisible();
  await expect(page.locator('form').getByRole('button')).toBeVisible();
  await expect(page.getByRole('button', { name: 'EN' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'EN' }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^ENnew arrivalsbestsellersboard gamessalecomming soonreviewsabout$/ }).getByRole('img').nth(3)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^ENnew arrivalsbestsellersboard gamessalecomming soonreviewsabout$/ }).getByRole('img').nth(4)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'About us' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Stay Updated & Get Exclusive' })).toBeVisible();
  // if (testInfo.status !== testInfo.expectedStatus) {
  //   await testInfo.attach('failure-screenshot', { body: await page.screenshot(), contentType: 'image/png' });
  // }
});