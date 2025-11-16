// Test module for home elements 
// playwright test should check all components on the home page
// and their functionality

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';


test('test critical home elements', async ({ page }) => {
  // steps
  await page.goto(BASE_URL);
  // assertions
  await expect(page).toHaveURL(BASE_URL);
  await expect(page.getByRole('heading', { name: 'NEW ARRIVALS' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'BESTSELLERS Shop now →' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'board games', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'sale', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'coming soon' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'reviews' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'about', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next slide' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'BUY NOW' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cart' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'BESTSELLERS Shop now →' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'SALE Shop now →' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'BOARD GAMES Shop now →' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Game Title 1' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Game Title 1' })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Game Title 1Learn more→$/ }).getByRole('link')).toBeVisible();
  await page.getByText('about', { exact: true }).click();
  await expect(page).toHaveURL(`${BASE_URL}/#about`);
});


test('test user can open login page', async ({ page }) => {
  // steps
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: 'Profile' }).click();
  // assertions
  await expect(page).toHaveURL(`${BASE_URL}/login`);
  await expect(page.getByRole('heading', { name: 'Log in here or' })).toBeVisible();
  const emailDiv = page.getByPlaceholder('Email', { exact: true });
  const passwordDiv = page.getByPlaceholder('password');
  await expect(emailDiv).toBeVisible();
  await expect(passwordDiv).toBeVisible();
  await expect(page.getByRole('link', { name: 'create account' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Forgot your password?' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continue as a guest' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'SIGN IN' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enter with Google' })).toBeVisible();

});
