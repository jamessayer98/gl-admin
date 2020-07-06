import React from 'react';
import {
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  }
}));

export default function ListFilter({ title, onSearch, children }) {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div
      className={classes.root}
    >
      {title}
      {children}
      <form
        onSubmit={event => {
          event.preventDefault();
          onSearch(searchQuery);
        }}
      >
        <input
          type="text"
          name="s"
          value={searchQuery}
          placeholder="Search"
          onChange={event => setSearchQuery(event.target.value)}
        />
      </form>
    </div>
  );
}