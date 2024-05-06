import React, { useState } from 'react';
import { FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';

const Settings = () => {
  // State variables for toggle settings
  const [notifications, SetNotifications] = useState(false);
  const [alert, setAlert] = useState(false);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={notifications} onChange={() => SetNotifications(!notifications)} />}
          label="Notifications"
        />
        <FormControlLabel
          control={<Switch checked={alert} onChange={() => setAlert(!alert)} />}
          label="Alert"
        />
      </FormGroup>
    </div>
  );
};

export default Settings;