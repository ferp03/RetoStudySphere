--Tablas regulares

--crear tipos de usuario
CREATE TYPE tipo_usuario AS ENUM('alumno', 'maestro');

CREATE TABLE Usuario(
    usuarioId SERIAL PRIMARY KEY, --EL SERIAL ES UN AUTO INCREMENT
    nombre VARCHAR(500),
	correo VARCHAR(500),
    contraseña VARCHAR(500),
    tipoUsuario tipo_usuario
);

CREATE TABLE Maestro(
	maestroId SERIAL PRIMARY KEY,
	usuarioId INT,
	FOREIGN KEY (usuarioId) REFERENCES Usuario(usuarioId)
);

CREATE TABLE Alumno(
	alumnoId SERIAL PRIMARY KEY, 
	usuarioId INT,
	FOREIGN KEY (usuarioId) REFERENCES Usuario(usuarioId)
);

CREATE TABLE Clase(
	claseId SERIAL PRIMARY KEY,
	nombreClase VARCHAR(150)
);

--Tablas de union (para poder hacer 1-N entre tablas)

CREATE TABLE Clase_Maestro(
	claseId INT,
	maestroId INT,
	PRIMARY KEY (claseId, maestroId),
	FOREIGN KEY (claseId) REFERENCES Clase(claseId),
	FOREIGN KEY (maestroId) REFERENCES Maestro(maestroId)
);

CREATE TABLE Clase_Alumno(
	claseId INT,
	alumnoId INT,
	PRIMARY KEY (claseId, alumnoId),
	FOREIGN KEY (claseId) REFERENCES Clase(claseId),
	FOREIGN KEY (alumnoId) REFERENCES Alumno(alumnoId)
);

--Ejemplos para agregar maestros
BEGIN;

INSERT INTO Usuario(nombre, correo, contraseña, tipoUsuario)
VALUES ('Antonio Bento', 'bentoprime@tec.mx', 'unacerveza', 'maestro')
RETURNING usuarioId INTO newUserId; --aqui damos el valor del usuarioId a newUserId para poder ingresarlo en la tabla de maestros

INSERT INTO Maestro (usuarioId)
VALUES (newUserId);

COMMIT;