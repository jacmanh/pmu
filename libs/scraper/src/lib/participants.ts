import { chromium, ElementHandle, Page } from '@playwright/test';
import { isToday, isYesterday } from 'date-fns';
import { Race } from '@pmu/shared';
import { Horse, Driver, Trainer, Owner } from '@pmu/shared';
import { getIdFromLink, getRaceIdFromLink } from './utils/scraper.util';

const baseUrl = 'https://www.zone-turf.fr';

const getRaceLink = async (page: Page, race: Race): Promise<string> => {
  let url = '';
  if (isToday(race.date)) {
    url = 'https://www.zone-turf.fr/programmes/aujourdhui/';
  } else if (isYesterday(race.date)) {
    url = 'https://www.zone-turf.fr/programmes/hier/';
  } else {
    url = 'https://www.zone-turf.fr/programmes/demain/';
  }

  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

  if (response?.ok()) {
    const list = page.locator('div.inner.slider > div > ul');
    await list.scrollIntoViewIfNeeded();
    const items = await list.locator('li').elementHandles();

    for (const item of items) {
      const raceTrackElement = await item.$('span.lieu');
      const raceTrack = raceTrackElement
        ? await raceTrackElement.innerText()
        : null;

      if (
        !containsString(race.meeting.raceTrack.name, raceTrack) &&
        !containsString(race.meeting.raceTrack.longName, raceTrack)
      ) {
        continue;
      }

      // 1 - Find meeting link
      const linkElement = await item.$('a');
      const meetingLink = linkElement
        ? await linkElement.getAttribute('href')
        : null;

      // 2 - Find race link
      if (meetingLink) {
        return await findRaceLink(page, race, meetingLink);
      }
    }

    return null;
  }
  return null;
};

const findRaceLink = async (
  page: Page,
  race: Race,
  meetingLink: string
): Promise<string> => {
  await page.goto(baseUrl + meetingLink, {
    waitUntil: 'domcontentloaded',
  });

  const table = page
    .locator('div.programme div.inner.slider > div.tableau')
    .first();
  await table.scrollIntoViewIfNeeded();
  const rows = await table.locator('tr').elementHandles();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = await row.$$('td');
    const raceLinkElement = await cells[1].$('a');
    const raceName = await raceLinkElement.getAttribute('title');
    if (containsString(raceName, race.name)) {
      return raceLinkElement
        ? await raceLinkElement.getAttribute('href')
        : null;
    }
  }
};

export const scrapeParticipants = async (race: Race) => {
  let browser;
  try {
    browser = await chromium.launch();
    const page: Page = await browser.newPage();

    const raceLink = await getRaceLink(page, race);
    await page.goto(baseUrl + raceLink, {
      waitUntil: 'domcontentloaded',
    });

    const raceId = getRaceIdFromLink(raceLink);

    const container = page
      .locator(`a[name="${raceId || 'quinte'}"]`)
      .first()
      .locator('..');
    const table = container.locator('table').first();
    await table.scrollIntoViewIfNeeded();

    const rows = await table.locator('tr').elementHandles();
    // Get columns index
    const columns = await rows[0].$$('th');
    const columnsText = await Promise.all(
      columns.map(async (column) => column.textContent())
    );

    return await getParticipants(rows, columnsText);
  } catch (error) {
    throw new Error('Error fetching races');
  } finally {
    await browser?.close();
  }
};

type Participant = {
  number: number;
  horse: Omit<
    Horse,
    | '_id'
    | 'driverId'
    | 'driver'
    | 'ownerId'
    | 'owner'
    | 'trainerId'
    | 'trainer'
    | 'history'
  >;
  driver: Omit<Driver, '_id'>;
  trainer: Omit<Trainer, '_id'>;
  owner: Omit<Owner, '_id'>;
};

const getParticipants = async (
  rows: ElementHandle[],
  columnsText: string[]
): Promise<Participant[] | null> => {
  let data: Participant[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = await row.$$('td');

    // Cells
    const numberCell = columnsText.findIndex((text) => text === 'N°');
    const horseCell = columnsText.findIndex((text) => text === 'Cheval');
    const ageSexeCell = columnsText.findIndex((text) => text === 'SA');
    const driverCell = columnsText.findIndex(
      (text) => text === 'Jockey' || text === 'Driver'
    );
    const trainerCell = columnsText.findIndex((text) => text === 'Entraîneur');
    const ownerCell = columnsText.findIndex((text) => text === 'Propriétaire');
    const perfCell = columnsText.findIndex(
      (text) => text === 'Dernières perf.'
    );
    const number = await cells[numberCell].textContent();

    // Data
    const ageSexeElement = (await cells[ageSexeCell].textContent()) || '';
    const [sexe, age] = ageSexeElement.split('');

    const horse = await getCellInfos(cells, horseCell);
    const driver = await getCellInfos(cells, driverCell);
    const trainer = await getCellInfos(cells, trainerCell);
    const owner = await getCellInfos(cells, ownerCell);
    const performance = await cells[perfCell].textContent();

    data.push({
      number: number ? parseInt(number, 10) : 0,
      horse: {
        name: horse?.name || '',
        age: parseInt(age, 10) || 0,
        sexe: sexe === 'H' ? 'M' : 'F',
        performance: performance.replace(/\s/g, ''),
        zt: {
          id: horse?.id || 0,
          link: horse?.link || '',
          name: horse?.name || '',
        },
      },
      driver: {
        name: driver?.name || '',
        totalRaces: 0,
        totalWins: 0,
        winRate: 0,
        totalPlaces: 0,
        placeRate: 0,
        zt: {
          id: driver?.id || 0,
          link: driver?.link || '',
          name: driver?.name || '',
        },
      },
      trainer: {
        name: trainer?.name || '',
        zt: {
          id: trainer?.id || 0,
          link: trainer?.link || '',
          name: trainer?.name || '',
        },
      },
      owner: {
        name: owner?.name || '',
        zt: {
          id: owner?.id || 0,
          link: owner?.link || '',
          name: owner?.name || '',
        },
      },
    });
  }

  return data;
};

const containsString = (dynamicString: string, targetString: string) => {
  const normalizedDynamicString = dynamicString
    .replace(/[-\s]/g, '')
    .toLowerCase();
  const normalizedTargetString = targetString
    .replace(/[-\s]/g, '')
    .toLowerCase();
  return normalizedDynamicString.includes(normalizedTargetString);
};

const getCellInfos = async (cells: any, index: number) => {
  const cell = await cells[index];
  const linkElement = await cell.$('a');
  if (!linkElement) {
    return null;
  }
  return {
    id: getIdFromLink(await linkElement.getAttribute('href')),
    link: (await linkElement.getAttribute('href')) || '',
    name: (await linkElement.getAttribute('title')) || '',
  };
};
