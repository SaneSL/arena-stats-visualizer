import * as icons from './icons';

export function secondsToHms(d) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const s = Math.floor((d % 3600) % 60);
  const m = Math.floor((d % 3600) / 60);

  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' min, ' : ' min, ') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' sec' : ' sec') : '';
  return hDisplay + mDisplay + sDisplay;
}

export function formatToMMSS(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0'); // Add leading zero if necessary
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function formatRatingGainLoss(ratingNew, diffRating) {
  let sign, className;
  if (diffRating <= 0) {
    sign = '-';
    className = 'ratingLossRed';
  } else {
    sign = '+';
    className = 'ratingGainGreen';
  }

  const diffRatingAbs = Math.abs(diffRating);

  return (
    <span className={className}>
      {ratingNew} ({sign}
      {diffRatingAbs})
    </span>
  );
}

export const mean = array => array.reduce((a, b) => a + b, 0) / array.length;
export const median = array =>
  array.slice().sort((a, b) => a - b)[Math.floor(array.length / 2)];
export const longestSequence = (array, value) => {
  let currentCount = 0;
  let maxCount = 0;
  for (let arrayValue of array) {
    if (arrayValue === value) currentCount++;
    if (arrayValue !== value) {
      maxCount = Math.max(maxCount, currentCount);
      currentCount = 0;
    }
  }
  return maxCount;
};

export const enemy = (enemyName, enemyClass) => {
  if (enemyClass) {
    if (enemyName) {
      return `${enemyName} (${enemyClass})`;
    } else {
      return enemyClass;
    }
  } else {
    return enemyName;
  }
};

export const classIcon = clazz => {
  switch (clazz) {
    case 'WARRIOR':
      return icons.warrior;
    case 'DEATHKNIGHT':
      return icons.deathknight;
    case 'PALADIN':
      return icons.paladin;
    case 'HUNTER':
      return icons.hunter;
    case 'SHAMAN':
      return icons.shaman;
    case 'ROGUE':
      return icons.rogue;
    case 'DRUID':
      return icons.druid;
    case 'PRIEST':
      return icons.priest;
    case 'MAGE':
      return icons.mage;
    case 'WARLOCK':
      return icons.warlock;
    default:
      return icons.unknown;
  }
};
