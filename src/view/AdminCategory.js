import React from 'react';
import { Link } from 'react-router-dom';
import GridView from '../components/GridView';

const MakeRequest = require('../helpers/MakeRequest');
const Util = require('../helpers/Util');

export default class AdminCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            listUnit : {},
            listCategorys : {},
        };

        this.postCreate = this.postCreate.bind(this);
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
            { attribute: 'iddef_categoria_padre', alias: 'Categoria', value : data => {
                return this.state.listCategorys.hasOwnProperty(data.iddef_categoria_padre) ?
                    this.state.listCategorys[data.iddef_categoria_padre] :
                    this.state.listCategorys[data.iddef_categoria]
                    ;
            }},
            { attribute: 'descripcion', alias: 'Sub Categoria' },
            { attribute: 'estado', alias: 'Estado', value : data => data.estado == 1 ? 'Active' : 'Inactive' },
        ];
    }

    /**
    * Se obtienen los datos del API al montar el componente
    * @return mixed
    */
    componentDidMount() {
        this.getListCatalogs();
        window.M.Modal.init(document.querySelectorAll('.modal'));
    }

    /**
    * se obtiene datos del catalogo de categorias
    */
    getDataCategory() {
        MakeRequest({
            method: 'get',
            url: 'categoria/search',
        }).then(response => {
            if (response.error) return null;
            this.setState({
                data : response.data
            });
        });
    }

    /**
    * se lista aosicativa de las unidades de negocio
    */
    async getListCatalogs() {
        var listUnit = await MakeRequest({
            method: 'get',
            url: 'unidadNegocio/list',
        });
        var listCategorys = await MakeRequest({
            method: 'get',
            url: 'categoria/list',
        });

        return this.setState({
                listUnit : listUnit.error ? {} : listUnit.data,
                listCategorys : listCategorys.error ? {} : listCategorys.data,
        }, () => {
            window.M.FormSelect.init(document.querySelectorAll('select'));
            this.getDataCategory()});
    }

    postCreate(e) {
        e.preventDefault();
        let data = Util.getDataElementsForm(e.target, false);

        MakeRequest({
            method: 'post',
            url: 'categoria/post',
            data : data
        }).then(response => {
            if (response.error) {
                return Util.getMsnDialog('danger', Util.getModelErrorMessages(response.message));
            }

            this.getListCatalogs();
            return  Util.getMsnDialog('success', 'Ok!');
        });
    }

    render() {
        const { listUnit, listCategorys } = this.state;

        return <div className="row">
            <div className="col s12 m12 right-align">
                <a className="waves-effect waves-light btn modal-trigger" href="#modal1"><i className="material-icons left">add</i>Category</a>
            </div>
            <div className="col s12 m12">
                <GridView columns={this.getConfigColums()} data={this.state.data} />
            </div>
            <div id="modal1" className="modal">
                <div className="modal-content">
                    <h4>Category</h4>
                        <div className="row">
                            <form className="col s12" onSubmit={this.postCreate}>
                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <select id="iddef_unidad_negocio" name="iddef_unidad_negocio">
                                            <option value="" >Select...</option>
                                            {Object.keys(listUnit).map(row => {
                                                return <option key={row} value={row}>{listUnit[row]}</option>;
                                            })}
                                        </select>
                                        <label htmlFor="iddef_unidad_negocio">Unit</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <select id="iddef_categoria_padre" name="iddef_categoria_padre">
                                            <option value="" >Select...</option>
                                            {Object.keys(listCategorys).map(row => {
                                                return <option key={row} value={row}>{listCategorys[row]}</option>;
                                            })}
                                        </select>
                                        <label htmlFor="iddef_categoria_padre">Category</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input id="descripcion" name="descripcion" type="text" className="validate" />
                                        <label htmlFor="descripcion">First Name</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <div className="switch">
                                        <label>
                                          Off
                                          <input type="checkbox" id="estado" name="estado"/>
                                          <span className="lever"></span>
                                          On
                                        </label>
                                      </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12 m12 right-align">
                                        <button className="btn waves-effect waves-light" type="submit">Submit
                                            <i className="material-icons right">send</i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                      </div>
                </div>
            </div>
        </div>;
    }
}
