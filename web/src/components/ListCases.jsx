
import '../styles/list.scss';
import Welcome from './Welcome';
import UserCases from './UserCases';
import { useEffect, useState } from 'react';
import apiCase from '../services/api-case';
import LogOut from './LogOut';
import { Link } from 'react-router-dom';
import Scroll from './Scroll';
import ls from '../services/localStorage'


function ListCases({ 
  isDark, 
  setIsDark, 
  idVet, 
  token, 
  setToken,  
  setUsername, 
  setIdVet,
setPublicList}) {
  
  // const [userData, setUserData] = useState(null);
  const [listCases, setListCases] = useState({ patients: [] });

  useEffect(() => {
    apiCase.getPublicCases()
    .then(data => {
      if (data.success) {
        setListCases(data); 
        setPublicList(data.patients);
        ls.set('public',data.patients);
      } else {
        console.error('Error al obtener los datos del usuario. Comprueba que estás registrados');
      }
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
  }, []);

  
  return (
    <>
      <Welcome isDark={isDark} setIsDark={setIsDark} />
      <Scroll/>
      <h2 className="sectionList__title">
        Consulta los casos publicados por otr@s veterinari@s
      </h2>
      <div className='sectionList__logOut'>
        <LogOut token={token} setToken={setToken} setIdVet={setIdVet} setUsername={setUsername}/></div>
      <ul className="sectionList">
        {listCases.patients.map((data) => (
          <li key={data.idCase} className="sectionList__ul">
           <Link to={`/publicCase/${data.idCase}`} className='link'>
            <UserCases data={data} idVet={idVet}/>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListCases;
