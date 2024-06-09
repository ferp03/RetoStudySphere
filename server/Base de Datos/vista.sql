CREATE VIEW UsuarioInfo AS
SELECT 
    u.usuarioId, 
    u.nombre, 
    u.correo, 
    u.tipoUsuario, 
    ul.ultimaModificacion
FROM 
    Usuario u
LEFT JOIN 
    UsuarioLog ul ON u.usuarioId = ul.usuarioId;
