import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

/**
* @author Felipe Tun <felipe.tun.cauich@gmail.com>
* Componente GridView, para mostrar informacion en tablas
*/
class GridView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns : [],
            data : [],
            numRow : 1,
            expandedRows : {},
        };

        this.auxCountRows = 1;
        this.styleA = {cursor : 'pointer'};
        this.styleFloatTable = this.props.floatHeader ? { position: 'sticky', top : 0 } : {};
        this.styleFloatTheader = this.props.floatHeader ? { position: 'sticky', top : 0, zIndex : 10, backgroundColor : 'white', color : 'black'} : {};
    }

    /**
    * Funcionalidad del componente al montarse sobre el DOM
    * @return mixed
    */
    componentDidMount() {
        let { columns } = this.props;
        if (this.props.serializeRows && !columns.find(c => c.alias == '#' && c.defaultColumn == true)) columns.unshift({ defaultColumn : true, alias : '#', value : () => this.auxCountRows++ });
        this.setState((state, props) => {
            return { columns : columns, data : props.data };
        }, () => {
            if (this.state.data.length > 0) this.props.afterMountData();
        });
    }

    /**
    * Se invoca antes de que un componente montado reciba nuevos props. Para actualizar el state.data en base a los props.data si estos son cargados de manera async
    * por el padre que lo implementa
    * @param mixed
    * @return mixed
    */
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState(state => {
                return { data: this.props.data, expandedRows : {} };
            }, this.props.afterMountData);
        }
    }

    /**
    * Funcionamiento para el efecto expand de las columnas del Grid
    * @param string. Referencia de la columna expand actual
    * @param index. Index del registro que realizar el expand
    * @param function. callback a renderizar en la columna expand
    * @return mixed
    */
    getExpand(refColumn, index, callback) {
        let { expandedRows } = this.state;

        if (expandedRows.hasOwnProperty(index) && expandedRows[index].refColumn == refColumn) {
            expandedRows = Object.keys(expandedRows)
                            .filter(key => key !== index)
                            .reduce((obj, key) => {
                                obj[key] = expandedRows[key];
                                return obj;
                            }, {});
        } else {
            expandedRows[index] = {expand : callback, refColumn : refColumn};
        }

        this.setState({expandedRows : expandedRows});
    }

    /**
    * Ordenamiento en base a attribute de la configuracion de las columnas
    * @param string
    * @return mixed
    */
    getSortBy(key) {
        if (key) {
            let arrayCopy = this.state.data.slice();
            arrayCopy.sort(function(a, b) {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
                return 0;
            });
            this.setState({ data: arrayCopy , expandedRows : {} });
        }
    }

    /**
    * Se obtienen las rows de la informacion del Grid
    * @return <element>
    */
    getBody() {
        const {data, columns, numRow, expandedRows} = this.state;
        this.auxCountRows = numRow;
        let body = [];

        data.forEach((data, index) => {
            let indexC = index + '-expand';
            let rows = columns.map((row, inx) => {
                let value = typeof row.value === 'function' ? row.value(data, index) : data[row.attribute];
                let iconExpand = typeof row.expand === 'function' ? <a style={this.styleA} onClick={() => this.getExpand((row.attribute || row.alias), indexC, row.expand)}><i className="material-icons">{row.icon || 'expand_more'}</i></a> : null;
                return <td key={inx} className={(row.visible === undefined || row.visible) ? null : 'hide'}>{value}{iconExpand}</td>;
            });

            let tr = [<tr key={index}>{rows}</tr>];
            if (expandedRows.hasOwnProperty(indexC)) tr.push(<tr key={indexC}><td colSpan={columns.length}>{expandedRows[indexC].expand(data)}</td></tr>);

            body = body.concat(tr);
            return body;
        });

        return body;
    }

    render() {
        return <table className={this.props.classTable} style={this.styleFloatTable}>
            <thead>
                <tr>{this.state.columns.map((row, index) => {
                        return <th key={index} className={(row.visible === undefined || row.visible) ? null : 'hide'} style={this.styleFloatTheader} onClick={() => this.getSortBy(row.attribute || false)}>{row.alias || ''}</th>
                    })}</tr>
            </thead>
            <tbody>
                {this.getBody()}
            </tbody>
        </table>;
    }
};

GridView.propTypes = {
    columns : PropTypes.array,
    data : PropTypes.array,
    serializeRows : PropTypes.bool,
    classTable : PropTypes.string,
    afterMountData : PropTypes.func,
    floatHeader : PropTypes.bool,
};

GridView.defaultProps = {
    serializeRows : true,
    classTable: 'responsive-table',
    afterMountData : () => {},
    floatHeader : true,
};

export default GridView;
