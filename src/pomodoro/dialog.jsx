import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import { blue } from '@material-ui/core/colors';
import CodeIcon from '@material-ui/icons/Code';
import BrushIcon from '@material-ui/icons/Brush';
import EditIcon from '@material-ui/icons/Edit';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';

const data = ['Development', 'Designing', 'Content', 'Marketing', 'Planning', 'Management'];
const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Choose category</DialogTitle>
      <List >
    { /* Development */ }
          <ListItem button onClick={() => handleListItemClick(data[0])} key={data[0]}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
		<CodeIcon />
              </Avatar>
            </ListItemAvatar>
	    <Typography> {data[0]} </Typography>
          </ListItem>

    { /* Designing */ }
          <ListItem button onClick={() => handleListItemClick(data[1])} key={data[1]}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <BrushIcon />
              </Avatar>
            </ListItemAvatar>
	    <Typography> {data[1]} </Typography>
          </ListItem>

    { /* Content */ }
          <ListItem button onClick={() => handleListItemClick(data[2])} key={data[2]}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <EditIcon />
              </Avatar>
            </ListItemAvatar>
	    <Typography> {data[2]} </Typography>
          </ListItem>

    { /* Marketing */ }
          <ListItem button onClick={() => handleListItemClick(data[3])} key={data[3]}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PersonAddIcon />
              </Avatar>
            </ListItemAvatar>
	    <Typography> {data[3]} </Typography>
          </ListItem>

    { /* Planning */ }
          <ListItem button onClick={() => handleListItemClick(data[4])} key={data[4]}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PeopleIcon />
              </Avatar>
            </ListItemAvatar>
	    <Typography> {data[4]} </Typography>
          </ListItem>

    { /* Management */ }
          <ListItem button onClick={() => handleListItemClick(data[5])} key={data[5]}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <SettingsIcon />
              </Avatar>
            </ListItemAvatar>
	    <Typography> {data[5]} </Typography>
          </ListItem>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(data[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
    { /*
      <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
      */ }
      <Button variant="contained" color="primary" style={{ width: '100px', height: '40px'}} onClick={handleClickOpen}>
	  Work
      </Button>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
    </div>
  );
}
