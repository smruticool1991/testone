
import React, { forwardRef } from "react";
import { useEffect } from "react";
// import ThermalPrinterEncoder from "thermal-printer-encoder";
//let ThermalPrinterEncoder = require('thermal-printer-encoder')
//import ThermalPrinterEncoder from "thermal-printer-encoder";
const Invoice = (props, ref) => {
    useEffect(()=>{
       console.log("invoice1", props)
    },[])
    const date = new Date()
  return (
    <>
    {props.content ? 
      (<div className="container bootdey mt-5 bg-white mx-auto" style={{width: '100%', height: window.innerHeight}}>
        <div className="row invoice row-printable">
          <div className="col-md-12">
            <div className="panel panel-default plain" id="dash_0">
              <div className="panel-body p30">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="invoice-logo">
                       KRISPY CHICKEN
                      {/* <img src="https://krispychicken.co/image/logo/logo.png" height="60px"/> */}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="invoice-from">
                      <ul className="list-unstyled text-right">
                        <li>KRISPY Chicken</li>
                        <li>G-01, Raghunath city Mall, Maal road, Almora</li>
                        <li>Uttarakhand 263601</li>
                        <li>GSTIN:- 05CLEPA7900C1ZT</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="invoice-details mt25">
                      <div className="well">
                        <ul className="list-unstyled mb0">
                          <li>
                            {/* <strong>Invoice</strong> #{props.content.id} */}
                          </li>
                          <li>
                            <strong>Invoice Date:</strong> {props.content.created_at}
                          </li>
                          <li>
                            <strong>Status:</strong>{" "}
                            <span className="label label-danger">PAID</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="invoice-to mt25">
                      <ul className="list-unstyled">
                        <li>
                          <strong>Invoiced To</strong>
                        </li>
                        <li>{props.content.customer_name}</li>
                        <li>{props.content.customer_number}</li>
                      </ul>
                    </div>
                    <div className="invoice-items">
                      <div
                        className="table-responsive"
                        style={{overflow: 'hidden', outline: 'none'}}
                        tabindex="0"
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th className="per70 text-center">Items</th>
                              <th className="per5 text-center">Price</th>
                              <th className="per5 text-center">Qty</th>
                              <th className="per25 text-center">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {JSON.parse(props.content.items).map((item)=>                            
                            (<tr key={item.id}>
                              <td>
                                {item.product_name}
                              </td>
                              <th className="per5 text-center">Rs {item.price}</th>
                              <td className="text-center">{item.quantity}</td>
                              <td className="text-center">Rs {(item.price * item.quantity).toFixed(2)}</td>
                            </tr>)
                            )}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th colSpan="3" className="text-right">
                                Sub Total:
                              </th>
                              <th className="text-center">Rs {(props.content.total).toFixed(2)}</th>
                            </tr>
                            <tr>
                              <th colSpan="3" className="text-right">
                                2.5% CGST:
                              </th>
                              <th className="text-center">Rs {((props.content.total * 2.5)/100).toFixed(2)}</th>
                            </tr>
                            <tr>
                              <th colSpan="3" className="text-right">
                                2.5% SGST:
                              </th>
                              <th className="text-center">Rs {((props.content.total * 2.5)/100).toFixed(2)}</th>
                            </tr>
                            <tr>
                              <th colspan="3" className="text-right">
                                Total:
                              </th>
                              <th className="text-center">Rs {props.content.total_cost}</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    <div className="invoice-footer mt25">
                      <p className="text-center">
                        Generated on {`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>): null}
    </>
  );
};
export default forwardRef(Invoice)
