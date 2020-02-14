import React from 'react';
import { Link } from 'react-router-dom';

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

        this.id = this.props.match.params.id;
    }

    /**
    * Inicializacion al momento de montar el componente
    */
    componentDidMount() {
        this.getData();
        // window.M.Modal.init(document.getElementById(this.idModal));
    }

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

        // this.setState({
        //     restrictions : restrictions.data,
        //     schedule : schedule.data,
        // });
    }

    render() {
        const { data, restrictions, schedule } = this.state,
            exist = Object.keys(data).length
        ;

        return <div className="row">
            <div className="col s12 m12">
                <h4>Actividad: {exist ? data.descripcion : 'No Encontrada'}</h4>
            </div>
            <div className="col s12 m6">
                <ul className="collection with-header">
                    <li className="collection-header"><h5>Horarios</h5></li>
                    {restrictions.map((row, i) => {
                        return <li key={i} className="collection-item"><div>Alvin<a href="javascript:void(0)" className="secondary-content"><i className="material-icons">send</i></a></div></li>
                    })}
                </ul>
            </div>
            <div className="col s12 m6">
                <ul className="collection with-header">
                    <li className="collection-header"><h5>Restricciones</h5></li>
                    {schedule.map((row, i) => {
                        return <li key={i} className="collection-item"><div>Alvin<a href="javascript:void(0)" className="secondary-content"><i className="material-icons">send</i></a></div></li>
                    })}
                </ul>
            </div>
        </div>;
    }
}
