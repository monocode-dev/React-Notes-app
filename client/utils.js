function apiRequest(url, options = {}){
  return fetch(url, {
    credentials: 'include',
    headers: {'Content-type': 'application/json', ...options.headers},
    ...options,
  })
  .then(res => {
    if(res.status === 401 || res.status === 204) return null;

    return res?.json();
  });
}

export default apiRequest;