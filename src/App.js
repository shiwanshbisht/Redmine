import "./App.css";
import { Component } from "react";
import { Route, Switch } from "react-router-dom";
import pomodoro from "./pomodoro/pomodoro";

class App extends Component {
    redirect = () => {
        window.location = "https://kore.koders.in/";
    };
    render() {
        return (
            <Switch>
                <Route path="/pomodoro" component={pomodoro} />
                <Route path="/" render={this.redirect} />
            </Switch>
        );
    }
}

export default App;
