import Grid from "@mui/material/Unstable_Grid2";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import { useTheme } from "@mui/system";
import { GPTCompletion } from "@shared/types";

interface BotMessageProps {
  completion: GPTCompletion;
}

function BotMessage({ completion }: BotMessageProps) {
  const theme = useTheme();
  return (
    <Grid container padding={2}>
      <Grid
        xs={1}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <PrecisionManufacturingIcon color="secondary" />
      </Grid>
      <Grid
        xs={10}
        sx={{
          py: 2,
          borderRadius: 2,
          borderRight: 0,
          backgroundColor: "#e0e0e0",
        }}
        style={{ borderBottomLeftRadius: 0 }}
      >
        {completion.choices.length ? (
          <div
            dangerouslySetInnerHTML={{
              __html: completion?.choices[0].text.replaceAll("\n", "<br>"),
            }}
          />
        ) : (
          <p>loading...</p>
        )}
      </Grid>
      <Grid xs={1} />
    </Grid>
  );
}

export default BotMessage;
