import { format } from 'date-fns/format';
import { chromium } from '@playwright/test';
import { PmuModel } from '@pmu/shared';

const getPmuPrograms = async (date = new Date()) => {
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    const dateString = format(date, 'ddMMyyyy');
    const url = `https://online.turfinfo.api.pmu.fr/rest/client/61/programme/${dateString}?meteo=true&specialisation=INTERNET`;
    const response = await page.goto(url);
    if (response?.ok()) {
      const rep = await response.json();
      return rep as PmuModel;
    }
    return null;
  } catch (error) {
    throw new Error('Error fetching PMU programs');
  }
};

export const scrapePrograms = async (date = new Date()): Promise<PmuModel> => {
  try {
    const pmuData = await getPmuPrograms(date);
    if (!pmuData) {
      throw new Error('No PMU program found');
    }

    return pmuData;
  } catch (error) {
    console.error('Error scraping:', error);
    throw new Error('Error scraping the website');
  }
};
