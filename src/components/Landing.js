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

const Landing = () => {
  return (
    <Container className="alerts-onboarding">
      <Alert key={'alert-infos'} variant={'primary'}>
        <Alert.Heading>Notice</Alert.Heading>
        This is a visualizer for the Classic (TBC/WOTLK/etc) addon "ArenaStats"
        It allows you to import your data in order to analyze them by bracket,
        by season, by enemy composition, and much more (to come!) All you have
        to do is click on the "Export" button in-game, copy the String, click on
        the "Import" button here, and paste it.
      </Alert>
      <Alert key={'alert-data'} variant={'warning'}>
        It automatically removes all skirmishes.
      </Alert>
      <Alert key={'alert-trimming'} variant={'warning'}>
        You will only see stats for matches played since you installed the
        addon.
      </Alert>
      <Alert key={'alert-leaving'} variant={'warning'}>
        If you want to leave a match in-game before it is ended, make sure you
        are the last one of your team alive. Otherwise, data for that particular
        match won't be recorded by the addon.
      </Alert>
    </Container>
  );
};

export default Landing;
