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
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import csvFile from './testdata.csv';
import About from './components/About';
import SeasonAndBracket from './components/SeasonAndBracket';
import Statistics from './components/Statistics';

import './App.css';
import Landing from './components/Landing';
import ImportModal from './components/ImportModal';
import MatchHistory from './components/MatchHistory';

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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const loadDebug = () => {
    Papa.parse(csvFile, {
      download: true,
      complete: function (results) {
        const parsed = results.data;

        const result = parsed.flatMap(row => {
          return row.length > 1 ? [new Row(row)] : [];
        }); // skip empty lines in input string
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

  return (
    <div className="App">
      <Container className="d-flex align-items-start justify-content-between mt-3">
        <Button className="modal-toggle" onClick={handleShowModal}>
          Import
        </Button>
        <About />
      </Container>

      <ImportModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        importString={importString}
        setImportString={setImportString}
        importConfirmed={importConfirmed}
      />

      {!cleanData.length && <Landing />}

      {cleanData.length && (
        <Container>
          {/* <strong>Total matches: {totalMatches}</strong>
          <strong className="total-wins">Total wins: {totalWins}</strong>
          {!!totalMatches && (
            <strong>
              Total win rate: {((totalWins / totalMatches) * 100).toFixed(2)}%
            </strong>
          )} */}
          <SeasonAndBracket setSeasons={setSeasons} setBrackets={setBrackets} />
          <p className="mt-3">
            <span className="blue d-block">Blue = vs Alliance</span>
            <span className="red d-block">Red = vs Horde</span>
          </p>
          {/* <Comps statsForEachComposition={statsForEachComposition} />
          <Statistics badges={badges} /> */}
          <MatchHistory
            data={cleanData}
            brackets={brackets}
            seasons={seasons}
          />
          <p>
            Skipped <strong className="red">{corruptedCount}</strong>{' '}
            unprocessable records (all seasons/brackets considered). Open
            console to inspect them if needed.
          </p>
        </Container>
      )}
    </div>
  );
}
