import { useActionState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { Link } from "react-router";

function LoginForm(props) {
  const [state, formAction] = useActionState(submitCredentials, { email: '', password: '' });

  async function submitCredentials(prevData, formData) {
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password')
    };
    try {
      await props.handleLogin(credentials);
      return { success: true };
    } catch (error) {
      return { error: 'Invalid credentials' };
    }
  }

  return (
    <Container
      fluid="sm"
      style={{ maxWidth: '400px', marginTop: '1rem', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}
    >
      <h2 className="mb-4 text-center">Login</h2>

      <Form action={formAction} noValidate>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Inserisci la tua email"
            required
            isInvalid={!!state.error}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Inserisci la password"
            required
            isInvalid={!!state.error}
          />
        </Form.Group>
        

        {state.error && <Alert variant="danger" className="text-center">{state.error}</Alert>}

        <div className="d-flex justify-content-between">
          <Link to="/" className="btn btn-outline-secondary">
            Cancel
          </Link>
          <Button type="submit" variant="primary">
            Login
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default LoginForm;
