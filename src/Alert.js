import React from 'react'

export default function Alert(props) {
  return <div className={`alert alert-${props.type} alert-dismissible`} role="alert">
    <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    {props.children}
  </div>
}
