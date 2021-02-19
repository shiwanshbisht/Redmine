import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  select: {
    color: 'white',
    margin: theme.spacing(1),
    "&:before": {
      border: "None"
    },
    "&:after": {
      border: "None"
    },
    "&:hover": {
      border: "None"
    }
  },
}));

export default function ControlledOpenSelect() {
  const classes = useStyles();
  const [age, setAge] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <FormControl className="btn col-2 ml-2 sel">
      <Select className ={classes.select}
        open={open}
        displayEmpty
        onClose={handleClose}
        onOpen={handleOpen}
        value={age}
        onChange={handleChange}
      >
        <MenuItem value="">Work</MenuItem>
        <MenuItem value="Development">Development</MenuItem>
        <MenuItem value="Designing">Designing</MenuItem>
        <MenuItem value="Content Creation">Content Creation</MenuItem>
        <MenuItem value="Marketing">Marketing</MenuItem>
        <MenuItem value="Planning">Planning</MenuItem>
        <MenuItem value="Management">Management</MenuItem>
      </Select>
    </FormControl>
  );
}
