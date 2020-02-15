import React, { Fragment } from 'react';

const MakeRequest = require('../helpers/MakeRequest');

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unidades : [],
            content : null,
        }
    }

    /**
    * Se obtienen los datos del API al montar el componente
    * @return mixed
    */
    componentDidMount() {
        MakeRequest({
            method: 'get',
            url: 'unidadNegocio/search',
        }).then(response => {
            if (response.error) return null;
            this.setState({
                unidades : response.error ? [] : response.data,
            }, () => window.M.Tabs.init(document.querySelectorAll('.tabs')));
        });
    }

    /**
    * se despliegan los detalles de las categorias y subcategorias
    * @return mixed
    */
    getContent(data) {
        MakeRequest({
            method: 'get',
            url: 'categoria/porUnidad/' + data.iddef_unidad_negocio,
        }).then(response => {
            if (response.error) return null;
            var content = [];
            Object.keys(response.data).map(key => {
                let row = response.data[key],
                    children = row.hijos.length > 0,
                    childrenContent = null
                ;

                if (children) {
                    childrenContent = <ul className="collection">
                        {row.hijos.map((c, i) => {
                            return <li key={i} className="collection-item"><div>{c}<a className="secondary-content"><i className="material-icons">send</i></a></div></li>
                        })}
                    </ul>;
                }

                content.push(<li key={key}>
                            <div className="collapsible-header"><i className="material-icons">{children ? 'expand_more' : 'fiber_manual_record'}</i>{row.descripcion}</div>
                            <div className="collapsible-body"><span>{childrenContent}</span></div>
                        </li>);
            });
            content.unshift(<li key={data.iddef_unidad_negocio + 'un'}><h4>{data.descripcion}</h4></li>);
            this.setState({ content : content }, () => window.M.Collapsible.init(document.querySelectorAll('.collapsible')));
        });
    }

    render() {
        const { unidades, content } = this.state;

        return <div className="row">
            <div className="col s12 m12">
                <ul className="tabs">
                    {unidades.map((row, index) => {
                        return <li key={index} className="tab col s3"><a href="#container" onClick={(e) => this.getContent(row)}>{row.descripcion}</a></li>
                    })}
                </ul>
            </div>
            <div id="container" className="col s12 m12">
                <ul className="collapsible">
                    {content}
                </ul>
            </div>
        </div>

    }
}

export default Home;
