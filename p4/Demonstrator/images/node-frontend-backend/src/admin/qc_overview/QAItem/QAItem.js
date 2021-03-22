import React from 'react';
import FA from 'react-fontawesome';
import '../overviewTP3.css'

export default class QAItem extends React.Component {

  render() {
    let color
    let form
    let startDate
    let endDate

    let formSoll
    let formIst

    let colorIst = ""

    let functionIst = ""

    if(this.props.item.state.controlProcesses[this.props.item.state.controlProcesses.length - 1].controlStartingTime !== null){
        startDate = "Prüfungsbeginn: " + new Date(this.props.item.state.controlProcesses[this.props.item.state.controlProcesses.length - 1].controlStartingTime).toLocaleString();
    } else {
        startDate = "Kein Standort eingetragen"
    }

    if(this.props.item.state.controlProcesses[this.props.item.state.controlProcesses.length - 1].controlCompletionTime !== null){
        endDate = "Prüfungsende: " + new Date(this.props.item.state.controlProcesses[this.props.item.state.controlProcesses.length - 1].controlCompletionTime).toLocaleString();
    } else {
        endDate = "Kein Standort eingetragen"
    }

    switch(this.props.item.color.toValue) {
        case "Orange":
            color = "orange"
            break;
        case "Blau":
            color = "blue"
            break;
        default:
            console.log("error")
    }

    switch(this.props.item.shape.toValue) {
        case "Kreis":
            form = (
                <div>
                    <FA name="circle" size="2x" style={{"color":color}}/>
                </div>
            )
            break;
        case "Viereck":
            form = (
                <div>
                    <FA name="square" size="2x" style={{"color":color}}/>
                </div>
            )
            break;
        case "Dreieck":
            form = (
                <div>
                    <FA name="play" className="fa-rotate-270" size="2x" style={{"color":color}}/>
                </div>
            )
            break;
        default:
            form = (
                <div>
                    <FA name="question-circle"  size="2x" style={{"color":color}}/>
                </div>
            )
    }

    switch(this.props.item.shape.toValue) {
        case "Kreis":
            formSoll = (
                <div>
                    <FA name="circle" className="float-left iconSize" size="2x"/>
                </div>
            )
            break;
        case "Viereck":
            formSoll = (
                <div>
                    <FA name="square" className="float-left iconSize" size="2x"/>
                </div>
            )
            break;
        case "Dreieck":
            formSoll = (
                <div>
                    <FA name="play" className="fa-rotate-270 float-left iconSize" size="2x"/>
                </div>
            )
            break;
        default:
            formSoll = (
                <div>
                    <FA name="question-circle" className="float-left iconSize" size="2x"/>
                </div>
            )
    }

    if(this.props.item.state.controlProcesses[this.props.item.state.controlProcesses.length - 1].shape !== null){
        switch(this.props.item.shape.actualValue) {
            case "Kreis":
                formIst = (
                    <div>
                        <FA name="circle" className="float-left iconSize" size="2x"/>
                    </div>
                )
                break;
            case "Viereck":
                formIst = (
                    <div>
                        <FA name="square" className="float-left iconSize" size="2x"/>
                    </div>
                )
                break;
            case "Dreieck":
                formIst = (
                    <div>
                        <FA name="play" className="fa-rotate-270 float-left iconSize" size="2x"/>
                    </div>
                )
                break;
            default:
                formIst = (
                    <div>
                        <FA name="question-circle" className="float-left iconSize" size="2x"/>
                    </div>
                )
        }
    }

    if(this.props.item.state.controlProcesses[this.props.item.state.controlProcesses.length - 1].color !== null){
        switch(this.props.item.color.actualValue) {
            case "Orange":
                colorIst = <FA className="float-left iconSize" name="paint-brush"  size="2x" style={{"color":"orange"}}/>
                break;
            case "Blau":
                colorIst = <FA className="float-left iconSize" name="paint-brush"  size="2x" style={{"color":"blue"}}/>
                break;
            default:
                console.log("error")
        }
    }

    if(this.props.item.state.controlProcesses[this.props.item.state.controlProcesses.length - 1].function === true){
        functionIst = <FA className="float-left iconSize" name="check"  size="2x" style={{"color":"green"}}/>
    }

    var main = (
        <div className="card">
            <div className="card-header p-0 container" id={this.props.item.workpieceId + "headingOne"}>
                <div className="row" style={{height: '50px'}}>
                    <div className="col-2">
                        <div className="bg-warning h-100" style={{width: '30px'}}>
        
                        </div>
                    </div>
                    <div className="col-4 col-sm-4 col-md-2 my-auto">
                        {form}
                    </div>
                    <div className="col-4 col-sm-5 my-auto text-left">             
                        <p className="mb-0">
                            {this.props.item.workpieceId}
                        </p>
                    </div>
                    <div className="col-2 col-sm-1 col-md-3 my-auto float-right">
                        <h5 className="test collapsed float-right m-0 p-0 mr-2" data-toggle="collapse" data-target={"#" + this.props.item.workpieceId +"collapseOne"} aria-expanded="false" aria-controls={this.props.item.workpieceId +"collapseOne"}> </h5>
                    </div>
                </div>        
            </div>
            <div id={this.props.item.workpieceId +"collapseOne"} className="collapse" aria-labelledby={this.props.item.workpieceId + "headingOne"} data-parent="#accordion">
                <div className="card-body p-0 py-4 container">
                    <div className="row mb-4">
                        <div className="col-2"></div>
                        <div className="col-4 col-sm-4 col-md-2 my-auto text-center">
                            <FA name="clock-o" size="2x"/>
                        </div>
                        <div className="col-5 my-auto">
                            <p className="m-0 mb-1">{startDate}</p>
                            <p className="m-0">{endDate}</p>
                        </div> 
                        <div className="col-1 col-sm-1 col-md-3 my-auto  my-auto">

                        </div>        
                    </div>
                    <div className="row mb-4">
                        <div className="col-2"></div>
                        <div className="col-4 col-sm-4 col-md-2 my-auto text-center">
                            <FA name="clipboard"  size="2x"/>
                        </div>
                        <div className="col-4 my-auto">
                            <p className="m-0">{this.props.item.state.message}</p>
                        </div>         
                    </div>
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-4 col-sm-4 col-md-2 my-auto text-center">
                            <FA name="search"  size="2x"/>
                        </div>
                        <div className="col-4 my-auto">
                            <table>
                                <tbody>
                                <tr style={{'borderBottom':'1px solid black'}}>
                                    <td className="pr-2"><h5 className="respHeader">Soll</h5></td>
                                    <td className="pr-2">{formSoll}</td>
                                    <td className="pr-2"><FA className="float-left iconSize" name="paint-brush"  size="2x" style={{"color":color}}/></td>
                                    <td><FA className="float-left iconSize" name="check"  size="2x" style={{"color":"green"}}/></td>
                                </tr>
                                <tr>
                                    <td className="mr-1"><h5 className="respHeader">Ist</h5></td>
                                    <td className="mr-1">{formIst}</td>
                                    <td className="mr-1">{colorIst}</td>
                                    <td>{functionIst}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>         
                    </div>
                </div>
            </div>
        </div>
    )
 return main
  }
}  