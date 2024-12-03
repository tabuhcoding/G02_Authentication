'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, TextField, Card, CardContent, CardHeader, Typography } from '@mui/material'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, formData)
      setMessage(response.data.message || 'Đăng nhập thành công!')
      setFormData({ email: '', password: '' })
      localStorage.setItem('token', response.data.token);
      navigate('/profile')
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data && error.response.data.message && error.response.data.message.message) {
        setMessage(error.response.data.message.message)
      } else {
        setMessage('Đã xảy ra lỗi trong quá trình đăng nhập')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
        <CardHeader
          title={<Typography variant="h5">Đăng nhập</Typography>}
          subheader={<Typography variant="body2" color="textSecondary">Đăng nhập vào tài khoản của bạn</Typography>}
          sx={{ textAlign: 'center' }}
        />
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập địa chỉ email"
              fullWidth
            />
            <TextField
              label="Mật khẩu"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
          {message && (
            <Alert
              severity={message.includes('thành công') ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {message}
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
