import axios from 'axios';
var ajax = function({
	url: url,
	param: parmas,
	type: type,
} = {}) {
	if(type == 'post' || type == 'get') {
		type = type
	} else {
		type = 'post'
	}
	if(type == 'post') {
		return new Promise((resolve, reject) => {
			axios({
					method: type,
					url: url,
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					data: parmas,
					transformRequest: [function(params) {
						var paramStr = '';
						for(var key in params) {
							paramStr += key + "=" + params[key] + "&";
						}
						return paramStr;
					}],
				}).then(function(response) {
					if(response.data.status == 'success') {
						resolve(response.data)
					} else {
						resolve(response.data)
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		})
	} else {
		return new Promise((resolve, reject) => {
			axios.get(url, {
					params: parmas
				})
				.then(function(response) {
					if(response.data.status == 'success') {
						resolve(response.data)
					} else {
						resolve(response.data)
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		})
	}
}
//export default和export的区别：export:{ajax},在前面可以import {ajax} from './.js'   default:import co from './.js' 
export { ajax }