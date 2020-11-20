import React from "react";
import { Grid, makeStyles, Box, Typography, Paper } from "@material-ui/core";

const _opts = {
  mainImageBoxHeight: 300,
  mainImageBoxWidth: 400,
  imageCellHeight: 90,
  imageCellWidth: 90,
};

const _layerTypeMap = {
  copper: "Copper",
  soldermask: "Solder Mask",
  silkscreen: "Silkscreen",
  solderpaste: "Solder Paste",
  drill: "Drill",
  outline: "Outline",
  drawing: "Drawing",
};

const _sideNameMap = {
  top: "Top",
  bottom: "Bottom",
  inner: "Inner",
  all: "All",
};

const _getLayerName = (layer) => {
  return _layerTypeMap[layer.type] + " (" + _sideNameMap[layer.side] + ")";
};

const useStyles = makeStyles((theme) => ({
  mainImagePaper: {
    width: "100%",
    minWidth: _opts.mainImageBoxWidth,
    height: _opts.mainImageBoxHeight,
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: 0.9 * _opts.mainImageBoxWidth,
    height: 0.9 * _opts.mainImageBoxHeight,
    display: "block",
  },
  imageCell: {
    cursor: "pointer",
    "&:hover": {
      "& > .MuiPaper-root": {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  imageCellPaper: {
    padding: theme.spacing(1),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    "& > *": {
      width: "100%",
    },
  },
  imageCellImage: {
    height: "auto",
    width: "100%",
    display: "block",
  },
  imageCellCaption: {
    fontSize: 10,
    marginBottom: 0,
  },
}));

function ImageCell({ src, label, ...props }) {
  let classes = useStyles();

  return (
    <Grid item className={classes.imageCell} {...props}>
      <Paper variant="outlined" className={classes.imageCellPaper}>
        <Box>
          <img alt={label} src={src} className={classes.imageCellImage} />
        </Box>
        <Typography
          paragraph
          variant="caption"
          className={classes.imageCellCaption}
        >
          {label}
        </Typography>
      </Paper>
    </Grid>
  );
}

export default function GerberPreview({ board }) {
  const classes = useStyles();
  const [currentImage, setCurrentImage] = React.useState(board.topImageUrl);
  const [currentImageTitle, setCurrentImageTitle] = React.useState("Top");

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" paragraph>
          {currentImageTitle}
        </Typography>
        <Paper variant="outlined" className={classes.mainImagePaper}>
          <img
            alt={currentImageTitle}
            src={currentImage}
            className={classes.mainImage}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <ImageCell
            xs={3}
            key="top"
            src={board.topImageUrl}
            label="Top"
            onClick={() => {
              setCurrentImage(board.topImageUrl);
              setCurrentImageTitle("Top");
            }}
          />
          <ImageCell
            xs={3}
            key="bottom"
            src={board.bottomImageUrl}
            label="Bottom"
            onClick={() => {
              setCurrentImage(board.bottomImageUrl);
              setCurrentImageTitle("Bottom");
            }}
          />
          {board.layers.map((layer, index) => (
            <ImageCell
              xs={3}
              key={index}
              src={layer.imageUrl}
              label={_getLayerName(layer)}
              onClick={() => {
                setCurrentImage(layer.imageUrl);
                setCurrentImageTitle(_getLayerName(layer));
              }}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
