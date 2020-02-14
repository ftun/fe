import React from 'react';

/**
* @author Felipe Tun <felipe.tun.cauich@gmail.com>
* Componente Card
*/
const Card = (props) => {
    return <div className="row">
        <div className="col s12 m12">
            <div className="card-panel">
                <span>
                    {props.children}
                </span>
          </div>
        </div>
    </div>
};

export default Card;
