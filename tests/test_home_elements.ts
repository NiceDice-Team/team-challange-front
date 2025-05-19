// Test module for home elements 
// playwright test should check all components on the home page
// and their functionality

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';


test('test description', async ({ page }) => {
  // steps
  await page.goto(BASE_URL);
  await page.getByText('new arrivals', { exact: true }).click();
  await page.getByText('bestsellers', { exact: true }).click();
  await page.getByText('board games', { exact: true }).click();
  await page.getByText('sale', { exact: true }).click();
  await page.getByText('comming soon').click();
  await page.getByText('reviews', { exact: true }).click();
  await page.getByText('about', { exact: true }).click();
  await page.getByRole('button', { name: 'Next slide' }).click();
  await page.getByRole('button', { name: 'BUY NOW' }).click();
  await page.getByRole('heading', { name: 'Ticket to Ride – The classic' }).click();
  await page.getByText('Collect train cards, claim').click();
  await page.getByRole('link', { name: 'BESTSELLERS Shop now →' }).click();
  await page.getByRole('link', { name: 'SALE Shop now →' }).click();
  await page.getByRole('link', { name: 'BOARD GAMES Shop now →' }).click();
  await page.getByRole('img', { name: 'Game Title 1' }).click();
  await page.getByRole('heading', { name: 'Game Title 1' }).click();
  await page.locator('div').filter({ hasText: /^Game Title 1Learn more→$/ }).getByRole('link').click();
  await page.getByRole('img', { name: 'Game Title 2' }).click();
  await page.getByRole('heading', { name: 'Game Title 2' }).click();
  await page.locator('div').filter({ hasText: /^Game Title 2Learn more→$/ }).getByRole('link').click();
  await page.getByRole('img', { name: 'Game Title 3' }).click();
  await page.getByRole('heading', { name: 'Game Title 3' }).click();
  await page.locator('div').filter({ hasText: /^Game Title 3Learn more→$/ }).getByRole('link').click();
  await page.getByRole('img', { name: 'Game Title 4' }).click();
  await page.getByRole('heading', { name: 'Game Title 4' }).click();
  await page.locator('div').filter({ hasText: /^Game Title 4Learn more→$/ }).getByRole('link').click();
  await page.getByText('view all').click();
  await page.getByRole('article').filter({ hasText: 'May 15, 2023 - 5 min' }).getByRole('link').click();
  await page.getByRole('article').filter({ hasText: 'June 2, 2023 - 7 min readD&D' }).getByRole('link').click();
  await page.getByRole('article').filter({ hasText: 'June 20, 2023 - 40 min' }).getByRole('link').click();
  await page.getByText('New Arrivals', { exact: true }).click();
  await page.getByText('Bestsellers', { exact: true }).click();
  await page.getByText('Board Games', { exact: true }).click();
  await page.getByRole('listitem').filter({ hasText: 'Coming soon' }).click();
  await page.getByText('Sale', { exact: true }).click();
  await page.getByText('Blog', { exact: true }).click();
  await page.getByText('Reviews', { exact: true }).click();
  await page.getByText('Shipping', { exact: true }).click();
  await page.getByText('Returns', { exact: true }).click();
  await page.getByText('About', { exact: true }).click();
  await page.getByText('Contact Us').click();
  await page.getByText('Terms of Service').click();
  await page.getByText('Privecy Policy').click();
  await page.locator('g > path:nth-child(2)').first().click();
  await page.locator('svg:nth-child(2) > g > path:nth-child(3)').click();
  // assertions
  await expect(page).toHaveURL(BASE_URL);
  await expect(page.getByText('new arrivals')).toBeVisible();
  await expect(page.getByText('bestsellers')).toBeVisible();
  await expect(page.getByText('board games')).toBeVisible();
  await expect(page.getByText('sale')).toBeVisible();
  await expect(page.getByText('comming soon')).toBeVisible();
  await expect(page.getByText('reviews')).toBeVisible();
  await expect(page.getByText('about')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next slide' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'BUY NOW' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ticket to Ride – The classic' })).toBeVisible();
  await expect(page.getByText('Collect train cards, claim')).toBeVisible();
  await expect(page.getByRole('link', { name: 'BESTSELLERS Shop now →' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'SALE Shop now →' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'BOARD GAMES Shop now →' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Game Title 1' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Game Title 1' })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Game Title 1Learn more→$/ }).getByRole('link')).toBeVisible();
  await expect(page).toHaveURL('{BASE_URL}/about');
});