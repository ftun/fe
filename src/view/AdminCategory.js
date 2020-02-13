import React from 'react';
import { Link } from 'react-router-dom';
import GridView from '../components/GridView';

const MakeRequest = require('../helpers/MakeRequest');

export default class AdminCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            listUnit : {}
        };
    }

    /**
    * configiracion de las columnas del GridView
    * @return array
    */
    getConfigColums() {
        return [
            { attribute: 'iddef_unidad_negocio', alias: 'Unidad Negocio', value : data => {
                return this.state.listUnit.hasOwnProperty(data.iddef_unidad_negocio) ? this.state.listUnit[data.iddef_unidad_negocio] : '';
            }},
            { attribute: 'descripcion', alias: 'Descripcion' },
            { attribute: 'estado', alias: 'Estado', value : data => data.estado == 1 ? 'Active' : ';Inactive' },
        ];
    }

    /**
    * Se obtienen los datos del API al montar el componente
    * @return mixed
    */
    componentDidMount() {
        this.getListBusinessUnit();
    }

    /**
    * se obtiene datos del catalogo de categorias
    */
    getDataCategory() {
        MakeRequest({
            method: 'get',
            url: 'categoria/search',
        }).then(response => {
            this.setState({
                data : response.data
            });
        });
    }

    /**
    * se lista aosicativa de las unidades de negocio
    */
    getListBusinessUnit() {
        MakeRequest({
            method: 'get',
            url: 'unidadNegocio/list',
        }).then(response => {
            this.setState({
                listUnit : response.data
            }, () => this.getDataCategory());
        });
    }

    render() {
        return <GridView columns={this.getConfigColums()} data={this.state.data} />
    }
}
