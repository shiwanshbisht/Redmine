import React from "react";
import Mousetrap from "mousetrap";
import "./style.css";
import audio from "./songs/alarm.mp3";
import Footer from "./Footer";
import icon from "./img/koders.png";
import axios from "axios";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import StopIcon from '@material-ui/icons/Stop';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Dialog from './dialog';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import PauseIcon from '@material-ui/icons/Pause';

export default class Pomodoro extends React.Component {
  constructor() {
    super();
    this.state = {
      time: 0,
      play: false,
      timeType: 0,
      title: "",
      work: "",
      value: "",
      pomodoros: [],
      open: false,
      anchorRef: null,
      selectedIndex: 1,
      todayPomodoros: 0,
      setOpen: false,
    };
    // Bind early, avoid function creation on render loop
    this.setTimeForCode = this.setTime.bind(this, 1500);
    this.setTimeForSocial = this.setTime.bind(this, 1200);
    this.setTimeForCoffee = this.setTime.bind(this, 300);
    this.reset = this.reset.bind(this);
    this.play = this.play.bind(this);
    this.alert = this.alert.bind(this);
    this.elapseTime = this.elapseTime.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this, 1);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    console.info(`You clicked ${this.state.options[this.selectedIndex]}`);
  };

  handleMenuItemClick = (event, index) => {
    this.setSelectedIndex(index);
    //this.setOpen(false);
    this.setState({ setOpen: !this.state.setOpen });
  };

  handleToggle = () => {
    //this.setOpen((prevOpen) => !prevOpen);
    this.setState({ setOpen: !this.state.setOpen });
  };

  handleClose = (event) => {
    if (
      this.anchorRef.current &&
      this.anchorRef.current.contains(event.target)
    ) {
      return;
    }

    this.setOpen(false);
  };

  componentDidMount() {
    this.setDefaultTime();
    this.startShortcuts();
    Notification.requestPermission();
  }
  getTitle(time) {
    time = typeof time === "undefined" ? this.state.time : time;
    let _title = this.format(time) + " | Pomodoro timer";
    return _title;
  }

  setDefaultTime() {
    let defaultTime = 1500;
    this.setState({
      time: defaultTime,
      timeType: defaultTime,
      title: this.getTitle(defaultTime),
      play: false,
    });
  }

  elapseTime() {
    if (this.state.time === 0) {
      this.reset(0);
      this.alert();
    }
    if (this.state.play === true) {
      let newState = this.state.time - 1;
      this.setState({ time: newState, title: this.getTitle(newState) });
    }
  }

  format(seconds) {
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor((seconds % 3600) % 60);
    let timeFormated = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    return timeFormated;
  }

  getFormatTypes() {
    const work = this.state.work ? `Working On ${this.state.work}` : "Work";
    return [
      { type: work, time: 1500 },
      { type: "Meeting", time: 1200 },
    ];
  }

  formatType(timeType) {
    let timeTypes = this.getFormatTypes();
    for (let i = 0; i < timeTypes.length; i++) {
      let timeObj = timeTypes[i];
      if (timeObj.time === timeType) {
        return timeObj.type;
      }
    }
    return null;
  }

  restartInterval() {
    clearInterval(this.interval);
    this.interval = setInterval(this.elapseTime, 1000);
  }

  play() {
    if (!this.state.value) {
      alert("Please enter Title for your tracker");
      return;
    }
    if (true === this.state.play) return;

    this.restartInterval();

    this.setState({
      play: true,
    });
  }

  reset(resetFor = this.state.time) {
    clearInterval(this.interval);
    this.format(resetFor);
    this.setState({ play: false });
  }

  togglePlay() {
    if (true === this.state.play) return this.reset();
    return this.play();
  }

  setTime(newTime) {
    this.restartInterval();
    this.setState({
      time: newTime,
      timeType: newTime,
      title: this.getTitle(newTime),
      play: false,
    });
  }

  startShortcuts() {
    Mousetrap.bind("space", this.togglePlay.bind(this));
    Mousetrap.bind(["ctrl+left", "meta+left"], this.toggleMode.bind(this, -1));
    Mousetrap.bind(["ctrl+right", "meta+right"], this.toggleMode.bind(this, 1));
  }

  toggleMode(gotoDirection) {
    let timeTypes = this.getFormatTypes();
    let currentPosition = -1;
    for (let i = 0; i < timeTypes.length; i++) {
      if (timeTypes[i].time === this.state.timeType) {
        currentPosition = i;
        break;
      }
    }

    if (currentPosition !== -1) {
      let newMode = timeTypes[currentPosition + gotoDirection];
      if (newMode) this.setTime(newMode.time);
    }
  }

  _setLocalStorage(item, element) {
    let value = element.target.checked;
    localStorage.setItem("react-pomodoro-" + item, value);
  }

  _getLocalStorage(item) {
    return localStorage.getItem("react-pomodoro-" + item) === "true"
      ? true
      : false;
  }
  countMinutes = (totalTime, currTime) => {
    const ct = currTime.split(":");
    const totalsec = parseInt(ct[0]) * 60 + parseInt(ct[1]);
    const restSec = totalTime - totalsec;
    if (restSec < 60) {
      if (restSec < 10) {
        return "00:0" + restSec;
      }
      return "00:" + restSec;
    } else {
      let mints = parseInt(restSec / 60);
      let sec = restSec - mints * 60;
      if (mints < 10) {
        mints = "0" + mints;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      return mints + ":" + sec;
    }
  };

  async alert() {
    if (!this.state.value) {
      alert("Please Enter Title");
      return;
    }
    // audio
    let aud = new Audio(audio);
    aud.play();
    setTimeout(() => aud.pause(), 1400);
    const time = new Date();
    const data = {
      type: this.formatType(this.state.timeType).split(" ").pop(),
      title: this.state.value,
      date: time.toLocaleDateString(),
      time: time,
    };

    // notification
    if (this.state.timeType === 5) {
      new Notification("The time is over!", {
        icon: icon,
        lang: "en",
        body: "Hey, Let's get back to Work.",
      });
      data.timer = this.countMinutes(5, this.format(this.state.time));
      this.setTimeForCoffee();
    } else if (this.state.timeType === 1200) {
      new Notification("Relax :)", {
        icon: icon,
        lang: "en",
        body: "Meeting timer is over.",
      });
      data.timer = this.countMinutes(1200, this.format(this.state.time));
    } else {
      new Notification("Relax :)", {
        icon: icon,
        lang: "en",
        body: "Break timer is over.",
      });
      data.timer = this.countMinutes(300, this.format(this.state.time));
    }
    this.sendWebhook(data);
    let newEntry = [{ ...data }];
    this.setDefaultTime();
  }
  sendWebhook = async (data) => {
    const { type, title, timer, time, date } = data;
    alert(JSON.stringify(data, 2, " "));
    const user = "Test username";
    const hostname = "Test hostname";
    const device = "Test device";
    let embed = {
      content: null,
      embeds: [
        {
          title: title,
          color: 5814783,
          fields: [
            {
              name: "Date",
              value: date,
            },
            {
              name: "Type",
              value: type,
              inline: true,
            },
            {
              name: "Timer",
              value: timer,
              inline: true,
            },
            {
              name: "Hostname",
              value: hostname,
            },
            {
              name: "Platform",
              value: device,
              inline: true,
            },
          ],
          author: {
            name: `Timer ran by ${user}`,
          },
          footer: {
            text: "Made with ❤ by Koders",
            icon_url:
              "https://media.discordapp.net/attachments/700257704723087360/709710823207206952/K_without_bg_1.png",
          },
          timestamp: time,
        },
      ],
    };
    try {
      await axios.post(
        "https://discord.com/api/webhooks/780830846575312927/h_NKiNA2NyQ3YOioLVjDOedsyBhowWIf2TW7YIQuTdjT134elK_SxOTSE1tmaY-PRn5O",
        embed
      );
    } catch (err) {
      alert(err);
    }
  };
  handleChange = (e) => {
    this.setTimeForCode();
    this.setState({ work: e.target.value });
  };
  handleChangeInput = (e) => {
    this.setState({ value: e.target.value });
  };

  timerProps = {
  strokeWidth: 6
  };

  renderTimer = (timer) => {
    return(
      <div>
    <CountdownCircleTimer className="timer-wrapper" style={{margin: '20px'}}
      {...this.timerProps}
	isPlaying={this.state.play}
	duration={1200}
	colors={[
	  ['#004777', 0.33],
	  ['#F7B801', 0.33],
	  ['#A30000', 0.33],
	]}
      >
      {({ elapsedTime }) =>
	  this.renderTime(this.format(this.state.time))
	}
      </CountdownCircleTimer>
      </div>
    )
  };
  renderTime = (dimension, time) => {
  return (
    <div className="flex-fill">
      <div className="time">{time}</div>
      <Typography variant="h3"> {dimension} </Typography>
      <Typography variant="h5"> {this.state.work} </Typography>
    </div>
  )};
  render() {
    return (
      <div className="pomodoro">
        <div className="main d-flex">
          <div className="flex-fill">
            <div className="content display timer ">
		<span className="timeType">
		  { this.renderTimer(this.state.time) }
		</span>
		<form>
		<TextField id="outlined-basic" style={{ width: '300px', margin: '20px' }} label="What're you working on?" value={this.state.value} onChange={this.handleChangeInput} variant="outlined" />
      </form>
            </div>
            <div className="content display">
	    <Dialog />
      &nbsp;
              <Button style={{ width: '100px', height: '40px', backgroundColor: "#1a4370" }} variant="contained" color="primary" onClick={this.setTimeForSocial}>
		  Meeting
	      </Button>
            </div>
            <div className="content">
              	<Button style={{ width: '50px', height: '40px', backgroundColor: "#00cc44" }} variant="contained" color="primary" onClick={this.play}>
		  <KeyboardArrowRightIcon />
		</Button>
	    &nbsp;
              	<Button style={{ width: '50px', height: '40px', backgroundColor: "#dce52d" }} variant="contained" color="primary" onClick={this.play}>
		  <PauseIcon />
		</Button>
	    &nbsp;
		<Button style={{ width: '50px', height: '40px'}} variant="contained" color="secondary" onClick={this.reset}>
		  <StopIcon />
		</Button>
            </div>
          </div>
        </div>
        <div className="bottomBar">
          <Footer />
        </div>
      </div>
    );
  }
}
