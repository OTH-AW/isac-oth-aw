import React from 'react';
import PrintItem from './printItem/printItem.js';



export default class PrintList extends React.Component {

  render() {
    var printingElements = []
    let waitingElements = []

    this.props.items.forEach(element => {
        if(element.state.id === 1){
            printingElements.push(<PrintItem key={element.workpieceId} item={element}/>)
        }
    })

    this.props.items.forEach(element => {
        if(element.state.id === 0){
            waitingElements.push(<PrintItem key={element.workpieceId} item={element}/>)
        }
    })

    var main = (
        <ul className="list-group">
            {printingElements}
            {waitingElements}  
        </ul>
    )
        
    return(main)
  }
} 