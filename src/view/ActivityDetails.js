import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const MakeRequest = require('../helpers/MakeRequest');
const Util = require('../helpers/Util');

export default class ActivityDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : {},
            restrictions : [],
            schedule : [],
        };

        this.id = this.props.id || this.props.match.params.id;
        this.visible = this.props.visible == undefined ? '' : 'hide';
        this.urlApi = '';
        this.methodApi = '';
        this.idModal = Util.uniqueID();
        this.idForm = Util.uniqueID();
        this.submitForm = this.submitForm.bind(this);
    }

    /**
    * Inicializacion al momento de montar el componente
    */
    componentDidMount() {
        this.getData();
        window.M.Modal.init(document.getElementById(this.idModal));
    }

    /**
    * Se realiza peticiones al API para obtener informacion
    */
    getData() {
        MakeRequest({
            method: 'get',
            url: 'actividad/byId/' + this.id,
        }).then(response => {
            if (!response.error) {
                this.setState({ data : response.data });
                this.getRestrictionsAndSchedule();
            }
        });
    }

    /**
    * Se obtienen las restricciones y horarios de la actividad
    * @return mixed
    */
    async getRestrictionsAndSchedule() {
        let restrictions = await MakeRequest({ method: 'get', url: 'restriccion/byActivity/' + this.id });
        let schedule = await MakeRequest({ method: 'get', url: 'horario/byActivity/' + this.id });
        this.setState({
            restrictions : restrictions.error ? [] : restrictions.data,
            schedule : schedule.error ? [] : schedule.data,
        });
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
            method: this.methodApi,
            url: this.urlApi,
            data : data
        }).then(response => {
            if (response === null) {
                this.getRestrictionsAndSchedule();
                return Util.getMsnDialog('success', 'Updated');
            }

            if (response.error) {
                return Util.getMsnDialog('danger', Util.getModelErrorMessages(response.message));
            }

            this.getRestrictionsAndSchedule();
            return  Util.getMsnDialog('success', 'Created');
        });
    }

    /**
    * Creacion de los horarios y restricciones
    * @param string
    * @return mixed
    */
    createItem(tipo) {
        this.urlApi = '';
        this.methodApi = 'post';
        if (tipo == 'schedule')  this.urlApi = 'horario/post';
        if (tipo == 'restrictions')  this.urlApi = 'restriccion/post';

        document.getElementById(this.idForm).reset();
        window.M.updateTextFields();
    }

    /**
    * Edicion de los horarios y restricciones
    */
    editItem(id, data, tipo) {
        this.urlApi = '';
        this.methodApi = 'put';
        if (tipo == 'schedule')  this.urlApi = 'horario/put/' + id;
        if (tipo == 'restrictions')  this.urlApi = 'restriccion/put/' + id;

        Util.setDataForm(data, document.getElementById(this.idForm));
        window.M.updateTextFields();
    }

    render() {
        const { data, restrictions, schedule } = this.state,
            exist = Object.keys(data).length
        ;

        return <div className="row">
            <div className={'col s12 m12 ' + this.visible}>
                <Link to={'/category'} className="waves-effect waves-light btn"><i className="material-icons left">arrow_back</i></Link>
                <h4>Actividad: {exist ? data.descripcion : 'No Encontrada'}</h4>
            </div>
            <div className="col s12 m6">
                <ul className="collection with-header">
                    <li className="collection-header">
                        <b>Horarios</b>
                        <a className={"modal-trigger " + this.visible} href={'#' + this.idModal} onClick={e => this.createItem('schedule')}><i className="material-icons left">add</i></a>
                    </li>
                    {schedule.map((row, i) => {
                        return <li key={i} className="collection-item">
                                    <div>{row.descripcion + ' - ' + (row.estado == 1 ? 'Activo' : 'Inactivo')}
                                    <a className={"secondary-content modal-trigger " + this.visible} href={'#' + this.idModal} onClick={e => this.editItem(row.iddef_horario, row, 'schedule')}><i className="material-icons">edit</i></a>
                                </div>
                            </li>;
                    })}
                </ul>
            </div>
            <div className="col s12 m6">
                <ul className="collection with-header">
                    <li className="collection-header">
                        <b>Restricciones</b>
                        <a className={"modal-trigger " + this.visible} href={'#' + this.idModal} onClick={e => this.createItem('restrictions')}><i className="material-icons left">add</i></a>
                    </li>
                    {restrictions.map((row, i) => {
                        return <li key={i} className="collection-item">
                                    <div>{row.descripcion + ' - ' + (row.estado == 1 ? 'Activo' : 'Inactivo')}
                                        <a className={"secondary-content modal-trigger " + this.visible} href={'#' + this.idModal} onClick={e => this.editItem(row.iddef_restriccion, row, 'restrictions')}><i className="material-icons">edit</i></a>
                                    </div>
                                </li>;
                    })}
                </ul>
            </div>

            <div id={this.idModal} className="modal">
                <div className="modal-content">
                    <div className="row">
                        <form id={this.idForm} className="col s12" onSubmit={this.submitForm}>
                            <input id="iddef_actividad" name="iddef_actividad" type="hidden" value={this.id} />
                            <input id="estado" name="estado" type="hidden" value={1} />
                            <div className="row">
                                <div className="input-field col s12 m6">
                                    <input name="descripcion" id="descripcion" type="text" className="validate" />
                                    <label htmlFor="descripcion">Description</label>
                                </div>
                                <div className="input-field col s12 m6">
                                    <div className="switch">
                                        <label>
                                          Off
                                          <input type="checkbox" name="estado" id="estado" defaultChecked={true}/>
                                          <span className="lever"></span>
                                          On
                                        </label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12 m12 right-align">
                                        <button className="btn waves-effect waves-light" type="submit">Submit
                                            <i className="material-icons right">send</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                  </div>
                </div>
            </div>
        </div>;
    }
}
