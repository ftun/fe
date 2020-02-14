import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const crudAdmin = [
    {
        name : 'Categorias',
        to : '/category',
        icon : 'apps'
    },
    {
        name : 'Paquete',
        to : '/package',
        icon : 'receipt'
    },
    {
        name : 'Promosiones',
        to : '/promotions',
        icon : 'event'
    },
];

/**
* @author Felipe Tun <felipe.tun.cauich@gmail.com>
*/
class Admin extends React.Component {
    render() {
        return [
        <div className="row">
            <div className="col s12 m12">
                <blockquote>
                    <h3>Administracion</h3>
                </blockquote>
            </div>
        </div>,
        <div className="row">
            {crudAdmin.map((row, index) => {
                return <div key={index + row.name} className="col s12 m4 center" >
                    <Card>
                        <Link to={row.to}><i className="large material-icons black-text">{row.icon}</i></Link>
                        <h4>{row.name}</h4>
                    </Card>
                </div>
            })}
        </div>
        ];
    }
}

export default Admin;
