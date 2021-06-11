import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  footer: {
    flex: 'none',
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    backgroundColor: theme.palette.background.paper
  }
}));

export default function Footer() {
  const fullDate = new Date();
  const currYear = fullDate.getFullYear();
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Typography variant='subtitle2' align='center' color='textSecondary' component='p'>
        © 2016-{currYear} The Van Valen Lab at the California Institute of Technology
        (Caltech). All rights reserved.
      </Typography>
      <Typography variant='subtitle2' align='center' color='textSecondary' component='p'>
        For any questions or issues, please post on our <Link href="https://github.com/vanvalenlab/deepcell-label/issues">GitHub Issues</Link> page.
      </Typography>
    </footer>
  );
}