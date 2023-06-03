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

const Statistics = ({ badges }) => {
  return (
    <Container>
      <BootstrapRow xs={1} sm={2} md={2} lg={3} xl={4} xxl={4} className="g-4">
        {badges.map(badge => (
          <Col key={badge.title}>
            <Card
              key={badge.title}
              border={badge.appearance}
              style={{ height: '100%' }}
            >
              <Card.Header as="h5">{badge.title}</Card.Header>
              <Card.Body>
                <Card.Text className="mb-2 text-muted">
                  {badge.details ? (
                    badge.details
                  ) : (
                    <ul className="sober">
                      {badge.detailsArray.map(it => (
                        <li>{it}</li>
                      ))}
                    </ul>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </BootstrapRow>
    </Container>
  );
};

export default Statistics;
