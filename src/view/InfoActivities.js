import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import GridView from '../components/GridView';
import ActivityDetails from './ActivityDetails';

const MakeRequest = require('../helpers/MakeRequest');
const Util = require('../helpers/Util');

export default class InfoActivities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataActivities : [],
        };
        this.id = this.props.match.params.id;
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
            url: 'actividad/byCategory/' + this.id,
        });

        if (dataActivities.error) return Util.getMsnDialog('warning', dataActivities.message + ' Activities');
        this.setState({ dataActivities : dataActivities.data });
    }

    getExpandActivities(data) {
        return <ActivityDetails
            id={data.iddef_actividad}
            visible="hide"
        />;
    }

    /**
    * Se obtiene el componente para visualizacion de los datos
    * @return object <element>
    */
    getGridView() {
        const { dataActivities } = this.state;
        if (dataActivities.length == 0) return null;

        return <GridView
                data={dataActivities}
                columns={[
                    { attribute: 'descripcion', alias: 'Actiividad'},
                    { alias: "Detalles", expand : this.getExpandActivities}
                ]}
            />;
    }

    render() {
        return <div className="row">
            <div className="col s12 m12">
                <h4>Actividades</h4>
            </div>
            <div className="col s12 m12">
                {this.getGridView()}
            </div>
        </div>;
    }
}
