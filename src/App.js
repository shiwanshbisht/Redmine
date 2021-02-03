import "./App.css";
import { Component } from "react";

class App extends Component {
    redirect = () => {
        window.location = "https://kore.koders.in/";
    };
    render() {
        return <div onClick={this.redirect()}></div>;
    }
}

export default App;
