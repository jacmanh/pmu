import { Browser, chromium, Locator, Page } from '@playwright/test';
import { Horse } from '@pmu/shared';
import { getIdFromLink } from './utils/scraper.util';

const baseUrl = 'https://www.zone-turf.fr';

type HorseHistoryParams = {
  name: string;
  zt: Horse['zt'];
};

type HorseHistoryDatas = {
  place: string;
  rope: string;
  weight: string;
  date: string;
  driver: {
    id: number;
    link: string;
    name: string;
  };
  race: {
    name: string;
    distance: number;
  };
};

export const scrapeHorseHistory = async (
  horse: HorseHistoryParams
): Promise<HorseHistoryDatas[] | null> => {
  let browser: Browser;
  try {
    browser = await chromium.launch();
    const page: Page = await browser.newPage();
    await page.goto(baseUrl + horse.zt.link, { waitUntil: 'domcontentloaded' });

    const container = page.locator('div.mobile-cheval-performances');
    const races = container.locator('div.bloc.data.course');
    const raceCount = await races.count();

    const racesInfos: HorseHistoryDatas[] = [];
    for (let i = 0; i < raceCount; i++) {
      const race = races.nth(i);
      racesInfos.push(await getRaceInformations(race));
    }
    return racesInfos;
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
};

const getRaceInformations = async (race: Locator) => {
  const raceInfo = await race.locator('.title.hidden-smallDevice').innerText();
  const [raceNameDate, distance] = raceInfo.split(' - ');
  const raceNameDateMatch = raceNameDate.match(/(.+?) (\d{2}\/\d{2}\/\d{4})/);

  const raceName = raceNameDateMatch[1].trim();
  const raceDate = raceNameDateMatch[2];

  const horseLine = race.locator('table tr.hover.next');
  const driverLink = horseLine.locator('td').nth(5).locator('a').first();

  return {
    race: {
      name: raceName,
      distance: parseInt(distance, 10),
    },
    date: raceDate,
    place: await horseLine.locator('td').nth(0).innerText(),
    rope: await horseLine.locator('td').nth(3).innerText(),
    weight: await horseLine.locator('td').nth(4).innerText(),
    driver: {
      id: getIdFromLink(await driverLink.getAttribute('href')),
      link: await driverLink.getAttribute('href'),
      name: await driverLink.innerText(),
    },
  };
};
