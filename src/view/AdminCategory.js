import React from 'react';
import { Link } from 'react-router-dom';
import GridView from '../components/GridView';
import Activities from './Activities';

const MakeRequest = require('../helpers/MakeRequest');
const Util = require('../helpers/Util');

/**
* @author Felipe Tun <felipe.tun.cauich@gmail.com>
*/
export default class AdminCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            listUnit : {},
            listCategorys : {},
        };

        this.idModal = Util.uniqueID();
        this.idForm = Util.uniqueID();
        this.submitForm = this.submitForm.bind(this);
        this.getCreate = this.getCreate.bind(this);
    }

    /**
    * Se obtienen los datos del API al montar el componente
    * @return mixed
    */
    componentDidMount() {
        this.getListCatalogs();
        window.M.Modal.init(document.getElementById(this.idModal));
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
            { attribute: 'descripcion', alias: 'Sub Categoria', value : data => {
                return data.iddef_categoria_padre == 0 ? '' : data.descripcion;
            }},
            { attribute: 'estado', alias: 'Estado', value : data => data.estado == 1 ? 'Active' : 'Inactive' },
            { alias : 'Edit', value : (data, index) => {
                return <a className="modal-trigger" href={'#' + this.idModal} data-index={index} onClick={e => this.getEdit(data)}><i className="material-icons left">edit</i></a>
            }},
            { alias: "Activities", icon : 'local_activity', expand : this.getExpandActivities},
        ];
    }

    /**
    * Contenido del expand de la columna
    * @param array
    * @return object <element>
    */
    getExpandActivities(data) {
        if (data.estado == 0) {
            Util.getMsnDialog('warning', 'Inacive Record');
            return null;
        }

        return <Activities category={data}/>;
    }

    /**
    * Edicion de un resgitros del grid
    * @param array
    * @return mixed
    */
    getEdit(data) {
        this.url = 'put/' + data.iddef_categoria;
        Util.setDataForm(data, document.getElementById(this.idForm));
        return window.M.FormSelect.init(document.querySelectorAll('select'));
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

    /**
    * Se envian los datos del formulario al API
    * @param Object <element>
    * @return mixed
    */
    submitForm(e) {
        e.preventDefault();
        let data = Util.getDataElementsForm(e.target, false);

        MakeRequest({
            method: this.url == 'post' ? this.url : 'put',
            url: 'categoria/' + this.url,
            data : data
        }).then(response => {
            if (response === null) {
                this.getListCatalogs();
                return Util.getMsnDialog('success', 'Updated');
            }

            if (response.error) {
                return Util.getMsnDialog('danger', Util.getModelErrorMessages(response.message));
            }

            this.getListCatalogs();
            return  Util.getMsnDialog('success', 'Created');
        });
    }

    /**
    * Reset parametros para la creacion de la vista
    */
    getCreate() {
        document.getElementById(this.idForm).reset();
        this.url = 'post';
    }

    render() {
        const { listUnit, listCategorys } = this.state;

        return <div className="row">
            <div className="col s12 m12 right-align">
                <a className="waves-effect waves-light btn modal-trigger" href={'#' + this.idModal} onClick={this.getCreate}><i className="material-icons left">add</i>Category</a>
            </div>
            <div className="col s12 m12">
                <GridView columns={this.getConfigColums()} data={this.state.data} />
            </div>
            <div id={this.idModal} className="modal">
                <div className="modal-content">
                    <h4>Category</h4>
                    <div className="row">
                        <form id={this.idForm} className="col s12" onSubmit={this.submitForm}>
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
                                        <option value="0" >N/A</option>
                                        {Object.keys(listCategorys).map(row => {
                                            return <option key={row} value={row}>{listCategorys[row]}</option>;
                                        })}
                                    </select>
                                    <label htmlFor="iddef_categoria_padre">Category</label>
                                </div>
                                <div className="input-field col s12 m6">
                                    <input id="descripcion" name="descripcion" type="text" className="validate" />
                                    <label htmlFor="descripcion">Description</label>
                                </div>
                                <div className="input-field col s12 m6">
                                    <div className="switch">
                                    <label>
                                      Off
                                      <input type="checkbox" id="estado" name="estado" defaultChecked={true}/>
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
