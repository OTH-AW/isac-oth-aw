import React from 'react'
import {NoBannerLayout} from 'layouts' 

export default class Controlpis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            color: null,
            shape: null,
            // Verfügbare Werkstücke
            printedWst: [],
            qcEntryWst: [],
            qcExitWst: [],
            storeWst: [],
            scanOutsourceWst: [],
            pickupWst: [],
            // Ausgewählte Werkstücke
            selectedPrintedWst: null,
            selectedQcEntryWst: null,
            selectedQcExitWst: null,
            selectedStoreWst: null,
            selectedScanOutsourceWst: null,
            selectedPickupWst: null,
        }

        this.updatePrintedWst = this.updatePrintedWst.bind(this);
        this.updateQcEntryWst = this.updateQcEntryWst.bind(this);
        this.updateQcExitWst = this.updateQcExitWst.bind(this);
        this.updateStoreWst = this.updateStoreWst.bind(this);
        this.updateScanOutsourceWst = this.updateScanOutsourceWst.bind(this);
        this.updatePickupWst = this.updatePickupWst.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.form = React.createRef();

        this.backendURL = window.backendURL;
    }

    componentDidMount() {
        fetch(this.backendURL + "/workpiece")
        .then(res => res.json())
        .then((data) => {
            data.forEach(wst => {
                if (wst.state.id === 0) {
                    // Man könnte hier zwar die Werkstücke ausgeben, die API
                    // erwartet hier aber nur Blau / Orange
                    if (this.state.printedWst.length === 0) {
                        this.state.printedWst.push("blau")
                        this.state.printedWst.push("orange")
                    }
                } else if (
                    wst.state.id === 0
                    || wst.state.id === 2
                    || wst.state.id === 6) {
                        this.state.qcEntryWst.push(wst)
                } else if (
                    wst.state.id === 3
                    || wst.state.id === 7) {
                        this.state.qcExitWst.push(wst)
                } else if (
                    wst.state.id === 4) {
                        this.state.storeWst.push(wst)
                } else if (
                    wst.state.id === 5) {
                        this.state.scanOutsourceWst.push(wst)
                } else if (
                    wst.state.id === 8) {
                        this.state.pickupWst.push(wst)
                }
            })
            this.forceUpdate()
        })
        .catch(console.log)
    }

    updatePrintedWst(e) {
        this.setState({
            selectedPrintedWst: e.target.value,
        })
    }

    updateQcEntryWst(e) {
        this.setState({
            selectedQcEntryWst: e.target.value,
        })
    }

    updateQcExitWst(e) {
        this.setState({
            selectedQcExitWst: e.target.value,
        })
    }

    updateStoreWst(e) {
        this.setState({
            selectedStoreWst: e.target.value,
        })
    }

    updateScanOutsourceWst(e) {
        this.setState({
            selectedScanOutsourceWst: e.target.value,
        })
    }

    updatePickupWst(e) {
        this.setState({
            selectedPickupWst: e.target.value,
        })
    }
    

    handleSubmit(event) {
        let submitAction = event.target.children[0].id
        

        if (submitAction === "submitPrintedWst") {
            if (this.state.selectedPrintedWst !== null) {
                console.log(this.state.selectedPrintedWst)

                window.open(`${this.backendURL}/pi/printed-wst?color=${encodeURIComponent(this.state.selectedPrintedWst)}`, '_blank')
            }
        } else if (submitAction === "submitQcEntryWst") {
            if (this.state.selectedQcEntryWst !== null) {
                console.log(this.state.selectedQcEntryWst)

                window.open(`${this.backendURL}/pi/qc-entry-wst?workpieceId=${encodeURIComponent(this.state.selectedQcEntryWst)}`, '_blank')
            }
        } else if (submitAction === "submitQcExitWst") {
            if (this.state.selectedQcExitWst !== null) {
                console.log(this.state.selectedQcExitWst)

                window.open(`${this.backendURL}/pi/qc-exit-wst?workpieceId=${encodeURIComponent(this.state.selectedQcExitWst)}`, '_blank')
            }
        } else if (submitAction === "submitStoreWst") {
            if (this.state.selectedStoreWst !== null) {
                console.log(this.state.selectedStoreWst)

                window.open(`${this.backendURL}/pi/store-wst?workpieceId=${encodeURIComponent(this.state.selectedStoreWst)}`, '_blank')
            }
        } else if (submitAction === "submitScanOutsourceWst") {
            if (this.state.selectedScanOutsourceWst !== null) {
                console.log(this.state.selectedScanOutsourceWst)

                window.open(`${this.backendURL}/pi/scan-outsource-wst?workpieceId=${encodeURIComponent(this.state.selectedScanOutsourceWst)}`, '_blank')
            }
        } else if (submitAction === "submitPickupWst") {
            if (this.state.selectedPickupWst !== null) {
                console.log(this.state.selectedPickupWst)

                window.open(`${this.backendURL}/pi/pickup-wst?workpieceId=${encodeURIComponent(this.state.selectedPickupWst)}`, '_blank')
            }
        }

        event.preventDefault();
    }

    renderSelectItems(list) {
        let items = [];

        items.push(<option key="blank" value="blank">Werkstück auswählen</option>)

        list.forEach(wst => {
            let id = wst.workpieceId
            items.push(<option key={id} value={id}>{id}</option>);
        })

        return items;
    }

    renderSubmitButton(action, label) {
        let renderLabel = "Aktion durchführen"
        if (typeof(label) !== "undefined") {
            renderLabel = label;
        }

        return (
        <form ref={this.form} className="btn-block my-2" onSubmit={this.handleSubmit}>
            <button id={action} className="btn btn-isac-primary btn-lg btn-block pt-2" type="submit">
                {renderLabel}
            </button>
        </form>)
    }

    render() {
        var main = (
            <NoBannerLayout title="Steuerung der Stationen">  
                <div className="col-md-12 mx-1">
                    <div className="alert alert-danger" role="alert">
                        Warnung: Beim manuellen Beschreiben der Datensätze über diese Seite werden nur die Inhalte in der Datenbank aktualisiert. Eventuell physikalisch vorliegende Tags werden dabei nicht aktualisiert. Durch diese Inkonsistenzen kann es beim erneuten Einlesen dieses Datensatzes zu Fehlern kommen. Weiterhin wird hier keine logisch vollständige Prüfung des Workflows des Systems durchgeführt. Diese Seite dient zur reinen Simulation der Erfassung einzelner Werkstücke an einzelnen implementierten Stationen, ohne diese physisch vorliegen haben zu müssen.
                    </div>
                    <div className="col-md-12 mx-1">
                        {/* Drucker */}
                        {/* Abschluss Druck */}
                        <div className="row">
                            <h2>Abschluss Druck</h2>
                        </div>
                        <div className="row">
                            <span>Liefert den zuerst zuletzt gedruckten Datensatz in der Farbe zurück. Rückgabe der Datensätze des gedruckten Werkstückes. Wenn kein Datensatz zurückgeliefert wird, dann war keiner in Druck.</span>
                        </div>

                        <select className="custom-select d-block w-100 mt-2" id="selectPrintedWst" name="selectPrintedWst" onChange={this.updatePrintedWst}>
                            <option value="blank">Gedruckte Farbe auswählen</option>
                            <option key="blue" value="blue">Blau</option>
                            <option key="orange" value="orange">Orange</option>
                        </select>

                        { this.renderSubmitButton("submitPrintedWst", "Werkstück nach Druckabschluss erfassen") }

                        {/* Qualitätskontrolle */}
                        {/* Eingang */}
                        <div className="row">
                            <h2>Eingang eines Werkstücks bei der Qualitätskontrolle</h2>
                        </div>
                        <div className="row">
                            <span>Liefert den Datensatz zurück, der bei der Qualitätskontrolle angekommen ist.</span>
                        </div>

                        <select className="custom-select d-block w-100 mt-2" id="qcEntryWst" name="qcEntryWst" onChange={this.updateQcEntryWst}>
                            {
                                this.renderSelectItems(this.state.qcEntryWst)
                            }
                        </select>

                        { this.renderSubmitButton("submitQcEntryWst", "Prüfung starten") }

                        {/* Qualitätskontrolle */}
                        {/* Ausgang */}
                        <div className="row">
                            <h2>Ausgang eines Werkstücks bei der Qualitätskontrolle</h2>
                        </div>
                        <div className="row">
                            <span>Liefert den Datensatz zurück, der durch die Qualitätskontrolle gelaufen ist.</span>
                        </div>

                        <select className="custom-select d-block w-100 mt-2" id="qcExitWst" name="qcExitWst" onChange={this.updateQcExitWst}>
                            {
                                this.renderSelectItems(this.state.qcExitWst)
                            }
                        </select>

                        { this.renderSubmitButton("submitQcExitWst", "Prüfung abschließen") }

                        {/* Lager */}
                        {/* Einlagern */}
                        <div className="row">
                            <h2>Einlagern eines Werkstücks</h2>
                        </div>
                        <div className="row">
                            <span>Liefert den Datensatz zurück, der eingelagert wird.</span>
                        </div>

                        <select className="custom-select d-block w-100 mt-2" id="storeWst" name="storeWst" onChange={this.updateStoreWst}>
                            {
                                this.renderSelectItems(this.state.storeWst)
                            }
                        </select>

                        { this.renderSubmitButton("submitStoreWst", "Werkstück einlagern") }

                        {/* Lager */}
                        {/* Auslagern */}
                        <div className="row">
                            <h2>Auslagern eines Werkstücks</h2>
                        </div>
                        <div className="row">
                            <span>Liefert den Datensatz zurück, der ausgelagert wird.</span>
                        </div>

                        <select className="custom-select d-block w-100 mt-2" id="scanOutsourceWst" name="scanOutsourceWst" onChange={this.updateScanOutsourceWst}>
                            {
                                this.renderSelectItems(this.state.scanOutsourceWst)
                            }
                        </select>

                        { this.renderSubmitButton("submitScanOutsourceWst", "Werkstück auslagern") }

                        {/* Abholstation */}
                        {/* Auslagern */}
                        <div className="row">
                            <h2>Werkstück liegt zur Abholung bereit</h2>
                        </div>
                        <div className="row">
                            <span>Teilt mit, dass das Werkstück an der Abholstation angelangt ist.</span>
                        </div>

                        <select className="custom-select d-block w-100 mt-2" id="pickupWst" name="pickupWst" onChange={this.updatePickupWst}>
                            {
                                this.renderSelectItems(this.state.pickupWst)
                            }
                        </select>

                        { this.renderSubmitButton("submitPickupWst", "Werkstück bei Abholstation erfassen") }
                    </div>
                </div>
            </NoBannerLayout>
        )

        return main;
    }
}