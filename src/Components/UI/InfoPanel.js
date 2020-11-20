import React from "react";
import {
  makeStyles,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {},
  card: {
    position: "relative",
  },
  cardContent: {
    "&:last-child": { paddingBottom: theme.spacing(2) },
  },
  editIconWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default function InfoPanel({
  title,
  children,
  editable,
  onEdit,
  className,
  ...props
}) {
  const classes = useStyles();

  if (editable === undefined) {
    editable = true;
  }

  return (
    <Card
      className={className + " " + classes.card}
      variant="outlined"
      {...props}
    >
      <CardContent className={classes.cardContent}>
        {editable && (
          <div className={classes.editIconWrapper}>
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
          </div>
        )}

        <Typography variant="h5" element="h2" paragraph>
          {title}
        </Typography>

        {children}
      </CardContent>
    </Card>
  );
}
