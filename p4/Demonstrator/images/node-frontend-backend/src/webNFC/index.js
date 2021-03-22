import React from 'react'
import {DefaultLayout} from 'layouts'

export default class WebNFCReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            error: ""
        }

        this.handleChange = this.handleChange.bind(this)
        this.readNFC = this.readNFC.bind(this)
    }

    handleChange(event){
        this.setState({text: event.target.value})
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
                    this.setState({data: JSON.parse(tagData), error: ""})
                } catch {
                    this.setState({data: "", error: ""})  
                }
            });
        } else {
            this.setState({error: "Ihr Gerät oder Browser untersützt kein WebNFC."}) 
        }
    }

    render() {
        var errorMessage = ""
        var orderTable = ""
        var workpieceTable = ""

        if (this.state.error != ""){
        errorMessage = <div className="alert alert-warning">{this.state.error}</div>
        }

        if (Object.keys(this.state.data).length !== 0){
            var place = ""
            if (this.state.data.state.place.faculty === null && this.state.data.state.place.floor === null && this.state.data.state.place.room === null){
                place = "Wird transportiert"
            }else{
                place = this.state.data.state.place.faculty + ", " + this.state.data.state.place.floor + ", " + this.state.data.state.place.room
            }
    
            workpieceTable = (
                <div>
                <p className="mb-2 font-weight-bold">Informationen zum Werkstück</p>
                    <table className="table text-left">
                        <thead>
                            <tr>
                                <th scope="col">Feld</th>
                                <th scope="col">Wert</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Werkstück ID</td>
                                <td>{this.state.data.workpieceId}</td>
                            </tr>
                            <tr>
                                <td>Ort</td>
                                <td>{place}</td>
                            </tr>
                            <tr>
                                <td>Nachricht</td>
                                <td>{this.state.data.state.message}</td>
                            </tr>
                            <tr className="invisible">
                                <td>Damit beide Reihen</td>
                                <td>immer übereinstimmten test test tes tes tes tes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
            
            
            if(this.state.data.hasOwnProperty('order')){
                var kunde = this.state.data.order.customer.name + " " + this.state.data.order.customer.firstname
                var ort = this.state.data.order.customer.ort + ", " + this.state.data.order.customer.address
    
                orderTable = (
                    <div>
                        <p className="mb-2 font-weight-bold">Informationen zur Bestellung</p>
                        <div className="table-responsive">
                            <table className="table text-left">
                                <thead>
                                    <tr>
                                        <th scope="col">Feld</th>
                                        <th scope="col">Wert</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Kunde</td>
                                        <td>{kunde}</td>
                                    </tr>
                                    <tr>
                                        <td>Ort</td>
                                        <td>{ort}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>{this.state.data.order.customer.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Nummer</td>
                                        <td>{this.state.data.order.number}</td>
                                    </tr>
                                    <tr className="invisible">
                                        <td>Damit beide Reihen</td>
                                        <td>immer übereinstimmten test test tes tes tes tes</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )    
            }    
        }
        var main = (
                <DefaultLayout title="WebNFC">
                    <div className="col-12 mt-3 mb-5 text-center">
                        <p>
                            Sie können mit Hilfe von WebNFC die Daten eines Werkstücks anzeigen lassen. Dafür müssen Sie diese Seite mit einem Android Smartphone
                            und dem Chrome Browser ansteuern. Zustätzlich müssen Sie auch die "Experimental Web Platform features" Flag aktiv haben. Dann klicken sie auf
                            "Tag auslesen" und halten Sie das Werkstück an ihr Smartphone.
                        </p>
                        {errorMessage}
                        <button className="btn btn-outline-primary btn-isac-primary btn-lg btn-block" onClick={this.readNFC}>
                            Tag auslesen
                        </button>
                        <br/>
                        <br/>
                        {workpieceTable}
                        {orderTable}
                    </div>
                </DefaultLayout>
        )

        return main;
    }

}