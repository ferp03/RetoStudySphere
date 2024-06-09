SELECT * FROM USUARIO;

SELECT * FROM ALUMNO;

SELECT * FROM MAESTRO;

SELECT * FROM CLASE;

SELECT * FROM CLASE_MAESTRO;

SELECT * FROM CLASE_ALUMNO;

SELECT * FROM sessioncookies;

SELECT * FROM QUIZ;

SELECT * FROM CLASE_QUIZ;

SELECT * FROM Alumno_Clase_Quiz;


DO $$
DECLARE
	p_quizzes JSON;
BEGIN
    CALL obtener_quiz(9, p_quizzes);  -- Reemplaza 1 con el ID de la clase que deseas consultar
    RAISE NOTICE 'Quizzes: %', p_quizzes;
END;
$$;



--id alumno 7, id maestro 16

INSERT INTO Clase (nombreClase) VALUES('Progra');

INSERT INTO Clase_alumno (claseId, alumnoId) VALUES (2, 3);

INSERT INTO Clase_maestro (claseId, maestroId) VALUES (3, 16);

--QUERYS PARA STORED PROCEDURES ALUMNO
--insert
DO $$
DECLARE
    _newAlumnoId INT;
BEGIN
    CALL insert_alumno('Ana Gómez', 'ana.gomez@example.com', 'password456', _newAlumnoId);
    RAISE NOTICE 'New Alumno ID: %', _newAlumnoId;
END;
$$;

--delete
CALL delete_alumno(4); --con el id de alumno

--update pass
CALL update_password_alumno(9, 'passwordprueba');

--detalles del alumno
DO $$
DECLARE
    _detalleAlumno JSON;
BEGIN
    CALL detalle_alumno(5, _detalleAlumno);  --con id alumno
    RAISE NOTICE 'Alumno Details: %', _detalleAlumno;
END;
$$;

--clases del alumno
DO $$
DECLARE
    resultado JSON;
BEGIN
    CALL clases_alumno(7, resultado);
    RAISE NOTICE 'Clases del alumno: %', resultado;
END $$;

--TODA INFORMACIÓN ALUMNO
DO $$
DECLARE resultado JSON;
BEGIN 
	CALL detalle_alumno_clases(4, resultado);
	RAISE NOTICE 'Detalles del alumno: %', resultado;
END $$;



--QUERYS PARA STORED PROCEDURES MAESTRO
--insert
DO $$
DECLARE
    _newMaestroId INT;
BEGIN
    CALL insert_maestro('Juan Pérez', 'juan.perez@example.com', 'password789', _newMaestroId);
    RAISE NOTICE 'New Maestro ID: %', _newMaestroId;
END;
$$;

--delete
CALL delete_maestro(13);

--update pass
CALL update_password_alumno(9, 'passwordprueba');

--detalles maestro
DO $$
DECLARE
    _detalleMaestro JSON;
BEGIN
    CALL detalle_Maestro(22, _detalleMaestro);  --con id usuario
    RAISE NOTICE 'Maestro Details: %', _detalleMaestro;
END;
$$;

--clases del maestro
DO $$
DECLARE
    resultado JSON;
BEGIN
    CALL clases_maestro(22, resultado);
    RAISE NOTICE 'Clases del maestro: %', resultado;
END $$;

--TODA INFORMACIÓN MAESTRO
DO $$
DECLARE resultado JSON;
BEGIN 
	CALL detalle_maestro_clases(1, resultado);
	RAISE NOTICE 'Detalles del maestro: %', resultado;
END $$;

--Agregar clase con maestro
CALL creaClase(1, 'JavaScript');
