import React from 'react';
import StorageItem from './storageItem/storageItem.js';



export default class OrderList extends React.Component {

  render() {
    var main = (
        <ul className="list-group">
            {this.props.items.map(item => (
                <StorageItem key={item._id} item={item}/>
            ))}
        </ul>
    )
        
    return(main)
  }
} 