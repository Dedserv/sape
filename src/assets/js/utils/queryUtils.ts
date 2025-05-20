interface IQueryObject {
  [key: string]: string | string[];
}

export function queryToObject(qs: string) {
  let obj: IQueryObject = {};

  if (qs) {
    let params = qs.split('&');

    params.forEach((param) => {
      let name = param.split('=')[0];
      let value = param.split('=')[1];
      if (name && value) {
        if (Object.prototype.hasOwnProperty.call(obj, name)) {
          if (Array.isArray(obj[name])) {
            obj[name].push(value);
          } else {
            obj[name] = [obj[name], value];
          }
        } else {
          obj[name] = value;
        }
      }
    });
  }
  return obj;
}

export function objectToQuery<T>(obj: T) {
  let qs = '';
  for (let name in obj) {
    if (obj[name]) {
      if (Array.isArray(obj[name])) {
        obj[name].forEach((val) => {
          if (val) {
            qs += `${name}=${val}&`;
          }
        });
      } else {
        qs += `${name}=${obj[name]}&`;
      }
    }
  }
  return qs.slice(0, -1);
}
