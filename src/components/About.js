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

import * as icons from '../utils/icons';

const About = () => {
  return (
    <Stack className="float-end">
      <div>
        <img src={icons.github} width={'28'} height={'24'} alt={'github'} />
        Contribute to the tool{' '}
        <a href="https://github.com/denishamann/arena-stats-visualizer">
          on Github
        </a>
      </div>
      <div>
        <img src={icons.github} width={'28'} height={'24'} alt={'github'} />
        Contribute to the addon{' '}
        <a href="https://github.com/denishamann/ArenaStats">on Github</a>
      </div>
      <div>
        <img
          src={icons.curse}
          width={'20'}
          height={'20'}
          alt={'curse'}
          style={{ marginLeft: '5px', marginRight: '3px' }}
        />
        Get the addon{' '}
        <a href="https://www.curseforge.com/wow/addons/arenastats">
          on CurseForge
        </a>
      </div>
    </Stack>
  );
};

export default About;
