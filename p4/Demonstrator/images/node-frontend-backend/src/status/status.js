import React from 'react'
import {DefaultLayout} from 'layouts'
import { withRouter } from 'react-router-dom';

class Status extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: "",
            error: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.readNFC = this.readNFC.bind(this)
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.history.push('/status/' + this.state.value);
    }

    async readNFC(){
        if ("NDEFReader" in window){
            const reader = new window.NDEFReader()
            await reader.scan();
            console.log("> Scan started");
        
            reader.addEventListener("reading", ({ message, serialNumber }) => {
                let tagData = ""
                const decoder = new TextDecoder();
                for (const record of message.records) {
                    let textString = decoder.decode(record.data);
                    tagData = tagData + textString
                }
                let tagJSON = JSON.parse(tagData)
                this.props.history.push('/status/' + tagJSON._id);
            });
        } else {
            this.setState({error: "Ihr Gerät oder Browser untersützt kein WebNFC."}) 
        }
    }
    render() {
        var errorMessage = ""

        if (this.state.error !== ""){
        errorMessage = <div className="alert alert-warning">{this.state.error}</div>
        }
        var nfcQuery = ""
        if ("NDEFReader" in window){
            nfcQuery = (
                <div className="row justify-content-center mt-5">
                    <div className="col-md-8 align-self-center">
                        <p>
                            Sie können mit Hilfe von WebNFC die Daten eines Werkstücks anzeigen lassen. Dafür müssen Sie diese Seite mit einem Android Smartphone
                            und dem Chrome Browser ansteuern. Zustätzlich müssen Sie auch die "Experimental Web Platform features" Flag aktiv haben. Dann klicken sie auf
                            "Tag auslesen" und halten Sie das Werkstück an ihr Smartphone.
                        </p>
                        {errorMessage}
                        <button className="btn btn-outline-primary btn-isac-primary btn-lg btn-block" onClick={this.readNFC}>
                            Abfragen
                        </button>
                    </div>
                </div>
            );
        }
        var main = (
            <DefaultLayout title="Statusabfrage">
                <div className="col-md-12">
                    <div className="row justify-content-center mx-1">
                        <div className="col-md-8 align-self-center">
                            <form onSubmit={this.handleSubmit}> 
                                <p>Sie können den Status ihrer Bestellung verfolgen und einsehen wann es sich bei welcher Station befunden hat. Geben Sie dafür einfach die Bestell-ID an, die Sie bei der Bestellung erhalten haben.</p>
                                <input className="form-control form-control-lg mb-2" id="orderid" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Bestellungs ID"/>        
                                <input className="btn btn-outline-primary btn-isac-primary btn-lg btn-block" type="submit" value="Abfragen" />
                            </form>
                        </div>
                    </div>
                    {nfcQuery}
                </div>
            </DefaultLayout>
        )

        return main;
    }
}
export default withRouter(Status) 