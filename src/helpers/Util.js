/**
* @author Felipe Tun Cauich <ftun@palaceresorts.com>
* Clases que contienen funcionalidades genericas de la aplicacion
*/
class Util {

    /**
    * @author Felipe Tun <ftun@palaceresorts.com>
    * Funcion para obtener los valores de los elementos de un formulario
    * @param Object form. instancia del formualrio a enviar | !importante: el formulario debe contener el dataset 'data-method-api' definido
	* en caso contraio devolvera los atributos de usuario_creacion y usuario_ultima_modificacion con el username del usuario en sesion
    * @param Boolean string. para retornar un STRING || JSON (default STRING)
    * @return STRING || JSON
    */
	static getDataElementsForm(form, string) {
		if (form.nodeName != 'FORM') {
			return false;
		}

		var elements, element, value, json = {};
		elements = form.elements;
		for (var i = 0; i < elements.length; i++) {
			element = elements[i];
			if (element.name) {
				if (element.nodeName == 'INPUT' && element.type == 'radio') {
					var options = document.getElementsByName(element.name);
					for (var j = 0; j < options.length; j++) {
						if (options[j].checked) {
							value = options[j].value;
						}
					}
				} else if (element.nodeName == 'INPUT' && element.type == 'checkbox') {
					value = element.checked ? 1 : 0;
				}else if(element.nodeName == 'SELECT' && element.multiple){
					json['attributeMultiple'] = element.name;
					value = this.getDataAttributeMultiple(element.id);;
				} else {
					value = element.value;
				}

				json[element.name] = value;
			}
		}

		if (form.getAttribute('data-method-api')) {
			form.getAttribute('data-method-api').toUpperCase() == 'PUT' ?
			json.usuario_ultima_modificacion = sessionStorage.getItem('username') :
			json.usuario_creacion =  sessionStorage.getItem('username');
		} else {
			json.usuario_ultima_modificacion = sessionStorage.getItem('username');
			json.usuario_creacion =  sessionStorage.getItem('username');
		}

		return string === undefined || string ? JSON.stringify(json) : json;
	}

    /**
    * @author Felipe Tun <ftun@palaceresorts.com>
    * Funcion para obtener la fecha actual o convertir una fecha a formato ISO
    * @param string
    * @param bool
    * @return String.
    */
    static getCurrentDate(current, useTime=false) {
        var hoy = current !== undefined ? new Date(current) : new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1; //hoy es 0!
        var yyyy = hoy.getFullYear();

        dd = (dd < 10 ? ('0' + dd) : dd);
        mm = (mm < 10 ? ('0' + mm) : mm);

        let date =  yyyy + '-' + mm + '-' + dd;

        if(useTime) {
            let hour = hoy.getHours();
            let minute = hoy.getMinutes();
            let second = hoy.getSeconds();
            hour = (hour.length == 1 ? ('0' + hour) : hour);
            minute = (minute.length == 1 ? ('0' + minute) : minute);
            second = (second.length == 1 ? ('0' + second) : second);
            date += ' '+ hour + ':' + minute + ':' + second;
        }

        return date;
    }

    /**
    * @author Felipe Tun <ftun@palaceresorts.com>
    * Funcion para tratar los nombres de los atributos de la BD del api REST, para no mostrar los nombre de atributo llaves.
    * y remplaza los guiones bajos por espacios en blancon. En caso que el atributo lo requiera.
    * @param string.
    * @return string
    */
    static getCleanAttributeName(attribute) {
        var io = attribute.indexOf('_') + 1;
        var attr = (attribute.split('_')[0].indexOf('id') > -1 ? attribute.substr(io) : attribute);
        return attr.replace('_', ' ');
    }

    /**
    * @author Felipe Tun <ftun@palaceresorts.com>
    * Funcion para obtener los errores del modelo de las peticiones POST y PUT, omitiendo los atributos por default de los modelos
    * @param array
    * @return string
    */
    static getModelErrorMessages(errors) {
        if (!errors) return false;

        var content = '',
            notAttr = {
                'fecha_creacion' : true,
                'usuario_creacion' : true,
                'fecha_ultima_modificacion' : true,
                'usuario_ultima_modificacion' : true
            }
        ;

        if (typeof errors == 'object') {
            content =
            '<div class="row blue-grey lighten-5">' +
                '<ul class="collection with-header">' +
                    '<li class="collection-header"><h5>The Following Errors Were Obtained:</h5></li>';

            for (var i = 0; i < errors.length; i++) {
                var err = errors[i];
                if (!notAttr.hasOwnProperty(err.field)) {
                    content +=
                    '<li class="collection-item">' +
                        '<b>' + Util.getCleanAttributeName(err.field) + ': </b>' + err.message +
                    '</li>';
                }
            }

            content +=
                '</ul>' +
            '</div>';
        }

        return content;
    }

    /**
    * @author Felipe Tun <ftun@palaceresorts.com>
    * Funcion para obtener el html para una alerta con las clases de boostrap
    * @param string. tipo de dialog ['success', 'info', 'warning', 'danger']
    * @param string. texto en el mensaje a mostrar. puede contener codigo html
    * @param integer. tiempo de duracion a mostrar en pantalla
    * @return string.
    */
    static getMsnDialog(type, msnText, time) {
        var duration = time || 4000;
        var typeMsn = '';
        if (type === 'info') {
            typeMsn = '<div class="valign-wrapper blue-text darken-3"><h6><b>Info!</b><b> ' + msnText + ' </b></h6></div>';
        } else if (type === 'success') {
            typeMsn = '<div class="valign-wrapper green-text darken-3"><h6><b>Success!</b><b> ' + msnText + ' </b></h6></div>';
        } else if (type === 'warning') {
            typeMsn = '<div class="valign-wrapper orange-text darken-3"><h6><b>Warning!</b><b> ' + msnText + ' </b></h6></div>';
        } else if (type === 'danger') {
            typeMsn = '<div class="valign-wrapper red-text darken-3"><h6><b>Danger!</b><b> ' + msnText + ' </b></h6></div>';
        } else {
            return false;
        }

        return  window.M.toast({html: typeMsn});
    }
}

module.exports = Util;
