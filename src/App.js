import 'bootstrap/dist/css/bootstrap.css';
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row as BootstrapRow,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';
import { computeBadges } from './badgeLogic';
import {
  ALL_CLASSES,
  DEFAULT_BRACKETS,
  DEFAULT_SEASONS,
  timestampsOk,
} from './utils/constants';
import { Row } from './row';
import BootstrapTable from 'react-bootstrap-table-next';
import * as icons from './utils/icons';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import csvFile from './testdata.csv';
import About from './components/About';
import SeasonAndBracket from './components/SeasonAndBracket';
import Statistics from './components/Statistics';

import './App.css';
import Landing from './components/Landing';
import ImportModal from './components/ImportModal';

import { classIcon } from './utils/util';
import Comps from './components/Comps';

export default function App() {
  // React state
  const [showModal, setShowModal] = useState(false);
  const [importString, setImportString] = useState('');
  const [cleanData, setCleanData] = useState([]);
  const [corruptedCount, setCorruptedCount] = useState(0);
  const [seasons, setSeasons] = useState(DEFAULT_SEASONS);
  const [brackets, setBrackets] = useState(DEFAULT_BRACKETS);

  // Inferred state
  let totalMatches = 0;
  let totalWins = 0;
  let statsForEachComposition = [];
  let badges = [];

  const loadDebug = () => {
    Papa.parse(csvFile, {
      download: true,
      complete: function (results) {
        const parsed = results.data;

        const result = parsed.flatMap(row =>
          row.length > 1 ? [new Row(row)] : []
        ); // skip empty lines in input string
        const dataWithoutSkirm = result.filter(row => !row.isTitleOrSkirmish());
        const cleanData = cleanCorruptedData(dataWithoutSkirm);
        setCorruptedCount(dataWithoutSkirm.length - cleanData.length);
        setCleanData(cleanData);
        handleCloseModal();
      },
    });
  };

  useEffect(() => {
    loadDebug();
  }, []);

  if (!timestampsOk())
    console.log('Error in arena season start/end timestamps!');

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Import logic - compute state based on imported string
  const importConfirmed = () => {
    const parsed = Papa.parse(importString).data;
    const result = parsed.flatMap(row =>
      row.length > 1 ? [new Row(row)] : []
    ); // skip empty lines in input string
    const dataWithoutSkirm = result.filter(row => !row.isTitleOrSkirmish());
    const cleanData = cleanCorruptedData(dataWithoutSkirm);
    setCorruptedCount(dataWithoutSkirm.length - cleanData.length);
    setCleanData(cleanData);
    handleCloseModal();
  };

  const cleanCorruptedData = data => {
    console.log(
      'Corrupted data',
      data.filter(row => !row.isRowClean())
    );
    return data.filter(row => row.isRowClean());
  };

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

  return (
    <div className="App">
      <Container>
        <Button className="modal-toggle" onClick={handleShowModal}>
          Import
        </Button>
        <About />
      </Container>

      {!cleanData.length ? (
        <Landing />
      ) : (
        <Container>
          <strong>Total matches: {totalMatches}</strong>
          <strong className="total-wins">Total wins: {totalWins}</strong>
          {!!totalMatches && (
            <strong>
              Total win rate: {((totalWins / totalMatches) * 100).toFixed(2)}%
            </strong>
          )}
          <SeasonAndBracket setSeasons={setSeasons} setBrackets={setBrackets} />
          <p>
            <span className="blue">Blue = vs Alliance</span>{' '}
            <span className="red">Red = vs Horde</span>
          </p>
          <Comps statsForEachComposition={statsForEachComposition} />
          <Statistics badges={badges} />
          <p>
            Skipped <strong className="red">{corruptedCount}</strong>{' '}
            unprocessable records (all seasons/brackets considered). Open
            console to inspect them if needed.
          </p>
        </Container>
      )}

      <ImportModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        importString={importString}
        setImportString={setImportString}
        importConfirmed={importConfirmed}
      />
    </div>
  );
}
