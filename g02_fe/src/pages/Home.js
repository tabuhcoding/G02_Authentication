import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader } from '@mui/material';
import { useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
        <CardHeader
          title="Welcome to 21120041's App"
          subheader="There are my IA03-04's projects"
          sx={{ textAlign: 'center' }}
        />
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>Login</Button>
            <Button variant="outlined" color="primary" onClick={handleRegister} fullWidth>Register</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
