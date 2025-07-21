import { Button, Dialog, DialogContent, DialogTitle, FormHelperText, TextField } from "@mui/material";
import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}
const key = process.env.NEXT_PUBLIC_PASS;

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            if (password === key) {
                localStorage.setItem('isAuthenticated', 'true');
                onClose();
            } else {
                setError('Senha incorreta');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Erro ao fazer login');
        }
    }


    return (
        <Dialog
            open={isOpen}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    label="Senha"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                    error={!!error}
                    sx={{ mt: 2 }}
                    InputProps={{
                        endAdornment: (
                            <Button
                                onClick={() => setShowPassword((prev) => !prev)}
                                sx={{ minWidth: 0, px: 1 }}
                                variant="text"
                            >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />
                                }
                            </Button>
                        ),
                    }}
                />
                {error && <FormHelperText error>{error}</FormHelperText>}
                <Button onClick={handleLogin} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Login
                </Button>
            </DialogContent>
        </Dialog>
    );
}