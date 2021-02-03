import "./App.css";
import { Component } from "react";
import Loading from "./Loading";

class App extends Component {
    state = {
        loading: true,
        animation: "",
    };
    componentDidMount() {
        this.setState({ loading: true }, () => {
            setTimeout(() => {
                this.setState({ animation: "galleryImg" });
            }, 2000);
            setTimeout(() => {
                this.setState({ loading: false });
            }, 4000);
        });
    }
    redirect = () => {
        window.location = "https://kore.koders.in/";
    };
    render() {
        return this.state.loading ? (
            <div className={`App ${this.state.animation}`}>
                <Loading />
            </div>
        ) : (
            <div onClick={this.redirect()}></div>
        );
    }
}

export default App;
