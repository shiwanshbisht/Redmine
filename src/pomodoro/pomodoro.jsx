import React from "react";
import Mousetrap from "mousetrap";
import "./style.css";
import audio from "./songs/alarm.mp3";
import Footer from "./Footer";
import "os";
import axios from "axios";

export default class Pomodoro extends React.Component {
    constructor() {
        super();
        this.state = {
            time: 0,
            play: false,
            timeType: 0,
            title: "",
            work: "",
        };
        // Bind early, avoid function creation on render loop
        this.setTimeForCode = this.setTime.bind(this, 1500);
        this.setTimeForSocial = this.setTime.bind(this, 5);
        this.setTimeForCoffee = this.setTime.bind(this, 900);
        this.reset = this.reset.bind(this);
        this.play = this.play.bind(this);
        this.elapseTime = this.elapseTime.bind(this);
    }

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
        let timeFormated =
            (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
        return timeFormated;
    }

    getFormatTypes() {
        const work = this.state.work
            ? `Working On ${this.state.work}`
            : "Select Work";
        return [
            { type: work, time: 1500 },
            { type: "In a Meeting", time: 5 },
            { type: "On a Break", time: 900 },
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
            play: true,
        });
    }

    startShortcuts() {
        Mousetrap.bind("space", this.togglePlay.bind(this));
        Mousetrap.bind(
            ["ctrl+left", "meta+left"],
            this.toggleMode.bind(this, -1)
        );
        Mousetrap.bind(
            ["ctrl+right", "meta+right"],
            this.toggleMode.bind(this, 1)
        );
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

    async alert() {
        // audio
        let aud = new Audio(audio);
        aud.play();
        setTimeout(() => aud.pause(), 1400);

        // notification
        if (this.state.timeType === 1500) {
            new Notification("Relax :)", {
                icon: "img/coffee.png",
                lang: "en",
                body: "Go talk or drink a coffee.",
            });
        } else {
            new Notification("The time is over!", {
                icon: "img/code.png",
                lang: "en",
                body: "Hey, back to code!",
            });
        }
        const user = "Mohd Saquib";
        const content = this.state.work;
        const title = this.formatType(this.state.timeType);
        let embed = {
            embeds: [
                {
                    title: title,
                    description: content,
                    color: 857138,
                    footer: {
                        icon_url:
                            "https://www.pngfind.com/pngs/m/49-491581_clock-icon-clock-blue-png-transparent-png-download.png",
                        text: "Pomodoro Webhook",
                    },
                    author: {
                        name: user,
                        icon_url: user.profile_url,
                    },
                },
            ],
        };
        await axios.post(
            "https://discord.com/api/webhooks/780830846575312927/h_NKiNA2NyQ3YOioLVjDOedsyBhowWIf2TW7YIQuTdjT134elK_SxOTSE1tmaY-PRn5O",
            embed
        );
    }
    handleChange = (e) => {
        this.setTimeForCode();
        this.setState({ work: e.target.value });
    };
    render() {
        return (
            <div className="pomodoro">
                <div className="main">
                    <div className="container display timer">
                        <span className="time">
                            {this.format(this.state.time)}
                        </span>
                        <span className="timeType">
                            {this.formatType(this.state.timeType)}
                        </span>
                    </div>

                    <div className="container display types">
                        <select
                            className="col-3 ml-2 form-control form-select sel"
                            aria-label="Default select example"
                            onChange={this.handleChange}>
                            <option defaultValue>Select Work Type</option>
                            <option value="Development">Development</option>
                            <option value="Designing">Designing</option>
                            <option value="Content Creation">
                                Content Creation
                            </option>
                            <option value="Marketing">Marketing</option>
                            <option value="Planning">Planning</option>
                            <option value="Management">Management</option>
                        </select>
                        <button
                            className="btn btn-success ml-2"
                            onClick={this.setTimeForSocial}>
                            Meetings
                        </button>
                        <button
                            className="btn btn-warning ml-2"
                            onClick={this.setTimeForCoffee}>
                            Break
                        </button>
                    </div>

                    <div className="container">
                        <div className="controlsPlay">
                            <button
                                className="play btnIcon"
                                onClick={this.play}></button>
                            <button
                                className="stop btnIcon"
                                onClick={this.reset}></button>
                        </div>
                    </div>
                </div>
                <div className="bottomBar">
                    <div className="controls">
                        <div className="container">
                            <div className="controlsLink">
                                <a
                                    href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
                                    target="_blank"
                                    rel="noreferrer">
                                    What is Pomodoro?
                                </a>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}
