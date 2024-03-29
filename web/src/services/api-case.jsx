

const getPublicCases= () => {
  return fetch ("https://vetfolio-manager.onrender.com/getPublic")
    .then(response => response.json())
    .then(data=>
          data)
}

const getFilterCase = (params) => {
  return fetch(`http://localhost:4000/case?name=${params.name}`)
  .then(response => response.json())
  .then(data => {
    console.log (data);
     return data;
  });
};


const objToExport = {
getPublicCases: getPublicCases,
getFilterCase: getFilterCase
};


export default objToExport;