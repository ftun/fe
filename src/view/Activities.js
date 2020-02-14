import React from 'react';
import { Link } from 'react-router-dom';
import GridView from '../components/GridView';
import Card from '../components/Card';

const MakeRequest = require('../helpers/MakeRequest');
const Util = require('../helpers/Util');

/**
* @author Felipe Tun <felipe.tun.cauich@gmail.com>
*/
export default class Activities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
        };

        this.idModal = Util.uniqueID();
        this.submitForm = this.submitForm.bind(this);
    }

    /**
    * Inicializacion al momento de montar el componente
    */
    componentDidMount() {
        this.getActivitiesByCategory();
        window.M.Modal.init(document.getElementById(this.idModal));
    }

    /**
    * Se obtiene las actividades en base a la categoria
    * @return mixed
    */
    async getActivitiesByCategory() {
        var dataActivities = await MakeRequest({
            method: 'get',
            url: 'actividad/byCategory/' + this.props.category.iddef_categoria,
        });

        if (dataActivities.error) return Util.getMsnDialog('warning', dataActivities.message + ' Activities');
        return this.setState({ data : dataActivities.data });
    }

    /**
    * Se obtiene el componente para visualizacion de los datos
    * @return object <element>
    */
    getGridView() {
        const { data } = this.state;
        if (data.length == 0) return null;

        return <GridView
                data={data}
                columns={[
                    { attribute: 'descripcion', alias: 'Actiividad'},
                    { attribute: 'estado', alias: 'Estado', value : data => {
                        return <div className="switch">
                                <label>
                                    Off
                                    <input type="checkbox" name="estado" data-pk={data.iddef_actividad} onChange={this.getUpdateStatus} defaultChecked={data.estado == 1}/>
                                    <span className="lever"></span>
                                    On
                                </label>
                        </div>
                    }},
                    { alias: 'Detalles', value : data => {
                        return <Link to={'/activityDetail/' + data.iddef_actividad}><i className="material-icons left">visibility</i></Link>;
                    }},
                ]}
            />;
    }

    /**
    * Inactivacion / Activacion de registros
    * @param object <element>
    * @return mixed
    */
    getUpdateStatus(e) {
        let obj = e.target,
            id = obj.dataset.pk
        ;

        MakeRequest({
            method: 'put',
            url: 'actividad/put/' + id,
            data : JSON.stringify({ estado : obj.checked ? 1 : 0 })
        }).then(response => {
            if (response === null) return Util.getMsnDialog('success', 'Updated');
            if (response.error) {
                return Util.getMsnDialog('danger', Util.getModelErrorMessages(response.message));
            }
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
            method: 'post',
            url: 'actividad/post',
            data : data
        }).then(response => {
            if (response.error) {
                return Util.getMsnDialog('danger', Util.getModelErrorMessages(response.message));
            }

            this.getActivitiesByCategory();
            return  Util.getMsnDialog('success', 'Created');
        });
    }

    getCreate() {

    }

    render() {
        return <Card>
            <div className="row">
                <div className="col s12 m6">
                    <a className="modal-trigger" href={'#' + this.idModal} onClick={this.getCreate}><i className="material-icons left">add</i></a>
                    <b>Actividades</b>
                </div>
                <div className="col s12 m12">
                    {this.getGridView()}
                </div>
                <div id={this.idModal} className="modal">
                    <div className="modal-content">
                        <h5>Activities</h5>
                        <div className="row">
                            <form id={this.idForm} className="col s12" onSubmit={this.submitForm}>
                                <input id="iddef_categoria" name="iddef_categoria" type="hidden" value={this.props.category.iddef_categoria} />
                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <input name="descripcion" type="text" className="validate" />
                                        <label htmlFor="descripcion">Description</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <div className="switch">
                                            <label>
                                              Off
                                              <input type="checkbox" name="estado" defaultChecked={true}/>
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
            </div>
        </Card>;
    }
}
