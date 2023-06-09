import BootstrapTable from 'react-bootstrap-table-next';
import { classIcon } from '../utils/util';
import * as icons from '../utils/icons';

import {
  ALL_CLASSES,
  DEFAULT_BRACKETS,
  DEFAULT_SEASONS,
  timestampsOk,
} from '../utils/constants';

const Comps = ({ statsForEachComposition }) => {
  // Rendering logic - compute inferred state based on state (i.e. user inputs)
  const processState = () => {
    if (cleanData.length) {
      const seasonSpecificData = getSeasonSpecificData(cleanData);
      const bracketAndSeasonSpecificData =
        getBracketSpecificData(seasonSpecificData);
      const possibleCompositions = getAllPossibleCompositions(
        bracketAndSeasonSpecificData
      );
      statsForEachComposition = getStatsForEachComposition(
        bracketAndSeasonSpecificData,
        possibleCompositions
      );

      totalMatches = statsForEachComposition.reduce(
        (prev, curr) => prev + curr.total,
        0
      );
      totalWins = statsForEachComposition.reduce(
        (prev, curr) => prev + curr.wins,
        0
      );

      badges = computeBadges(bracketAndSeasonSpecificData);
    }
  };

  const getSeasonSpecificData = data => {
    return data.filter(
      row =>
        (row.isSeasonOne() && seasons.includes('s1')) ||
        (row.isSeasonTwo() && seasons.includes('s2')) ||
        (row.isSeasonThree() && seasons.includes('s3')) ||
        (row.isSeasonFour() && seasons.includes('s4')) ||
        (row.isSeasonFive() && seasons.includes('s5')) ||
        (row.isSeasonSixOrLater() && seasons.includes('s6'))
    );
  };

  const getBracketSpecificData = data => {
    return data.filter(
      row =>
        (row.is2sData() && brackets.includes('2s')) ||
        (row.is3sData() && brackets.includes('3s')) ||
        (row.is5sData() && brackets.includes('5s'))
    );
  };

  const getAllPossibleCompositions = data => {
    const compositions = new Set();
    data.forEach(row => {
      const comp = row.getComposition(brackets);
      if (comp !== '') {
        compositions.add(comp);
      }
    });
    return Array.from(compositions).sort((a, b) => a.localeCompare(b)); // this .sort is useless; it will be re-sorted by wins anyway
  };

  const getStatsForEachComposition = (data, possibleCompositions) => {
    const stats = possibleCompositions.map(comp => {
      return {
        comp,
        total: 0,
        wins: 0,
        aTotal: 0,
        aWins: 0,
        hTotal: 0,
        hWins: 0,
      };
    });

    data.forEach(row => {
      const comp = row.getComposition(brackets);
      if (comp !== '') {
        const index = stats.findIndex(s => s.comp === comp);
        if (index !== -1) {
          stats[index].total = stats[index].total + 1;
          if (row.enemyFaction === 'ALLIANCE') {
            stats[index].aTotal = stats[index].aTotal + 1;
          } else if (row.enemyFaction === 'HORDE') {
            stats[index].hTotal = stats[index].hTotal + 1;
          }
          if (row.won()) {
            stats[index].wins = stats[index].wins + 1;
            if (row.enemyFaction === 'ALLIANCE') {
              stats[index].aWins = stats[index].aWins + 1;
            } else if (row.enemyFaction === 'HORDE') {
              stats[index].hWins = stats[index].hWins + 1;
            }
          }
        } else {
          console.log('Error with row', row);
        }
      }
    });

    return stats.sort((a, b) => b.total - a.total);
  };

  processState();

  const content = statsForEachComposition.map(item => {
    return {
      composition: item.comp,
      total: JSON.stringify({
        total: item.total,
        aTotal: item.aTotal,
        hTotal: item.hTotal,
      }),
      wins: JSON.stringify({
        wins: item.wins,
        aWins: item.aWins,
        hWins: item.hWins,
      }),
      losses: JSON.stringify({
        total: item.total,
        wins: item.wins,
        aTotal: item.aTotal,
        aWins: item.aWins,
        hTotal: item.hTotal,
        hWins: item.hWins,
      }),
      percent: JSON.stringify({
        wins: item.wins,
        total: item.total,
      }),
      aPercent: JSON.stringify({
        aTotal: item.aTotal,
        aWins: item.aWins,
      }),
      hPercent: JSON.stringify({
        hTotal: item.hTotal,
        hWins: item.hWins,
      }),
    };
  });

  const columns = [
    {
      dataField: 'composition',
      text: 'Enemy composition',
      sort: true,
      formatter: cell => {
        const classes = cell.split('+');
        return (
          <div key={cell}>
            {classes.map((clazz, idx) => (
              <img
                key={idx + clazz}
                src={classIcon(clazz)}
                width={'32'}
                height={'32'}
                alt={clazz}
              />
            ))}
          </div>
        );
      },
      sortValue: cell => {
        // sort by bracket (2s -> 3s -> 5s -> unknown bracket/unknown class included) and then by ALL_CLASSES order
        const classes = cell.split('+');
        const firstCode = 'A'.charCodeAt(0); // 65
        const indices = classes.map(clazz =>
          ALL_CLASSES.indexOf(clazz) === -1
            ? 'Z'
            : String.fromCharCode(firstCode + ALL_CLASSES.indexOf(clazz))
        ); // 'A' for warrior, 'B' for hunter... and 'Z' for unknown
        return (
          (indices.length === 0 || indices.includes('Z')
            ? 'Z'
            : '' + indices.length) + indices.join('')
        ); // prefix with '2', '3', '5' or 'Z' depending on the bracket
      },
      headerStyle: (column, colIndex) => {
        return { width: '200px' };
      },
    },
    {
      dataField: 'total',
      text: 'Total matches',
      sort: true,
      formatter: cell => {
        const item = JSON.parse(cell);
        return (
          <div>
            {item.total} <span className="blue">({item.aTotal}</span> +{' '}
            <span className="red">{item.hTotal}</span>)
          </div>
        );
      },
      sortValue: cell => JSON.parse(cell).total,
      headerStyle: (column, colIndex) => {
        return { width: '175px' };
      },
    },
    {
      dataField: 'wins',
      text: 'Wins',
      sort: true,
      formatter: cell => {
        const item = JSON.parse(cell);
        return (
          <div>
            {item.wins} <span className="blue">({item.aWins}</span> +{' '}
            <span className="red">{item.hWins}</span>)
          </div>
        );
      },
      sortValue: cell => JSON.parse(cell).wins,
      headerStyle: (column, colIndex) => {
        return { width: '175px' };
      },
    },
    {
      dataField: 'losses',
      text: 'Losses',
      sort: true,
      formatter: cell => {
        const item = JSON.parse(cell);
        return (
          <div>
            {item.total - item.wins}{' '}
            <span className="blue">({item.aTotal - item.aWins}</span> +{' '}
            <span className="red">{item.hTotal - item.hWins}</span>)
          </div>
        );
      },
      sortValue: cell => {
        const item = JSON.parse(cell);
        return item.total - item.wins;
      },
      headerStyle: (column, colIndex) => {
        return { width: '175px' };
      },
    },
    {
      dataField: 'percent',
      text: '%',
      sort: true,
      formatter: cell => {
        const item = JSON.parse(cell);
        return <div>{((item.wins / item.total) * 100).toFixed(1)}</div>;
      },
      sortValue: cell => {
        const item = JSON.parse(cell);
        return item.wins / item.total;
      },
      headerStyle: (column, colIndex) => {
        return { width: '90px' };
      },
    },
    {
      dataField: 'aPercent',
      text: '% (A)',
      headerFormatter: (column, colIndex, components) => (
        <div>
          <img
            src={icons.alliance}
            width={'24'}
            height={'24'}
            alt={'alliance'}
          />{' '}
          %{components.sortElement}
        </div>
      ),
      sort: true,
      formatter: cell => {
        const item = JSON.parse(cell);
        return (
          <div className="blue">
            {item.aTotal !== 0
              ? ((item.aWins / item.aTotal) * 100).toFixed(1)
              : '-'}
          </div>
        );
      },
      sortValue: cell => {
        const item = JSON.parse(cell);
        return item.aTotal !== 0 ? item.aWins / item.aTotal : -1;
      },
      headerStyle: (column, colIndex) => {
        return { width: '90px' };
      },
    },
    {
      dataField: 'hPercent',
      text: '% (H)',
      headerFormatter: (column, colIndex, components) => (
        <div>
          <img src={icons.horde} width={'24'} height={'24'} alt={'horde'} /> %
          {components.sortElement}
        </div>
      ),
      sort: true,
      formatter: cell => {
        const item = JSON.parse(cell);
        return (
          <div className="red">
            {item.hTotal !== 0
              ? ((item.hWins / item.hTotal) * 100).toFixed(1)
              : '-'}
          </div>
        );
      },
      sortValue: cell => {
        const item = JSON.parse(cell);
        return item.hTotal !== 0 ? item.hWins / item.hTotal : -1;
      },
      headerStyle: (column, colIndex) => {
        return { width: '90px' };
      },
    },
  ];

  return (
    <BootstrapTable
      keyField="composition"
      data={content}
      columns={columns}
      defaultSorted={[{ dataField: 'total', order: 'desc' }]}
      bootstrap4={true}
      striped={true}
      bordered={true}
      hover={true}
      classes={'data-table'}
    />
  );
};

export default Comps;
