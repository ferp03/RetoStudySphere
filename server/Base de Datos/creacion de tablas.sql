--Tablas regulares

--crear tipos de usuario
CREATE TYPE tipo_usuario AS ENUM('alumno', 'maestro');

CREATE TABLE Usuario(
    usuarioId SERIAL PRIMARY KEY, --EL SERIAL ES UN AUTO INCREMENT
    nombre VARCHAR(100),
	correo VARCHAR(100),
    contraseña VARCHAR(100),
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

CREATE TABLE Quiz (
    quizId SERIAL PRIMARY KEY,
    preguntas JSON,
    fechaEntrega TIMESTAMP WITH TIME ZONE
	nombre VARCHAR(100)
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

CREATE TABLE Alumno_Score(
	alumnoId INT,
	score INT,
	PRIMARY KEY (alumnoId),
	FOREIGN KEY (alumnoId) REFERENCES Alumno(alumnoId)
);

CREATE TABLE Clase_Quiz(
	claseId INT,
	quizId INT,
	PRIMARY KEY (claseId, quizId),
	FOREIGN KEY (claseId) REFERENCES Clase(claseId),
	FOREIGN KEY (quizId) REFERENCES Quiz(quizId)
);

CREATE TABLE Alumno_Clase_Quiz(
	alumnoId INT,
	claseId INT,
	quizId INT,
	incorrectas JSON,
	correctas JSON,
	calificacion INT,
	PRIMARY KEY (claseId, quizId, alumnoId),
	FOREIGN KEY (alumnoId) REFERENCES Alumno(alumnoId),
	FOREIGN KEY (claseId) REFERENCES Clase(claseId),
	FOREIGN KEY (quizId) REFERENCES Quiz(quizId)
);

CREATE TABLE UsuarioLog (
    usuarioId INT,
    fechaCreacion TIMESTAMP,
    ultimaModificacion TIMESTAMP,
    PRIMARY KEY (usuarioId),
    FOREIGN KEY (usuarioId) REFERENCES Usuario(usuarioId)
);