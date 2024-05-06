import React, { useState } from "react";
import axios from "axios";
import zxcvbn from "zxcvbn";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

import { URL } from "./config";

const RegistrationForm = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setPassword(randomPassword);
    setPasswordStrength(zxcvbn(randomPassword).score);
    setGeneratedPassword(randomPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when async function starts
    try {
      const response = await axios.post(`${URL}/user`, {
        username: userName,
        password: password,
      });

      setUserName("");
      setPassword("");
      setPasswordStrength(0);
      if (generatedPassword) {
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setLoading(false); // Set loading to false when async function finishes
    }
  };

  const handlePasswordChange = (e) => {
    const strength = zxcvbn(e.target.value).score;
    setPasswordStrength(strength);
    setPassword(e.target.value);
    setGeneratedPassword("");
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopiedPassword(generatedPassword);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCopiedPassword("");
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        User Registration
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              required
              fullWidth
              id="userName"
              label="Username"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={handlePasswordChange}
              value={password}
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {password && (
              <Typography variant="body2" color="textSecondary">
                Password Strength: {passwordStrength}/4
              </Typography>
            )}
          </Grid>
        </Grid>
        <br />
        <Button
          type="button"
          fullWidth
          variant="contained"
          onClick={generateRandomPassword}
        >
          Generate Password
        </Button>
        <br />
        <br />
        {/* Use CircularProgress to indicate loading */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading || passwordStrength < 2 || !userName || !password} // Disable button when loading
        >
          {loading ? <CircularProgress size={24} /> : "Register"} {/* Show CircularProgress or "Register" text */}
        </Button>
      </form>

      {/* Modal for showing generated password */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="password-modal"
        aria-describedby="modal-to-show-generated-password"
      >
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 250, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
          <Typography id="password-modal" variant="h6" component="h2">
            Generated Password
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your generated password is: {generatedPassword}
          </Typography>
          {copiedPassword && (
            <Typography variant="body2" color="textSecondary">
              Password copied to clipboard: {copiedPassword}
            </Typography>
          )}
          <Button onClick={handleCopyPassword}>Copy Password</Button>
          <Button onClick={handleCloseModal}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default RegistrationForm;
