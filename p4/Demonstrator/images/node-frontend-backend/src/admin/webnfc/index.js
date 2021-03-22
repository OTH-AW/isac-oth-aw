import React from 'react'
import {NoBannerLayout} from 'layouts'
import ReactJson from 'react-json-view'

export default class WebNFC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDB: [{"message": "Es wurde noch kein JSON Objekt geladen.",}],
            dataWP: [{"message": "Es wurde noch kein JSON Objekt geladen.",}],
            text: [{"message": "Es wurde noch kein JSON Objekt geladen.",}],
            error: "",
            noID: false}

        this.handleChange = this.handleChange.bind(this)
        this.writeNFC = this.writeNFC.bind(this)
        this.readNFC = this.readNFC.bind(this)
        this.dataDBToTextbox = this.dataDBToTextbox.bind(this)
        this.dataWPToTextbox = this.dataWPToTextbox.bind(this)

        this.backendURL = window.backendURL;
    }

    componentDidMount() {

        const { id } = this.props.match.params
        if(id){
            fetch(`${this.backendURL}/workpiece/${id}`)
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                this.setState({
                    dataDB: data,
                });
            })
            .catch(console.log)
        } else {
            this.setState({noID: true})
        }


    }

    handleChange(event){
        this.setState({text: event.target.value})
    }

    dataDBToTextbox(){
        this.setState({text: this.state.dataDB})
    }

    dataWPToTextbox(){
        this.setState({text: this.state.dataWP})
    }

    async writeNFC(){
        if ("NDEFReader" in window){
            try {
                const writer = new window.NDEFWriter();
                await writer.write(JSON.stringify(this.state.text));
            } catch (error) {
                console.log("WebNFC Write Error")
            }
        } else {
            this.setState({error: "Ihr Gerät oder Browser untersützt kein WebNFC."}) 
        }
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
                try{
                    this.setState({dataWP: JSON.parse(tagData), error: ""})
                } catch {
                    this.setState({dataWP: "", error: ""})  
                }
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

        var main = (
                <NoBannerLayout title="WebNFC">
                    <div className="col-md-12 mx-1">
                        {errorMessage}
                        <div className="row mb-2">
                            <div className="col-12 align-self-end">
                            
                                <button className="btn btn-outline-primary btn-isac-primary btn-lg btn-block" onClick={this.readNFC}>
                                    Tag auslesen
                                </button>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-12">
                                {errorMessage}
                                <ReactJson theme="monokai" src={this.state.dataDB} />
                            </div>
                            <div className="col-12">
                                <ReactJson theme="monokai" src={this.state.dataWP} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 text-center">
                                <button className="btn btn-outline-primary btn-isac-primary btn-lg btn-block" onClick={this.dataDBToTextbox}>
                                    JSON bearbeiten
                                </button>
                            </div>
                            <div className="col-12 text-center">
                                <button className="btn btn-outline-primary btn-isac-primary btn-lg btn-block" onClick={this.dataWPToTextbox}>
                                    JSON bearbeiten
                                </button>
                            </div>
                        </div>
                        {errorMessage}
                        <div className="form-group mt-5">
                            <div className="alert alert-danger" role="alert">
                            Warnung: Beim Beschreiben des Tags mit diesem Datensatz werden die Änderungen nicht in die Datenbank übernommen. Durch diese Inkonsistenzen kann es beim erneuten Einlesen dieses Datensatzes zu Fehlern kommen.
                            </div>
                            <ReactJson theme="monokai" onEdit={e => {console.log(e);this.setState({ text: e.updated_src })}} src={this.state.text}/>
                        </div>
                        <button className="btn btn-outline-primary btn-isac-primary btn-lg btn-block" onClick={this.writeNFC}>
                            Tag beschreiben
                        </button>
                        <br/>
                        <br/>
                    </div>
                </NoBannerLayout>
        )

        if (this.state.noID){
            main = (
                <NoBannerLayout title="WebNFC">
                    <div className="col-md-12 mx-1">
                        {errorMessage}
                        <div className="row justify-content-end mb-3">
                            <div className="col-12 align-self-end">
                                <button className="btn btn-outline-primary btn-isac-primary btn-lg btn-block" onClick={this.readNFC}>
                                    Tag auslesen
                                </button>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-12">
                                <ReactJson theme="monokai" src={this.state.dataWP} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 text-center">
                                <button className="btn btn-outline-primary btn-isac-primary btn-lg btn-block" onClick={this.dataWPToTextbox}>
                                    JSON bearbeiten
                                </button>
                            </div>
                        </div>
                        <div className="form-group mt-5">
                            <div className="alert alert-danger" role="alert">
                            Warnung: Beim Beschreiben des Tags mit diesem Datensatz werden die Änderungen nicht in die Datenbank übernommen. Durch diese Inkonsistenzen kann es beim erneuten Einlesen dieses Datensatzes zu Fehlern kommen.
                            </div>
                            <ReactJson theme="monokai" onEdit={e => {console.log(e);this.setState({ text: e.updated_src })}} src={this.state.text}/>
                        </div>
                        <button className="btn btn-outline-primary btn-isac-primary btn-lg btn-block" onClick={this.writeNFC}>
                            Tag beschreiben
                        </button>
                        <br/>
                        <br/>
                    </div>
                </NoBannerLayout>
        )
        }

        return main;
    }

}