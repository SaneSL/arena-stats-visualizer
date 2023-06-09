import BootstrapTable from 'react-bootstrap-table-next';
import { ARENA_MAP_NAMES_BY_ID } from '../utils/constants';
import { formatToMMSS, formatRatingGainLoss, classIcon } from '../utils/util';
import { createRef } from 'react';

//     date: new Date(item.endTime * 1000).toLocaleDateString('en-fi'),

import { memo } from 'react';
import { useEffect } from 'react';

const MatchHistory = ({ data, brackets, seasons }) => {
  const dialogRef = createRef();

  const content = data.reduce((acc, item, index) => {
    if (!brackets.includes(item.bracket) || !seasons.includes(item.season))
      return acc;

    acc.push({
      index: index,
      date: item.startTime,
      map: ARENA_MAP_NAMES_BY_ID[item.zoneId] || 'N/A',
      duration: item.duration,
      team: item.teamComp,
      rating: {
        newTeamRating: item.newTeamRating,
        diffRating: item.diffRating,
      },
      mmr: item.mmr,
      enemyTeam: item.enemyComp,
      enemyMmr: item.enemyMmr,
      season: item.season,
    });

    return acc;
  }, []);

  const columns = [
    {
      dataField: 'date',
      text: 'Date',
      sort: true,
      formatter: cell => {
        return <>{new Date(cell * 1000).toLocaleDateString('en-fi')}</>;
      },
    },
    {
      dataField: 'map',
      text: 'Map',
      sort: true,
    },
    {
      dataField: 'duration',
      text: 'Duration',
      sort: true,
      formatter: cell => {
        return <>{formatToMMSS(cell)}</>;
      },
    },
    {
      dataField: 'team',
      text: 'Team',
      formatter: cell => {
        return (
          <div>
            {cell.map((clazz, index) => (
              <img
                key={index}
                src={classIcon(clazz)}
                width={'32'}
                height={'32'}
                alt={clazz}
              />
            ))}
          </div>
        );
      },
    },
    {
      dataField: 'rating',
      text: 'Rating',
      formatter: cell => {
        return (
          <span>
            {formatRatingGainLoss(cell.newTeamRating, cell.diffRating)}
          </span>
        );
      },
    },
    {
      dataField: 'mmr',
      text: 'MMR',
    },
    {
      dataField: 'enemyTeam',
      text: 'Enemy Team',
      formatter: cell => {
        return (
          <div>
            {cell.map((clazz, index) => (
              <img
                key={index}
                src={classIcon(clazz)}
                width={'32'}
                height={'32'}
                alt={clazz}
              />
            ))}
          </div>
        );
      },
    },
    {
      dataField: 'enemyMmr',
      text: 'Enemy MMR',
    },
    {
      dataField: 'season',
      text: 'Season',
    },
  ];

  return (
    <>
      {/* <button type="button" onClick={() => dialogRef.current.showModal()}>
        Show
      </button>
      <button type="button" onClick={() => dialogRef.current.close()}>
        Hide
      </button>
      <dialog id="playersDialog" ref={dialogRef}>
        <p>Greetings, one and all!</p>
      </dialog> */}
      <BootstrapTable
        keyField="index"
        data={content}
        columns={columns}
        defaultSorted={[{ dataField: 'date', order: 'desc' }]}
        bootstrap4={true}
        striped={true}
        bordered={true}
        hover={true}
        classes={'data-table'}
      />
    </>
  );
};

const arePropsEqual = (oldProps, newProps) => {
  // const difference = oldProps.brackets.filter(x =>
  //   newProps.brackets.includes(x)
  // );

  // return difference.length != 0 ? false : true;

  if (
    !Object.is(oldProps.brackets, newProps.brackets) ||
    !Object.is(oldProps.seasons, newProps.seasons)
  ) {
    return false;
  } else {
    return true;
  }
};

export default memo(MatchHistory, arePropsEqual);
