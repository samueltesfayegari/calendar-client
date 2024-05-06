import React, { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import RegistrationForm from "./register.js";
import UserList from "./userList.js";
import UserEvents from "./userEvents.js";
import Settings from "./settings.js";
import {
  Button,
  Popover,
  ListSubheader,
  ListItemButton,
  ListItemText as MuiListItemText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Admin.css";

import io from "socket.io-client"; // Import Socket.IO client library

const socket = io("http://localhost:5000"); // Connect to Socket.IO server

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "fixed",
    zIndex: theme.zIndex.drawer + 100,
    width: open ? drawerWidth : 0,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      width: 0,
    }),
  },
}));

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState("userEvents");
  const [newEvents, setNewEvents] = useState([]); // Track new events
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Load notifications from localStorage on component mount
    const storedNotifications = JSON.parse(
      localStorage.getItem("notifications")
    );
    if (storedNotifications) {
      setNewEvents(storedNotifications);
    }

    // Listen for "newEvent" event from the server
    socket.on("newEvent", (newEvent) => {
      // Add the new event to the list
      setNewEvents((prevEvents) => {
        // Using a callback function to access the previous state
        const updatedEvents = [...prevEvents, newEvent];
        // Store updated notifications in localStorage
        localStorage.setItem("notifications", JSON.stringify(updatedEvents));
        return updatedEvents;
      });
    });

    // Cleanup socket.io listener on component unmount
    return () => {
      socket.off("newEvent");
    };
  }, []);

  useEffect(() => {
    // Simulate loading delay for demonstration purposes
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNavigation = (component) => {
    setSelectedComponent(component);
  };

  const handleLogout = () => {
    // Clear the adminToken from localStorage
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userId");
    // Redirect or perform any other action as needed
    // For simplicity, let's just reload the page
    window.location.reload();
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);

  const handleNotificationClick = (index) => {
    // Remove the clicked event from the list
    setNewEvents((prevEvents) => prevEvents.filter((_, i) => i !== index));
    // Clear localStorage
    localStorage.removeItem("notifications");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Admin
            </Typography>
            <IconButton color="inherit" onClick={handlePopoverOpen}>
              <Badge badgeContent={newEvents.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Popover
              open={openPopover}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <List
                sx={{ width: "100%", maxHeight: "300px", overflow: "auto" }}
                subheader={<ListSubheader>New Events</ListSubheader>}
              >
                {newEvents.map((event, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => handleNotificationClick(index)}
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <ListItemText primary={event.date} />
                    <ListItemText primary={event.book} />
                  </ListItemButton>
                ))}
              </List>
            </Popover>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItem button onClick={() => handleNavigation("userEvents")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("Users")}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("Register")}>
              <ListItemIcon>
                <AssignmentIndIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("Settings")}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
          <Divider />
          <Box sx={{ flexGrow: 1 }} />
          <Divider />
          <Button
            variant="danger"
            onClick={handleLogout}
            className="logout-button mt-3 mb-3"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "black",
              marginLeft: "16px",
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Log out
          </Button>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <>
                      {selectedComponent === "Register" && <RegistrationForm />}
                      {selectedComponent === "Users" && <UserList />}
                      {selectedComponent === "userEvents" && (
                        <UserEvents
                          newEvents={newEvents}
                          handleNotificationClick={handleNotificationClick}
                        />
                      )}
                      {selectedComponent === "Settings" && <Settings />}
                      {/* Render other components based on selectedComponent */}
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>
            <Typography
              sx={{ pt: 4 }}
              align="center"
              color="textSecondary"
              component="p"
            >
              {/* Your footer content */}
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
