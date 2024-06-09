CREATE OR REPLACE FUNCTION log_usuario_func()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO UsuarioLog (usuarioId, fechaCreacion, ultimaModificacion)
        VALUES (NEW.usuarioId, NOW(), NOW());
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE UsuarioLog
        SET ultimaModificacion = NOW()
        WHERE usuarioId = NEW.usuarioId;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER log_usuario
AFTER INSERT OR UPDATE ON Usuario
FOR EACH ROW
EXECUTE PROCEDURE log_usuario_func();