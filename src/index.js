// Fichero src/index.js

//1. Importamos los dos módulos de NPM necesarios para trabajar
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
//2. Creamos el servidor
const server = express();

//3. Configuramos el servidor. aquí iremos agregando las configuraciones de nuestro servidor.
server.use(cors());
server.use(express.json({ limit: '25mb' }));


const serverPort = process.env.PORT || 3000;
server.listen(serverPort, () => {
  console.log(`Server listening at ${serverPort}`);
});

//conexion a MYSQL

async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'sql.freedb.tech',
    user: process.env.USER_DB,
    password: process.env.USER_PASS,
    database: 'freedb_vetfolio',
  });
  connection.connect();
  return connection;
}

// endpoints 

//funciones token
const generateToken = (payload) => {
  const token = jwt.sign(payload, 'secreto', { expiresIn: '1h' }); 
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, 'secreto'); //aqui se verifica si el token es real o no; y si existe la devuelve.
    return decoded;
  } catch (err) {
    return null;
  }
};

//middleware : verifica si con ese token tienes permiso para hacer una funcion. 

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  req.user = decoded; //si es válido lo pone en el usuario
  next();
};

//así creo contraseñas encriptadas
// const passwordHash = await bcrypt.hash(body.password, saltRounds);

//----------------ENDPOINT PARA REGISTRARSE, ENCRIPTAR PASSWORD Y OBTENER UN TOKEN---------------------
server.post('/signin', async (req, res) => {
  const { userName, nameVet, email, password, city, country, public } = req.body;
  const connection= await getConnection();
  const selectUser = 'select * from vet where email = ?  or userName = ? ';
  const [resultSelect] = await connection.query(selectUser, [email, userName]);

  if (resultSelect.length === 0) {
    const passwordHashed = await bcrypt.hash(password, 10);
    const insertVet =
      'INSERT INTO vet (userName,nameVet,email,hashed_password,city,country,public) VALUES (?,?,?,?,?,?,?)';

    jwt.sign(password, 'secreto', async (err, token) => {
      if (err) {
        res.json({success: false, msg: 'Error'});
      } else {
        const [resultInsertVet] = await connection.query(insertVet, [
          userName,
          nameVet,
          email,
          passwordHashed,
          city,
          country,
          public,
        ]);
        connection.end();
        //Si todo sale bien, se envía una respuesta JSON con un mensaje de éxito, el token JWT y el insertId,
        //que es el ID del usuario recién insertado en la base de datos.
        res.json({
          success: true,
          data: resultInsertVet,
          token: token,
          id: resultInsertVet.insertId,
          idVet: resultInsertVet.idVet,
          nameVet: nameVet
        });
      }
    });
  } else {
    res.json({success: false, msg: 'Usuario ya registrado'})
  }
});

//respuesta de postman por ejemplo. el TOKEN  tiene sus 3 partes de encabezado,datos(id) y firma
// {
//   "msg": "success",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inl0YXlsb3JkZXYiLCJuYW1lIjoiWWFuZWxpcyIsInBhc3N3b3JkSGFzaCI6IiQyYiQxMCRERy5iM0hNSFZzVnU5SFZaN1JDYmp1YkFUR1VTU1F2cm5NZ0pTUTBPbWpMaTVjWG43a0pwLiIsImlhdCI6MTY4NjIxODEzN30.tqYwIeLEkLlh_tXU7uDXZ0A6j1kdxpSgokS-J3qTaYk",
//   "id": 2
// }

//----------------ENDPOINT PARA INCIAR SESIÓN---------------------

