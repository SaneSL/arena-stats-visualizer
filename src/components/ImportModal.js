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

const ImportModal = ({
  showModal,
  handleCloseModal,
  importString,
  setImportString,
  importConfirmed,
}) => {
  return (
    <Modal centered size="lg" show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Import</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Export string from addon</Form.Label>
            <Form.Control
              autoFocus
              as="textarea"
              rows={20}
              cols={50}
              value={importString}
              onChange={e => setImportString(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          className="import-confirmed"
          onClick={importConfirmed}
        >
          Import
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportModal;
