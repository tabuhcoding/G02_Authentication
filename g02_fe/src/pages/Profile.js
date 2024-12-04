'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardContent, CardHeader, Typography, CircularProgress, Alert } from '@mui/material'
import { LogOut } from 'lucide-react'
import { getCookie, deleteCookie } from '../helpers/cookies'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = getCookie('token')
    console.log(token)
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data.user)
        setLoading(false)
      })
      .catch(() => {
        setError('Không thể tải thông tin người dùng')
        setLoading(false)
      })
  }, [navigate])

  const handleLogout = () => {
    deleteCookie('token')
    navigate('/')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
        <CardHeader
          title={<Typography variant="h5" component="h2">Trang cá nhân</Typography>}
          subheader={<Typography variant="body2" color="textSecondary">Thông tin người dùng</Typography>}
          sx={{ textAlign: 'center' }}
        />
        <CardContent>
          {error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Tên đăng nhập:</strong> {user.username}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Email:</strong> {user.email}
              </Typography>
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogout}
            startIcon={<LogOut />}
          >
            Đăng xuất
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}