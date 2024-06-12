import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

const AddStudent = ({ claseId }) => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axiosInstance.get('/getAlumnos');
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, []);

    console.log(students);
    return (
        <div>
            {/* Tabla de vista de todos los alumnos disponibles con sus alumno id */}
            <table>
                <thead>
                    <tr>
                        <th>Usuario ID</th>
                        <th>Nombre Usuario</th>
                        <th>Correo</th>
                        <th>Alumno ID</th>
                        <th>Clase ID</th>
                        <th>Nombre Clase</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.usuarioId}>
                            <td>{student.usuarioId}</td>
                            <td>{student.nombre_usuario}</td>
                            <td>{student.correo}</td>
                            <td>{student.alumnoId}</td>
                            <td>{student.claseId}</td>
                            <td>{student.nombreClase}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Tabla para agregar alumnos en base a su alumno id y la clase id */}
            <form>
                <div>
                    <label>Alumno ID:</label>
                    <input type="text" name="alumnoId" />
                </div>
                <div>
                    <label>Clase ID:</label>
                    <input type="text" name="claseId" value={claseId} readOnly />
                </div>
                <button type="submit">Agregar Alumno</button>
            </form>
        </div>
    );
};

export default AddStudent;
