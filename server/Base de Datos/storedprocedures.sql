--Fernando Pérez García
--A01285236

--Stored procedure para tabla de usuario para poderla usar en los insert de ambas maestro y alumno
CREATE OR REPLACE PROCEDURE insert_usuario(
    IN _nombre VARCHAR,
    IN _correo VARCHAR,
    IN _contraseña VARCHAR,
    IN _tipoUsuario tipo_usuario,
    OUT _newUsuarioId INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Usuario(nombre, correo, contraseña, tipoUsuario)
    VALUES (_nombre, _correo, _contraseña, _tipoUsuario)
    RETURNING usuarioId INTO _newUsuarioId;
END;
$$;

CREATE OR REPLACE PROCEDURE insert_quiz(
    IN p_nombre VARCHAR(100),
    IN p_preguntas JSON,
    IN p_fechaEntrega TIMESTAMP WITH TIME ZONE,
    IN p_claseId INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_quizId INT;
BEGIN
    -- Insertar el nuevo quiz en la tabla Quiz
    INSERT INTO Quiz (nombre, preguntas, fechaEntrega)
    VALUES (p_nombre, p_preguntas, p_fechaEntrega)
    RETURNING quizId INTO v_quizId;

    -- Insertar la relación entre la clase y el quiz en la tabla Clase_Quiz
    INSERT INTO Clase_Quiz (claseId, quizId)
    VALUES (p_claseId, v_quizId);
END;
$$;

CREATE OR REPLACE PROCEDURE obtener_quiz(
    IN p_claseId INT,
    OUT p_quizzes JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Obtener los quizzes de la clase específica
    SELECT json_agg(row_to_json(q)) INTO p_quizzes
    FROM (
        SELECT q.quizId, q.nombre, q.preguntas, q.fechaEntrega
        FROM Quiz q
        JOIN Clase_Quiz cq ON q.quizId = cq.quizId
        WHERE cq.claseId = p_claseId
    ) q;
END;
$$;


--Stored procedures Alumno

--Insert
CREATE OR REPLACE PROCEDURE insert_alumno(
    IN _nombre VARCHAR,
    IN _correo VARCHAR,
    IN _contraseña VARCHAR,
    OUT _newAlumnoId INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    _newUsuarioId INT;
BEGIN
    -- Llamar al procedimiento para insertar el usuario
    CALL insert_usuario(_nombre, _correo, _contraseña, 'alumno', _newUsuarioId);

    -- Insertar en la tabla Alumno
    INSERT INTO Alumno(usuarioId) VALUES(_newUsuarioId)
    RETURNING alumnoId INTO _newAlumnoId;
END;
$$;

--Delete
CREATE OR REPLACE PROCEDURE delete_alumno(
	IN _alumnoId INT
)
LANGUAGE plpgsql
AS $$
DECLARE
	_usuarioId INT;
BEGIN
	--obtener usuarioId
	SELECT usuarioId INTO _usuarioId FROM Alumno
	WHERE alumnoId = _alumnoId;

	--eliminar de alumno
	DELETE FROM Alumno
	WHERE alumnoId = _alumnoId;

	--eliminar de usuario
	DELETE FROM Usuario
	WHERE usuarioId = _usuarioId;
END;
$$;


--Update
CREATE OR REPLACE PROCEDURE update_password(
	IN _usuarioId INT,
	IN _newPassword VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
	UPDATE Usuario
	SET contraseña = _newPassword WHERE usuarioId = _usuarioId;
END;
$$;

--Select
CREATE OR REPLACE PROCEDURE detalle_alumno(
	IN _alumnoId INT,
	OUT _detalleAlumno JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
	--obtener los detalles del alumno en json
	SELECT row_to_json(t) INTO _detalleAlumno FROM (
		SELECT a.alumnoId, u.nombre, u.correo, u.tipoUsuario
		FROM Alumno a
		JOIN Usuario u ON a.usuarioId = u.usuarioId WHERE a.alumnoId = _alumnoId
	) t;
END;
$$;

CREATE OR REPLACE PROCEDURE clases_alumno(
	IN _alumnoId INT,
	OUT _clasesAlumno JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
	SELECT row_to_json(t) INTO _clasesAlumno FROM(
	SELECT c.claseId, c.nombreClase
	FROM Clase c
	JOIN Clase_Alumno ca ON c.claseId = ca.claseId
	JOIN Alumno a ON ca.alumnoId = a.alumnoId
	WHERE a.alumnoId = _alumnoId
	) t;
END;
$$;

-- TODA INFO DE ALUMNO
CREATE OR REPLACE PROCEDURE detalle_alumno_clases(
    IN _userId INT,
    OUT _detalleAlumnoClases JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Obtener los detalles del alumno y las clases en las que está registrado
    SELECT jsonb_build_object(
        'info', 
        (SELECT row_to_json(md)
         FROM (
             SELECT a.alumnoId, u.nombre, u.correo, u.tipoUsuario
             FROM Alumno a
             JOIN Usuario u ON a.usuarioId = u.usuarioId 
             WHERE u.usuarioId = _userId
         ) md),
        'clases', 
        (SELECT json_agg(row_to_json(c))
         FROM (
             SELECT c.claseId, c.nombreClase
             FROM Clase c
             JOIN Clase_Alumno ca ON c.claseId = ca.claseId
             JOIN Alumno a ON ca.alumnoId = a.alumnoId
             WHERE a.usuarioId = _userId
         ) c)
    ) INTO _detalleAlumnoclases;
END;
$$;


--Stored procedures Maestro

--Insert
CREATE OR REPLACE PROCEDURE insert_maestro(
    IN _nombre VARCHAR,
    IN _correo VARCHAR,
    IN _contraseña VARCHAR,
    OUT _newMaestroId INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    _newUsuarioId INT;
BEGIN
    -- Llamar al procedimiento para insertar el usuario
    CALL insert_usuario(_nombre, _correo, _contraseña, 'maestro', _newUsuarioId);

    -- Insertar en la tabla Maestro
    INSERT INTO Maestro(usuarioId) VALUES(_newUsuarioId)
    RETURNING maestroId INTO _newMaestroId;
END;
$$;

--Delete
CREATE OR REPLACE PROCEDURE delete_maestro(
	IN _maestroId INT
)
LANGUAGE plpgsql
AS $$
DECLARE
	_usuarioId INT;
BEGIN
	--obtener usuarioId
	SELECT usuarioId INTO _usuarioId FROM Maestro
	WHERE maestroId = _maestroId;

	--eliminar de maestro
	DELETE FROM Maestro
	WHERE maestroId = _maestroId;

	--eliminar de usuario
	DELETE FROM Usuario
	WHERE usuarioId = _usuarioId;
END;
$$;

--Update
--como nuestra tabla de usuario es la que tiene la informacion de contraseñam usamos el mismo procedure que en alumno
CREATE OR REPLACE PROCEDURE update_password(
	IN _usuarioId INT,
	IN _newPassword VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
	UPDATE Usuario
	SET contraseña = _newPassword WHERE usuarioId = _usuarioId;
END;
$$;

--Select
CREATE OR REPLACE PROCEDURE detalle_maestro(
    IN _userId INT,
    OUT _detalleMaestro JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Obtener los detalles del maestro en JSON
    SELECT row_to_json(t) INTO _detalleMaestro FROM (
        SELECT m.maestroId, u.nombre, u.correo, u.tipoUsuario
        FROM Maestro m
        JOIN Usuario u ON m.usuarioId = u.usuarioId 
        WHERE u.usuarioId = _userId
    ) t;
END;
$$;


--CLASES DEL MAESTRO
CREATE OR REPLACE PROCEDURE clases_maestro(
    IN _userId INT,
    OUT _clasesMaestro JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT row_to_json(t) INTO _clasesMaestro FROM (
        SELECT c.claseId, c.nombreClase
        FROM Clase c
        JOIN Clase_Maestro cm ON c.claseId = cm.claseId
        JOIN Maestro m ON cm.maestroId = m.maestroId
        JOIN Usuario u ON m.usuarioId = u.usuarioId
        WHERE u.usuarioId = _userId
    ) t;
END;
$$;

-- TODA INFO DE MAESTRO
CREATE OR REPLACE PROCEDURE detalle_maestro_clases(
    IN _userId INT,
    OUT _detalleMaestroClases JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Obtener los detalles del maestro y las clases en las que está registrado
    SELECT jsonb_build_object(
        'info', 
        (SELECT row_to_json(md)
         FROM (
             SELECT m.maestroId, u.nombre, u.correo, u.tipoUsuario
             FROM Maestro m
             JOIN Usuario u ON m.usuarioId = u.usuarioId 
             WHERE u.usuarioId = _userId
         ) md),
        'clases', 
        (SELECT json_agg(row_to_json(c))
         FROM (
             SELECT c.claseId, c.nombreClase
             FROM Clase c
             JOIN Clase_Maestro cm ON c.claseId = cm.claseId
             JOIN Maestro m ON cm.maestroId = m.maestroId
             WHERE m.usuarioId = _userId
         ) c)
    ) INTO _detalleMaestroClases;
END;
$$;




--Extra: Para obtener informacion sobre una clase (aun no poblamos la tabla de clases)
CREATE OR REPLACE PROCEDURE detalle_clase(
    IN _claseId INT,
    OUT class_name VARCHAR,
    OUT teacher_name VARCHAR,
    OUT students JSON
)

LANGUAGE plpgsql
AS $$
DECLARE
    teacher_id INT;
BEGIN
    -- Obtener el nombre de la clase
    SELECT nombreClase INTO class_name
    FROM Clase
    WHERE claseId = _claseId;

    -- Obtener el nombre del maestro
    SELECT u.nombre INTO teacher_name
    FROM Maestro m
    JOIN Usuario u ON m.usuarioId = u.usuarioId
    JOIN Clase_Maestro cm ON m.maestroId = cm.maestroId
    WHERE cm.claseId = _claseId;

    -- Obtener la lista de alumnos
    SELECT json_agg(u.nombre) INTO students
    FROM Alumno a
    JOIN Usuario u ON a.usuarioId = u.usuarioId
    JOIN Clase_Alumno ca ON a.alumnoId = ca.alumnoId
    WHERE ca.claseId = _claseId;
END;
$$;

--agregar unba clase desde maestro
CREATE OR REPLACE PROCEDURE creaClase(
	IN _userId INT,
	IN _nombreClase VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE 
	nueva_claseId INT;
	maestro_Id INT;
BEGIN
    SELECT maestroId INTO maestro_Id
    FROM Maestro
    WHERE usuarioId = _userId;
    
    -- Insertar una nueva clase
    INSERT INTO Clase (nombreClase)
    VALUES (_nombreClase)
    RETURNING claseId INTO nueva_claseId;
    
    -- Asignar la nueva clase al maestro
    INSERT INTO Clase_Maestro (claseId, maestroId)
    VALUES (nueva_claseId, maestro_Id);
END;
$$;
