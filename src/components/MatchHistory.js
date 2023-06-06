import BootstrapTable from 'react-bootstrap-table-next';
import { ARENA_MAP_NAMES_BY_ID } from '../utils/constants';
import { formatToMMSS, formatRatingGainLoss, classIcon } from '../utils/util';
import { createRef } from 'react';

//     date: new Date(item.endTime * 1000).toLocaleDateString('en-fi'),

const MatchHistory = ({ data }) => {
  const dialogRef = createRef();

  const content = data.map((item, index) => ({
    index: index,
    date: item.endTime,
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
  }));

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
  ];

  console.log(data);

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

export default MatchHistory;