server.post('/login', async (req, res) => {

  const {username, email, password} = req.body;

  //Buscar si el usuario existe en la bases de datos
  const selectUser = 'SELECT * FROM vet WHERE email = ?';
  const connection = await getConnection();
  const [users] = await connection.query(selectUser, [email]);
  connection.end();
  if (users.length !== 0) {
    const isOkPass = await bcrypt.compare(
      password,
      users[0].hashed_password
    );
    if (isOkPass) {
      // generar token
      const infoToken = {
        id: users[0].idVet,
        email: users[0].email,
      };
      const token = generateToken(infoToken);
      res.json({
        success: true,
        token: token,
        id: users[0].idVet,
        name: users[0].nameVet,
        public: users[0].public
      });
    } else {
      res.json({
        success: false,
        msj: 'contraseña incorrecta',
      });
    }
  } else {
    res.json({
      success: false,
      msj: 'correo no existe',
    });
  }
});



//.----------------------cargar los casos del usuario autenticado.......................

server.get('/listUser', authenticateToken, async (req, res) => {
  try {
    const idVet = req.headers['id'];
    const numberId= parseInt(idVet);
    let sql = 'SELECT * FROM `case` WHERE fk_Vet = ?';
    const connection = await getConnection();
    const [cases] = await connection.query(sql, [numberId]);
    connection.end();
    const response = {
      success: true,
      patients: cases,
    };
    res.json(response);
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
});

const staticServer = './src/public-react';
server.use(express.static(staticServer));

//.................ENDPOINT AÑADIR UN CASO.............

server.post('/newCase', async (req, res) => {
  const connection = await getConnection();
  const {name, specie, breed, birthday, clinical, exploration, tests, results, treatment, evolution, comments, public, fk_Vet} = req.body;
  const insertCase = 'INSERT INTO `case` (`name`, specie, breed, birthday, clinical, exploration, tests, results, treatment, evolution, comments, public, fk_Vet) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
  const [resultCases] = await connection.query(insertCase, [ name, specie, breed, birthday, clinical, exploration, tests, results, treatment, evolution, comments, public, fk_Vet]);
  connection.end(); 
  res.json({
    success: true,
    caseName: resultCases,
  })
})

//----ENDPOINT CIERRE SESION----------------

server.put('/logout', async (req, res) =>{
  const authHeader = req.headers["authorization"];
  jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
     if (logout) {
        res.json({success: true, message: 'se ha cerrado tu sesión'});
     } else {
      res.json({success: false, message: 'no se ha podido cerrar la sesión'});
     }
  });
})


//............CARGAR TODOS LOS CASOS PÚBLICOS-EXPLORA-----

server.get('/getPublic', async (req, res) => {
  try{
    const connection = await getConnection();
    const sql = 'SELECT * FROM `case` WHERE public = 1';
    const [results] = await connection.query(sql);
    console.log(results);
    connection.end();
    const response = {
      success: true,
      patients: results,
    };
    res.json(response);
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
   

});

//---------FILTRO BÚSQUEDA.........//

server.get('/case', async (req, res) => {
  try {
    const connection = await getConnection();
    const name= req.query.name;
    const sql =  "SELECT * FROM `case` WHERE name = ? ";
    const [resultQuery] = await connection.query(sql, [name]);
    console.log(resultQuery);
   
    // if (!resultQuery) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Error en la consulta o ningún caso con esos criterios de búsqueda',
    //   });
    // }
    if (resultQuery.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Ningún caso con esos criterios de búsqueda',
      });
    } else {
      res.status(200).json({ success: true, patients: resultQuery });
    }
    connection.end();
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return res.status(404).json({
      success:false, 
      message: 'Error al obtener datos'
    });
  }
});

//comentarios
server.post('/contact', async (req, res) => {
  try{
    const {name, comments} = req.body;
    const connection= await getConnection();
    const insert='INSERT INTO comments (name, comments) VALUES (?,?)';
    const [result] = await connection.query(insert, [name, comments]);
    console.log(result);
   
    res.json({success: true, message: 'mensaje enviado'})
    connection.end();
  } catch (error) {
    res.json({success:false, message: 'el mensaje no se pudo enviar'})
  }

  });

