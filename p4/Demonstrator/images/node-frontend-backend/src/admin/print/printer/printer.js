import React from 'react';



export default class Printer extends React.Component {

    getFancyTimeString(timeElement) {
        let date = new Date(0, 0, 0, 0, 0, timeElement)
        let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
        let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
        return `${minutes}:${seconds}`
    }

    renderFancyPrintingTime(current, estimate) {
        let formattedCurrent = this.getFancyTimeString(current)
        let formattedEstimate = this.getFancyTimeString(estimate)
        return `${formattedCurrent} von ${formattedEstimate} Minuten`
    }

    render() {
        var status = ""
        var completion = ""
        var printingTime = ""
        var bgStyle = ""

        if(this.props.items.state.printing === true){
            var timeCurrent
            if (this.props.items.state.time_current === "0"){
                timeCurrent = 0
            } else {
                timeCurrent = this.props.items.state.time_current
            }

            status = "Printing"
            completion = this.props.items.state.completion + "%"

            printingTime = this.renderFancyPrintingTime(timeCurrent, this.props.items.state.time_estimate)
        }else{
            if (this.props.items.base_information.state_online === true){
                status = "Online"
                completion = "Idle"
            }else{
                status = "Offline"
                completion = "--"
            }
            printingTime = `-- von -- Minuten`
        }

        if (this.props.items.base_information.color === "Orange"){
            bgStyle = "bg-warning"
        }else{
            bgStyle = "bg-primary"
        }

        var main = (
            <div className="border">
                <div className={bgStyle}>
                <h3 className="text-center text-light">
                    {this.props.items.base_information.name}
                </h3>
                </div>
                <h1 className="text-center font-weight-bold my-3">
                    {completion}
                </h1>
                <h1 className="text-center mb-2">
                    {status}
                </h1>
                <h4 className="text-center mb-2">
                    {printingTime}
                </h4>
            </div>
            
        )
            
        return(main)
    }
} 