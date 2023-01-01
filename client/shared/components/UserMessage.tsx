import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/system";
import {Typography} from '@mui/material'

function UserMessage({prompt} : {prompt: string}) {
  const theme = useTheme();

  return (
    <Grid container padding={2}>
      <Grid xs={1} />
      <Grid
        xs={10}
        sx={{
          py: 2,
          borderRadius: 2,
          borderRight: 0,
          backgroundColor: theme.palette.primary.main,
        }}
        style={{ borderBottomRightRadius: 0 }}
      >
        <Typography>{prompt}</Typography>
      </Grid>
      <Grid
        xs={1}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <AccountCircleIcon color="primary" />
      </Grid>
    </Grid>
  );
}

export default UserMessage;
