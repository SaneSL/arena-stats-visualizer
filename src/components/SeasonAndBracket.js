import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import {
  ALL_CLASSES,
  DEFAULT_BRACKETS,
  DEFAULT_SEASONS,
  timestampsOk,
} from '../utils/constants';

const SeasonAndBracket = ({ setSeasons, setBrackets }) => {
  return (
    <div className="d-flex flex-column align-items-start">
      <ToggleButtonGroup
        type="checkbox"
        defaultValue={'s6'}
        onChange={setSeasons}
        className="button-group-vertical"
      >
        <ToggleButton id="season-1" value={'s1'} variant={'outline-primary'}>
          Season 1
        </ToggleButton>
        <ToggleButton id="season-2" value={'s2'} variant={'outline-primary'}>
          Season 2
        </ToggleButton>
        <ToggleButton id="season-3" value={'s3'} variant={'outline-primary'}>
          Season 3
        </ToggleButton>
        <ToggleButton id="season-4" value={'s4'} variant={'outline-primary'}>
          Season 4
        </ToggleButton>
        <ToggleButton id="season-5" value={'s5'} variant={'outline-primary'}>
          Season 5
        </ToggleButton>
        <ToggleButton id="season-6" value={'s6'} variant={'outline-primary'}>
          Season 6+
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        type="checkbox"
        defaultValue={DEFAULT_BRACKETS}
        onChange={setBrackets}
        className="mt-3"
      >
        <ToggleButton id="bracket-2s" value={'2s'} variant={'outline-primary'}>
          2v2
        </ToggleButton>
        <ToggleButton id="bracket-3s" value={'3s'} variant={'outline-primary'}>
          3v3
        </ToggleButton>
        <ToggleButton id="bracket-5s" value={'5s'} variant={'outline-primary'}>
          5v5
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default SeasonAndBracket;
